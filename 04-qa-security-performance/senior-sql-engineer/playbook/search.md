# Search (SR): ค้นหาข้อความ รวมถึงภาษาไทย

ต่อจาก IX-05 (LIKE '%คำ%') ข้อเท็จจริงของ pg_trgm ตรวจกับเอกสาร PostgreSQL `pg_trgm`

---

## SR-01 — เลือกเครื่องมือตามโจทย์

| โจทย์ | เครื่องมือ |
|---|---|
| ค้นจากต้นคำ (`abc%`): SKU, รหัส, อีเมล | B-tree (`text_pattern_ops` / collation `C` ใน PostgreSQL) |
| ค้นคำบางส่วนตรงไหนก็ได้ (`%คำ%`), พิมพ์ผิดเล็กน้อย, ข้อมูลไม่เกินหลักล้านแถว | **`pg_trgm`** + GIN / GiST (PostgreSQL) |
| ค้นข้อความยาว จัดอันดับความเกี่ยวข้อง ภาษาอังกฤษ / ภาษาที่มีช่องว่างคั่นคำ | Full-Text Search ในตัว (`tsvector` / `tsquery`, SQL Server Full-Text, MySQL `FULLTEXT`) |
| ภาษาไทย / ภาษาที่ไม่มีช่องว่างคั่นคำ ต้องการค้นแบบคำจริง | ตัดคำก่อนเก็บ หรือ extension ที่รองรับ (SR-03) หรือ search engine แยก |
| facet, typo tolerance, ranking ซับซ้อน, หลายสิบล้านเอกสาร | search engine แยก (Meilisearch, Typesense, Elasticsearch / OpenSearch) แล้ว sync จาก database |

เริ่มจากง่ายสุดที่ผ่านโจทย์ และวัดก่อนย้ายไปขั้นถัดไป search engine แยกมีต้นทุน sync / ปฏิบัติการเพิ่ม

---

## SR-02 — `pg_trgm` (ค้นคำบางส่วน)

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX products_name_trgm ON products USING gin (name gin_trgm_ops);
SELECT id, name FROM products WHERE name ILIKE '%' || $1 || '%' LIMIT 20;   -- index-assisted
SELECT name FROM products WHERE name % $1 ORDER BY name <-> $1 LIMIT 10;   -- fuzzy; the ORDER BY needs a GiST index
```
- GIN / GiST trgm รองรับ `LIKE`, `ILIKE`, `~`, `~*`, `=` และ similarity `%` โดยไม่ต้องขึ้นต้นคำ
- **คำค้นสั้นมาก (1–2 ตัวอักษร)** สกัด trigram ได้น้อยหรือไม่ได้เลย → index ช่วยน้อย / กลายเป็นอ่านทั้ง index → บังคับความยาวขั้นต่ำในแอป (เช่น ≥ 3)
- pg_trgm **ข้ามตัวอักษรที่ไม่ใช่ตัวอักษร / ตัวเลข** และแยกคำตามสิ่งเหล่านั้น การที่ตัวอักษรไทย (รวมสระบน / ล่าง และวรรณยุกต์) ถูกนับเป็นตัวอักษรหรือไม่ขึ้นกับ locale (`LC_CTYPE`) ของ database → **ทดสอบกับข้อมูลจริง** ด้วย `SELECT show_trgm('ข้าวผัดกุ้ง');` และเทียบผลค้นหาก่อนใช้
- GIN index ของ trgm ใหญ่และทำให้เขียนช้าลง ทำเฉพาะคอลัมน์ที่ค้นจริง
- escape `%` และ `_` ใน input ของผู้ใช้ (IX-05)

---

## SR-03 — ภาษาไทยกับ Full-Text Search

- Full-Text Search ในตัวของ PostgreSQL แยกคำด้วยช่องว่าง / เครื่องหมาย และไม่มี dictionary / parser ภาษาไทยมาให้ → ประโยคไทยทั้งประโยคถูกมองเป็น "คำ" เดียว ค้นคำย่อยไม่เจอ
- ทางเลือก (เรียงจากง่าย):
  1. **pg_trgm** (SR-02): ไม่ต้องตัดคำ ค้นคำบางส่วนได้ เพียงพอสำหรับชื่อสินค้า / ชื่อคน / หัวข้อสั้นๆ ส่วนใหญ่
  2. **ตัดคำฝั่งแอปก่อนเก็บ** (เช่น PyThaiNLP, ICU word break) แล้วเก็บผลที่คั่นด้วยช่องว่างในคอลัมน์ `search_text` → ใช้ `to_tsvector('simple', search_text)` + GIN และตัดคำของคำค้นด้วยตัวตัดคำเดียวกัน
  3. **Extension ที่รองรับภาษาที่ไม่มีช่องว่างคั่นคำ** เช่น PGroonga (ออกแบบมาสำหรับภาษาญี่ปุ่น / CJK; ตรวจว่าผู้ให้บริการ database ของคุณเปิดให้ใช้และรองรับภาษาไทยตามต้องการ โดยทดสอบกับข้อมูลจริงก่อน)
  4. **Search engine แยก** ที่มีตัวตัดคำไทย (Elasticsearch / OpenSearch มี ICU / `thai` analyzer)
- SQL Server Full-Text มี word breaker ภาษาไทย (LCID 1054) · MySQL `FULLTEXT` ใช้ ngram parser กับภาษาที่ไม่มีช่องว่างได้ (`WITH PARSER ngram`)

---

## SR-04 — Full-Text Search (ภาษาอังกฤษ / มีช่องว่าง) ใน PostgreSQL

```sql
ALTER TABLE articles ADD COLUMN search tsvector
  GENERATED ALWAYS AS (setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
                       setweight(to_tsvector('english', coalesce(body, '')), 'B')) STORED;
CREATE INDEX articles_search_idx ON articles USING gin (search);
SELECT id, title, ts_rank(search, q) AS rank
FROM articles, websearch_to_tsquery('english', $1) q
WHERE search @@ q ORDER BY rank DESC LIMIT 20;
```
- `websearch_to_tsquery` รับ input แบบช่องค้นหาทั่วไปได้ปลอดภัย (ไม่ error กับเครื่องหมายแปลกๆ)
- ใช้ generated column เก็บ `tsvector` ไว้แทนการคำนวณทุก query
- `ts_rank` ต้องคำนวณทุกแถวที่ match → ถ้าผลลัพธ์เยอะมาก การเรียงตาม rank แพง จำกัดผลหรือกรองเพิ่มก่อน

---

## SR-05 — ค้นหาหลายเงื่อนไข (ช่องค้นหา + filter)

- รวมกับ filter อื่น (หมวด, ราคา, ร้าน): ให้ filter ที่เลือกได้ดีและมี B-tree ทำงานก่อน ถ้าเป็นไปได้ หรือแยก query เมื่อ planner เลือกผิด (ดู plan ทั้งสองแบบ)
- multi-tenant: ทุกการค้นหาต้องมี `tenant_id` (DM-01)
- autocomplete ที่ยิงทุกการพิมพ์: debounce ฝั่ง client, จำกัดผล (`LIMIT 10`), ความยาวขั้นต่ำ, และพิจารณา cache คำค้นยอดนิยม
