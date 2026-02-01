import { prisma } from '../../../utils/prisma'
import { deleteFromR2, getKeyFromUrl } from '../../../utils/r2'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID media jest wymagane',
    })
  }

  const media = await prisma.media.findUnique({
    where: { id },
  })

  if (!media) {
    throw createError({
      statusCode: 404,
      message: 'Media nie zostało znalezione',
    })
  }

  try {
    // Delete from R2
    await Promise.all([
      deleteFromR2(getKeyFromUrl(media.urlOriginal)),
      deleteFromR2(getKeyFromUrl(media.urlCompressed)),
    ])
  } catch (error) {
    console.error('R2 delete error:', error)
    // Continue with database deletion even if R2 fails
  }

  // Delete from database
  await prisma.media.delete({
    where: { id },
  })

  return { success: true }
})
