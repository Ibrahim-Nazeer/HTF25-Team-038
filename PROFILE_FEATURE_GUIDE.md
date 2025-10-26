# Profile Feature - Setup & Migration Guide

## Overview
A comprehensive user profile system has been added to CodeSync Interview platform, allowing users to manage their personal and professional information.

## Features Added

### 1. **Profile Page** (`/profile`)
   - View and edit personal information
   - Manage professional details (organization, job role)
   - Add social links (LinkedIn, GitHub)
   - Display account information
   - Real-time validation and saving

### 2. **Database Schema Updates**
New fields added to the `User` model:
- `updatedAt` - Auto-updated timestamp
- `organization` - User's company/organization name
- `jobRole` - Current job title/role
- `phoneNumber` - Contact number
- `bio` - Personal bio (max 500 characters)
- `linkedinUrl` - LinkedIn profile URL
- `githubUrl` - GitHub profile URL
- `location` - Geographic location

### 3. **API Endpoints**
- `GET /api/auth/user/:id` - Fetch user profile (existing)
- `PATCH /api/auth/user/:id/profile` - Update user profile (new)

### 4. **UI Improvements**
- Profile icon button added to Dashboard header
- Easy navigation between Dashboard and Profile
- Edit mode with save/cancel functionality
- Visual indicators for required fields
- Character counter for bio field

## Database Migration

### Apply the migration:

```bash
cd server
npx prisma migrate dev --name add_user_profile_fields
```

Or use push (faster for development):
```bash
cd server
npx prisma db push
npx prisma generate
```

### Verify migration:
```bash
npx prisma studio
```
This opens Prisma Studio where you can view the updated User table schema.

## Testing the Feature

### 1. **Access Profile**
   - Log in to your account
   - Click the user icon (UserCircle) in the Dashboard header
   - You'll be redirected to `/profile`

### 2. **Edit Profile**
   - Click "Edit Profile" button
   - Fill in your details:
     - Name (required)
     - Organization
     - Job Role
     - Phone Number
     - Location
     - Bio (max 500 chars)
     - LinkedIn URL
     - GitHub URL
   - Click "Save" to persist changes
   - Or "Cancel" to discard changes

### 3. **View Mode**
   - After saving, profile switches to view-only mode
   - All fields are displayed but cannot be edited
   - Click "Edit Profile" again to make changes

## Profile Fields

| Field | Type | Required | Max Length | Notes |
|-------|------|----------|------------|-------|
| Name | Text | Yes | - | Display name |
| Email | Email | Yes (auto) | - | Cannot be changed |
| Organization | Text | No | - | Company name |
| Job Role | Text | No | - | Current position |
| Phone Number | Text | No | - | Contact number |
| Location | Text | No | - | City, Country |
| Bio | Text | No | 500 chars | About yourself |
| LinkedIn URL | URL | No | - | LinkedIn profile |
| GitHub URL | URL | No | - | GitHub profile |

## File Changes

### Frontend Files:
1. **Created**: `client/src/Pages/Profile.jsx` - Profile page component
2. **Modified**: `client/src/App.jsx` - Added `/profile` route
3. **Modified**: `client/src/Pages/Dashboard.jsx` - Added profile icon button

### Backend Files:
1. **Modified**: `server/routes/auth.js` - Added profile update endpoint
2. **Modified**: `server/prisma/schema.prisma` - Added profile fields to User model
3. **Created**: `server/prisma/migrations/20251026000001_add_user_profile_fields/migration.sql`

## Design Details

### Colors & Styling:
- Background: `bg-gray-900` (dark mode)
- Cards: `bg-gray-800` with `border-gray-700`
- Primary Action: Blue (`bg-blue-600`)
- Save Action: Green (`bg-green-600`)
- Text: White for titles, gray-400 for secondary

### Icons Used:
- User, Mail, Briefcase, Building2, Phone, MapPin, Github, Linkedin, ArrowLeft, Save, Edit, UserCircle

### Responsive Design:
- Mobile-first approach
- 2-column grid on medium+ screens
- Stack to single column on mobile
- Full-width on all screen sizes

## Security Considerations

1. **Email Protection**: Email field is read-only and cannot be changed from profile
2. **User ID Validation**: All updates require valid user ID
3. **Data Validation**: URLs and phone numbers validated on frontend
4. **Character Limits**: Bio limited to 500 characters
5. **SQL Injection Protection**: Using Prisma ORM with parameterized queries

## Future Enhancements

Potential additions:
- Profile picture upload
- Email verification for changes
- Password change functionality
- Two-factor authentication
- Activity history
- Privacy settings
- Profile visibility controls
- Export profile data (GDPR compliance)

## Troubleshooting

### Migration Issues:
```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Force push schema
npx prisma db push --force-reset
```

### Profile Not Loading:
1. Check if API endpoint is accessible: `GET /api/auth/user/:id`
2. Verify user is authenticated
3. Check browser console for errors
4. Ensure VITE_API_URL is set correctly

### Save Not Working:
1. Verify backend server is running
2. Check network tab for API request
3. Ensure user ID is valid
4. Check server logs for errors

## API Response Examples

### GET User Profile:
```json
{
  "id": "clxxx123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "INTERVIEWER",
  "organization": "Tech Corp",
  "jobRole": "Senior Developer",
  "phoneNumber": "+1234567890",
  "bio": "Passionate developer with 5 years experience",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "githubUrl": "https://github.com/johndoe",
  "location": "San Francisco, CA",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-15T12:00:00.000Z"
}
```

### PATCH Update Profile:
```json
{
  "name": "John Doe",
  "organization": "Tech Corp",
  "jobRole": "Senior Developer",
  "phoneNumber": "+1234567890",
  "bio": "Updated bio...",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "githubUrl": "https://github.com/johndoe",
  "location": "San Francisco, CA"
}
```

## Support

For issues or questions:
1. Check server logs: `npm run dev` output in server terminal
2. Check browser console for frontend errors
3. Verify database connection in `.env` file
4. Ensure all migrations are applied

---

**Created**: October 26, 2025  
**Version**: 1.0.0  
**Status**: Ready for Production
