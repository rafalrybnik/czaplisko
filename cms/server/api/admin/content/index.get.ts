import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = query.page as string | undefined
  const section = query.section as string | undefined

  const where: { page?: string; section?: string } = {}
  if (page) where.page = page
  if (section) where.section = section

  const content = await prisma.pageContent.findMany({
    where,
    orderBy: [
      { page: 'asc' },
      { section: 'asc' },
      { key: 'asc' },
    ],
  })

  return content
})
