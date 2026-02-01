import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID aktualności jest wymagane',
    })
  }

  const news = await prisma.news.findUnique({
    where: { id },
  })

  if (!news) {
    throw createError({
      statusCode: 404,
      message: 'Aktualność nie została znaleziona',
    })
  }

  return news
})
