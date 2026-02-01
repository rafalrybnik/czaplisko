import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID sezonu jest wymagane',
    })
  }

  await prisma.seasonRange.delete({
    where: { id },
  })

  return { success: true }
})
