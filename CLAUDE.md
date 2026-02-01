# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Czaplisko Siedlisko is a website for an eco-friendly, dog-friendly guesthouse in Western Masuria, Poland. The project has two phases:

1. **Current Phase**: Static HTML template (production-ready, no build process)
2. **Planned Phase**: Full CMS using Nuxt 3 + PostgreSQL + Prisma 7 + Cloudflare R2

## Development Commands

### Local Testing (Static Template)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

### Production Optimization (Optional)
```bash
# Generate minified Tailwind CSS
npx tailwindcss -o css/tailwind.min.css --minify
```

## Architecture

### Static Template Structure
```
template/
├── index.html          # Homepage with hero slider
├── apartments.html     # Apartment showcase
├── price-list.html     # Seasonal pricing
├── gallery.html        # Lightbox gallery with animated counters
├── faq.html            # Accordion Q&A
├── contact.html        # Form + Google Maps
├── room-details.html   # Individual room details
├── css/styles.css      # Custom styles (Tailwind via CDN)
└── js/main.js          # All interactive features
```

### JavaScript Modules (main.js)
Seven independently-initialized features, each wrapped in DOMContentLoaded:
- Mobile menu toggle (`#mobile-menu-toggle`, `#mobile-menu`)
- Hero slider (auto-play 5s, `.hero-slide`, `.slide-indicator`)
- Gallery lightbox (keyboard nav: Arrow keys, Escape)
- FAQ accordion (`.faq-item`, `.faq-question`, `.faq-answer`)
- Contact form validation (`#contact-form`)
- Smooth scrolling for anchor links
- Animated counters with IntersectionObserver (`.animated-counter`)

### Reusable Sections
Header and footer are marked with comments for copy-paste across pages:
```html
<!-- ========== HEADER SECTION - START ========== -->
<!-- ========== HEADER SECTION - END ========== -->
```

### Color Palette
- Primary Blue: `#78b3ce`
- Dark Blue: `#4a6b8a`
- Charcoal: `#1a2b3c`

### External Dependencies (via CDN)
- Tailwind CSS
- FontAwesome 6.4.0
- Google Fonts (Montserrat: 300-700)

## Planned CMS Architecture (Phase 2)

### Tech Stack
- **Framework**: Nuxt 3 (Vue 3) with Nitro Engine
- **Database**: PostgreSQL via Prisma 7
- **Validation**: Zod
- **Assets**: Cloudflare R2 (public bucket for images, private for backups)
- **Data Fetching**: `useAsyncData` or `useFetch`

### Prisma Models
- `GlobalSettings` - Key-value pairs for footer/header
- `Apartment` - id, name, slug, description, amenities (JSON)
- `SeasonRange` - id, startDate, endDate, label
- `Pricing` - apartmentId, seasonType, pricePerNight, extraBedPrice, minStayNights
- `News` - title, slug, content, publishedAt, status
- `Page` - title, slug, content, status, showInFooter
- `Media` - url_original, url_compressed, alt, order, category

### Business Rules
- Fixed 2 apartments: "Czapla Polna" and "Czapla Wodna"
- Seasonal pricing: High Season (defined date ranges) vs Low Season (default)
- Extra bed pricing (dostawka) per apartment per season
- Minimum stay requirements per season
- Single admin user (no multi-user roles)

### Image Processing Pipeline
On upload: original stored in R2, compressed WebP/AVIF generated via Sharp, both URLs saved in Media table.

## Documentation

- `docs/PRD.md` - Product scope and MVP definition
- `docs/FRS.md` - Technical requirements and acceptance criteria
- `docs/BACKLOG.md` - 4-phase development roadmap
