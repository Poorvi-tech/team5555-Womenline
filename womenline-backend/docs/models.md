Models Documentation

User
Description: Stores user account info, roles, green credits, and redemption history.
Fields:
username (String, required)
email (String, required, unique)
password (String, required)
phone (String, required)
role (String, enum: ["admin", "user", "mother", "caregiver"], default: "user")
greenCredits (Number, default: 0)
isAdmin (Boolean, default: false)
redemptionHistory (Array of Objects)
rewardId (ObjectId, ref: Reward)
redeemedAt (Date, default: now)
createdAt, updatedAt (Date, auto)
 isVerified (Boolean, default: false)
Relationships: redemptionHistory.rewardId → Reward
Example Entry:
{
"username": "alice123",
"email": "alice@example.com",
"phone": "+911234567890",
"role": "user",
"greenCredits": 100,
"isAdmin": false,
"redemptionHistory": [
{ "rewardId": "64da12345abcde6789f01234", "redeemedAt": "2025-08-21T03:00:00Z" }
]
}

Reward
Description: Stores rewards that users can redeem using green credits.
Fields:
title (String, required)
description (String, optional)
cost (Number, required)
imageURL (String, optional)
userId (ObjectId, ref: User, optional)
category (String, enum: ["Health", "Mental", "Supplements"], optional)
points (Number, optional)
redemptionHistory (Array)
userId (ObjectId, ref: User)
redeemedAt (Date, default: now)
createdAt, updatedAt (Date, auto)
Relationships: userId → User, redemptionHistory.userId → User
Example Entry:
{
"title": "Yoga Mat",
"description": "Eco-friendly yoga mat",
"cost": 50,
"category": "Health",
"redemptionHistory": [
{ "userId": "64da12345abcde6789f01234", "redeemedAt": "2025-08-21T03:00:00Z" }
]
}

Journal
Description: User journal entries for mood, notes, and period tracking.
Fields:
userId (ObjectId, ref: User, required)
mood (String, required)
note (String, required)
date (Date, required)
periodDay (String, optional)
voiceNote (String, optional, default "")
createdAt, updatedAt (Date, auto)
Relationships: userId → User
Example Entry:
{
"userId": "64da12345abcde6789f01234",
"mood": "Happy",
"note": "Feeling energetic today",
"date": "2025-08-21",
"periodDay": "Day 3",
"voiceNote": "uploads/voice/entry1.mp3"
}

PeriodLog
Description: Logs menstrual cycles, symptoms, moods, and notes.
Fields:
userId (ObjectId, ref: User, required)
startDate, endDate (Date, required)
symptoms (Array of Strings, default [])
mood (String, enum: ["Happy", "Sad", "Anxious", "Angry", "Neutral"], required)
notes (String, optional)
cycleLength (Number, required)
createdAt, updatedAt (Date, auto)
Relationships: userId → User
Example Entry:
{
"userId": "64da12345abcde6789f01234",
"startDate": "2025-08-01",
"endDate": "2025-08-05",
"symptoms": ["Cramps", "Headache"],
"mood": "Anxious",
"notes": "Felt tired",
"cycleLength": 28
}

Appointment
Description: Stores user appointments with doctors.
Fields:
userId (ObjectId, ref: User, required)
doctorName (String, required)
date (Date, required)
timeSlot (String, required)
status (String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending')
createdAt (Date, default: now)
Relationships: userId → User
Example Entry:
{
"userId": "64da12345abcde6789f01234",
"doctorName": "Dr. Mehta",
"date": "2025-08-25",
"timeSlot": "10:00 AM - 11:00 AM",
"status": "pending"
}

AbuseReport
Description: Tracks abuse reports by users (anonymous optional).
Fields:
userId (ObjectId, ref: User, optional)
type (String, required)
description (String, required)
location (String, optional)
timestamp (Date, default: now)
Example Entry:
{
"userId": null,
"type": "Harassment",
"description": "User sent inappropriate messages",
"location": "Forum Post",
"timestamp": "2025-08-21T03:00:00Z"
}

ForumPost
Description: User forum posts, optional anonymous, with replies & reports.
Fields:
userId (ObjectId, ref: User, optional)
content (String, required)
tags (Array of Strings, optional)
createdAt (Date, default: now)
reports (Array)
userId (ObjectId, ref: User)
reason (String, required)
reportedAt (Date, default: now)
replies (Array)
userId (ObjectId, ref: User, optional)
content (String, required)
createdAt (Date, default: now)
Relationships: userId → User, reports.userId → User, replies.userId → User
Example Entry:
{
"userId": "64da12345abcde6789f01234",
"content": "What are natural remedies for cramps?",
"tags": ["health", "period"],
"reports": [],
"replies": []
}

Reply
Description: Replies to forum posts.
Fields:
forumId (ObjectId, ref: Forum, required)
userId (ObjectId, ref: User, required)
content (String, required)
createdAt (Date, default: now)
Relationships: forumId → ForumPost, userId → User
Example Entry:
{
"forumId": "64da22345abcde6789f04567",
"userId": "64da12345abcde6789f01234",
"content": "Try using a heating pad for cramps.",
"createdAt": "2025-08-21T03:05:00Z"
}

VoiceEntry
Description: Stores user audio logs with mood tags and duration.
Fields:
userId (ObjectId, ref: User, required)
audioURL (String, required)
moodTag (String, enum: ['happy','sad','neutral','angry','anxious'], required)
timestamp (Date, default: now)
duration (Number, required, max 120 seconds)
transcription (String, optional)
tags (String, required)
audiotype (String, required)
Relationships: userId → User
Example Entry:
{
"userId": "64da12345abcde6789f01234",
"audioURL": "uploads/voice/entry1.mp3",
"moodTag": "happy",
"timestamp": "2025-08-21T03:10:00Z",
"duration": 60,
"tags": "reflection",
"audiotype": "voice-note"
}

MaCoin
Description: Logs user green credits earned through activities.
Fields:
userId (ObjectId, ref: User, required)
activityLog (Object)
type (String, required)
source (String, required)
coins (Number, required)
date (Date, default: now)
amount (Number, required)
createdAt, updatedAt (Date, auto)
Relationships: userId → User
Example Entry:
{
"userId": "64da12345abcde6789f01234",
"activityLog": {
"type": "eco-action",
"source": "journal",
"coins": 10,
"date": "2025-08-21T03:00:00Z"
},
"amount": 10
}

PdfExport
Description: Logs PDF exports by users.
Fields:
userId (ObjectId, ref: User, required)
exportType (String, required)
exportedAt (Date, default: now)
Relationships: userId → User
Example Entry:
{
"userId": "64da12345abcde6789f01234",
"exportType": "summary-report",
"exportedAt": "2025-08-21T03:15:00Z"
}

WhatsAppLog
Description: Tracks WhatsApp messages sent to users.
Fields:
userId (ObjectId, ref: User, required)
phone (String, required)
messageType (String, enum: ['OTP','Reminder','Notification','text'], required)
status (String, enum: ['sent','failed'], default: 'sent')
sentAt (Date, default: now)
Relationships: userId → User
Example Entry:
{
"userId": "64da12345abcde6789f01234",
"phone": "+911234567890",
"messageType": "Reminder",
"status": "sent",
"sentAt": "2025-08-21T03:20:00Z"
}

AuditLog
Description: Stores immutable logs of actions with hash verification.
Fields:
action (String, required)
details (Mixed, optional)
userId (ObjectId, ref: User, optional)
timestamp (Date, default: now)
hash (String, required)
prevHash (String, optional)
Relationships: userId → User
Example Entry:
{
"action": "BOOK_APPOINTMENT",
"details": {"doctorName":"Dr. Mehta"},
"userId": "64da12345abcde6789f01234",
"timestamp": "2025-08-21T03:25:00Z",
"hash": "abcd1234ef5678...",
"prevHash": "1234abcd5678..."
}

DoctorChecklist
Description: Stores doctor info for checklists.
Fields:
doctorName (String, required)
specialization (String, required)
availability (String, required)
contact (String, required)
createdBy (ObjectId, ref: User, optional)
createdAt, updatedAt (Date, auto)
Relationships: createdBy → User
Example Entry:
{
"doctorName": "Dr. Mehta",
"specialization": "Gynecologist",
"availability": "Mon-Fri 10AM-4PM",
"contact": "+911234567890",
"createdBy": "64da12345abcde6789f01234"
}

RedemptionLog
Description: Tracks rewards redeemed by users.
Fields:
userId (ObjectId, ref: User, required)
rewardId (ObjectId, ref: Reward, required)
redeemedAt (Date, required)
status (Boolean, default false, required)
creditsUsed (Number, required)
createdAt, updatedAt (Date, auto)
Relationships: userId → User, rewardId → Reward
Example Entry:
{
"userId": "64da12345abcde6789f01234",
"rewardId": "64da56789abcde6789f09876",
"redeemedAt": "2025-08-21T03:30:00Z",
"status": true,
"creditsUsed": 50
}

Reports
Description: Reports against forum posts.
Fields:
reportedBy (String, required)
postId (ObjectId, ref: ForumPost, required)
reason (String, required)
createdAt, updatedAt (Date, auto)
Relationships: postId → ForumPost
Example Entry:
{
"reportedBy": "alice123",
"postId": "64da22345abcde6789f04567",
"reason": "Inappropriate content"
}
