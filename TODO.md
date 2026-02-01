# TODO.md - Plan Implementacji Czaplisko CMS

## Podsumowanie Projektu

Transformacja statycznego szablonu HTML/Tailwind w dynamiczny CMS oparty o Nuxt 3 + PostgreSQL + Prisma 7 + Cloudflare R2.

**MVP Features:**
1. Autentykacja admina (JWT)
2. Edycja apartamentów (nazwa, opis, galeria)
3. Zarządzanie cennikiem sezonowym
4. Moduł aktualności (CRUD)
5. Upload i hosting obrazów (R2)

---

## Faza 0: Inicjalizacja Projektu ✅ DONE

### 0.1 Utworzenie projektu Nuxt 3
- [x] `npx nuxi@latest init czaplisko-cms`
- [x] Konfiguracja `nuxt.config.ts` (SSR enabled, Tailwind, runtime config)
- [x] Instalacja zależności:
  ```
  @nuxtjs/tailwindcss
  @prisma/client prisma
  zod
  jsonwebtoken bcryptjs
  @aws-sdk/client-s3 (dla R2)
  sharp (image processing)
  ```

### 0.2 Struktura katalogów
```
czaplisko-cms/
├── prisma/
│   └── schema.prisma
├── server/
│   ├── api/
│   │   ├── admin/          # Protected routes
│   │   └── public/         # Public API
│   ├── middleware/
│   │   └── auth.ts
│   └── utils/
│       ├── prisma.ts
│       ├── r2.ts
│       └── image.ts
├── pages/
│   ├── admin/
│   │   ├── index.vue       # Dashboard
│   │   ├── login.vue
│   │   ├── apartments/
│   │   ├── pricing/
│   │   ├── news/
│   │   └── media/
│   ├── [...slug].vue       # Dynamic pages
│   └── index.vue
├── components/
│   ├── admin/
│   └── public/
├── composables/
└── types/
```

### 0.3 Zmienne środowiskowe (.env)
- [x] Utworzyć `.env.example` z wymaganymi zmiennymi:
  ```
  DATABASE_URL=
  JWT_SECRET=
  ADMIN_EMAIL=
  ADMIN_PASSWORD_HASH=
  R2_ACCOUNT_ID=
  R2_ACCESS_KEY_ID=
  R2_SECRET_ACCESS_KEY=
  R2_BUCKET_PUBLIC=
  R2_BUCKET_PRIVATE=
  R2_PUBLIC_URL=
  ```

---

## Faza 1: Fundament i Infrastruktura Chmurowa ✅ DONE

### 1.1 Schema Prisma [B-1.1]
- [x] Utworzyć `prisma/schema.prisma`:

```prisma
model GlobalSettings {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}

model Apartment {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String    @db.Text
  amenities   Json      // ["WiFi", "Dog friendly", ...]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  pricing     Pricing[]
  media       Media[]
}

model SeasonRange {
  id        String   @id @default(cuid())
  label     String   // "Sylwester", "Majówka", "Wakacje"
  startDate DateTime
  endDate   DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Pricing {
  id            String    @id @default(cuid())
  apartmentId   String
  apartment     Apartment @relation(fields: [apartmentId], references: [id], onDelete: Cascade)
  seasonType    String    // "high" | "low"
  pricePerNight Decimal   @db.Decimal(10, 2)
  extraBedPrice Decimal   @db.Decimal(10, 2)
  minStayNights Int
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([apartmentId, seasonType])
}

model News {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  content     String    @db.Text
  excerpt     String?
  featureImage String?
  status      String    @default("draft") // "draft" | "published"
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Page {
  id           String   @id @default(cuid())
  title        String
  slug         String   @unique
  content      String   @db.Text
  status       String   @default("draft")
  showInFooter Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Media {
  id            String    @id @default(cuid())
  urlOriginal   String
  urlCompressed String
  alt           String?
  order         Int       @default(0)
  category      String    // "gallery" | "apartment" | "news"
  apartmentId   String?
  apartment     Apartment? @relation(fields: [apartmentId], references: [id], onDelete: SetNull)
  createdAt     DateTime  @default(now())
}
```

- [x] `npx prisma generate`
- [x] `npx prisma db push` (development)
- [x] Utworzyć seed script `prisma/seed.ts` z danymi inicjalnymi:
  - 2 apartamenty: "Czapla Polna", "Czapla Wodna"
  - Domyślne zakresy sezonów (High Season dates)
  - Przykładowe ceny

### 1.2 Konfiguracja Cloudflare R2 [B-1.2]
- [x] Utworzyć `server/utils/r2.ts`:
  - S3Client z konfiguracją R2 (EU endpoint)
  - Funkcje: `uploadToR2()`, `deleteFromR2()`, `getSignedUrl()`
- [x] Konfiguracja bucketów w Cloudflare Dashboard:
  - Public bucket: `czaplisko-assets` (public access enabled)
  - Private bucket: `czaplisko-backups` (API-only access)

### 1.3 System Autentykacji [B-1.3]
- [x] Utworzyć `server/utils/auth.ts`:
  - `generateToken(userId)` - JWT z 7-dniowym expiry
  - `verifyToken(token)` - walidacja JWT
  - `hashPassword()`, `comparePassword()` - bcrypt
- [x] Utworzyć `server/api/auth/login.post.ts`:
  - Walidacja email/password przez Zod
  - Zwrot JWT token + httpOnly cookie
- [x] Utworzyć `server/api/auth/logout.post.ts`:
  - Usunięcie cookie
- [x] Utworzyć `server/api/auth/me.get.ts`:
  - Zwrot danych zalogowanego użytkownika

### 1.4 Middleware Autoryzacji [B-1.4]
- [x] Utworzyć `server/middleware/auth.ts`:
  - Sprawdzenie JWT z cookie/header
  - Ochrona routes `/api/admin/*`
  - Zwrot 401 dla nieautoryzowanych

### 1.5 Skrypt Backupu [B-1.5]
- [ ] Utworzyć `scripts/backup.ts`: (Deferred to post-MVP)
  - Export PostgreSQL via `pg_dump`
  - Kompresja gzip
  - Upload do prywatnego bucketu R2
  - Naming: `backup-YYYY-MM-DD-HHmmss.sql.gz`
- [ ] Konfiguracja cron job (np. przez Nitro scheduled tasks lub zewnętrzny scheduler)

---

## Faza 2: Logika Biznesowa Pensjonatu ✅ DONE (API + Admin UI)

### 2.1 Silnik Cennika Sezonowego [B-2.1]
- [ ] Utworzyć `server/utils/pricing.ts`: (Optional for MVP - public API returns raw data)
  ```typescript
  function getSeasonType(date: Date): 'high' | 'low'
  function getPriceForDate(apartmentId: string, date: Date): PricingInfo
  function calculateStayPrice(apartmentId: string, checkIn: Date, checkOut: Date, extraBeds: number): number
  ```
- [ ] Logika:
  - Pobranie wszystkich SeasonRange z bazy
  - Sprawdzenie czy data mieści się w którymkolwiek zakresie High Season
  - Jeśli nie - Low Season (domyślny)

### 2.2 API Zarządzania Apartamentami [B-2.2]
- [x] `server/api/admin/apartments/index.get.ts` - lista apartamentów
- [x] `server/api/admin/apartments/[id].get.ts` - szczegóły apartamentu
- [x] `server/api/admin/apartments/[id].put.ts` - aktualizacja apartamentu
- [x] Walidacja Zod dla każdego endpointu

### 2.3 API Zarządzania Cennikiem [B-2.3]
- [x] `server/api/admin/seasons/index.get.ts` - lista zakresów sezonów
- [x] `server/api/admin/seasons/index.post.ts` - dodanie zakresu
- [x] `server/api/admin/seasons/[id].put.ts` - edycja zakresu
- [x] `server/api/admin/seasons/[id].delete.ts` - usunięcie zakresu
- [x] `server/api/admin/pricing/index.get.ts` - lista cen
- [x] `server/api/admin/pricing/[id].put.ts` - aktualizacja ceny
- [ ] Walidacja nakładania się dat (overlap validation) - Deferred

### 2.4 SSR Strona Cennika [B-2.4]
- [ ] Utworzyć `pages/cennik.vue`:
  - `useAsyncData` do pobrania cen z bazy
  - Renderowanie tabeli cen (High/Low season)
  - Zachowanie stylów z obecnego `template/price-list.html`

### 2.5 Admin UI - Apartamenty
- [x] `pages/admin/apartments/index.vue` - lista apartamentów
- [x] `pages/admin/apartments/[id].vue` - formularz edycji:
  - Nazwa, opis (Rich Text), udogodnienia (multi-select/tags)
  - Galeria apartamentu (drag & drop reorder)

### 2.6 Admin UI - Cennik
- [x] `pages/admin/pricing/index.vue`:
  - Tabela z cenami per apartament per sezon
  - Inline editing lub modalne formularze
- [x] Zarządzanie zakresami High Season (w tym samym widoku)

---

## Faza 3: Treści i Media z Integracją R2 ✅ DONE (API + Admin UI)

### 3.1 Pipeline Przetwarzania Obrazów [B-3.1]
- [x] Utworzyć `server/utils/image.ts`:
  ```typescript
  async function processImage(buffer: Buffer): Promise<{original: Buffer, compressed: Buffer}>
  // Sharp: resize max 1920px, WebP quality 80
  ```
- [x] Utworzyć `server/api/admin/media/upload.post.ts`:
  - Accept multipart/form-data
  - Wywołanie `processImage()`
  - Upload obu wersji do R2
  - Zapis w tabeli Media (urlOriginal, urlCompressed)
  - Zwrot URLs
- [x] Utworzyć `server/api/admin/media/[id].delete.ts`:
  - Usunięcie z R2 (obie wersje)
  - Usunięcie z bazy

### 3.2 Moduł Aktualności [B-3.2]
- [x] API CRUD:
  - `server/api/admin/news/index.get.ts`
  - `server/api/admin/news/index.post.ts`
  - `server/api/admin/news/[id].get.ts`
  - `server/api/admin/news/[id].put.ts`
  - `server/api/admin/news/[id].delete.ts`
- [x] Public API:
  - `server/api/public/news/index.get.ts` - lista opublikowanych
  - `server/api/public/news/[slug].get.ts` - szczegóły po slug

### 3.3 Admin UI - Aktualności
- [x] `pages/admin/news/index.vue`:
  - Lista aktualności z filtrem status
  - Przycisk publikuj/ukryj
- [x] `pages/admin/news/create.vue`:
  - Formularz (Rich Text editor deferred - using textarea for MVP)
  - Upload obrazu głównego
- [x] `pages/admin/news/[id].vue`:
  - Edycja istniejącej aktualności

### 3.4 Moduł Stron Dynamicznych [B-3.3]
- [ ] API CRUD dla Page (analogicznie do News) - Deferred post-MVP
- [ ] Utworzyć `pages/[...slug].vue` - Deferred post-MVP

### 3.5 Zarządzanie Galerią [B-3.4]
- [x] `pages/admin/media/index.vue`:
  - Grid wszystkich obrazów
  - Filtrowanie po kategorii
  - Drag & drop reorder (update `order` field)
  - Usuwanie z potwierdzeniem
- [ ] Komponent `components/admin/MediaPicker.vue` - Deferred

---

## Faza 4: Finalna Integracja i SEO

### 4.1 Migracja Szablonu [B-4.1]
- [ ] Przekształcenie `template/index.html` → `pages/index.vue`:
  - Hero slider z danymi z GlobalSettings
  - Sekcja apartamentów z bazy
  - Ostatnie aktualności
- [ ] Przekształcenie `template/apartments.html` → `pages/apartamenty/index.vue`
- [ ] Utworzenie `pages/apartamenty/[slug].vue` dla szczegółów
- [ ] Przekształcenie `template/gallery.html` → `pages/galeria.vue`:
  - Obrazy z tabeli Media (category: "gallery")
- [ ] Przekształcenie `template/faq.html` → `pages/faq.vue`
- [ ] Przekształcenie `template/contact.html` → `pages/kontakt.vue`

### 4.2 Komponenty Współdzielone
- [ ] `components/TheHeader.vue` - nawigacja z GlobalSettings
- [ ] `components/TheFooter.vue` - stopka z GlobalSettings + dynamic pages (showInFooter)
- [ ] `components/HeroSlider.vue`
- [ ] `components/GalleryLightbox.vue`
- [ ] `components/FaqAccordion.vue`
- [ ] `components/ContactForm.vue`
- [ ] `components/PricingTable.vue`

### 4.3 SEO i Meta Tags [B-4.2]
- [ ] Utworzyć `composables/useSeo.ts`:
  ```typescript
  function useSeo(title: string, description: string, image?: string)
  // Wrapper dla useServerSeoMeta + useHead
  ```
- [ ] Zastosowanie na wszystkich stronach publicznych
- [ ] Open Graph tags dla social media
- [ ] Structured data (JSON-LD) dla apartamentów i cennika

### 4.4 Admin Dashboard
- [ ] `pages/admin/index.vue`:
  - Podsumowanie: liczba apartamentów, aktualności, obrazów
  - Ostatnie aktualności (draft/published)
  - Quick links do sekcji

### 4.5 Layout Admina
- [ ] `layouts/admin.vue`:
  - Sidebar z nawigacją
  - Header z user info i logout
  - Responsywny (mobile sidebar toggle)

### 4.6 Audyt Wydajności [B-4.3]
- [ ] Lighthouse audit
- [ ] Weryfikacja SSR (view source powinno zawierać treść)
- [ ] Sprawdzenie cache headers dla R2 assets
- [ ] Lazy loading obrazów (native loading="lazy")

---

## Testy Akceptacyjne (Kryteria z FRS)

### Test: Optymalizacja Obrazów
- [ ] Upload 5MB JPG w Admin Panel
- [ ] Weryfikacja: 2 pliki w R2 (original + compressed WebP)
- [ ] Frontend serwuje compressed version

### Test: Bezpieczeństwo Backupów
- [ ] Backup file istnieje w R2 private bucket
- [ ] Próba dostępu bez API key → 403 Forbidden

### Test: SSR Pricing
- [ ] Strona /cennik renderuje ceny server-side
- [ ] View source zawiera aktualne ceny

---

## Deployment ✅ DONE

### Railway / Docker
- [x] Utworzyć `Dockerfile` (multi-stage build)
- [x] Railway project created with PostgreSQL
- [x] CMS service deployed
- [x] Environment variables configured
- [x] Domain generated: **https://cms-production-5efa.up.railway.app**

### Production URLs:
- **CMS Admin**: https://cms-production-5efa.up.railway.app/admin/login
- **Public API**: https://cms-production-5efa.up.railway.app/api/public/apartments

### DNS i Certyfikat
- [x] SSL przez Railway (auto-provisioned)
- [ ] Custom domain (optional)

---

## Notatki Implementacyjne

### Kolejność Priorytetów (MVP)
1. Faza 0 + Faza 1 (fundament)
2. Faza 2.1-2.4 (cennik - core business logic)
3. Faza 3.1-3.2 (media + news)
4. Faza 4.1-4.3 (migracja szablonu)

### Techniczne Decyzje
- **Rich Text Editor**: Tiptap (Vue-native, extensible)
- **Drag & Drop**: vuedraggable lub @formkit/drag-and-drop
- **State Management**: Nuxt useState + composables (nie potrzeba Pinia dla tak małej app)
- **Form Validation**: Zod + custom composable

### Ograniczenia MVP
- Brak rezerwacji online (Phase 2+)
- Jeden użytkownik admin
- Brak multi-language
- Brak zaawansowanego SEO (tylko podstawowe meta tags)

---

### Tech Lead Reviews / Notes

1.  **Środowisko Uruchomieniowe (Runtime):**
    *   Wybór biblioteki `sharp` wymusza użycie środowiska Node.js (konteneryzacja, np. Docker/Railway). Jest to zgodne z planem deploymentu, ale wyklucza proste wdrożenie na Cloudflare Workers (Edge). Decyzja o użyciu Railway jest poprawna w tym kontekście.

2.  **Bezpieczeństwo (Auth):**
    *   Implementacja własnego JWT (`server/utils/auth.ts`) jest ryzykowna. Należy zwrócić szczególną uwagę na:
        *   Ustawienie flag `HttpOnly`, `Secure` i `SameSite=Strict` dla ciasteczka z tokenem.
        *   Krótki czas życia tokena dostępowego (Access Token) i ewentualne użycie Refresh Token (choć dla MVP i jednego admina long-lived session cookie może wystarczyć, pod warunkiem możliwości jego unieważnienia - np. zmiana sekretu lub wersjonowanie tokena w bazie, czego obecny plan nie uwzględnia).
        *   Zalecam rozważenie `nuxt-auth` lub `Lucia Auth` w przyszłości, ale akceptuję custom implementation dla MVP (Single User).

3.  **Walidacja Danych:**
    *   **Zod na froncie i back-endzie:** Upewnij się, że schematy walidacji są współdzielone (np. w katalogu `shared/` lub `utils/`) aby uniknąć duplikacji logiki.
    *   **Env Variables:** Zalecam dodanie walidacji zmiennych środowiskowych przy starcie aplikacji (np. w `nuxt.config.ts`), aby aplikacja nie uruchomiła się bez kluczy do R2 czy bazy danych.

4.  **Sanityzacja HTML:**
    *   Moduł News i Pages używa Rich Text. **Krytyczne:** Konieczne jest użycie biblioteki do sanityzacji HTML (np. `dompurify` lub wbudowane mechanizmy Tiptap) przed wyrenderowaniem treści (`v-html`) na froncie, aby zapobiec atakom XSS, nawet jeśli edytuje to tylko admin (ochrona przed wklejeniem złośliwego kodu).

5.  **Relacje Prisma:**
    *   W modelu `Pricing` klucz `@@unique([apartmentId, seasonType])` zakłada, że mamy tylko jeden rekord ceny dla danego typu sezonu dla danego apartamentu. Jest to zgodne z założeniami (High/Low), ale ogranicza elastyczność (np. "Super High Season"). Na potrzeby MVP jest to akceptowalne i zgodne z PRD.

6.  **Backup Restore:**
    *   Plan zawiera skrypt backupu (`scripts/backup.ts`), ale brakuje procedury **odtwarzania (restore)**. Należy dodać przynajmniej dokumentację (README) procedury przywracania bazy z pliku `.sql.gz` pobranego z R2.

7.  **Inicjalizacja (Seed):**
    *   Przy pierwszym wdrożeniu produkcyjnym, upewnij się, że admin zostanie utworzony. Skrypt `seed.ts` powinien zawierać tworzenie domyślnego admina (z hasłem do zmiany lub pobieranym z ENV przy pierwszym uruchomieniu).