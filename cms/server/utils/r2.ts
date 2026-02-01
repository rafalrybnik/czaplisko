import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

let s3Client: S3Client | null = null

function getS3Client(): S3Client {
  if (s3Client) return s3Client

  const config = useRuntimeConfig()

  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.r2AccessKeyId,
      secretAccessKey: config.r2SecretAccessKey,
    },
  })

  return s3Client
}

export async function uploadToR2(
  key: string,
  body: Buffer,
  contentType: string,
  isPrivate = false
): Promise<string> {
  const config = useRuntimeConfig()
  const client = getS3Client()
  const bucket = isPrivate ? config.r2BucketPrivate : config.r2BucketPublic

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )

  if (isPrivate) {
    // For private files, return the key (URL must be signed on demand)
    return key
  }

  // For public files, return the public URL
  return `${config.public.r2PublicUrl}/${key}`
}

export async function deleteFromR2(key: string, isPrivate = false): Promise<void> {
  const config = useRuntimeConfig()
  const client = getS3Client()
  const bucket = isPrivate ? config.r2BucketPrivate : config.r2BucketPublic

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  )
}

export async function getSignedUrlForPrivateFile(key: string, expiresIn = 3600): Promise<string> {
  const config = useRuntimeConfig()
  const client = getS3Client()

  const command = new GetObjectCommand({
    Bucket: config.r2BucketPrivate,
    Key: key,
  })

  return getSignedUrl(client, command, { expiresIn })
}

export function getKeyFromUrl(url: string): string {
  const config = useRuntimeConfig()
  return url.replace(`${config.public.r2PublicUrl}/`, '')
}
