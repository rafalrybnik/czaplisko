import { prisma } from '../utils/prisma'

export default defineNitroPlugin(async () => {
  console.log('[init-db] Checking database initialization...')

  try {
    // Check if apartments exist
    const apartmentCount = await prisma.apartment.count()

    if (apartmentCount === 0) {
      console.log('[init-db] No apartments found, seeding database...')

      // Create apartments
      const czaplaPolna = await prisma.apartment.create({
        data: {
          name: 'Czapla Polna',
          slug: 'czapla-polna',
          description: 'Przytulny apartament z widokiem na laki. Idealny dla par i rodzin z dziecmi.',
          amenities: ['WiFi', 'TV', 'Aneks kuchenny', 'Lazienka', 'Taras', 'Przyjazny psom'],
        },
      })

      const czaplaWodna = await prisma.apartment.create({
        data: {
          name: 'Czapla Wodna',
          slug: 'czapla-wodna',
          description: 'Przestronny apartament z widokiem na jezioro. Doskonaly dla milosnikow przyrody.',
          amenities: ['WiFi', 'TV', 'Aneks kuchenny', 'Lazienka', 'Taras', 'Przyjazny psom', 'Widok na jezioro'],
        },
      })

      console.log('[init-db] Created apartments:', czaplaPolna.name, czaplaWodna.name)

      // Create pricing for each apartment
      for (const apartment of [czaplaPolna, czaplaWodna]) {
        await prisma.pricing.create({
          data: {
            apartmentId: apartment.id,
            seasonType: 'high',
            pricePerNight: 450,
            extraBedPrice: 80,
            minStayNights: 4,
          },
        })

        await prisma.pricing.create({
          data: {
            apartmentId: apartment.id,
            seasonType: 'low',
            pricePerNight: 350,
            extraBedPrice: 60,
            minStayNights: 3,
          },
        })
      }

      console.log('[init-db] Created pricing')
    } else {
      console.log(`[init-db] Database already has ${apartmentCount} apartments, skipping seed`)
    }

    // Check if global settings exist
    const settingsCount = await prisma.globalSettings.count()

    if (settingsCount === 0) {
      console.log('[init-db] No global settings found, creating defaults...')

      const defaultSettings = [
        { key: 'site_name', value: 'Czaplisko Siedlisko' },
        { key: 'phone', value: '+48 123 456 789' },
        { key: 'email', value: 'kontakt@czaplisko.pl' },
        { key: 'address', value: 'Mazury Zachodnie, Polska' },
        { key: 'facebook_url', value: 'https://facebook.com/czaplisko' },
        { key: 'instagram_url', value: 'https://instagram.com/czaplisko' },
      ]

      for (const setting of defaultSettings) {
        await prisma.globalSettings.create({
          data: setting,
        })
      }

      console.log('[init-db] Created global settings')
    }

    // Check if season ranges exist
    const seasonCount = await prisma.seasonRange.count()

    if (seasonCount === 0) {
      console.log('[init-db] No season ranges found, creating defaults...')

      const highSeasons = [
        { label: 'Sylwester / Nowy Rok', startDate: new Date('2025-01-01'), endDate: new Date('2025-01-07') },
        { label: 'Ferie zimowe', startDate: new Date('2025-01-25'), endDate: new Date('2025-02-09') },
        { label: 'Wielkanoc', startDate: new Date('2025-04-18'), endDate: new Date('2025-04-21') },
        { label: 'Majowka', startDate: new Date('2025-05-01'), endDate: new Date('2025-05-04') },
        { label: 'Boze Cialo', startDate: new Date('2025-06-19'), endDate: new Date('2025-06-22') },
        { label: 'Wakacje letnie', startDate: new Date('2025-07-01'), endDate: new Date('2025-08-31') },
        { label: 'Boze Narodzenie', startDate: new Date('2025-12-23'), endDate: new Date('2025-12-31') },
      ]

      for (const season of highSeasons) {
        await prisma.seasonRange.create({
          data: season,
        })
      }

      console.log('[init-db] Created season ranges')
    }

    console.log('[init-db] Database initialization complete')
  } catch (error) {
    console.error('[init-db] Error during database initialization:', error)
  }
})
