import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status as string | undefined

  const news = await prisma.news.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return news
})
