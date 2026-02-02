/**
 * Script to download external images and upload them to R2
 * Run with: npx tsx scripts/migrate-images.ts
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'

// Load env
import * as dotenv from 'dotenv'
dotenv.config()

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET_PUBLIC = process.env.R2_BUCKET_PUBLIC!
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

// All external images used in the project
const externalImages = [
  // Logo
  { url: 'https://i.ibb.co/q4Yf33P/logotyp-czaplisko-df-kolor-4x-kopia.png', name: 'logo-czaplisko' },

  // Hero slider
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1920', name: 'hero-pensjonat' },
  { url: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1920', name: 'hero-dom-jezioro' },
  { url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1920', name: 'hero-wellness' },
  { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1920', name: 'hero-wnetrze' },

  // Index page sections
  { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920', name: 'apartments-preview' },
  { url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&q=80&w=800', name: 'feature-taras' },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=800', name: 'feature-pomost' },
  { url: 'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&q=80&w=1000', name: 'location-map' },

  // Apartments
  { url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200', name: 'apartment-bedroom' },
  { url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1920', name: 'apartment-view' },
  { url: 'https://images.unsplash.com/photo-1549488344-c705e46405ce?auto=format&fit=crop&q=80&w=1200', name: 'apartment-living' },
  { url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200', name: 'apartment-bathroom' },

  // Gallery
  { url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200', name: 'gallery-1' },
  { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200', name: 'gallery-2' },
  { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200', name: 'gallery-3' },
  { url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200', name: 'gallery-4' },
  { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200', name: 'gallery-5' },

  // Contact
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920', name: 'contact-hero' },

  // Pricing
  { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=200', name: 'pricing-thumb-1' },
  { url: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1920', name: 'pricing-winter' },
]

async function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http

    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ImageDownloader/1.0)'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location).then(resolve).catch(reject)
        return
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }

      const chunks: Buffer[] = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => resolve(Buffer.concat(chunks)))
      response.on('error', reject)
    })

    request.on('error', reject)
    request.setTimeout(30000, () => {
      request.destroy()
      reject(new Error('Request timeout'))
    })
  })
}

function getContentType(url: string): string {
  if (url.includes('.png')) return 'image/png'
  if (url.includes('.gif')) return 'image/gif'
  if (url.includes('.webp')) return 'image/webp'
  return 'image/jpeg'
}

function getExtension(url: string, contentType: string): string {
  if (url.includes('.png')) return 'png'
  if (url.includes('.gif')) return 'gif'
  if (url.includes('.webp')) return 'webp'
  if (contentType.includes('png')) return 'png'
  return 'jpg'
}

async function uploadToR2(buffer: Buffer, key: string, contentType: string): Promise<string> {
  await client.send(new PutObjectCommand({
    Bucket: R2_BUCKET_PUBLIC,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))

  return `${R2_PUBLIC_URL}/${key}`
}

async function main() {
  console.log('Starting image migration to R2...\n')

  const results: { original: string, new: string, name: string }[] = []

  for (const image of externalImages) {
    try {
      console.log(`Downloading: ${image.name}...`)
      const buffer = await downloadImage(image.url)

      const contentType = getContentType(image.url)
      const ext = getExtension(image.url, contentType)
      const key = `defaults/${image.name}.${ext}`

      console.log(`  Uploading to R2: ${key}...`)
      const newUrl = await uploadToR2(buffer, key, contentType)

      results.push({
        original: image.url,
        new: newUrl,
        name: image.name,
      })

      console.log(`  Done: ${newUrl}\n`)
    } catch (error) {
      console.error(`  Error with ${image.name}:`, error)
    }
  }

  console.log('\n=== Migration Complete ===\n')
  console.log('URL Mapping (copy this for code updates):\n')

  for (const r of results) {
    console.log(`// ${r.name}`)
    console.log(`// Old: ${r.original}`)
    console.log(`// New: ${r.new}\n`)
  }

  // Save mapping to file
  const mappingFile = path.join(__dirname, 'image-mapping.json')
  fs.writeFileSync(mappingFile, JSON.stringify(results, null, 2))
  console.log(`\nMapping saved to: ${mappingFile}`)
}

main().catch(console.error)
