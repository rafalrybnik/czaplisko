# Document: Discovery & Intent - Guesthouse CMS Integration

## Document Purpose

This document defines the high-level vision, problem statement, and initial scope for integrating a custom CMS into a pre-existing HTML/Tailwind template for a guesthouse ("Czaplisko"). It serves as the foundation for the Product Requirements Document (PRD).

## Project Overview

- **Product Name:** Czaplisko Guesthouse CMS
- **Guesthouse Profile:** Eco-friendly & dog-friendly guesthouse with 2 distinct apartments (Czapla Polna, Czapla Wodna).
- **Goal:** Transform a static HTML/Tailwind CSS template into a dynamic, manageable website where the owner can update pricing, news, and galleries without technical knowledge or using bloated systems like WordPress.

## Problem Statement

The client has a high-quality static design but cannot update it. Existing CMS solutions (like WordPress) are too heavy and often break the clean architecture of a custom Tailwind-based template. There is a need for a lightweight, "logical" CMS that maps directly to the guesthouse's business model (2 apartments, 2 seasons).

## Target Audience

- **Primary User:** Guesthouse Owner (Admin). Single user role, non-technical background.
- **End Users:** Potential guests browsing the site for availability, pricing, and news.

## Business Rules & Context

1. **Apartment Units:** Two specific units: "Czapla Polna" and "Czapla Wodna".
2. **Pricing Logic:** - Two main seasons: High Season (Wysoki Sezon) and Low Season (Niski Sezon).
   - High Season is defined by specific date ranges (e.g., New Year's, May holiday, Summer, Christmas).
   - Minimum stay requirements vary by season (e.g., 4 nights in High, 3 in Low).
   - Extra bed (dostawka) costs are fixed per person.
3. **Content Structure:** - Static global elements: Navbar, Header, Footer.
   - Dynamic pages: Home, Apartment 1, Apartment 2, News (Blog), Gallery, Contact.
4. **Media:** - General guesthouse gallery.
   - Dedicated galleries for each apartment.

## Technical Constraints (Stack)

- **Framework:** Nuxt 3 (SSR-first)
- **Database:** PostgreSQL with Prisma 7 ORM
- **Styling:** Tailwind CSS (reusing existing static classes)
- **Validation:** Zod
- **Architecture:** Modular composables, SSR for SEO optimization.

## Dependencies

- Existing HTML/Tailwind/JS assets from the freelancer.
- Hosting environment (e.g., Railway/Docker as per provided architecture).

## Completeness Status: STABLE