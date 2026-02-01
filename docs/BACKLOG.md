# Document: Backlog & Roadmap - Czaplisko CMS

## Document Purpose

This document provides a prioritized list of tasks (Product Backlog) required to implement the Czaplisko CMS. It is organized into development phases to ensure a logical workflow from foundation to launch, specifically incorporating Cloudflare R2 for asset storage and database backups.

## 1. Phase 1: Foundation & Cloud Infrastructure (MVP)

*Focus: Setting up the environment, security, and storage buckets.*

- **[B-1.1] Database Schema Implementation:** Create Prisma models for `Apartment`, `SeasonRange`, `Pricing`, `News`, `Page`, and `Media`.
- **[B-1.2] Cloudflare R2 Setup:** - Configure public bucket for assets (images).
  - Configure private bucket for database backups.
  - Set up API Access Keys and environment variables.
- **[B-1.3] Authentication System:** Implement JWT-based login for the admin account.
- **[B-1.4] Server Middleware:** Create Nuxt server middleware to protect `/api/admin/*` routes.
- **[B-1.5] Backup Script:** Implement a daily cron job/script to export PostgreSQL dump and upload it to the private R2 bucket.

## 2. Phase 2: Core Guesthouse Logic (MVP)

*Focus: Managing critical business data and SSR rendering.*

- **[B-2.1] Seasonal Pricing Engine:** Implement server-side logic to determine "High" vs "Low" season.
- **[B-2.2] Apartment Management Module:** Create Admin UI to edit apartment details and amenities.
- **[B-2.3] Pricing Management UI:** Dashboard to define High Season date ranges (with overlap validation).
- **[B-2.4] SSR Pricing Page:** Hydrate the static "Cennik" template with real data from the database.

## 3. Phase 3: Content & Media with R2 Integration (MVP)

*Focus: Populating the site and handling optimized media.*

- **[B-3.1] Image Processing Pipeline:**
  - Implement server-side resizing/compression (e.g., using Sharp).
  - Logic to upload both original and compressed versions to R2.
  - Store dual URLs in the `Media` database table.
- **[B-3.2] News/Blog Module:** Build CRUD for news with Rich Text editor and R2 image integration.
- **[B-3.3] Custom Pages Module:** Implement catch-all route `[...slug].vue` for dynamic subpages.
- **[B-3.4] Gallery Management:** Drag-and-drop reordering for R2-hosted images.

## 4. Phase 4: Final Integration & SEO

*Focus: Polish and visibility.*

- **[B-4.1] Template Migration:** Final transition of static sections into dynamic Nuxt components.
- **[B-4.2] SEO & Meta-Tag Hydration:** Implement `useServerSeoMeta` for all dynamic routes.
- **[B-4.3] Performance Audit:** Ensure images are served correctly from R2 via CDN and SSR is fully optimized.

## 5. Roadmap Summary

1. **Sprint 1:** Foundation, Security, Cloudflare R2 Buckets, and Backups.
2. **Sprint 2:** Pricing Engine, Apartment Logic, and SSR Pricing Table.
3. **Sprint 3:** Media Pipeline (Original/Compressed), News, and Custom Pages.
4. **Sprint 4:** Final UI Integration, SEO Audit, and Go-Live.

## Completeness Status: STABLE

