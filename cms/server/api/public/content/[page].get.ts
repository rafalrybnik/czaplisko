import { prisma } from '../../../utils/prisma'

interface ContentItem {
  value: string
  type: string
  metadata: unknown
}

interface ContentBySection {
  [key: string]: ContentItem
}

interface ContentResponse {
  [section: string]: ContentBySection
}

export default defineEventHandler(async (event) => {
  const page = getRouterParam(event, 'page')

  if (!page) {
    throw createError({
      statusCode: 400,
      message: 'Page parameter is required',
    })
  }

  try {
    const items = await prisma.pageContent.findMany({
      where: { page },
      select: {
        section: true,
        key: true,
        value: true,
        type: true,
        metadata: true,
      },
    })

    // Transform to nested structure: { section: { key: { value, type, metadata } } }
    const content: ContentResponse = {}

    for (const item of items) {
      if (!content[item.section]) {
        content[item.section] = {}
      }
      content[item.section][item.key] = {
        value: item.value,
        type: item.type,
        metadata: item.metadata,
      }
    }

    return content
  } catch (error) {
    console.error(`[content/${page}] Database error:`, error)
    return {}
  }
})
