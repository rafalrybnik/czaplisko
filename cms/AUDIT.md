# Security Audit Report - Czaplisko CMS

**Data analizy:** 3 lutego 2026
**Zakres:** Autentykacja, Autoryzacja, API, Upload plików, XSS, Zarządzanie sekretami, CSRF

---

## Podsumowanie

Czaplisko CMS wykazuje solidne praktyki bezpieczeństwa z właściwym użyciem nowoczesnych frameworków (Nuxt 4, Prisma 7, bcryptjs, JWT, Zod). Zidentyfikowano jednak kilka problemów od średniego do krytycznego poziomu. Najpoważniejsze dotyczą braku ochrony CSRF, potencjalnej podatności na timing attack oraz niewystarczającej walidacji sekretów.

**Ogólna ocena bezpieczeństwa: 6/10**

---

## Znalezione problemy

### KRYTYCZNE

#### 1. Brak ochrony CSRF na mutacjach admin

**Plik:** `server/middleware/auth.ts`, wszystkie endpointy admin
**Problem:** Brak tokenów CSRF dla operacji POST, PUT, DELETE.

- Wszystkie endpointy admin akceptują mutacje bez walidacji tokenu CSRF
- `sameSite: 'strict'` daje częściową ochronę, ale nie jest wystarczające
- Atakujący mógłby wykonać nieautoryzowane akcje jeśli użytkownik odwiedzi złośliwą stronę będąc zalogowanym

**Rekomendacja:**
- Zaimplementować middleware generujący i walidujący tokeny CSRF
- Dodać nagłówek X-CSRF-Token do żądań mutujących
- Rozważyć wzorzec "double-submit-cookie"

---

#### 2. Słaba konfiguracja cookie w development

**Plik:** `server/utils/auth.ts:36-43`
**Problem:** Flaga `secure` ustawiana warunkowo tylko na podstawie NODE_ENV.

```typescript
setCookie(event, COOKIE_NAME, token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',  // Słabe w dev
  sameSite: 'strict',
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
})
```

**Rekomendacja:**
- Dodać walidację że NODE_ENV='production' przed deploymentem
- Rozważyć ustawienie explicit `domain` dla izolacji subdomen

---

### WYSOKIE

#### 3. Słaba walidacja hasła w schemacie logowania

**Plik:** `app/shared/schemas.ts:4-7`
**Problem:** Minimalne wymagania dla hasła (tylko 1 znak).

```typescript
password: z.string().min(1, 'Hasło jest wymagane'),  // Tylko 1 znak!
```

**Rekomendacja:**
- Wymagać minimum 12 znaków
- Dodać wymagania złożoności (wielkie/małe litery, cyfry, znaki specjalne)
- Zaimplementować rate limiting na endpoint logowania

---

#### 4. Podatność na timing attack w logowaniu

**Plik:** `server/api/auth/login.post.ts:21-35`
**Problem:** Porównanie email przed hasłem ujawnia czy email istnieje.

```typescript
if (email !== config.adminEmail) {  // Natychmiastowy return
  throw createError({...})
}
const isValidPassword = await comparePassword(password, config.adminPasswordHash)
```

**Rekomendacja:**
- Zawsze wykonywać porównanie hasła niezależnie od poprawności email
- Użyć `crypto.timingSafeEqual()` dla porównań stałoczasowych

```typescript
const emailMatch = email === config.adminEmail
const passwordMatch = await comparePassword(password, config.adminPasswordHash)
if (!emailMatch || !passwordMatch) {
  throw createError({...})  // Jeden, połączony check
}
```

---

#### 5. Niewystarczająca walidacja zmiennych środowiskowych

**Plik:** `nuxt.config.ts:27-43`
**Problem:** Runtime config używa pustych stringów jako fallback.

```typescript
runtimeConfig: {
  jwtSecret: process.env.JWT_SECRET || '',  // Pusty fallback!
  adminEmail: process.env.ADMIN_EMAIL || '',
  // ...
}
```

**Rekomendacja:**
- Usunąć wszystkie puste fallbacki
- Wywołać `validateEnv()` przy starcie serwera
- Aplikacja powinna nie startować jeśli brakuje wymaganych zmiennych

---

#### 6. Wyciek informacji o błędach bazy danych

**Plik:** Wiele endpointów - `server/api/public/**`, `server/api/admin/**`
**Problem:** Błędy logowane z potencjalnie wrażliwymi informacjami.

```typescript
} catch (error: any) {
  console.error('Upload error:', error)  // Pełny obiekt błędu
  // ...
}
```

**Rekomendacja:**
- Zaimplementować proper error logging (np. Sentry)
- Nigdy nie logować pełnych obiektów błędów z wrażliwymi danymi
- Używać generycznych komunikatów dla użytkownika

---

#### 7. Brak rate limiting na endpointach autentykacji

**Plik:** `server/api/auth/login.post.ts`
**Problem:** Endpoint logowania akceptuje nieograniczoną liczbę żądań.

**Rekomendacja:**
- Zaimplementować rate limiting (np. h3-rate-limiter)
- Limit: 5-10 prób na minutę per IP
- Exponential backoff po nieudanych próbach
- Tymczasowa blokada konta po N nieudanych próbach
- Rozważyć MFA/2FA

---

### ŚREDNIE

#### 8. Luźna walidacja metadanych w API content

**Plik:** `server/api/admin/content/index.post.ts:4-11`
**Problem:** Pole metadata akceptuje dowolne dane.

```typescript
metadata: z.record(z.any()).optional(),  // Any type!
```

**Rekomendacja:**
- Ograniczyć metadata do znanych pól
- Zdefiniować explicit schema dla metadata

---

#### 9. Brak limitów długości stringów

**Plik:** Wiele schematów w `app/shared/schemas.ts`
**Problem:** Pola string bez ograniczeń maksymalnej długości.

**Rekomendacja:**
- Dodać `.max()` do wszystkich pól string
- Ustawić rozsądne limity (np. page: max 50, value: max 100000)

---

#### 10. Obejście walidacji typu pliku

**Plik:** `server/api/admin/media/upload.post.ts:42-49`
**Problem:** Walidacja MIME type polega tylko na danych od klienta.

```typescript
const mimeType = file.type || 'image/jpeg'  // Od klienta!
```

**Rekomendacja:**
- Weryfikować zawartość pliku używając magic bytes
- Użyć biblioteki file-type:
```typescript
import { fileTypeFromBuffer } from 'file-type';
const detectedType = await fileTypeFromBuffer(file.data);
```

---

#### 11. Brak audit trail dla usunięć

**Plik:** `server/api/admin/media/[id].delete.ts` i inne
**Problem:** Operacje usuwania nie tworzą logów audytu.

**Rekomendacja:**
- Dodać tabelę audit log: user, action, timestamp, record_id, old_value
- Implementować soft deletes z `deletedAt`
- Zachowywać usunięte wersje plików

---

#### 12. Brak regeneracji sesji

**Plik:** `server/api/auth/login.post.ts`, `server/utils/auth.ts`
**Problem:** Nowy token wydawany bez unieważnienia starych.

**Rekomendacja:**
- Implementować śledzenie wersji tokenów w bazie
- Przy logowaniu inkrementować wersję tokenu
- Walidować wersję tokenu przy każdym żądaniu
- Przy zmianie hasła unieważniać wszystkie tokeny

---

### NISKIE

#### 13. Brak nagłówków Content Security Policy

**Plik:** `nuxt.config.ts`
**Problem:** Brak nagłówków CSP.

**Rekomendacja:**
- Dodać nagłówki CSP w middleware Nitro
- `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`

---

#### 14. Brakujące nagłówki bezpieczeństwa

**Problem:** Brak standardowych nagłówków bezpieczeństwa.

**Rekomendacja:**
```typescript
setHeader('X-Content-Type-Options', 'nosniff')
setHeader('X-Frame-Options', 'DENY')
setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
```

---

#### 15. Brak sanityzacji rich text

**Plik:** `app/shared/schemas.ts` (typ richtext)
**Problem:** Rich text akceptowany bez sanityzacji HTML.

**Rekomendacja:**
- Dodać bibliotekę sanityzacji (DOMPurify, sanitize-html)
- Whitelist dozwolonych tagów: `<p>, <br>, <strong>, <em>, <ul>, <ol>, <li>, <a>`
- Sanityzować przy zapisie, nie przy renderowaniu

---

## Pozytywne aspekty

- Właściwa walidacja inputu z Zod we wszystkich endpointach API
- Brak ryzyka SQL Injection dzięki Prisma ORM
- Dobre hashowanie haseł (bcryptjs, 12 rund)
- Poprawna implementacja JWT z expiration (7 dni)
- Cookies HttpOnly chronione przed dostępem JS
- SameSite=Strict jako częściowa ochrona CSRF
- Brak użycia v-html w szablonach Vue
- Whitelist typów plików przy uploadzie
- Limit rozmiaru plików 10MB
- Rozdzielone endpointy public i admin

---

## Priorytety napraw

### Natychmiast (Tydzień 1)
1. Implementacja ochrony CSRF
2. Rate limiting na logowaniu
3. Naprawa timing attack w autentykacji
4. Wzmocnienie walidacji zmiennych środowiskowych

### Krótkoterminowo (Miesiąc 1)
5. Poprawa wymagań dla haseł
6. Implementacja audit logging
7. Dodanie nagłówków bezpieczeństwa
8. Poprawa walidacji typu pliku (magic bytes)
9. Limity długości stringów

### Średnioterminowo (Miesiąc 2-3)
10. Śledzenie wersji tokenów / regeneracja sesji
11. Sanityzacja rich text
12. Limity rozmiaru żądań i ochrona DoS
13. Poprawa obsługi błędów

### Długoterminowo
14. Regularne aktualizacje zależności i skanowanie podatności
15. System audit trail / logowania
16. Implementacja MFA/2FA
17. Testy penetracyjne
