// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    // Private keys (server-only)
    jwtSecret: process.env.JWT_SECRET || '',
    adminEmail: process.env.ADMIN_EMAIL || '',
    adminPasswordHash: process.env.ADMIN_PASSWORD_HASH || '',
    databaseUrl: process.env.DATABASE_URL || '',
    r2AccountId: process.env.R2_ACCOUNT_ID || '',
    r2AccessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    r2SecretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    r2BucketPublic: process.env.R2_BUCKET_PUBLIC || '',
    r2BucketPrivate: process.env.R2_BUCKET_PRIVATE || '',
    // Public keys (exposed to client)
    public: {
      r2PublicUrl: process.env.R2_PUBLIC_URL || '',
      siteName: 'Czaplisko Siedlisko',
    },
  },

  routeRules: {
    '/admin/**': { ssr: false },
  },

  nitro: {
    preset: 'node-server',
  },

  typescript: {
    strict: true,
  },
})
