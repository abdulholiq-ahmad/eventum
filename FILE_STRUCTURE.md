project/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts          ← NextAuth handlers
│   │   ├── events/
│   │   │   ├── route.ts              ← GET (list) & POST (create)
│   │   │   └── [id]/
│   │   │       ├── route.ts          ← GET/PATCH/DELETE
│   │   │       ├── attend/
│   │   │       │   └── route.ts      ← POST join event
│   │   │       └── leave/
│   │   │           └── route.ts      ← POST leave event
│   │   └── register/
│   │       └── route.ts              ← POST user registration
│   ├── globals.css
│   ├── layout.tsx                    ← Updated with Providers
│   ├── page.tsx
│   └── providers.tsx                 ← SessionProvider wrapper
├── components/
│   ├── CreateEvent.tsx               ← Updated with API integration
│   ├── LoginModal.tsx                ← Updated with NextAuth
│   └── ... (other existing components)
├── lib/
│   ├── mongodb.ts                    ← Connection singleton
│   ├── auth.ts                       ← NextAuth config
│   ├── auth-guard.ts                 ← requireAuth() middleware
│   └── api-response.ts               ← Response helpers
├── models/
│   ├── User.ts                       ← User schema
│   ├── Event.ts                      ← Event schema
│   └── index.ts                      ← Barrel exports
├── schemas/
│   ├── auth.schema.ts                ← Zod validation for auth
│   └── event.schema.ts               ← Zod validation for events
├── .env.local                        ← Environment variables (update needed)
├── package.json
├── tsconfig.json
└── SETUP.md                          ← Setup instructions
