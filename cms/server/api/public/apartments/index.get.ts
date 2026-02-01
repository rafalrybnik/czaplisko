import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  const apartments = await prisma.apartment.findMany({
    include: {
      media: {
        orderBy: { order: 'asc' },
        take: 5, // Only first 5 images for list view
      },
    },
    orderBy: { name: 'asc' },
  })

  return apartments
})
