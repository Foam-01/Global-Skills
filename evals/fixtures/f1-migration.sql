-- Supabase (PostgreSQL 15). Table orders has ~180,000,000 rows, ~2,000 writes/sec at peak, app runs 6 instances with rolling deploys.
-- Developer's migration file (runs inside one transaction via the migration tool). User: "จะรันอันนี้บน production คืนนี้ โอเคไหม"

BEGIN;

ALTER TABLE orders ADD COLUMN channel text NOT NULL DEFAULT 'web';
ALTER TABLE orders ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE orders ALTER COLUMN total TYPE numeric(19,4);           -- currently double precision
ALTER TABLE orders RENAME COLUMN cust_id TO customer_id;
ALTER TABLE orders ADD CONSTRAINT orders_customer_fk FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE orders ALTER COLUMN coupon_code SET NOT NULL;
CREATE INDEX orders_customer_created_idx ON orders (customer_id, created_at DESC);
UPDATE orders SET channel = 'app' WHERE source_app IS NOT NULL;    -- ~70,000,000 rows

COMMIT;
