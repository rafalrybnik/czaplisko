import { prisma } from '../../../utils/prisma'

const fallbackApartments = [
  {
    id: 'fallback-1',
    name: 'Czapla Polna',
    slug: 'czapla-polna',
    description: 'Przytulny apartament z widokiem na laki. Idealny dla par i rodzin z dziecmi.',
    amenities: ['WiFi', 'TV', 'Aneks kuchenny', 'Lazienka', 'Taras', 'Przyjazny psom'],
    media: [],
  },
  {
    id: 'fallback-2',
    name: 'Czapla Wodna',
    slug: 'czapla-wodna',
    description: 'Przestronny apartament z widokiem na jezioro. Doskonaly dla milosnikow przyrody.',
    amenities: ['WiFi', 'TV', 'Aneks kuchenny', 'Lazienka', 'Taras', 'Przyjazny psom', 'Widok na jezioro'],
    media: [],
  },
]

export default defineEventHandler(async () => {
  try {
    const apartments = await prisma.apartment.findMany({
      include: {
        media: {
          orderBy: { order: 'asc' },
          take: 5, // Only first 5 images for list view
        },
      },
      orderBy: { name: 'asc' },
    })

    // Return fallback if no apartments in database
    if (apartments.length === 0) {
      return fallbackApartments
    }

    return apartments
  } catch (error) {
    console.error('[apartments] Database error, using fallback:', error)
    return fallbackApartments
  }
})
