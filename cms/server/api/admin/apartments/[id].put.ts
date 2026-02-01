import { prisma } from '../../../utils/prisma'
import { apartmentUpdateSchema } from '../../../../app/shared/schemas'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID apartamentu jest wymagane',
    })
  }

  const body = await readBody(event)
  const result = apartmentUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const apartment = await prisma.apartment.update({
    where: { id },
    data: result.data,
    include: {
      pricing: true,
      media: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return apartment
})
