# Thai shop: search + owner dashboard (Supabase PostgreSQL 15, ~5,000,000 orders, ~200,000 products)

User: "ช่องค้นหาสินค้าพิมพ์ภาษาไทยแล้วหาไม่ค่อยเจอ แถมช้า ส่วนหน้า dashboard ของเจ้าของร้านโหลด 20 วินาที ยอดบางวันก็ไม่ตรงกับที่บัญชีนับ ช่วยดูหน่อย"

```sql
-- search (runs on every keystroke from the first character)
SELECT * FROM products
WHERE to_tsvector('simple', name) @@ plainto_tsquery('simple', $1);

-- dashboard: daily revenue for the last 30 days, opened by every shop owner many times a day
SELECT DATE(o.created_at) AS day, SUM(o.total) AS revenue, COUNT(*) AS orders
FROM orders o
JOIN order_items i ON i.order_id = o.id
WHERE o.shop_id = $1 AND o.created_at >= now() - interval '30 days'
GROUP BY DATE(o.created_at)
ORDER BY day;
-- orders.total is double precision, created_at is timestamptz, the shop is in Thailand
-- indexes: orders(pk), order_items(pk) only
```
