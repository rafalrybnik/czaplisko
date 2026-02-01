import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID aktualności jest wymagane',
    })
  }

  await prisma.news.delete({
    where: { id },
  })

  return { success: true }
})
