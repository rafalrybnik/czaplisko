import { prisma } from '../../../utils/prisma'
import { newsCreateSchema } from '../../../../app/shared/schemas'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const result = newsCreateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.flatten(),
    })
  }

  const { title, content, excerpt, featureImage, status } = result.data

  // Generate unique slug
  let slug = generateSlug(title)
  let slugSuffix = 0

  while (await prisma.news.findUnique({ where: { slug } })) {
    slugSuffix++
    slug = `${generateSlug(title)}-${slugSuffix}`
  }

  const news = await prisma.news.create({
    data: {
      title,
      slug,
      content,
      excerpt,
      featureImage,
      status,
      publishedAt: status === 'published' ? new Date() : null,
    },
  })

  return news
})
