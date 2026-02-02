import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required')
}

const pool = new pg.Pool({
  connectionString,
  ssl: connectionString.includes('railway') ? { rejectUnauthorized: false } : false,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Create apartments
  const czaplaPolna = await prisma.apartment.upsert({
    where: { slug: 'czapla-polna' },
    update: {},
    create: {
      name: 'Czapla Polna',
      slug: 'czapla-polna',
      description: 'Przytulny apartament z widokiem na łąki. Idealny dla par i rodzin z dziećmi.',
      amenities: ['WiFi', 'TV', 'Aneks kuchenny', 'Łazienka', 'Taras', 'Przyjazny psom'],
    },
  })

  const czaplaWodna = await prisma.apartment.upsert({
    where: { slug: 'czapla-wodna' },
    update: {},
    create: {
      name: 'Czapla Wodna',
      slug: 'czapla-wodna',
      description: 'Przestronny apartament z widokiem na jezioro. Doskonały dla miłośników przyrody.',
      amenities: ['WiFi', 'TV', 'Aneks kuchenny', 'Łazienka', 'Taras', 'Przyjazny psom', 'Widok na jezioro'],
    },
  })

  console.log('Created apartments:', czaplaPolna.name, czaplaWodna.name)

  // Create pricing for each apartment
  for (const apartment of [czaplaPolna, czaplaWodna]) {
    await prisma.pricing.upsert({
      where: {
        apartmentId_seasonType: {
          apartmentId: apartment.id,
          seasonType: 'high',
        },
      },
      update: {},
      create: {
        apartmentId: apartment.id,
        seasonType: 'high',
        pricePerNight: 450,
        extraBedPrice: 80,
        minStayNights: 4,
      },
    })

    await prisma.pricing.upsert({
      where: {
        apartmentId_seasonType: {
          apartmentId: apartment.id,
          seasonType: 'low',
        },
      },
      update: {},
      create: {
        apartmentId: apartment.id,
        seasonType: 'low',
        pricePerNight: 350,
        extraBedPrice: 60,
        minStayNights: 3,
      },
    })
  }

  console.log('Created pricing')

  // Create High Season date ranges for 2025
  const highSeasons = [
    { label: 'Sylwester / Nowy Rok', startDate: '2025-01-01', endDate: '2025-01-07' },
    { label: 'Ferie zimowe', startDate: '2025-01-25', endDate: '2025-02-09' },
    { label: 'Wielkanoc', startDate: '2025-04-18', endDate: '2025-04-21' },
    { label: 'Majówka', startDate: '2025-05-01', endDate: '2025-05-04' },
    { label: 'Boże Ciało', startDate: '2025-06-19', endDate: '2025-06-22' },
    { label: 'Wakacje letnie', startDate: '2025-07-01', endDate: '2025-08-31' },
    { label: 'Boże Narodzenie', startDate: '2025-12-23', endDate: '2025-12-31' },
  ]

  // Delete existing seasons and recreate
  await prisma.seasonRange.deleteMany({})

  for (const season of highSeasons) {
    await prisma.seasonRange.create({
      data: {
        label: season.label,
        startDate: new Date(season.startDate),
        endDate: new Date(season.endDate),
      },
    })
  }

  console.log('Created season ranges')

  // Create global settings
  const defaultSettings = [
    { key: 'site_name', value: 'Czaplisko Siedlisko' },
    { key: 'phone', value: '+48 123 456 789' },
    { key: 'email', value: 'kontakt@czaplisko.pl' },
    { key: 'address', value: 'Mazury Zachodnie, Polska' },
    { key: 'facebook_url', value: 'https://facebook.com/czaplisko' },
    { key: 'instagram_url', value: 'https://instagram.com/czaplisko' },
  ]

  for (const setting of defaultSettings) {
    await prisma.globalSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('Created global settings')

  // Create navigation items
  const defaultNav = [
    { label: 'Start', path: '/', order: 0 },
    { label: 'Apartamenty', path: '/apartamenty', order: 1 },
    { label: 'Cennik', path: '/cennik', order: 2 },
    { label: 'Galeria', path: '/galeria', order: 3 },
    { label: 'FAQ', path: '/faq', order: 4 },
    { label: 'Kontakt', path: '/kontakt', order: 5 },
  ]

  // Delete existing nav and recreate
  await prisma.navigationItem.deleteMany({})

  for (const nav of defaultNav) {
    await prisma.navigationItem.create({
      data: nav,
    })
  }

  console.log('Created navigation items')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
