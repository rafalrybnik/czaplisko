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

### Deployment Methods

**Primary: GitHub Integration (recommended)**
- Railway auto-deploys on every push to `main` branch
- No manual intervention needed
- Configured in Railway dashboard: Settings → Source → Connect GitHub

**Manual: Safe Deploy Script**
```bash
cd cms
./deploy.sh  # Verifies service before deploying
```

The script:
1. Checks Railway CLI is installed and logged in
2. Verifies linked service is `cms` (not Postgres!)
3. Auto-switches if wrong service detected
4. Warns about uncommitted changes
5. Deploys with `railway up --detach`

### Critical Safety Rules

1. **NEVER run `prisma db push` on container startup** - causes conflicts with concurrent deployments
2. **NEVER deploy manually without `./deploy.sh`** - prevents deploying to wrong service
3. **NEVER link to Postgres service** - only for debugging variables, then immediately switch back
4. **ALWAYS use Prisma CLI for migrations** - never raw SQL

### Database Migrations

**Development workflow:**
```bash
# 1. Modify prisma/schema.prisma
# 2. Create migration (generates SQL + applies to dev DB)
npm run db:migrate

# 3. Push changes to GitHub → Railway auto-deploys
git add prisma/
git commit -m "Add XYZ field to Model"
git push
```

**Production migration:**
- Migrations are applied automatically during build via `prisma generate`
- Schema changes via `prisma migrate deploy` (NOT `db push`)
- For breaking changes: deploy migration first, then code that uses it

**Emergency schema sync (use sparingly):**
```bash
# Only when dev DB is out of sync, NEVER on production
npm run db:push
```

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

### Railway Project Structure

```
Railway Project: czaplisko
├── cms (Node.js service)     ← Deploy target
│   └── GitHub: main branch
└── Postgres (database)       ← NEVER deploy here
```

## Language

- UI/content is in Polish
- Code comments and technical docs in English
- Page routes use Polish names: `/apartamenty`, `/cennik`, `/galeria`, `/kontakt`, `/faq`
