import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const pricing = await prisma.pricing.findMany({
    include: {
      apartment: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: [
      { apartment: { name: 'asc' } },
      { seasonType: 'asc' },
    ],
  })

  return pricing
})
