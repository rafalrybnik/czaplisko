import { prisma } from '~/server/utils/prisma'
import { seasonRangeSchema } from '~/shared/schemas'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = seasonRangeSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const { label, startDate, endDate } = result.data

  // Check for overlapping seasons
  const overlapping = await prisma.seasonRange.findFirst({
    where: {
      OR: [
        {
          startDate: { lte: new Date(endDate) },
          endDate: { gte: new Date(startDate) },
        },
      ],
    },
  })

  if (overlapping) {
    throw createError({
      statusCode: 400,
      message: `Zakres dat nakłada się z istniejącym sezonem: ${overlapping.label}`,
    })
  }

  const season = await prisma.seasonRange.create({
    data: {
      label,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  })

  return season
})
