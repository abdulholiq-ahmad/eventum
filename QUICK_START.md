# Quick Reference Guide - Eventum Backend

## 🔑 Essential Environment Variables
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/eventum?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=2q9ggUH/2+d3dFswMhhVG/PmJPChv0304RPswJExXkY=
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

## 🚀 Start Development
```bash
npm run dev
# Server runs on http://localhost:3000
```

## 📝 API Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Event (Requires Auth)
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Event",
    "startsAt": "2024-02-15T10:00:00Z",
    "endsAt": "2024-02-15T12:00:00Z",
    "timezone": "GMT+5",
    "visibility": "public",
    "location": {
      "name": "Tashkent City",
      "address": "123 Main St",
      "coords": "41.3115,69.2403",
      "type": "physical"
    }
  }'
```

### List Events
```bash
curl http://localhost:3000/api/events?visibility=public
```

### Attend Event
```bash
curl -X POST http://localhost:3000/api/events/[eventId]/attend
```

### Leave Event
```bash
curl -X POST http://localhost:3000/api/events/[eventId]/leave
```

## 🔐 Auth Flow in UI

1. **LoginModal Component**
   - Email/password registration & login
   - Google OAuth button
   - Form validation with client-side & server-side checks

2. **Session Management**
   - `useSession()` hook from next-auth/react
   - Auto-redirects to login if needed
   - Session available in all client components

3. **Protected API Routes**
   - Use `requireAuth()` in POST/PATCH/DELETE handlers
   - Returns 401 if not authenticated

## 📂 File Quick Links

| Purpose | File |
|---------|------|
| Add new model | `models/*.ts` |
| Add new validation | `schemas/*.ts` |
| Add new API route | `app/api/*/route.ts` |
| Add utility | `lib/*.ts` |
| Style component | `components/*.tsx` (Tailwind) |
| Environment vars | `.env.local` |

## 🧪 Testing Tips

1. **Test Auth**
   - Register in LoginModal
   - Check DB for new user (password hashed?)
   - Login with same credentials
   - Try Google OAuth

2. **Test Events**
   - Create event while logged in
   - Check DB: event should have host & attendees
   - Attend event as different user
   - Leave event

3. **Test API Directly**
   - Use curl or Postman
   - POST /api/register to create user
   - Login to get session
   - Use session to create events

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| 401 when creating event | Not authenticated - login first |
| 403 when updating event | Not the host - only host can edit |
| "User already exists" | Use different email or clear cookies |
| MongoDB connection error | Check MONGODB_URI in .env.local |
| Google login fails | Check CLIENT_ID/SECRET in console |

## 📊 Database Structure

**Collections:**
- `users` - User accounts
- `events` - Events with host & attendees

**Indexes:**
- `users.email` (unique)
- `events.host`
- `events.attendees`

## 🎯 Next Steps

1. ✅ Setup MongoDB & Google OAuth credentials
2. ✅ Run `npm run dev`
3. ✅ Test registration & login
4. ✅ Create test event
5. ✅ Attend event
6. ✅ Deploy to production

## 📚 Documentation

- Full guide: [SETUP.md](./SETUP.md)
- Implementation details: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- File structure: [FILE_STRUCTURE.md](./FILE_STRUCTURE.md)

---

**Questions?** Check the docs above or review the implementation files.
