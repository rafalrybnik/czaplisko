import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Content ID is required',
    })
  }

  await prisma.pageContent.delete({
    where: { id },
  })

  return { success: true }
})
