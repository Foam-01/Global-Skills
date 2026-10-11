-- PostgreSQL 16, table products has ~3,000,000 rows, no indexes except the primary key (id)
-- This query runs on every search request and takes ~2.5s
SELECT id, name, price
FROM products
WHERE shop_id = $1
  AND status = 'active'
  AND name ILIKE '%' || $2 || '%'
ORDER BY created_at DESC
LIMIT 20;
