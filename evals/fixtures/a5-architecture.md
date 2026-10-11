# Current architecture (queue-booking SaaS)

- One Node.js (Express) server on a single VPS. Sessions stored in an in-memory JS object (`const sessions = {}`).
- A `node-cron` job inside the same process sends SMS reminders every 5 minutes for tomorrow's bookings and marks them `reminded = true`.
- Customer profile photos are uploaded and saved to `./uploads` on the VPS local disk and served by Express static.
- One PostgreSQL 15 instance on the same VPS. No replicas. Backups: none configured.
- Next month we plan to put 3 copies of the Node server behind a load balancer (3 VPS) because traffic will triple for a marketing campaign.
