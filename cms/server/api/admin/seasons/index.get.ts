import { prisma } from '../../../utils/prisma'

export default defineEventHandler(async () => {
  const seasons = await prisma.seasonRange.findMany({
    orderBy: { startDate: 'asc' },
  })

  return seasons
})
