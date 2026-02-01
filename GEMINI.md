# Czaplisko Siedlisko - Project Context

## Project Overview
**Czaplisko Siedlisko** is a web development project for an eco-guesthouse in Western Masuria, Poland.

The project currently consists of:
1.  **Static Prototype:** A complete, production-ready HTML/Tailwind CSS template located in the `template/` directory.
2.  **CMS Specification:** Detailed requirements and architectural plans to convert this static site into a dynamic CMS-driven application using Nuxt 3.

## 📂 Directory Structure

### `template/` (Static Prototype)
Contains the static HTML implementation of the website.
*   **Tech Stack:** HTML5, Tailwind CSS (via CDN), Vanilla JavaScript.
*   **Key Files:**
    *   `index.html`: Homepage.
    *   `apartments.html`, `price-list.html`, `gallery.html`, `contact.html`: Core pages.
    *   `css/styles.css`: Custom overrides.
    *   `js/main.js`: Interactivity (mobile menu, sliders, gallery lightbox).
*   **Usage:** Open `index.html` in a browser or serve with a simple HTTP server (e.g., `npx serve template/`).

### `docs/` (Requirements & Architecture)
Contains the blueprint for the future CMS implementation.
*   **`PRD.md` (Product Requirements):** Defines the scope (MVP), features (Admin Panel, Seasonal Pricing, News Module), and constraints.
*   **`FRS.md` (Functional Requirements):** Defines the technical architecture:
    *   **Framework:** Nuxt 3 (SSR).
    *   **Database:** PostgreSQL with Prisma 7.
    *   **Storage:** Cloudflare R2 (Assets & Backups).
    *   **Key Logic:** Seasonal pricing engine, server-side image optimization.

## 🚀 Development Roadmap
The primary goal is to migrate the `template/` into a full-stack Nuxt 3 application following the specs in `docs/`.

**Key Tasks (Inferred from Docs):**
1.  Initialize Nuxt 3 project.
2.  Port HTML templates to Vue components.
3.  Implement Prisma schema for Apartments, Pricing, and News.
4.  Build the Admin Dashboard for content management.
5.  Integrate Cloudflare R2 for media storage.

## 🛠 Conventions
*   **Styling:** Strict adherence to the existing Tailwind CSS design. No new CSS frameworks should be introduced.
*   **Icons:** FontAwesome.
*   **Typography:** Google Fonts (Montserrat).
*   **Images:** Currently using Unsplash placeholders; production will use R2-hosted assets.
