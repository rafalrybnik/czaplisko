# Document: Product Requirements Document (PRD) - Czaplisko CMS

## Document Purpose

This document outlines the functional scope, product features, and MVP definition for the Czaplisko Guesthouse CMS. It translates business needs into high-level technical requirements.

## 1. Product Scope

The system is a lightweight "In-Place" or "Headless-adjacent" CMS designed to manage the content of a pre-existing HTML/Tailwind CSS website for a small guesthouse.

### In-Scope:

- Editing global content (contact info, social links, logo).
- Managing two specific apartments (descriptions, features, pricing).
- Seasonal pricing management (dates and rates).
- News/Blog module for updates.
- Media management (Galleries).
- Login for the owner (Admin Panel).

### Out-of-Scope:

- Real-time booking engine with payments (Phase 2+).
- Advanced SEO tools (meta tags will be managed via simple fields).
- Multi-user roles/permissions (single admin only).
- Visual "drag and drop" layout builder (the layout is fixed by the template).

## 2. Functional Overview

### 2.1 Content Management System (CMS)

The admin must be able to edit text and images without touching the HTML/CSS code.

- **Global Elements:** Footer (address, phone, email), Header (hero images, slogans).
- **Rich Text Editor:** Basic formatting (Bold, Italic, Lists, H1-H3) for news and descriptions. No advanced layout formatting to prevent breaking the Tailwind design.

### 2.2 Apartment Management

Specific module for the two apartments:

- **Details:** Title, Description, Amenities list (e.g., "Dog friendly", "WiFi").
- **Pricing Integration:** Link to the seasonal pricing table.
- **Dedicated Gallery:** Upload/reorder images for each apartment.

### 2.3 Seasonal Pricing Engine

A structured data management system based on the provided "Cennik 2025":

- **Season Definition:** Admin can set "High Season" date ranges (e.g., Jan 1-7, May 1-4). Everything else defaults to "Low Season".
- **Rate Management:** Set "Price per night" and "Extra bed (dostawka) price" for each apartment per season.
- **Minimum Stay:** Set minimum number of nights per season.

### 2.4 Gallery & Media

- **General Gallery:** Global images of the guesthouse and surrounding nature.
- **Organization:** Ability to upload multiple images, add alt text (SEO), and reorder via drag-and-drop.

### 2.5 News Module

- **Post Structure:** Title, Date, Feature Image, Content (Rich Text).
- **Status:** Draft/Published toggle.

## 3. MVP Definition (Minimum Viable Product)

The following features are mandatory for the first release:

1. **Admin Authentication:** Secure login for one user.
2. **Apartment Content Editing:** Name, description, and specific gallery.
3. **Pricing Table:** Simple table management that updates the pricing page.
4. **News Module:** Ability to add/edit/delete news.
5. **Image Uploads:** Basic image hosting and serving.

## 4. Constraints & Assumptions

- **Assumption:** The number of apartments is fixed at 2. The CMS logic will reflect this to simplify the UI.
- **Constraint:** Styling is strictly tied to the existing Tailwind CSS template. The CMS should provide content, not change the grid system.
- **Assumption:** The owner uses a desktop or tablet to manage the site (Mobile admin view is "Should-have", not "Must-have").

## 5. Dependencies

- **DISCOVERY_AND_INTENT.md**: Business context foundation.
- **Prisma Schema**: Must reflect the Apartment/Season/News relationship.

## Completeness Status: STABLE