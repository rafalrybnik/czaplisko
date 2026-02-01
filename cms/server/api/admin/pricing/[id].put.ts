import { prisma } from '~/server/utils/prisma'
import { pricingUpdateSchema } from '~/shared/schemas'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID cennika jest wymagane',
    })
  }

  const body = await readBody(event)
  const result = pricingUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const pricing = await prisma.pricing.update({
    where: { id },
    data: result.data,
    include: {
      apartment: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  return pricing
})
