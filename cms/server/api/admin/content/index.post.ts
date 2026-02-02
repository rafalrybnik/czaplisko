import { z } from 'zod'
import { prisma } from '../../../utils/prisma'

const contentSchema = z.object({
  page: z.string().min(1),
  section: z.string().min(1),
  key: z.string().min(1),
  value: z.string(),
  type: z.enum(['text', 'richtext', 'image']).default('text'),
  metadata: z.record(z.any()).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const data = contentSchema.parse(body)

  // Upsert - create if not exists, update if exists
  const content = await prisma.pageContent.upsert({
    where: {
      page_section_key: {
        page: data.page,
        section: data.section,
        key: data.key,
      },
    },
    update: {
      value: data.value,
      type: data.type,
      metadata: data.metadata ?? undefined,
    },
    create: {
      page: data.page,
      section: data.section,
      key: data.key,
      value: data.value,
      type: data.type,
      metadata: data.metadata ?? undefined,
    },
  })

  return content
})
