# Clinic booking (Supabase / PostgreSQL 15, Next.js API route)

User: "บางทีมีคนจองเวลาเดียวกันกับหมอคนเดียวกันได้ 2 คน แล้วตอนคนเยอะ ตาราง bookings ช้าลงเรื่อยๆ แถมพื้นที่ database โตไม่หยุด ทั้งที่ข้อมูลไม่ได้เพิ่มเยอะ ช่วยดูหน่อย"

```sql
CREATE TABLE bookings (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  doctor_id bigint NOT NULL REFERENCES doctors(id),
  patient_id uuid NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL,                 -- 'held' | 'confirmed' | 'cancelled'
  last_seen timestamptz                 -- updated every 5 seconds while the patient keeps the booking page open
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY p ON bookings USING (auth.uid() = patient_id);
CREATE INDEX ON bookings (last_seen);
CREATE INDEX ON bookings (status);
```

```ts
// POST /api/book
const { data: clash } = await supabase.from('bookings')
  .select('id').eq('doctor_id', d).lt('starts_at', end).gt('ends_at', start).neq('status', 'cancelled');
if (clash.length === 0) {
  await supabase.from('bookings').insert({ doctor_id: d, patient_id: uid, starts_at: start, ends_at: end, status: 'held' });
}

// Background: a nightly report opens a transaction with BEGIN and reads for a long time,
// sometimes the script crashes and leaves the session "idle in transaction" for days.
```

Numbers: bookings has 40,000 live rows but the table + indexes take 9 GB. `n_dead_tup` = 31,000,000. `last_autovacuum` is 6 days ago.
