# Incident Runbook (IN): database มีปัญหาบน production ทำอะไรก่อน

หลัก: **หยุดเลือดก่อน หาสาเหตุทีหลัง** แต่เก็บหลักฐานไว้ก่อนแก้ (copy ผล query ด้านล่างเก็บไว้) และคำสั่งที่กระทบ production (kill session, เปลี่ยน config, failover) ต้องแจ้ง / ได้รับอนุมัติตามกติกาของทีม (SKILL.md กฎข้อ 16)

---

## IN-01 — CPU database 100% / ทุกอย่างช้า

1. หา query ที่กิน CPU ตอนนี้
   ```sql
   -- PostgreSQL
   SELECT pid, now() - query_start AS running, state, wait_event_type, wait_event, left(query, 200)
   FROM pg_stat_activity
   WHERE state <> 'idle' AND backend_type = 'client backend' AND pid <> pg_backend_pid()
   ORDER BY running DESC;
   SELECT left(query, 200), calls, round(total_exec_time) AS total_ms, round(mean_exec_time) AS mean_ms
   FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;
   -- SQL Server
   SELECT TOP 10 r.session_id, r.cpu_time, r.total_elapsed_time, r.wait_type, t.text
   FROM sys.dm_exec_requests r CROSS APPLY sys.dm_exec_sql_text(r.sql_handle) t ORDER BY r.cpu_time DESC;
   ```
2. สาเหตุที่พบบ่อย: deploy ใหม่มี query ไม่มี index / N+1 · plan เปลี่ยน (statistics, parameter sniffing AP-09) · งาน batch / รายงานรันผิดเวลา · traffic พุ่ง
3. หยุดเลือด: rollback deploy ล่าสุด · ปิด feature / งาน batch · ยกเลิก query ที่หลุด (`pg_cancel_backend(pid)` ก่อน `pg_terminate_backend`; SQL Server `KILL`) · ถ้า plan เปลี่ยน: บังคับ plan เดิมด้วย Query Store (SQL Server) / `ANALYZE` ตาราง (PostgreSQL)
4. หลังสงบ: เพิ่ม index / แก้ query ตามหลักฐาน และตั้ง `statement_timeout` กันซ้ำ

---

## IN-02 — Connection เต็ม (`too many connections` / pool timeout)

1. ดูว่าใครถือ connection และสถานะอะไร
   ```sql
   SELECT usename, application_name, state, count(*) FROM pg_stat_activity GROUP BY 1,2,3 ORDER BY 4 DESC;
   ```
2. อาการ → สาเหตุ:
   - `idle` เยอะมาก → แอปเปิด pool ใหญ่เกิน × จำนวน instance / serverless แต่ละ invocation เปิด connection ใหม่ → ใช้ pooler (PG-07), ลดขนาด pool ต่อ instance
   - `idle in transaction` เยอะ → โค้ดไม่ปิด transaction / connection leak → ตั้ง `idle_in_transaction_session_timeout`, แก้โค้ดให้ใช้ `using` / `finally`
   - `active` เยอะและรอ lock → ไป IN-03
3. ห้ามแก้ด้วยการเพิ่ม `max_connections` อย่างเดียว (แต่ละ connection กิน memory และแย่ง CPU กันเอง)

---

## IN-03 — Query ค้าง / รอ lock / blocking

```sql
-- PostgreSQL: who blocks whom
SELECT a.pid, pg_blocking_pids(a.pid) AS blocked_by, now() - a.query_start AS waiting, left(a.query, 150)
FROM pg_stat_activity a WHERE cardinality(pg_blocking_pids(a.pid)) > 0;
-- SQL Server
SELECT session_id, blocking_session_id, wait_type, wait_time FROM sys.dm_exec_requests WHERE blocking_session_id <> 0;
```
- หา **ต้นตอของโซ่** (session ที่บล็อกคนอื่นแต่ตัวเองไม่ถูกบล็อก) มักเป็น: migration / DDL ที่รอ lock (CC-06), transaction ที่เปิดค้าง / idle in transaction, งาน `UPDATE` / `DELETE` ก้อนใหญ่
- ยกเลิกต้นตอ (ไม่ใช่ปลายโซ่) แล้วแก้ที่สาเหตุ: `lock_timeout` สำหรับ DDL, transaction สั้น (AP-13), ทำงานก้อนใหญ่เป็นรอบ

---

## IN-04 — Disk ใกล้เต็ม

ตรวจตามลำดับ:
1. WAL / transaction log โต: replication slot ค้าง (`pg_replication_slots` ที่ `active = false`), archive ล้มเหลว · SQL Server: `log_reuse_wait_desc` (รอ log backup / transaction ค้าง / replication)
2. ตาราง / index บวม: dead tuple (PG-02), index ที่ไม่ใช้ (IX-08)
3. ตาราง log / audit / session ที่ไม่มี retention → ลบเป็นรอบหรือ drop partition (SD-03)
4. temp file จาก query ที่ spill (`temp_files` ใน `pg_stat_database`)

⚠️ ห้ามลบไฟล์ใน data directory ด้วยมือ · `VACUUM FULL` และ `pg_repack` ต้องใช้พื้นที่ว่างเพิ่มราวขนาดตาราง + index (ทำตอนดิสก์จะเต็มยิ่งแย่) · ขยายดิสก์ก่อนถ้าทำได้ แล้วค่อยเก็บกวาด

---

## IN-05 — Replica lag สูง / อ่านแล้วได้ข้อมูลเก่า

- สาเหตุ: งานเขียนก้อนใหญ่บน primary (backfill, ลบข้อมูล, rebuild index), replica เครื่องเล็กกว่า, query ยาวบน replica ขัดกับการ apply (PostgreSQL: `max_standby_streaming_delay`, `hot_standby_feedback`)
- ระหว่างนั้นย้ายการอ่านที่ต้องสดกลับไป primary (OP-03) และหยุดงานเขียนก้อนใหญ่ แล้วทำใหม่เป็นรอบ (MG-05)

---

## IN-06 — ลบ / แก้ข้อมูลผิด (`UPDATE` / `DELETE` ลืม WHERE)

1. **หยุด** งานที่อาจเขียนทับต่อ และจดเวลาที่เกิดเหตุให้แม่นที่สุด
2. อย่าพยายามเดาแก้ข้อมูลใน production ทันที
3. กู้ด้วย PITR ไปยัง **database ใหม่** ณ เวลาก่อนเกิดเหตุ (OP-01) แล้วคัดลอกเฉพาะแถวที่เสียกลับมา (เทียบด้วย primary key)
4. ป้องกัน: รันคำสั่งแก้ข้อมูลใน transaction แล้วดูจำนวนแถวก่อน `COMMIT`, สิทธิ์ของคนทั่วไปเป็น read-only, ใช้ migration / script ที่ผ่านรีวิวแทนการพิมพ์ใน console

---

## IN-07 — หลังเหตุการณ์

- เขียน postmortem สั้นๆ: เกิดอะไร, ตรวจพบอย่างไร, ผลกระทบ, สาเหตุจริง, แก้อะไร, จะกันไม่ให้เกิดซ้ำอย่างไร (alert, timeout, test, review)
- เพิ่มบทเรียนที่ได้ลง playbook นี้พร้อมตัวเลขจริง
