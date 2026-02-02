import { z } from 'zod'
import { prisma } from '../../../utils/prisma'

const contentItemSchema = z.object({
  page: z.string().min(1),
  section: z.string().min(1),
  key: z.string().min(1),
  value: z.string(),
  type: z.enum(['text', 'richtext', 'image']).default('text'),
  metadata: z.record(z.any()).optional(),
})

const bulkUpdateSchema = z.object({
  items: z.array(contentItemSchema).min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { items } = bulkUpdateSchema.parse(body)

  // Use transaction to ensure all-or-nothing
  const results = await prisma.$transaction(
    items.map((item) =>
      prisma.pageContent.upsert({
        where: {
          page_section_key: {
            page: item.page,
            section: item.section,
            key: item.key,
          },
        },
        update: {
          value: item.value,
          type: item.type,
          metadata: item.metadata ?? undefined,
        },
        create: {
          page: item.page,
          section: item.section,
          key: item.key,
          value: item.value,
          type: item.type,
          metadata: item.metadata ?? undefined,
        },
      })
    )
  )

  return {
    success: true,
    count: results.length,
    items: results,
  }
})
