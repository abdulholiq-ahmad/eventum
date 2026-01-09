# Eventum - Backend Setup Complete ✅

## What Was Built

### 1. **Database Models**
- `models/User.ts` - Mongoose User schema (name, email, password, image)
- `models/Event.ts` - Mongoose Event schema (full event lifecycle with host, attendees, location, capacity)
- `models/index.ts` - Barrel export for clean imports

### 2. **Authentication**
- `lib/auth.ts` - NextAuth configuration with:
  - Google OAuth provider
  - Credentials provider (email/password)
  - JWT session strategy
  - Automatic user creation on Google signin
- `app/api/auth/[...nextauth]/route.ts` - NextAuth route handler
- `schemas/auth.schema.ts` - Zod validation for register/login

### 3. **API Routes**
- `app/api/register/route.ts` - User registration with bcrypt hashing
- `app/api/events/route.ts` - List public events & create new event (auth required)
- `app/api/events/[id]/route.ts` - Get/update/delete event (host only)
- `app/api/events/[id]/attend/route.ts` - Join event
- `app/api/events/[id]/leave/route.ts` - Leave event

### 4. **Utilities**
- `lib/mongodb.ts` - MongoDB connection singleton with hot-reload caching
- `lib/auth-guard.ts` - `requireAuth()` middleware for protecting routes
- `lib/api-response.ts` - Standardized response helpers (ok, badRequest, unauthorized, etc.)
- `schemas/event.schema.ts` - Zod validation for event CRUD

### 5. **Frontend Integration**
- `app/providers.tsx` - SessionProvider wrapper for Next-Auth
- `app/layout.tsx` - Updated to wrap app with Providers
- `components/LoginModal.tsx` - Integrated with NextAuth (signIn/signOut, register/login)
- `components/CreateEvent.tsx` - Integrated with event creation API

## Setup Instructions

### 1. **MongoDB Atlas**
```
1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user with password
4. Whitelist IP: 0.0.0.0/0 (development only)
5. Copy connection string and replace MONGODB_URI in .env.local
   Format: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eventum?retryWrites=true&w=majority
```

### 2. **Google OAuth**
```
1. Go to https://console.cloud.google.com
2. Create new OAuth 2.0 Client ID (Web application)
3. Add redirect URI: http://localhost:3000/api/auth/callback/google
4. Copy Client ID and Secret to .env.local:
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
```

### 3. **Environment Variables**
Update `.env.local` with:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eventum?retryWrites=true&w=majority
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 4. **Start Development Server**
```bash
npm run dev
```

## Quick API Reference

### Register User
```
POST /api/register
{ "name": "John", "email": "john@example.com", "password": "password123" }
```

### Create Event (Auth Required)
```
POST /api/events
{
  "title": "My Event",
  "startsAt": "2024-01-20T10:00:00Z",
  "endsAt": "2024-01-20T12:00:00Z",
  "timezone": "GMT+5",
  "visibility": "public",
  "location": { "name": "Tashkent", "address": "...", "coords": "..." }
}
```

### List Events
```
GET /api/events?visibility=public
```

### Attend Event
```
POST /api/events/{eventId}/attend
```

### Leave Event
```
POST /api/events/{eventId}/leave
```

## Testing Checklist

- [ ] Start server: `npm run dev`
- [ ] Register new user via LoginModal
- [ ] Login with credentials
- [ ] Login with Google OAuth
- [ ] Create new event via CreateEvent component
- [ ] View event in list
- [ ] Attend/leave event
- [ ] Update event (as host)
- [ ] Delete event (as host)

## Notes

- All API endpoints return standardized JSON: `{ success: boolean, data/error }`
- Authentication is required for event create/update/delete/attend/leave
- Only event host can update/delete
- Capacity limits are enforced on attend
- MongoDB connection uses global caching for hot-reload optimization
- NextAuth uses JWT strategy (stateless, no sessions table)
