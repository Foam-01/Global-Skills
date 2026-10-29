# Operations (OP): ดูแล database ระดับ production

เรื่องที่ไม่ได้อยู่ใน query แต่ทำให้ระบบล่มหรือข้อมูลหายจริง

---

## OP-01 — Backup ที่ไม่เคยทดสอบ restore = ไม่มี backup

- กำหนดเป้าหมายก่อน: **RPO** (ยอมเสียข้อมูลย้อนหลังได้กี่นาที) และ **RTO** (ต้องกลับมาใช้ได้ภายในกี่นาที) แล้วเลือกวิธีให้ตรง
- **PITR (Point-in-Time Recovery):** full backup + WAL archive (PostgreSQL) / full + log backup (SQL Server, recovery model `FULL`) → ย้อนไปจุดก่อน "เผลอ `DELETE` ไม่มี WHERE" ได้ · Supabase: PITR เป็น add-on, daily backup อย่างเดียวเสียข้อมูลได้ถึง 24 ชม.
- `pg_dump` / logical dump เหมาะกับ database เล็กหรือย้ายข้อมูล ไม่ใช่ backup หลักของ database ใหญ่ (ช้า, restore นาน, ไม่มี PITR)
- **ซ้อม restore เป็นรอบ** ไปเครื่องแยก จับเวลาเทียบกับ RTO และตรวจว่าข้อมูลใช้ได้จริง
- เก็บ backup แยกบัญชี / region อย่างน้อยหนึ่งชุด (กันบัญชีโดน compromise / ransomware) และเข้ารหัส
- Replica **ไม่ใช่** backup: `DELETE` ผิดก็ถูก replicate ไปทันที

---

## OP-02 — Monitoring: ดูอะไรบ้าง

| กลุ่ม | ตัวชี้วัด | PostgreSQL | SQL Server |
|---|---|---|---|
| Query | top query ตามเวลารวม / จำนวนครั้ง / reads | `pg_stat_statements` | Query Store, `sys.dm_exec_query_stats` |
| Wait / lock | รออะไรอยู่, ใครบล็อกใคร | `pg_stat_activity.wait_event`, `pg_blocking_pids()` | `sys.dm_os_wait_stats`, `sys.dm_exec_requests` |
| Connection | จำนวนเทียบ max, idle in transaction | `pg_stat_activity` | `sys.dm_exec_sessions` |
| Storage | ขนาดตาราง / index, bloat, disk ว่าง, WAL / log โต | `pg_total_relation_size`, `pg_stat_user_tables.n_dead_tup` | `sys.dm_db_file_space_usage`, log reuse wait |
| Maintenance | autovacuum ล่าสุด, XID age | `last_autovacuum`, `age(datfrozenxid)` | index / statistics maintenance job |
| Replication | lag | `pg_stat_replication` (`replay_lag`) | AG dashboard / `sys.dm_hadr_*` |
| Cache | hit ratio (ดูแนวโน้ม ไม่ใช่ตัวเลขเดียว) | `blks_hit / (blks_hit + blks_read)` | Page Life Expectancy |

- เปิด log query ช้า: PostgreSQL `log_min_duration_statement = 500ms` (+ `auto_explain` สำหรับเก็บ plan) · SQL Server Query Store
- แจ้งเตือนจาก **อาการ** (latency, error rate, disk > 80%, replica lag, XID age) ไม่ใช่ทุกตัวเลข

---

## OP-03 — Read replica และ replication lag

- Replica ช่วยแบ่งงานอ่าน (รายงาน, หน้า dashboard) แต่ข้อมูล **ช้ากว่า primary เสมอ** (มิลลิวินาทีถึงนาทีตอนโหลดหนัก)
- **Read-your-own-writes:** ผู้ใช้บันทึกแล้วหน้าถัดไปอ่านจาก replica = ไม่เห็นสิ่งที่เพิ่งบันทึก → อ่านจาก primary ช่วงสั้นๆ หลังเขียน หรือเฉพาะข้อมูลของผู้ใช้คนนั้น
- ห้ามอ่านจาก replica แล้วตัดสินใจเขียน (เช็กสต็อก / ยอดเงินจาก replica แล้วตัด) ต้องทำบน primary ใน transaction เดียว (CC-02)
- งานเขียนก้อนใหญ่ (backfill, ลบข้อมูลเก่า) ทำ replica lag → ทำเป็นรอบ (MG-05) และเฝ้า lag
- Replication slot ที่ replica ตาย / เลิกใช้แล้ว ทำให้ primary เก็บ WAL ไม่หยุดจน disk เต็ม และขวาง VACUUM (PG-02) → ลบ slot ที่ไม่ใช้

---

## OP-04 — Timeout และการป้องกันตัวเองของระบบ

- ตั้ง timeout ทุกชั้นให้สอดคล้อง: HTTP request < command timeout ของแอป < `statement_timeout` ของ database (ไม่เช่นนั้นผู้ใช้ไปแล้วแต่ query ยังรันกิน resource)
- `statement_timeout` / `lock_timeout` / `idle_in_transaction_session_timeout` ตั้งต่อ role (role ของแอป, role ของ migration, role ของรายงานใช้ค่าต่างกัน)
- Retry เฉพาะ error ที่ retry ได้ (serialization failure `40001`, deadlock `40P01` / 1205, connection หลุด) ด้วย backoff + jitter และเฉพาะงานที่ idempotent
- จำกัด query รายงานหนักๆ ไม่ให้รันบน primary ช่วงพีก (replica, ตาราง summary, หรือช่วงกลางคืน)

---

## OP-05 — Security และสิทธิ์ (ฝั่ง database)

- แยก role: แอปใช้ role ที่ทำได้แค่ DML บนตารางที่ต้องใช้ (ไม่ใช่ owner / superuser / `sa`) · migration ใช้อีก role · คนอ่านรายงานใช้ role read-only
- ห้ามเปิด port database สู่ internet ตรงๆ (ใช้ private network / allowlist IP / SSL บังคับ)
- Credential อยู่ใน secret manager / env ไม่อยู่ใน git และ rotate ได้
- ทุก query ใช้ parameter (กัน SQL injection) รวมถึงชื่อคอลัมน์ / ทิศ ORDER BY ที่รับจากผู้ใช้ต้องผ่าน allowlist
- ข้อมูลส่วนบุคคล / ข้อมูลอ่อนไหว: เข้ารหัส at rest (มักเปิดอยู่แล้วบน cloud), เข้ารหัสระดับคอลัมน์สำหรับข้อมูลที่อ่อนไหวมาก, audit log การเข้าถึง และกำหนด retention (ดูสกิล `pdpa-privacy-engineer`)

---

## OP-06 — Scale ตามลำดับ (อย่าข้ามขั้น)

1. แก้ query / index / schema (บทอื่นในเล่ม) ซึ่งแก้ได้ราว 90% ของปัญหา
2. Connection pooling (PG-07) + timeout (OP-04)
3. Cache ฝั่งแอปสำหรับข้อมูลที่อ่านบ่อยเปลี่ยนน้อย (มีแผน invalidate)
4. Read replica สำหรับงานอ่าน (OP-03)
5. เพิ่มเครื่อง (vertical scale) ซึ่งมักถูกกว่าการเปลี่ยนสถาปัตยกรรม
6. Partition ตารางใหญ่ตามเวลา / key (SD-03)
7. Sharding / แยก database เป็นทางสุดท้าย เพราะ JOIN / transaction ข้าม shard ยากมาก

ทุกขั้นต้องมีตัวเลขยืนยันว่าขั้นก่อนหน้าไม่พอแล้ว (SKILL.md หมวด 11)
