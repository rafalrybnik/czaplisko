import { prisma } from '../../../utils/prisma'

const fallbackPricing = {
  apartments: [
    {
      id: 'fallback-1',
      name: 'Czapla Polna',
      slug: 'czapla-polna',
      pricing: {
        high: { pricePerNight: 450, extraBedPrice: 80, minStayNights: 4 },
        low: { pricePerNight: 350, extraBedPrice: 60, minStayNights: 3 },
      },
    },
    {
      id: 'fallback-2',
      name: 'Czapla Wodna',
      slug: 'czapla-wodna',
      pricing: {
        high: { pricePerNight: 450, extraBedPrice: 80, minStayNights: 4 },
        low: { pricePerNight: 350, extraBedPrice: 60, minStayNights: 3 },
      },
    },
  ],
  seasons: [
    { label: 'Sylwester / Nowy Rok', startDate: '2025-01-01', endDate: '2025-01-07' },
    { label: 'Ferie zimowe', startDate: '2025-01-25', endDate: '2025-02-09' },
    { label: 'Wielkanoc', startDate: '2025-04-18', endDate: '2025-04-21' },
    { label: 'Majowka', startDate: '2025-05-01', endDate: '2025-05-04' },
    { label: 'Boze Cialo', startDate: '2025-06-19', endDate: '2025-06-22' },
    { label: 'Wakacje letnie', startDate: '2025-07-01', endDate: '2025-08-31' },
    { label: 'Boze Narodzenie', startDate: '2025-12-23', endDate: '2025-12-31' },
  ],
}

export default defineEventHandler(async () => {
  try {
    const [apartments, seasons] = await Promise.all([
      prisma.apartment.findMany({
        include: {
          pricing: true,
        },
        orderBy: { name: 'asc' },
      }),
      prisma.seasonRange.findMany({
        orderBy: { startDate: 'asc' },
      }),
    ])

    // Return fallback if no data
    if (apartments.length === 0) {
      return fallbackPricing
    }

    return {
      apartments: apartments.map((apt) => ({
        id: apt.id,
        name: apt.name,
        slug: apt.slug,
        pricing: {
          high: apt.pricing.find((p) => p.seasonType === 'high'),
          low: apt.pricing.find((p) => p.seasonType === 'low'),
        },
      })),
      seasons: seasons.map((s) => ({
        label: s.label,
        startDate: s.startDate,
        endDate: s.endDate,
      })),
    }
  } catch (error) {
    console.error('[pricing] Database error, using fallback:', error)
    return fallbackPricing
  }
})
