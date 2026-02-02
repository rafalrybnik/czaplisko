import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    const media = await prisma.media.findMany({
      where: {
        category: 'gallery',
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        urlOriginal: true,
        urlCompressed: true,
        alt: true,
        order: true,
      },
    })

    return media
  } catch (error) {
    console.error('[gallery] Database error, returning empty list:', error)
    return []
  }
})
