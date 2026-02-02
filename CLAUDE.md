# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Czaplisko is a CMS for a Polish eco-guesthouse website. Two main components:

- **`/cms`** - Nuxt 4 full-stack app (admin panel + API)
- **`/template`** - Static HTML/Tailwind template (reference design)

## Development Commands

All commands run from `/cms` directory:

```bash
npm run dev              # Dev server on port 2137
npm run build            # Production build

# Database (Prisma 7 with Driver Adapters)
npm run db:push          # Push schema changes
npm run db:migrate       # Create migration
npm run db:seed          # Seed data
npm run db:studio        # Prisma Studio GUI
npm run db:reset         # Reset database
```

## Architecture

### Backend (Nitro/Nuxt)

```
cms/server/
├── api/
│   ├── admin/          # Protected endpoints (apartments, content, media, pricing, etc.)
│   ├── auth/           # Login/logout/me
│   └── public/         # Public read endpoints
├── middleware/auth.ts  # JWT verification
├── plugins/init-db.ts  # DB initialization
└── utils/
    ├── prisma.ts       # Prisma client with pg adapter
    ├── auth.ts         # JWT/bcrypt helpers
    ├── image.ts        # Sharp compression
    └── r2.ts           # Cloudflare R2 uploads
```

### Frontend (Vue 3)

```
cms/app/
├── components/
│   ├── admin/          # Admin panel components
│   ├── editable/       # Inline editing (EditableText, EditableImage, AdminToolbar)
│   └── public/         # Public website components
├── composables/
│   ├── useAuth.ts      # Authentication state
│   ├── useEditMode.ts  # Inline editing state
│   └── usePageContent.ts
├── layouts/
│   ├── admin.vue       # Admin panel layout
│   └── public.vue      # Public website layout
└── pages/
    ├── admin/          # Admin routes
    └── *.vue           # Public pages (Polish: apartamenty, cennik, galeria, kontakt, faq)
```

### Database Models (Prisma)

- `Apartment` - Guesthouse units (fixed at 2)
- `Pricing` - Per-apartment seasonal pricing (high/low season)
- `SeasonRange` - Date ranges for high season
- `Media` - Images with R2 URLs (urlOriginal, urlCompressed)
- `News` - Blog posts (draft/published)
- `PageContent` - Inline editable content (page/section/key structure)
- `NavigationItem` - Dynamic menu
- `GlobalSettings` - Site-wide config

## Key Patterns

### Prisma 7 Configuration

Uses Driver Adapters pattern. URL defined only in `prisma.config.ts`, NOT in schema.prisma:

```typescript
// prisma.config.ts - CLI config
datasource: { url: process.env.DATABASE_URL }

// server/utils/prisma.ts - Runtime with pg.Pool adapter
const pool = new pg.Pool({ connectionString, ssl: ... })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
```

### Inline Editing System

PageContent uses `page/section/key` structure:
- `home/hero/title` → Hero section title
- `contact/info/phone` → Contact phone number
- `footer/address/city` → Footer city

Components: `EditableText`, `EditableImage`, `EditableBackground`, `AdminToolbar`

### Authentication

- JWT tokens (7-day expiry) in httpOnly cookies
- Single admin user (credentials in env vars)
- Protected routes: `/admin/**`, `/api/admin/**`

## Environment Variables

Required in `.env`:
```
DATABASE_URL=postgresql://...
JWT_SECRET=<32+ chars>
ADMIN_EMAIL=...
ADMIN_PASSWORD_HASH=<bcrypt hash>
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_PUBLIC=czaplisko-assets
R2_PUBLIC_URL=https://...
```

## Deployment (Railway)

### Critical Safety Rules

1. **NEVER run `prisma db push` on container startup** - causes conflicts with concurrent deployments
2. **Always verify active service before deploy:**
   ```bash
   railway status  # Must show "Service: cms"
   ```
3. **Never link to Postgres service for deployment** - only for debugging, then immediately switch back

### Database Connection

- Internal Railway: `postgresql://...@postgres.railway.internal:5432/railway` (no SSL)
- External proxy: `postgresql://...@nozomi.proxy.rlwy.net:39249/railway?sslmode=require`

SSL config in prisma.ts:
```typescript
ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
```

### Start Script

`start.sh` only runs the Node server - no schema operations:
```bash
exec node .output/server/index.mjs
```

## Language

- UI/content is in Polish
- Code comments and technical docs in English
- Page routes use Polish names: `/apartamenty`, `/cennik`, `/galeria`, `/kontakt`, `/faq`
