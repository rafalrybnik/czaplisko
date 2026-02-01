import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string | undefined
  const apartmentId = query.apartmentId as string | undefined

  const media = await prisma.media.findMany({
    where: {
      ...(category && { category }),
      ...(apartmentId && { apartmentId }),
    },
    orderBy: { order: 'asc' },
  })

  return media
})
