import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const apartments = await prisma.apartment.findMany({
    include: {
      pricing: true,
      media: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  })

  return apartments
})
