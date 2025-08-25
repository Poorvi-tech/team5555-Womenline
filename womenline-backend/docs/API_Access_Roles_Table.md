# API Access Roles Table

## 1. Authentication

| Endpoint                | Method | Purpose / Description     | Access Role         |
| ----------------------- | ------ | ------------------------- | ------------------- |
| `/api/auth/register`    | POST   | Register new user         | Public              |
| `/api/auth/login`       | POST   | User login                | Public              |
| `/forgot-password`      | POST   | forgot password           | Public              |
| `/reset-password`       | POST   | reset password            | Public              |
| `/api/auth/send-otp`    | POST   | Send OTP for verification | Public              |
| `/api/auth/verify-otp`  | POST   | Verify OTP                | Public              |
| `/api/auth/token-check` | GET    | Check valid token         | Authenticated Users |

## 2. Journals

| Endpoint        | Method | Purpose / Description  | Access Role         |
| --------------- | ------ | ---------------------- | ------------------- |
| `/api/journals` | GET    | Fetch user journals    | Authenticated Users |
| `/api/journals` | POST   | Create a journal entry | Authenticated Users |

## 3. Uploads

| Endpoint                   | Method | Purpose / Description            | Access Role         |
| -------------------------- | ------ | -------------------------------- | ------------------- |
| `/api/upload/file`         | POST   | Upload general files (PDF/Image) | Authenticated Users |
| `/api/voice/upload`        | POST   | Upload voice note                | Authenticated Users |
| `/uploads/voice/:filename` | GET    | Access voice files               | Public              |
| `/uploads/pdf/:filename`   | GET    | Access PDF files                 | Public              |

## 4. Rewards & MaCoin

| Endpoint                          | Method | Purpose / Description           | Access Role         |
| --------------------------------- | ------ | ------------------------------- | ------------------- |
| `/api/earn-credits`               | POST   | Earn credits (MaCoin)           | Authenticated Users |
| `/api/rewards/redeem`             | POST   | Redeem rewards                  | Authenticated Users |
| `/api/rewards`                    | GET    | Fetch available rewards         | Authenticated Users |
| `/api/rewards/user-credits`       | GET    | Fetch user's current credits    | Authenticated Users |
| `/api/rewards/redemption-history` | GET    | Fetch user's redemption history | Authenticated Users |

## 5. PDF / Export

| Endpoint                  | Method | Purpose / Description   | Access Role         |
| ------------------------- | ------ | ----------------------- | ------------------- |
| `/api/pdf/export-summary` | GET    | Export user summary PDF | Authenticated Users |

## 6. Period Logging

| Endpoint                  | Method | Purpose / Description        | Access Role         |
| ------------------------- | ------ | ---------------------------- | ------------------- |
| `/api/period-log`         | POST   | Log period entry             | Authenticated Users |
| `/api/period-log/:userId` | GET    | Fetch period logs for a user | Authenticated Users |

## 7. WhatsApp

| Endpoint                              | Method | Purpose / Description                   | Access Role         |
| ------------------------------------- | ------ | --------------------------------------- | ------------------- |
| `/api/whatsapp/send-whatsapp`         | POST   | Send WhatsApp message via bot           | Authenticated Users |
| `/api/whatsapp/send-whatsapp`         | POST   | Send WhatsApp message via bot           | Authenticated Users |
| `/api/whatsapp/inbound`               | POST   | Inbound WhatsApp webhook (Twilio → App) | Public              |
| `/api/whatsapp/test-weekly-checklist` | GET    | Trigger weekly checklist test           | Public              |

## 8. Abuse Reporting

| Endpoint                  | Method | Purpose / Description | Access Role         |
| ------------------------- | ------ | --------------------- | ------------------- |
| `/api/abuse/report-abuse` | POST   | Report abuse          | Authenticated Users |
| `/api/abuse/report-abuse` | GET    | Get abuse reports     | Admin               |

## 9. Forum

| Endpoint                           | Method | Purpose / Description    | Access Role         |
| ---------------------------------- | ------ | ------------------------ | ------------------- |
| `/api/forum/forum-post`            | POST   | Create forum post        | Authenticated Users |
| `/api/forum/forum-reply/:postId`   | POST   | Reply to forum post      | Authenticated Users |
| `/api/forum/forum-replies/:postId` | GET    | Fetch replies for a post | Authenticated Users |
| `/api/forum/report-post/:postId`   | POST   | Report a forum post      | Authenticated Users |
| `/api/forum/reports`               | GET    | View all forum reports   | Admin Only          |

## 10. Appointments

| Endpoint                | Method | Purpose / Description   | Access Role         |
| ----------------------- | ------ | ----------------------- | ------------------- |
| `/api/appointments`     | POST   | Book an appointment     | Authenticated Users |
| `/api/appointments`     | GET    | Get user's appointments | Authenticated Users |
| `/api/appointments/:id` | DELETE | Cancel an appointment   | Authenticated Users |

## 11. Checklist / Doctor

## 11. Checklist / Doctor

| Endpoint                | Method | Purpose / Description     | Access Role         |
| ----------------------- | ------ | ------------------------- | ------------------- |
| `/api/doctor-checklist` | GET    | Fetch doctor checklist    | Authenticated Users |
| `/api/checklist`        | POST   | Add new doctor/checklist  | Admin Only          |
| `/api/checklist/:id`    | PUT    | Update existing checklist | Admin Only          |
| `/api/checklist/:id`    | DELETE | Delete a checklist entry  | Admin Only          |

## 12. Leaderboard

| Endpoint           | Method | Purpose / Description            | Access Role         |
| ------------------ | ------ | -------------------------------- | ------------------- |
| `/api/leaderboard` | GET    | Fetch leaderboard (MaCoin/Posts) | Authenticated Users |
