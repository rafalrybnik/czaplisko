import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug jest wymagany',
    })
  }

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
    throw createError({
      statusCode: 404,
      message: 'Apartament nie został znaleziony',
    })
  }

  return apartment
})
