import { prisma } from '../../../utils/prisma'
import { newsUpdateSchema } from '../../../../app/shared/schemas'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID aktualności jest wymagane',
    })
  }

  const body = await readBody(event)
  const result = newsUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const existing = await prisma.news.findUnique({ where: { id } })
  if (!existing) {
    throw createError({
      statusCode: 404,
      message: 'Aktualność nie została znaleziona',
    })
  }

  // Handle publishedAt when status changes
  const updateData: any = { ...result.data }
  if (result.data.status === 'published' && existing.status !== 'published') {
    updateData.publishedAt = new Date()
  } else if (result.data.status === 'draft') {
    updateData.publishedAt = null
  }

  const news = await prisma.news.update({
    where: { id },
    data: updateData,
  })

  return news
})
