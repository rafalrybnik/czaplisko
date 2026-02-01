import { prisma } from '../../../utils/prisma'
import { processImage, generateImageKey, generateWebpKey } from '../../../utils/image'
import { uploadToR2 } from '../../../utils/r2'

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event)

  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Brak pliku do przesłania',
    })
  }

  const file = formData.find((f) => f.name === 'file')
  const categoryField = formData.find((f) => f.name === 'category')
  const apartmentIdField = formData.find((f) => f.name === 'apartmentId')
  const altField = formData.find((f) => f.name === 'alt')

  if (!file || !file.data) {
    throw createError({
      statusCode: 400,
      message: 'Brak pliku do przesłania',
    })
  }

  const mimeType = file.type || 'image/jpeg'
  const category = categoryField?.data?.toString() || 'gallery'
  const apartmentId = apartmentIdField?.data?.toString() || null
  const alt = altField?.data?.toString() || null

  // Validate mime type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(mimeType)) {
    throw createError({
      statusCode: 400,
      message: 'Niedozwolony format pliku. Dozwolone: JPG, PNG, GIF, WebP',
    })
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      message: 'Plik jest za duży. Maksymalny rozmiar: 10MB',
    })
  }

  try {
    // Process image
    const processed = await processImage(file.data, mimeType)

    // Generate keys
    const originalKey = generateImageKey(file.filename || 'image.jpg', 'original')
    const compressedKey = generateWebpKey(originalKey.replace('-original', '-compressed'))

    // Upload both versions to R2
    const [urlOriginal, urlCompressed] = await Promise.all([
      uploadToR2(originalKey, processed.original, processed.originalMimeType),
      uploadToR2(compressedKey, processed.compressed, processed.compressedMimeType),
    ])

    // Get max order for category
    const maxOrder = await prisma.media.aggregate({
      where: { category },
      _max: { order: true },
    })

    // Save to database
    const media = await prisma.media.create({
      data: {
        urlOriginal,
        urlCompressed,
        alt,
        order: (maxOrder._max.order || 0) + 1,
        category,
        apartmentId,
      },
    })

    return media
  } catch (error) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: 500,
      message: 'Błąd podczas przesyłania pliku',
    })
  }
})
