import { prisma } from '../../../utils/prisma'
import { seasonRangeSchema } from '../../../../app/shared/schemas'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID sezonu jest wymagane',
    })
  }

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

  // Check for overlapping seasons (excluding current one)
  const overlapping = await prisma.seasonRange.findFirst({
    where: {
      id: { not: id },
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

  const season = await prisma.seasonRange.update({
    where: { id },
    data: {
      label,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  })

  return season
})
