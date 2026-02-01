import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),
  ADMIN_PASSWORD_HASH: z.string().min(1, 'ADMIN_PASSWORD_HASH is required'),
  R2_ACCOUNT_ID: z.string().min(1, 'R2_ACCOUNT_ID is required'),
  R2_ACCESS_KEY_ID: z.string().min(1, 'R2_ACCESS_KEY_ID is required'),
  R2_SECRET_ACCESS_KEY: z.string().min(1, 'R2_SECRET_ACCESS_KEY is required'),
  R2_BUCKET_PUBLIC: z.string().min(1, 'R2_BUCKET_PUBLIC is required'),
  R2_BUCKET_PRIVATE: z.string().min(1, 'R2_BUCKET_PRIVATE is required'),
  R2_PUBLIC_URL: z.string().url('R2_PUBLIC_URL must be a valid URL'),
})

export type Env = z.infer<typeof envSchema>

let validatedEnv: Env | null = null

export function validateEnv(): Env {
  if (validatedEnv) return validatedEnv

  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    console.error('Environment validation failed:')
    for (const error of result.error.errors) {
      console.error(`  - ${error.path.join('.')}: ${error.message}`)
    }
    throw new Error('Invalid environment configuration. See errors above.')
  }

  validatedEnv = result.data
  return validatedEnv
}

// For development, allow partial env (don't validate on import)
export function getEnv(): Partial<Env> {
  return process.env as Partial<Env>
}
