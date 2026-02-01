import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || 10, 50)
  const page = Math.max(Number(query.page) || 1, 1)
  const skip = (page - 1) * limit

  const [news, total] = await Promise.all([
    prisma.news.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featureImage: true,
        publishedAt: true,
      },
    }),
    prisma.news.count({ where: { status: 'published' } }),
  ])

  return {
    data: news,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
})
