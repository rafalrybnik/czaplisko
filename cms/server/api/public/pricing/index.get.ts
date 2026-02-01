import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
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
})
