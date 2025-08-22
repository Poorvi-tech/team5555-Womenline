🌸 Womenline Routes Documentation 🌸

Welcome to the Womenline API Routes Summary     
This document provides a clear map of all route files in the backend and the APIs they contain.
Think of it as a quick index + reference guide 🗂️

🔐 Authentication Routes (authRoutes.js)
✨Handles user authentication, registration, login, and OTP verification.

➡️POST /api/auth/register → Register a new user (Public)
➡️POST /api/auth/login → User login & get JWT token (Public)
➡️POST /api/auth/send-otp → Send OTP to email/phone (Public)
➡️POST /api/auth/verify-otp → Verify user OTP (Public)
➡️GET /api/auth/token-check → Validate JWT token (Authenticated Users)


📔 Journal Routes (journalRoutes.js)
✨Manages user journals including voice and mood logs.

➡️GET /api/journals → Fetch user’s journal entries (Authenticated)
➡️POST /api/journals → Create a new journal entry (Authenticated)
➡️POST /api/voice/upload → Upload a voice entry (Authenticated)


🌸 Period Tracker Routes (periodRoutes.js)
✨Handles menstrual cycle tracking and logs.

➡️POST /api/period-log → Add a new period entry (Authenticated)
➡️GET /api/period-log/:userId → Get period logs for a user (Authenticated)


🎁 Rewards & Green Credits Routes (rewardRoutes.js)
✨Manages user rewards, credits, and redemption history.

➡️POST /api/rewards/earn-credits → Earn MaCoins/credits (Authenticated)
➡️POST /api/rewards/redeem → Redeem credits for rewards (Authenticated)
➡️GET /api/rewards → Get all available rewards (Authenticated)
➡️GET /api/rewards/user-credits → Get user’s current credits (Authenticated)
➡️GET /api/rewards/user/redemption-history → Redemption history (Authenticated)


📑 PDF Export Routes (pdfRoutes.js)
✨Handles exporting reports and data into PDFs.

➡️GET /api/pdf/sample → Download sample PDF (Authenticated)
➡️GET /api/pdf/export-summary → Export user summary as PDF (Authenticated)


💬 WhatsApp Routes (whatsappRoutes.js)
✨Integration with WhatsApp bot for sending and receiving alerts.

➡️POST /api/whatsapp/send-whatsapp → Send WhatsApp message (Authenticated)
➡️POST /api/whatsapp/inbound → Handle inbound WhatsApp replies (Public)
➡️GET /api/whatsapp/test → Test WhatsApp bot integration (Public)


📂 File Upload Routes (uploadRoutes.js)
✨Handles file uploads and storage.

➡️POST /api/upload/file → Upload a file (Authenticated)


🚨 Abuse Report Routes (abuseRoutes.js)
✨Users can report abuse, admins can review reports.

➡️POST /api/abuse/report-abuse → Report abuse (Users/Public)
➡️GET /api/abuse/report-abuse → Get abuse reports (Admin only)


📝 Forum Routes (forumRoutes.js)
✨Community forum for posting, replying, and reporting content.

➡️POST /api/forum/forum-post → Create a forum post (Authenticated)
➡️POST /api/forum/forum-reply/:postId → Reply to a forum post (Authenticated)
➡️GET /api/forum/forum-replies/:postId → Get all replies for a forum post (Authenticated)
➡️POST /api/forum/report-post/:postId → Report a forum post (Authenticated)
➡️GET /api/forum/reports → Get forum reports (Admin only)


📅 Appointment Routes (appointmentRoutes.js)
✨Manage doctor appointments.

➡️POST /api/appointments → Book an appointment (Authenticated)
➡️GET /api/appointments → Fetch all appointments (Authenticated)
➡️DELETE /api/appointments/:id → Cancel an appointment (Authenticated)


✅ Doctor Checklist Routes (checklistRoutes.js)
✨Manage doctor checklists and availability.

➡️GET /api/doctor-checklist → Fetch doctor checklist (Users)
➡️POST /api/checklist → Add a new checklist entry (Admin only)
➡️PUT /api/checklist/:id → Update doctor checklist entry (Admin only)
➡️DELETE /api/checklist/:id → Delete doctor checklist entry (Admin only)


🏆 Leaderboard Routes (leaderboardRoutes.js)
✨Shows rankings of users based on MaCoins and forum activity.

➡️GET /api/leaderboard → Fetch leaderboard (Authenticated Users)


📌 Notes
Each routes file is dedicated to a specific module.
This summary helps quickly identify which API belongs to which file.
For detailed descriptions and roles, refer to the controller documentation.

✨ End of Routes.md ✨