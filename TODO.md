# TODO.md - Custom Inline Editing Implementation

**Archiwum poprzedniego planu:** `docs/archive/TODO-MVP-v1-20260202.md`

---

## Cel Projektu

Implementacja systemu edycji inline dla admina, umożliwiającego edycję treści (tekstów i obrazków) bezpośrednio na stronach publicznych, bez zmiany układu elementów.

**Architektura przygotowana na przyszłą integrację z GrapesJS** (page builder dla landing pages).

---

## Architektura Systemu

### Model danych

```
┌─────────────────────────────────────────────────────────────┐
│                     PageContent                             │
│  (edycja inline - teksty/obrazki w istniejącym layoucie)   │
├─────────────────────────────────────────────────────────────┤
│  id        │ cuid                                           │
│  page      │ "home" | "apartments" | "contact" | ...        │
│  section   │ "hero" | "about" | "features" | ...            │
│  key       │ "title" | "subtitle" | "description" | "image" │
│  value     │ treść tekstowa lub URL obrazka                 │
│  type      │ "text" | "richtext" | "image"                  │
│  metadata  │ JSON (alt dla obrazków, placeholder, etc.)     │
│  updatedAt │ timestamp                                      │
└─────────────────────────────────────────────────────────────┘
```

### Przyszła rozbudowa (GrapesJS)

```
┌─────────────────────────────────────────────────────────────┐
│                     CustomPage                              │
│  (pełny page builder - landing pages, promocje)            │
├─────────────────────────────────────────────────────────────┤
│  id          │ cuid                                         │
│  slug        │ unique URL path                              │
│  title       │ tytuł strony                                 │
│  gjsHtml     │ HTML wygenerowany przez GrapesJS             │
│  gjsCss      │ CSS wygenerowany przez GrapesJS              │
│  gjsData     │ JSON - pełna struktura edytora               │
│  status      │ "draft" | "published"                        │
│  publishedAt │ timestamp                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Faza 1: Model Danych i API ✅ DONE

### 1.1 Rozszerzenie schematu Prisma
- [x] Dodać model `PageContent` do `prisma/schema.prisma`:
  ```prisma
  model PageContent {
    id        String   @id @default(cuid())
    page      String   // identyfikator strony: "home", "apartments", etc.
    section   String   // sekcja na stronie: "hero", "about", "features"
    key       String   // klucz elementu: "title", "subtitle", "image"
    value     String   @db.Text  // wartość (tekst lub URL)
    type      String   @default("text") // "text" | "richtext" | "image"
    metadata  Json?    // dodatkowe dane (alt, placeholder, etc.)
    updatedAt DateTime @updatedAt

    @@unique([page, section, key])
    @@index([page])
  }
  ```
- [x] Uruchomić `npx prisma db push`

### 1.2 API Admin - CRUD dla PageContent
- [x] `server/api/admin/content/index.get.ts`
  - Parametry query: `?page=home` (opcjonalnie `&section=hero`)
  - Zwraca listę wszystkich elementów dla strony/sekcji

- [x] `server/api/admin/content/index.post.ts`
  - Body: `{ page, section, key, value, type, metadata? }`
  - Tworzy nowy element lub aktualizuje istniejący (upsert)

- [x] `server/api/admin/content/bulk.put.ts`
  - Body: `{ items: [{ page, section, key, value, type }] }`
  - Masowa aktualizacja wielu elementów naraz (dla "Zapisz wszystko")

- [x] `server/api/admin/content/[id].delete.ts`
  - Usunięcie elementu (przywrócenie do domyślnego)

### 1.3 API Public - Pobieranie treści
- [x] `server/api/public/content/[page].get.ts`
  - Zwraca wszystkie elementy dla danej strony
  - Format: `{ [section]: { [key]: { value, type, metadata } } }`
  - Cache-friendly (można dodać stale-while-revalidate)

### 1.4 Seed domyślnych treści
- [x] Rozszerzyć `server/plugins/init-db.ts` o seedowanie PageContent:
  - Strona główna (home): hero title, subtitle, image, about section, etc.
  - Strona apartamentów: intro text
  - FAQ: intro text
  - Kontakt: intro text, info sections
  - Galeria: intro text

---

## Faza 2: Komponenty Edycji Inline ✅ DONE

### 2.1 Composable useEditMode
- [x] Utworzyć `composables/useEditMode.ts`:
  ```typescript
  export function useEditMode() {
    const isAdmin = useState<boolean>('isAdmin', () => false)
    const editMode = useState<boolean>('editMode', () => false)
    const pendingChanges = useState<Map<string, ContentChange>>('pendingChanges', () => new Map())
    const isDirty = computed(() => pendingChanges.value.size > 0)

    function toggleEditMode() { ... }
    function registerChange(page: string, section: string, key: string, value: string) { ... }
    function discardChanges() { ... }
    async function saveAllChanges() { ... }

    return { isAdmin, editMode, isDirty, toggleEditMode, registerChange, discardChanges, saveAllChanges }
  }
  ```

### 2.2 Composable usePageContent
- [x] Utworzyć `composables/usePageContent.ts`:
  ```typescript
  export function usePageContent(page: string) {
    const { data: content } = useAsyncData(`content-${page}`, () =>
      $fetch(`/api/public/content/${page}`)
    )

    function get(section: string, key: string, fallback: string = ''): string { ... }
    function getImage(section: string, key: string, fallback: string = ''): string { ... }

    return { content, get, getImage }
  }
  ```

### 2.3 Komponent EditableText
- [x] Utworzyć `components/editable/EditableText.vue`:
  ```vue
  <script setup lang="ts">
  defineProps<{
    page: string
    section: string
    contentKey: string
    tag?: string  // 'p' | 'h1' | 'h2' | 'span' | etc.
    fallback?: string
    richtext?: boolean
  }>()
  </script>

  <template>
    <!-- Tryb normalny: renderuj tekst -->
    <!-- Tryb edycji (admin): contenteditable z highlight -->
  </template>
  ```

  **Funkcjonalności:**
  - Normalny tryb: renderuje tekst jako wybrany tag
  - Tryb edycji: żółte obramowanie, contenteditable
  - Auto-save do pendingChanges przy blur
  - Opcjonalny richtext (bold, italic, links)

### 2.4 Komponent EditableImage
- [x] Utworzyć `components/editable/EditableImage.vue`:
  ```vue
  <script setup lang="ts">
  defineProps<{
    page: string
    section: string
    contentKey: string
    fallback?: string
    class?: string
    alt?: string
  }>()
  </script>

  <template>
    <!-- Tryb normalny: <img> lub background -->
    <!-- Tryb edycji: overlay z ikoną "zmień", click otwiera modal -->
  </template>
  ```

  **Funkcjonalności:**
  - Normalny tryb: renderuje obrazek
  - Tryb edycji: overlay z ikoną aparatu/edit
  - Kliknięcie otwiera MediaPicker modal
  - Po wyborze: zapis do pendingChanges

### 2.5 Komponent EditableBackground
- [x] Utworzyć `components/editable/EditableBackground.vue`:
  - Wariant EditableImage dla background-image
  - Używany dla sekcji hero, bannerów, etc.

### 2.6 Komponent MediaPickerModal
- [x] Utworzyć `components/editable/EditableMediaPicker.vue`:
  - Modal z galerią wszystkich obrazków z Media
  - Opcja upload nowego obrazka
  - Wyszukiwanie/filtrowanie
  - Zwraca wybrany URL

### 2.7 Komponent AdminToolbar
- [x] Utworzyć `components/editable/AdminToolbar.vue`:
  - Floating toolbar (fixed bottom)
  - **Widoczny zawsze gdy admin zalogowany**
  - Tryb podglądu: `[👤 Admin: email] [✏️ Edytuj stronę]`
  - Tryb edycji: `[⚠️ Tryb edycji (X zmian)] [💾 Zapisz] [❌ Anuluj]`
  - Przycisk "Edytuj" włącza editMode
  - Przycisk "Anuluj" wyłącza editMode i odrzuca zmiany
  - Przycisk "Zapisz" zapisuje i wyłącza editMode

---

## Faza 3: Integracja ze Stronami (CZĘŚCIOWO)

### 3.1 Integracja AdminToolbar z layoutem
- [x] Dodać `<AdminToolbar />` do `layouts/public.vue`:
  - Komponent sam sprawdza czy admin zalogowany (`/api/auth/me`)
  - Renderuje się tylko dla admina
  - Fixed position na dole ekranu
  - Z-index wysoki (nad resztą treści)

### 3.2 Integracja ze stroną główną (home)
- [x] Zmodyfikować `pages/index.vue`:
  - Zastąpić statyczne teksty komponentami `<EditableText>`
  - Zastąpić obrazki hero komponentami `<EditableBackground>` (TODO)
  - Zachować istniejący layout i style

  **Elementy zintegrowane:**
  - [x] Hero: label, title, description
  - [x] Hero: button_text (Zobacz Apartamenty)
  - [x] Hero cards: card1/2/3 title + description (Komfortowe Pokoje, Idealne Wakacje, Ekologia i Natura)
  - [x] Intro: label, title, description
  - [x] Features: title
  - [x] Features cards: Taras + subtitle, Pomost + subtitle
  - [x] Features list: 4 opisy (paw, leaf, water, kitchen)
  - [x] Location: label, title, description_1, description_2
  - [ ] Hero background images (slider) - wymaga więcej pracy

### 3.3 Integracja ze stroną apartamentów
- [x] Zmodyfikować `pages/apartamenty/index.vue`:
  - [x] Hero title
  - [x] Subtitle "Wybierz swoj apartament"
  - (Opisy apartamentów pozostają w modelu Apartment - osobna edycja)

### 3.4 Integracja ze stroną FAQ
- [x] Zmodyfikować `pages/faq.vue`:
  - [x] Header label + title
  - [x] CTA section (title, description, button)
  - (Pytania i odpowiedzi zarządzane przez admin panel)

### 3.5 Integracja ze stroną kontakt
- [x] Zmodyfikować `pages/kontakt.vue`:
  - [x] Hero title
  - [x] Form section (label, title, description)
  - [x] Contact info (address, phone, email, region, checkin, checkout)

### 3.6 Integracja ze stroną galeria
- [x] Zmodyfikować `pages/galeria.vue`:
  - [x] Hero title
  - [x] Intro section (title, description)
  - [x] CTA section (title, description, button)
  - (Obrazki zarządzane przez Media - bez zmian)

### 3.7 Integracja ze stroną cennik
- [x] Zmodyfikować `pages/cennik.vue`:
  - [x] Header (title, subtitle)
  - [x] Season descriptions (high/low)
  - [x] CTA section (title, button)

### 3.8 Integracja z TheFooter
- [x] Zmodyfikować `components/TheFooter.vue`:
  - [x] Section titles (Odwiedz nas, Social media)
  - [x] Address info (line1, line2, street, city)

---

## Faza 4: Polish i UX

### 4.1 Visual feedback podczas edycji
- [x] Style CSS dla trybu edycji:
  - [x] Żółte obramowanie edytowalnych elementów (dashed)
  - [x] Hover effect z darker border
  - [ ] Ikona ołówka przy hover (opcjonalne)
  - [ ] Podświetlenie zmienionych elementów (przed zapisem)

### 4.2 Autosave i draft
- [ ] Opcjonalny autosave do localStorage:
  - Zapisywanie pendingChanges co 30 sekund
  - Odzyskiwanie po odświeżeniu strony
  - Pytanie "Masz niezapisane zmiany, przywrócić?"

### 4.3 Historia zmian (opcjonalne)
- [ ] Prosty log zmian w PageContent:
  - previousValue przed każdą zmianą
  - Możliwość podglądu "co się zmieniło"

### 4.4 Walidacja i limity
- [ ] Maksymalna długość tekstu per pole
- [ ] Walidacja URL dla obrazków
- [ ] Sanityzacja HTML dla richtext (DOMPurify)

---

## Faza 5: Testy i Dokumentacja

### 5.1 Testy manualne
- [ ] Test edycji tekstu na każdej stronie
- [ ] Test zmiany obrazków
- [ ] Test zapisywania zmian (bulk save)
- [ ] Test anulowania zmian
- [ ] Test na mobile (responsywność toolbara)

### 5.2 Dokumentacja dla admina
- [ ] Krótki przewodnik w admin panelu:
  - Jak włączyć tryb edycji
  - Jak edytować teksty
  - Jak zmieniać obrazki
  - Jak zapisać/anulować zmiany

---

## Estymacja czasowa

| Faza | Zadania | Czas |
|------|---------|------|
| Faza 1 | Model + API | 3-4h |
| Faza 2 | Komponenty edycji | 4-6h |
| Faza 3 | Integracja ze stronami | 4-5h |
| Faza 4 | Polish i UX | 2-3h |
| Faza 5 | Testy i dokumentacja | 1-2h |
| **Suma** | | **14-20h (2-3 dni)** |

---

## Przygotowanie na GrapesJS (przyszłość)

Architektura jest gotowa na dodanie GrapesJS:

1. **Osobny model `CustomPage`** - nie koliduje z `PageContent`
2. **Komponenty `Editable*`** - można zarejestrować jako bloki GrapesJS
3. **MediaPicker** - reużywalny w obu systemach
4. **API pattern** - `/api/admin/content/` vs `/api/admin/pages/`

**Gdy będzie potrzeba GrapesJS:**
- Dodać model `CustomPage`
- Zintegrować GrapesJS editor w `/admin/pages/builder`
- Renderować custom pages przez `pages/p/[slug].vue`
- Zarejestrować Editable* jako custom blocks

---

## Notatki techniczne

### Klucze treści (page/section/key)

```
home/hero/title          → "Witamy w Czaplisku Siedlisku"
home/hero/subtitle       → "Dog Friendly & Eco Guesthouse"
home/hero/image_1        → "https://r2.../hero1.webp"
home/hero/image_2        → "https://r2.../hero2.webp"
home/about/title         → "O nas"
home/about/description   → "Lorem ipsum..."
home/about/image         → "https://r2.../about.webp"

contact/header/title     → "Kontakt"
contact/info/address     → "Skitlawki 2A, 14-230 Zalewo"
contact/info/phone       → "+48 123 456 789"
contact/info/email       → "kontakt@czaplisko.pl"

footer/social/facebook   → "https://facebook.com/czaplisko"
footer/social/instagram  → "https://instagram.com/czaplisko"
footer/address/line1     → "Czaplisko Siedlisko"
footer/address/line2     → "Skitlawki 2A"
```

### Fallback strategy

1. Sprawdź `PageContent` w bazie
2. Jeśli brak → użyj hardcoded fallback w komponencie
3. Fallback = obecne statyczne wartości (migracja stopniowa)

---

## Decyzje (zatwierdzone)

1. **FAQ:** Tylko intro text inline, pytania przez admin panel ✅
2. **Apartamenty:** Opisy przez istniejący admin panel ✅
3. **Rich text:** Prosty contenteditable (bold/italic/links) ✅
4. **Toolbar:** Pasek admina zawsze widoczny na dole gdy zalogowany ✅

---

**Status:** ✅ FAZA 1-3 UKOŃCZONE

### Postęp implementacji (2026-02-02):
- ✅ Model PageContent + API (Faza 1)
- ✅ Wszystkie komponenty edycji (Faza 2)
- ✅ Strona główna z inline editing - KOMPLETNA (Faza 3.1-3.2)
  - Hero: label, title, description, button
  - Hero cards: 3 karty z tytułami i opisami
  - Intro: label, title, description
  - Features: title, 2 karty (Taras/Pomost), 4 opisy funkcji
  - Location: label, title, 2 opisy
- ✅ Wszystkie pozostałe strony - KOMPLETNE (Faza 3.3-3.8)
  - Apartamenty: hero title, subtitle
  - FAQ: header, CTA section
  - Kontakt: hero, form section, contact info
  - Galeria: hero, intro, CTA
  - Cennik: header, season descriptions, CTA
  - Footer: section titles, address
- 🔄 Polish i UX (Faza 4)
