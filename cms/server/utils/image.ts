import sharp from 'sharp'

const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080
const WEBP_QUALITY = 80

interface ProcessedImage {
  original: Buffer
  compressed: Buffer
  originalMimeType: string
  compressedMimeType: string
}

export async function processImage(buffer: Buffer, mimeType: string): Promise<ProcessedImage> {
  // Get image metadata
  const metadata = await sharp(buffer).metadata()

  // Create compressed WebP version
  let compressedImage = sharp(buffer)

  // Resize if larger than max dimensions
  if (metadata.width && metadata.width > MAX_WIDTH) {
    compressedImage = compressedImage.resize(MAX_WIDTH, null, {
      withoutEnlargement: true,
      fit: 'inside',
    })
  } else if (metadata.height && metadata.height > MAX_HEIGHT) {
    compressedImage = compressedImage.resize(null, MAX_HEIGHT, {
      withoutEnlargement: true,
      fit: 'inside',
    })
  }

  const compressed = await compressedImage.webp({ quality: WEBP_QUALITY }).toBuffer()

  return {
    original: buffer,
    compressed,
    originalMimeType: mimeType,
    compressedMimeType: 'image/webp',
  }
}

export function generateImageKey(filename: string, suffix?: string): string {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 8)
  const ext = filename.split('.').pop() || 'jpg'
  const baseName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-')

  if (suffix) {
    return `images/${timestamp}-${randomStr}-${baseName}-${suffix}.${ext}`
  }
  return `images/${timestamp}-${randomStr}-${baseName}.${ext}`
}

export function generateWebpKey(originalKey: string): string {
  return originalKey.replace(/\.[^/.]+$/, '.webp')
}
