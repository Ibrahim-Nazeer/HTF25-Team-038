# Database Migration Instructions

## To apply the new session status changes, run the following commands:

### Option 1: Apply migration manually
```bash
cd server
npx prisma migrate deploy
```

### Option 2: Create and apply migration with Prisma
```bash
cd server
npx prisma migrate dev --name add_session_status
```

### Option 3: If you encounter issues, reset and regenerate
```bash
cd server
npx prisma generate
npx prisma db push
```

## What Changed:
- Added `SessionStatus` enum with values: ACTIVE, COMPLETED, CANCELLED
- Added `status` field to InterviewSession (defaults to ACTIVE)
- Added `endedAt` timestamp field to track when sessions end
- Added API endpoint: `POST /api/sessions/:id/end` to end sessions
- Only interviewers can end sessions
- Ended sessions cannot be rejoined
- Sessions are marked as COMPLETED and added to history

## Testing:
1. Start a session as an interviewer
2. Click the "End Session" button in the header
3. Confirm the action
4. All participants will be notified and redirected
5. The session will appear in history but cannot be accessed again
