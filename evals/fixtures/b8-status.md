# Release status — clinic appointment web app, planned go-live: this Friday

- Features: done, demoed to the client, client is happy
- Tests: unit tests cover ~40% of services; no E2E tests
- Secrets: `.env.production` is committed in the private GitHub repo (team of 2 has access)
- Database: Supabase Postgres, automatic daily backups enabled by plan, restore never tested
- RLS: enabled on `appointments`, NOT enabled on `patients` table (client app reads it with anon key)
- Monitoring: none; we check Vercel logs manually
- Deploy: Vercel auto-deploy from main; no staging environment
- Rollback: never tried
- Load: expected 3 clinics, ~150 appointments/day
