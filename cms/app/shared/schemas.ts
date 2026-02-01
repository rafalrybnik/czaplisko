import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Podaj poprawny adres email'),
  password: z.string().min(1, 'Hasło jest wymagane'),
})

// Apartment schemas
export const apartmentUpdateSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana').max(100),
  description: z.string().min(1, 'Opis jest wymagany'),
  amenities: z.array(z.string()),
})

// Season schemas
export const seasonRangeSchema = z.object({
  label: z.string().min(1, 'Nazwa sezonu jest wymagana').max(50),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format daty: YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format daty: YYYY-MM-DD'),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
  message: 'Data końcowa musi być po dacie początkowej',
  path: ['endDate'],
})

// Pricing schemas
export const pricingUpdateSchema = z.object({
  pricePerNight: z.number().positive('Cena musi być większa od 0'),
  extraBedPrice: z.number().min(0, 'Cena nie może być ujemna'),
  minStayNights: z.number().int().min(1, 'Minimum 1 noc'),
})

// News schemas
export const newsCreateSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany').max(200),
  content: z.string().min(1, 'Treść jest wymagana'),
  excerpt: z.string().max(500).optional(),
  featureImage: z.string().url().optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
})

export const newsUpdateSchema = newsCreateSchema.partial()

// Page schemas
export const pageCreateSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany').max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug może zawierać tylko małe litery, cyfry i myślniki'),
  content: z.string().min(1, 'Treść jest wymagana'),
  status: z.enum(['draft', 'published']).default('draft'),
  showInFooter: z.boolean().default(false),
})

export const pageUpdateSchema = pageCreateSchema.partial()

// Media schemas
export const mediaUpdateSchema = z.object({
  alt: z.string().max(200).optional(),
  order: z.number().int().min(0).optional(),
  category: z.enum(['gallery', 'apartment', 'news']).optional(),
  apartmentId: z.string().optional().nullable(),
})

// Global settings schemas
export const settingsUpdateSchema = z.object({
  key: z.string().min(1).max(50),
  value: z.string(),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type ApartmentUpdateInput = z.infer<typeof apartmentUpdateSchema>
export type SeasonRangeInput = z.infer<typeof seasonRangeSchema>
export type PricingUpdateInput = z.infer<typeof pricingUpdateSchema>
export type NewsCreateInput = z.infer<typeof newsCreateSchema>
export type NewsUpdateInput = z.infer<typeof newsUpdateSchema>
export type PageCreateInput = z.infer<typeof pageCreateSchema>
export type PageUpdateInput = z.infer<typeof pageUpdateSchema>
export type MediaUpdateInput = z.infer<typeof mediaUpdateSchema>
export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>
