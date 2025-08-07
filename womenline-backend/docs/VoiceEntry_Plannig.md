# Voice Entry API Planning Notes

## API Route

`POST /api/voice-entry`

## Purpose

Allows users to upload a voice entry (audio note) along with an optional text transcript.

## Request Headers

- Authorization: Bearer <JWT Token>
- Content-Type: multipart/form-data

## Request Body

| Field          | Type     | Required | Description                    |
| -------------- | -------- | -------- | ------------------------------ |
| voiceFile      | File     | Yes      | Audio file (.mp3, .wav)        |
| textTranscript | String   | No       | Optional text version of voice |
| userId         | ObjectId | Yes      | MongoDB User ID                |

## Middleware

- JWT Authentication (protect middleware)
- File Upload Handling (Multer)

## Response Example

### Success (201)

```json
{
  "success": true,
  "data": {
    "voiceEntryId": "64e90e7d2c9abc1234567890"
  }
}
```
