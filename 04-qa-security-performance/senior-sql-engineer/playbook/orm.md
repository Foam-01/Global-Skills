# ORM Pitfalls (OR): Prisma, Drizzle, supabase-js, EF Core

กฎข้อแรก: **ดู SQL ที่ ORM สร้างจริงเสมอ** (AP-07) แล้ววัดด้วย EXPLAIN เหมือน SQL ที่เขียนเอง

| ORM | ดู SQL / log อย่างไร |
|---|---|
| Prisma | `new PrismaClient({ log: ['query'] })` |
| Drizzle | `drizzle(client, { logger: true })` หรือ `.toSQL()` |
| supabase-js / PostgREST | Supabase Dashboard → Logs / Query Performance, หรือ `.explain()` (ต้องเปิด `db_plan_enabled`) |
| EF Core | `query.ToQueryString()`, `LogTo(Console.WriteLine)` |
| TypeORM / Sequelize | `logging: true` |

---

## OR-01 — N+1 จากการโหลด relation

- โหลดรายการแล้ววนเข้าถึง relation ทีละแถว (lazy loading) = 1 + N query (AP-02)
- Prisma: `include` / `select` ซ้อน (Prisma รวมเป็น query เพิ่มต่อ relation หรือ JOIN ตาม `relationLoadStrategy`) · EF Core: `Include` / projection `Select` · supabase-js: embed relation `select('*, items(*)')` ใน request เดียว
- ⚠️ `Include` หลาย collection พร้อมกันใน EF Core = JOIN ที่แถวคูณกัน (cartesian explosion) → `AsSplitQuery()` หรือ projection

---

## OR-02 — ดึงทุกคอลัมน์และทุกแถว

- `findMany()` / `ToListAsync()` / `select('*')` ไม่จำกัดคอลัมน์ = ลาก JSON / text / รูปมาด้วย (IX-04 lob, SD-02) → `select` เฉพาะฟิลด์
- ไม่มี `take` / `limit` บน endpoint รายการ = วันหนึ่งคืนแสนแถว
- `count()` ทุกหน้า pagination บนตารางใหญ่แพง (AP-08)
- EF Core อ่านอย่างเดียวให้ `AsNoTracking()`

---

## OR-03 — Type ไม่ตรงคอลัมน์ (implicit conversion)

- EF Core / .NET ส่ง string เป็น `nvarchar` → คอลัมน์ `varchar` ใช้ index ไม่ได้ (IX-03: 841 → 42 reads) → `HasColumnType("varchar(n)")` / `IsUnicode(false)`
- ส่ง `DateTime` ไปเทียบกับ `date` / timestamp ต่างชนิด, ส่งตัวเลขเป็น string → ตรวจ SQL และ plan
- ORM ใส่ฟังก์ชันครอบคอลัมน์ให้เอง เช่น `.ToLower()`, `.Date`, `mode: 'insensitive'` (Prisma → `ILIKE`) ทำให้ใช้ B-tree index ปกติไม่ได้ → expression index / `citext` / `pg_trgm` (PG-03)

---

## OR-04 — Transaction และ concurrency ใน ORM

- อ่าน → แก้ object → save = lost update (CC-02) → ใช้ atomic update: Prisma `update({ data: { qty: { decrement: n } } })` (ยังต้องกันติดลบด้วย `where` / `CHECK`), EF Core `ExecuteUpdateAsync`, หรือ concurrency token (`[Timestamp]`, Prisma ต้องทำ version เอง)
- Prisma interactive transaction (`$transaction(async tx => …)`) ถือ connection และ lock ตลอดฟังก์ชัน → ห้ามเรียก API / งานช้าข้างใน (AP-13) มี timeout default (5 วินาที) ไม่ใช่ให้ขยายแก้ปัญหา
- supabase-js ไม่มี transaction ข้ามหลาย request → งานหลายขั้นที่ต้อง atomic ทำเป็น PostgreSQL function แล้วเรียก `rpc()` (AP-09)
- ORM ฝั่ง server ที่ต่อด้วย role `postgres` **ข้าม RLS ของ Supabase** การแยกข้อมูลระหว่างผู้ใช้ / tenant ต้องทำในโค้ด (ดึง id จาก session ไม่ใช่จาก request) หรือใช้ role ที่ไม่ข้าม RLS + `SET LOCAL` (DM-01)
- upsert ของ ORM ต้องมี unique constraint รองรับจริง ไม่เช่นนั้นเป็น "find แล้ว create" ที่มี race (CC-03)

---

## OR-05 — Connection ใน serverless / หลาย instance

- แต่ละ function / instance เปิด pool ของตัวเอง → รวมกันเกิน `max_connections` (IN-02) → ใช้ pooler (Supabase: transaction pooler port 6543) + `connection_limit` ต่ำต่อ instance
- Prisma กับ pooler แบบ transaction mode: **PgBouncer ก่อน 1.21** ต้องใส่ `?pgbouncer=true` · **PgBouncer 1.21+** เอกสาร Prisma แนะนำ **ไม่ใส่** แต่ต้องตั้ง `max_prepared_statements > 0` · Supavisor (Supabase) ใส่ใน connection string แบบ pooled ได้ · migration (`prisma migrate`, `db push`, `db pull`) ต้องใช้ **direct connection** แยก (`directUrl` / `DIRECT_URL` ใน `prisma.config.ts` ของ Prisma 7) ไม่เช่นนั้นเจอ `prepared statement "s0" already exists`
- Next.js dev ที่ hot reload สร้าง PrismaClient ใหม่ทุกครั้ง → เก็บเป็น singleton บน `globalThis`

---

## OR-06 — Migration ที่ ORM สร้างให้

- อ่าน SQL ที่ `prisma migrate dev` / `drizzle-kit generate` / `dotnet ef migrations` สร้างทุกครั้งก่อน merge
  - rename field ใน schema อาจถูกสร้างเป็น **drop + add** (ข้อมูลหาย)
  - เปลี่ยน type = rewrite ตาราง (MG-02)
  - สร้าง index แบบไม่ `CONCURRENTLY`
- ตารางใหญ่: แก้ไฟล์ migration เอง หรือแยก migration ที่ต้องรันนอก transaction (MG-02) และทำตาม MG-06
- ห้ามใช้ `prisma db push` / `EnsureCreated` กับ production (ไม่มีประวัติ migration)

---

## OR-07 — เมื่อไหร่ควรเขียน SQL เอง

- รายงาน / aggregate ซับซ้อน, window function, CTE recursive, upsert แบบมีเงื่อนไข, bulk update / delete เป็นรอบ, keyset pagination หลายคอลัมน์ (AP-08)
- ใช้ raw query แบบมี parameter เสมอ: Prisma `$queryRaw` (tagged template) ไม่ใช่ `$queryRawUnsafe` กับ input ผู้ใช้, EF Core `FromSqlInterpolated`, Drizzle `sql\`\`` template
- ห่อไว้ใน repository / function เดียว พร้อม test เทียบผลกับข้อมูลตัวอย่าง
