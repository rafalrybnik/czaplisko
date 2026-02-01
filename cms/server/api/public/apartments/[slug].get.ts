import { prisma } from '../../../utils/prisma'

const fallbackApartments: Record<string, any> = {
  'czapla-polna': {
    id: 'fallback-1',
    name: 'Czapla Polna',
    slug: 'czapla-polna',
    description: 'Przytulny apartament z widokiem na laki. Idealny dla par i rodzin z dziecmi.',
    amenities: ['WiFi', 'TV', 'Aneks kuchenny', 'Lazienka', 'Taras', 'Przyjazny psom'],
    media: [],
    pricing: [
      { seasonType: 'high', pricePerNight: 450, extraBedPrice: 80, minStayNights: 4 },
      { seasonType: 'low', pricePerNight: 350, extraBedPrice: 60, minStayNights: 3 },
    ],
  },
  'czapla-wodna': {
    id: 'fallback-2',
    name: 'Czapla Wodna',
    slug: 'czapla-wodna',
    description: 'Przestronny apartament z widokiem na jezioro. Doskonaly dla milosnikow przyrody.',
    amenities: ['WiFi', 'TV', 'Aneks kuchenny', 'Lazienka', 'Taras', 'Przyjazny psom', 'Widok na jezioro'],
    media: [],
    pricing: [
      { seasonType: 'high', pricePerNight: 450, extraBedPrice: 80, minStayNights: 4 },
      { seasonType: 'low', pricePerNight: 350, extraBedPrice: 60, minStayNights: 3 },
    ],
  },
}

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug jest wymagany',
    })
  }

  try {
    const apartment = await prisma.apartment.findUnique({
      where: { slug },
      include: {
        pricing: true,
        media: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!apartment) {
      // Check if we have fallback data for this slug
      const fallback = fallbackApartments[slug]
      if (fallback) {
        return fallback
      }
      throw createError({
        statusCode: 404,
        message: 'Apartament nie zostal znaleziony',
      })
    }

    return apartment
  } catch (error: any) {
    // If it's already an HTTP error, rethrow it
    if (error.statusCode) {
      throw error
    }
    // Check if we have fallback data for this slug
    console.error('[apartment] Database error, using fallback:', error)
    const fallback = fallbackApartments[slug]
    if (fallback) {
      return fallback
    }
    throw createError({
      statusCode: 404,
      message: 'Apartament nie zostal znaleziony',
    })
  }
})
