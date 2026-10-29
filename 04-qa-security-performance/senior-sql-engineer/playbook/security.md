# Database Security (SE): ช่องโหว่ฝั่ง SQL ที่คนมองข้าม

ต่อจาก SKILL.md หมวด 12, AP-04 (IDOR), PG-06 (RLS), OP-05 (role / network) สำหรับการตรวจ security ทั้งระบบใช้สกิล `security-engineer` / `security-audit`

---

## SE-01 — SQL injection ที่ parameter กันไม่ได้

Parameter (`$1`, `@p`) ใช้แทน **ค่า** ได้เท่านั้น ใช้แทน **ชื่อตาราง / คอลัมน์ / ทิศ ORDER BY / keyword** ไม่ได้ ตรงนี้คือที่ injection ยังเกิดแม้ทีมจะ "ใช้ parameter ทุกที่"

```ts
// ❌ sort / column from the request goes straight into SQL
const sql = `SELECT * FROM products ORDER BY ${req.query.sort} ${req.query.dir}`;
// ✅ allowlist
const SORT = { price: 'price', newest: 'created_at' } as const;
const col = SORT[req.query.sort as keyof typeof SORT] ?? 'created_at';
const dir = req.query.dir === 'asc' ? 'ASC' : 'DESC';
```
- ORM ก็โดนได้: Prisma `$queryRawUnsafe` / `$executeRawUnsafe`, Sequelize `literal`, TypeORM `.orderBy(userInput)`, EF Core `FromSqlRaw` ที่ต่อ string (OR-07)
- `LIKE` ต้อง escape `%` / `_` (ไม่ใช่ injection แต่ทำให้ค้นผิด / ช้า, IX-05)
- `IN (...)` จากรายการ: ใช้ array parameter (`= ANY($1)` ใน PostgreSQL, table-valued parameter / `STRING_SPLIT` ใน SQL Server) ไม่ใช่ต่อ string

---

## SE-02 — Dynamic SQL ภายใน function / stored procedure

```sql
-- PostgreSQL ❌
EXECUTE 'SELECT * FROM ' || tbl || ' WHERE name = ''' || p_name || '''';
-- ✅ identifiers via format(%I), values via USING
EXECUTE format('SELECT * FROM %I WHERE name = $1', tbl) USING p_name;
```
```sql
-- SQL Server ✅
DECLARE @sql nvarchar(max) = N'SELECT * FROM ' + QUOTENAME(@tbl) + N' WHERE name = @name';
EXEC sp_executesql @sql, N'@name nvarchar(100)', @name = @name;
```
- ชื่อ object ที่มาจากผู้ใช้ควรผ่าน allowlist ด้วย ไม่ใช่แค่ quote

---

## SE-03 — `SECURITY DEFINER` function (PostgreSQL / Supabase)

function แบบนี้รันด้วยสิทธิ์ของ **เจ้าของ** (มักเป็น `postgres`) และข้าม RLS → ถ้าเขียนพลาดคือประตูหลังของทั้ง database
- ตั้ง `SET search_path = ''` (หรือ schema ที่ปลอดภัย) และอ้างชื่อเต็ม `public.orders`, `auth.uid()` ทุกตัว กันการสร้าง object ปลอมใน schema อื่นมาแทนที่
- ตรวจสิทธิ์ข้างใน function เอง (`IF NOT is_shop_admin((select auth.uid()), p_shop_id) THEN RAISE EXCEPTION …`) เพราะ RLS ไม่ช่วยแล้ว
- `REVOKE EXECUTE ON FUNCTION … FROM PUBLIC, anon;` แล้ว `GRANT` เฉพาะ role ที่ต้องใช้ (function ใน schema `public` ของ Supabase ถูกเรียกผ่าน API `rpc()` ได้)
- ใช้ `SECURITY INVOKER` (default) ถ้าไม่จำเป็นต้องข้ามสิทธิ์

---

## SE-04 — ข้อมูลรั่วผ่านทางอ้อม

- **Error message** ส่ง SQL error ดิบกลับ client (ชื่อตาราง, constraint, ค่าในแถว) → log ฝั่ง server แล้วตอบข้อความทั่วไป
- **ID ที่เดาได้** (`/invoices/1001`) ไม่ใช่ช่องโหว่เองถ้ามีการตรวจสิทธิ์ แต่เปิดให้ไล่ลองได้ → ตรวจสิทธิ์ทุกครั้ง (AP-04) และใช้ public id ที่เดายาก (UUID) สำหรับลิงก์ที่แชร์ได้
- **คอลัมน์เกิน:** `select('*')` / serialize entity ทั้งตัว ส่ง `password_hash`, `role`, `internal_note` ออกไป → เลือกคอลัมน์ / DTO (OR-02); Supabase: column-level privileges หรือ view ที่ตัดคอลัมน์ (พร้อม `security_invoker`, PG-06)
- **Mass assignment:** รับ body ทั้งก้อนไป `update` (ผู้ใช้ส่ง `role: 'admin'` / `balance: 999999` มาด้วย) → allowlist ฟิลด์ที่แก้ได้
- **Log / backup / dump** มีข้อมูลส่วนบุคคลครบ → จำกัดสิทธิ์และเข้ารหัสเหมือน production (OP-01)
- **Timing / count:** endpoint "อีเมลนี้มีในระบบไหม" ให้ข้อมูลว่าใครเป็นสมาชิก → ตอบเหมือนกันทั้งสองกรณีเมื่อเป็นเรื่องอ่อนไหว

---

## SE-05 — เก็บข้อมูลลับให้ถูกวิธี

| ข้อมูล | วิธีเก็บ |
|---|---|
| รหัสผ่าน | **hash แบบช้า** (argon2id / bcrypt / scrypt) ที่ฝั่งแอป หรือใช้ระบบ auth สำเร็จรูป ห้ามเข้ารหัสแบบถอดกลับได้ ห้าม MD5 / SHA ตรงๆ |
| token / API key ที่ต้องตรวจ | เก็บ hash (SHA-256) ของ token แล้วเทียบ ไม่เก็บตัวจริง |
| ข้อมูลที่ต้องอ่านกลับได้ (เลขบัตรประชาชน, เลขบัญชี) | เข้ารหัสระดับคอลัมน์ด้วยกุญแจที่อยู่ **นอก database** (KMS / Vault / Supabase Vault) + เก็บค่า hash แยกไว้ค้นหาแบบตรงตัว |
| เลขบัตรเครดิต | อย่าเก็บเอง ใช้ token ของ payment provider |

- `pgcrypto` ใน PostgreSQL เข้ารหัสได้ แต่ถ้าส่งกุญแจไปใน query กุญแจอาจไปโผล่ใน log / `pg_stat_statements` → เข้ารหัสฝั่งแอปมักปลอดภัยกว่า
- encryption at rest ของ cloud กันกรณีดิสก์หลุด ไม่ได้กันคนที่มีสิทธิ์ query

---

## SE-06 — สิทธิ์ขั้นต่ำและการตรวจสอบ

- role ของแอปไม่เป็นเจ้าของตารางและไม่มีสิทธิ์ DDL (OP-05) ถ้าแอปโดนเจาะ ผู้บุกรุกจะ `DROP` ไม่ได้
- สิทธิ์ระดับคอลัมน์ / view สำหรับ role ที่ดูได้บางส่วน (ทีม support เห็นชื่อแต่ไม่เห็นเลขบัตร)
- audit log การเข้าถึงข้อมูลอ่อนไหวและการเปลี่ยนสิทธิ์ (DM-04)
- ตรวจ Supabase Security Advisor / `pg_tables` ว่ามีตารางใน schema ที่เปิดผ่าน API แต่ยังไม่ `ENABLE ROW LEVEL SECURITY` หรือไม่
