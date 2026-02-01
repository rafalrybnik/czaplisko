import { z } from 'zod'
import { prisma } from '../../../utils/prisma'

const createSchema = z.object({
  label: z.string().min(1, 'Etykieta jest wymagana'),
  path: z.string().min(1, 'Sciezka jest wymagana'),
  order: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const result = createSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: result.error.errors[0].message,
    })
  }

  // Get max order if not provided
  let order = result.data.order
  if (order === undefined) {
    const maxOrder = await prisma.navigationItem.aggregate({
      _max: { order: true },
    })
    order = (maxOrder._max.order ?? -1) + 1
  }

  const item = await prisma.navigationItem.create({
    data: {
      label: result.data.label,
      path: result.data.path,
      order,
      isActive: result.data.isActive ?? true,
    },
  })

  return item
})
