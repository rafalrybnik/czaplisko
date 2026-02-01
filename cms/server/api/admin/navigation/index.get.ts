import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async () => {
  const items = await prisma.navigationItem.findMany({
    orderBy: {
      order: 'asc',
    },
  })

  return items
})
