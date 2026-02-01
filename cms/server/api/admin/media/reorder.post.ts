import { z } from 'zod'
import { prisma } from '../../../utils/prisma'

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      order: z.number().int().min(0),
    })
  ),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = reorderSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  // Update all items in a transaction
  await prisma.$transaction(
    result.data.items.map((item) =>
      prisma.media.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    )
  )

  return { success: true }
})
