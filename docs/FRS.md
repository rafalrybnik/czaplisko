# Document: Functional & System Requirements (FRS/SRS) - Czaplisko CMS

## Document Purpose

This document provides explicit technical and functional requirements for developers with a primary focus on **SSR (Server-Side Rendering)** and **Data Integrity**. It defines data structures, server-side logic, and storage strategies.

## 1. System Architecture (SSR-First)

- **Framework:** Nuxt 3 (Vue 3) with Nitro Engine.
- **Data Fetching:** Must use `useAsyncData` or `useFetch`.
- **Storage Strategy:** - **Assets:** Cloudflare R2 (S3-compatible object storage).
  - **Backups:** Cloudflare R2 (Private bucket).
- **Database:** PostgreSQL via Prisma 7.

## 2. Data Models (Prisma Schema Logic)

- **GlobalSettings:** Key-value pairs for footer/header.
- **Apartment:** `id`, `name`, `slug`, `description`, `amenities` (JSON/Array).
- **SeasonRange:** `id`, `startDate`, `endDate`, `label`.
- **Pricing:** `id`, `apartmentId`, `seasonType`, `pricePerNight`, `extraBedPrice`, `minStayNights`.
- **News:** `id`, `title`, `slug`, `content`, `publishedAt`, `status`.
- **Page:** `id`, `title`, `slug`, `content`, `status`, `showInFooter`.
- **Media:** `id`, `url_original`, `url_compressed`, `alt`, `order`, `category`.

## 3. Functional Requirements

### 3.1 Seasonal Pricing Engine

- Logic executed on the server to determine rates based on `SeasonRange`.

### 3.2 Media Processing & Storage (Cloudflare R2)

The system must handle two versions of every uploaded image:

1. **Original Version:** Stored in R2 as the master copy.
2. **Compressed Version:** Processed on the server (using Sharp or Nuxt Image) to WebP/AVIF format with optimized dimensions for frontend display.
3. **Logic:** On upload, the server-side API must trigger processing, upload both versions to R2, and save both URLs in the `Media` table.

### 3.3 Database Backups

- **Frequency:** Automated daily backups of the PostgreSQL database.
- **Storage:** Exported `.sql` or `.dump` files must be uploaded to a **private** (non-public) bucket on Cloudflare R2.
- **Security:** Access to the backup bucket must be restricted to the server's service account (R2 API Keys).

### 3.4 Dynamic Custom Pages Routing

- Catch-all route `[...slug].vue` to render dynamic pages from the database.

## 4. Acceptance Criteria

### 4.1 Feature: Image Optimization

**Scenario: Uploading a high-resolution photo**

- **Given** I am in the Admin Panel uploading a 5MB JPG.
- **When** the upload finishes.
- **Then** Two files must exist in Cloudflare R2: the original JPG and a compressed WebP/AVIF.
- **And** The frontend must serve the compressed version by default.

### 4.2 Feature: Backup Verification

**Scenario: Validating backup security**

- **Given** a backup file exists in the R2 backup bucket.
- **When** trying to access the backup URL without an API key.
- **Then** The server must return a `403 Forbidden` error (Public access disabled).

## 5. Non-Functional Requirements

- **Performance:** Images served via Cloudflare's CDN for low latency.
- **Reliability:** 99.9% availability of assets via R2.

## Completeness Status: STABLE