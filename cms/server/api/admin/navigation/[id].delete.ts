import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID jest wymagane',
    })
  }

  await prisma.navigationItem.delete({
    where: { id },
  })

  return { success: true }
})
