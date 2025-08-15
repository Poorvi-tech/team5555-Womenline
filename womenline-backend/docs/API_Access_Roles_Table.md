# API Access Roles Table

| Endpoint | Method | Purpose / Description | Access Role |
|----------|--------|-----------------------|-------------|
| `/api/auth/register` | POST | Register new user | Public |
| `/api/auth/login` | POST | User login | Public |
| `/api/auth/send-otp` | POST | Send OTP for verification | Public |
| `/api/auth/verify-otp` | POST | Verify OTP | Public |
| `/api/auth/token-check` | GET | Check valid token | Authenticated Users |
| `/api/journals` | GET | Fetch user journals | Authenticated Users |
| `/api/journals` | POST | Create a journal entry | Authenticated Users |
| `/api/upload/file` | POST | Upload files | Authenticated Users |
| `/api/rewards/earn-credits` | POST | Earn credits (MaCoin) | Authenticated Users |
| `/api/rewards/redeem` | POST | Redeem rewards | Authenticated Users |
| `/api/rewards` | GET | Fetch available rewards | Authenticated Users |
| `/api/rewards/user-credits` | GET | Fetch user's current credits | Authenticated Users |
| `/api/rewards/user/redemption-history` | GET | Fetch user's redemption history | Authenticated Users |
| `/api/pdf/sample` | GET | Sample PDF download | Authenticated Users |
| `/api/pdf/export-summary` | GET | Export user summary PDF | Authenticated Users |
| `/api/period-log` | POST | Log period entry | Authenticated Users |
| `/api/period-log/:userId` | GET | Fetch period logs for a user | Authenticated Users |
| `/api/whatsapp/send-whatsapp` | POST | Send WhatsApp message via bot | Authenticated Users |
| `/api/voice/upload` | POST | Upload voice entry | Authenticated Users |
| `/api/abuse/report-abuse` | POST | Report abuse | Authenticated Users |
| `/api/abuse/report-abuse` | GET | Get abuse reports | Admin |
| `/api/forum/forum-post` | POST | Create forum post | Authenticated Users |
| `/api/forum/forum-reply/:postId` | POST | Reply to forum post | Authenticated Users |
| `/api/forum/forum-replies/:postId` | GET | Fetch replies for a post | Authenticated Users |
| `/api/forum/report-post/:postId` | POST | Report a forum post | Authenticated Users |
| `/api/forum/reports` | GET | To see all reports | Admin Only |
| `/api/appointments` | POST | Book an appointment | Authenticated Users |
| `/api/appointments` | GET | Get user's appointments | Authenticated Users |
| `/api/appointments/:id` | DELETE | Cancel an appointment | Authenticated Users |
| `/api/doctor-checklist` | GET | Fetch doctor checklist | Authenticated Users |
| `/api/checklist` | POST | Add new doctor/checklist | Admin Only |
| `/api/leaderboard` | GET | Fetch leaderboard (MaCoin/Posts) | Authenticated Users |
