# Clinic app — patient sign-up (Flutter app + Supabase, project region: Singapore)

Sign-up screen fields: full name, national ID number, phone, email, date of birth, address,
blood type, chronic diseases, current medications, allergy list, emergency contact name + phone,
LINE ID, monthly income range, religion.

One checkbox at the bottom, already ticked by default:
"☑ ข้าพเจ้ายอมรับข้อตกลงการใช้งาน นโยบายความเป็นส่วนตัว และยินยอมรับข่าวสารโปรโมชันจากคลินิกและพาร์ทเนอร์"

Backend notes:
- All fields stored in one `patients` table; staff app reads it with a role that can read every row.
- Every API request body is logged to Logtail (US region) for debugging.
- A "summarise patient history" button sends the full patient record to an AI API (US) to draft notes.
- There is no way to delete an account; the team says "we keep everything in case we need it".
