import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug jest wymagany',
    })
  }

  const news = await prisma.news.findUnique({
    where: { slug },
  })

  if (!news || news.status !== 'published') {
    throw createError({
      statusCode: 404,
      message: 'Aktualność nie została znaleziona',
    })
  }

  return news
})
