import { z } from 'zod'
import { prisma } from '../../../utils/prisma'

const updateSchema = z.object({
  label: z.string().min(1).optional(),
  path: z.string().min(1).optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID jest wymagane',
    })
  }

  const body = await readBody(event)

  const result = updateSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.errors[0].message,
    })
  }

  const item = await prisma.navigationItem.update({
    where: { id },
    data: result.data,
  })

  return item
})
