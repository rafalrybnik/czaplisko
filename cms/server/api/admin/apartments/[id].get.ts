import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID apartamentu jest wymagane',
    })
  }

  const apartment = await prisma.apartment.findUnique({
    where: { id },
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
