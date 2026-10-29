# Analytics & Reporting (AN): dashboard, รายงาน, ข้อมูลสรุป

query รายงานต่างจาก query หน้าเว็บ: อ่านข้อมูลมาก, รันไม่บ่อย, ต้องการผลรวม ไม่ใช่แถวเดียว ใช้วิธีจูนคนละแบบ

---

## AN-01 — แยกงานรายงานออกจากงานหน้าเว็บ (OLTP vs OLAP)

- รายงานหนักบน primary ช่วงพีก = แย่ง CPU / I/O / buffer กับลูกค้า (IX-06) → ย้ายไป read replica, รันนอกเวลา, หรือใช้ตารางสรุป (AN-02)
- ตั้ง `statement_timeout` ให้ role ของรายงาน และอย่าเปิด transaction ค้างระหว่างดึงรายงาน (PG-02)
- ข้อมูลระดับหลายร้อยล้านแถวที่ต้อง slice หลายมิติ → data warehouse (BigQuery, Snowflake, ClickHouse, DuckDB) แล้ว sync ข้อมูลไป ไม่ใช่ฝืนจูน OLTP

---

## AN-02 — ตารางสรุป / pre-aggregation

```sql
-- daily rollup maintained incrementally (PostgreSQL)
CREATE TABLE sales_daily (
  shop_id bigint NOT NULL, day date NOT NULL,
  orders int NOT NULL, revenue_satang bigint NOT NULL,
  PRIMARY KEY (shop_id, day)
);
INSERT INTO sales_daily (shop_id, day, orders, revenue_satang)
SELECT shop_id, (created_at AT TIME ZONE 'Asia/Bangkok')::date, count(*), sum(total_satang)
FROM orders
WHERE created_at >= @from AND created_at < @to AND status = 'paid'
GROUP BY 1, 2
ON CONFLICT (shop_id, day) DO UPDATE
  SET orders = EXCLUDED.orders, revenue_satang = EXCLUDED.revenue_satang;   -- recompute the window, idempotent
```
- dashboard อ่านจากตารางสรุป (หลักพันแถว) แทน `GROUP BY` บน orders หลายล้านแถวทุกครั้งที่เปิดหน้า
- คำนวณซ้ำช่วงล่าสุด (เช่น 2–3 วันย้อนหลัง) ทุกรอบ เผื่อข้อมูลมาช้า / มีการแก้ไข / คืนเงิน และให้ job รันซ้ำได้ (idempotent)
- ระบุ timezone ของ "วัน" ให้ชัด (DM-07)

---

## AN-03 — Materialized view / Indexed view

- PostgreSQL `MATERIALIZED VIEW`: เก็บผลไว้ ต้อง `REFRESH` เอง (ทั้งก้อน) · `REFRESH MATERIALIZED VIEW CONCURRENTLY` ไม่บล็อกการอ่าน แต่ต้องมี unique index และยังคำนวณใหม่ทั้งหมด → เหมาะกับข้อมูลไม่ใหญ่มากหรือ refresh ไม่ถี่ ถ้าใหญ่ใช้ตารางสรุปแบบ incremental (AN-02)
- SQL Server indexed view: อัปเดตอัตโนมัติทุกครั้งที่ตารางต้นทางเปลี่ยน (อ่านเร็ว แต่ทุกการเขียนช้าลง และมีข้อจำกัดเยอะ: `SCHEMABINDING`, `COUNT_BIG(*)`, ห้าม outer join)

---

## AN-04 — Columnstore / BRIN / partition สำหรับตารางข้อมูลเยอะ

- SQL Server **columnstore index**: เก็บแบบคอลัมน์ บีบอัดดีมาก เหมาะกับ aggregate ล้านแถวขึ้นไป (`SUM`, `COUNT`, `GROUP BY` คอลัมน์ไม่กี่ตัว) ใช้ nonclustered columnstore บนตาราง OLTP ได้ (แลกกับต้นทุนการเขียน) ดู IX-06
- PostgreSQL ไม่มี columnstore ในตัว: BRIN index สำหรับตารางที่เรียงตามเวลา (PG-03), partition ตามเวลาเพื่อตัด partition ที่ไม่เกี่ยว (SD-03), หรือ extension / ระบบวิเคราะห์แยก
- อ่านเฉพาะคอลัมน์ที่ใช้เสมอ (`SELECT *` ในรายงานคือการอ่านข้อมูลที่ไม่ใช้ทั้งหมด)

---

## AN-05 — เขียน query รายงานให้ถูกก่อนเร็ว

- ระวัง fan-out ตอน JOIN แล้ว `SUM` (AP-06, FD-03): รวมแต่ละตารางก่อนแล้วค่อย JOIN
- นับแบบมีเงื่อนไขหลายตัวใน scan เดียว: `COUNT(*) FILTER (WHERE …)` / `SUM(CASE …)` (FD-04) แทนหลาย query
- วันที่ไม่มีข้อมูลต้องแสดงเป็น 0: JOIN กับชุดวันที่ (`generate_series` ใน PostgreSQL, ตาราง calendar ใน SQL Server)
- ยอดเปรียบเทียบช่วงก่อนหน้า / ยอดสะสม: window function (`LAG`, `SUM() OVER (ORDER BY … ROWS …)`)
- เปอร์เซ็นไทล์ / median: `percentile_cont(0.5) WITHIN GROUP (ORDER BY x)` (PostgreSQL) / `PERCENTILE_CONT` (SQL Server, เป็น window function)
- นับไม่ซ้ำปริมาณมาก (`COUNT(DISTINCT user_id)` หลายร้อยล้าน) แพง → ค่าประมาณ (`APPROX_COUNT_DISTINCT` ใน SQL Server 2019+, HyperLogLog extension ใน PostgreSQL) เมื่อยอมรับความคลาดเคลื่อนเล็กน้อยได้
- export ข้อมูลจำนวนมากให้ผู้ใช้: ทำเป็นงานเบื้องหลัง + keyset (AP-08) + stream เป็นไฟล์ ไม่ใช่โหลดทั้งหมดเข้า memory ใน request เดียว
