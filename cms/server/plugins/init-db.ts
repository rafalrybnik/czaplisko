import { prisma } from '../utils/prisma'

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function initDatabase(attempt = 1, maxAttempts = 5): Promise<void> {
  console.log(`[init-db] Checking database initialization (attempt ${attempt}/${maxAttempts})...`)

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

    // Check if navigation exists
    const navCount = await prisma.navigationItem.count()

    if (navCount === 0) {
      console.log('[init-db] No navigation items found, creating defaults...')

      const defaultNav = [
        { label: 'Start', path: '/', order: 0 },
        { label: 'Apartamenty', path: '/apartamenty', order: 1 },
        { label: 'Cennik', path: '/cennik', order: 2 },
        { label: 'Galeria', path: '/galeria', order: 3 },
        { label: 'FAQ', path: '/faq', order: 4 },
        { label: 'Kontakt', path: '/kontakt', order: 5 },
      ]

      for (const nav of defaultNav) {
        await prisma.navigationItem.create({
          data: nav,
        })
      }

      console.log('[init-db] Created navigation items')
    }

    // Check if page content exists
    const contentCount = await prisma.pageContent.count()

    if (contentCount === 0) {
      console.log('[init-db] No page content found, creating defaults...')

      const defaultContent = [
        // Global content (header)
        { page: 'global', section: 'header', key: 'logo', value: 'https://cdn.czapliskosiedlisko.pl/defaults/logo-czaplisko.png', type: 'image' },
        { page: 'global', section: 'social', key: 'facebook', value: 'https://facebook.com/czaplisko', type: 'text' },
        { page: 'global', section: 'social', key: 'instagram', value: 'https://instagram.com/czaplisko', type: 'text' },

        // Home page - Intro section
        { page: 'home', section: 'intro', key: 'label', value: 'Witamy w Czaplisku', type: 'text' },
        { page: 'home', section: 'intro', key: 'title', value: 'Twoja oaza spokoju w sercu Mazur Zachodnich', type: 'text' },
        { page: 'home', section: 'intro', key: 'description', value: 'Przezyj prawdziwa harmonie z natura. Nasz ekologiczny pensjonat oferuje unikalne polaczenie nowoczesnego komfortu i wiejskiego uroku, gdzie kazdy gosc — rowniez ten czworonozny — jest traktowany z krolewska troska.', type: 'text' },

        // Home page - Hero section
        { page: 'home', section: 'hero', key: 'label', value: 'ODKRYJ SPOKOJ', type: 'text' },
        { page: 'home', section: 'hero', key: 'title', value: 'Relaksujace Wakacje', type: 'text' },
        { page: 'home', section: 'hero', key: 'description', value: 'Przezyj niezapomniane chwile na Mazurach Zachodnich. Nasz ekologiczny pensjonat to idealne miejsce na wypoczynek w otoczeniu dziewiczej natury i absolutnego spokoju.', type: 'text' },

        // Home page - Features section
        { page: 'home', section: 'features', key: 'title', value: 'Najlepszy wypoczynek nad jeziorem na Mazurach Zachodnich', type: 'text' },

        // Home page - Hero cards (left side)
        { page: 'home', section: 'hero_cards', key: 'card1_title', value: 'Komfortowe Pokoje', type: 'text' },
        { page: 'home', section: 'hero_cards', key: 'card1_description', value: 'Przestronne apartamenty z widokiem na jezioro i las. Idealne dla rodzin z psami.', type: 'text' },
        { page: 'home', section: 'hero_cards', key: 'card2_title', value: 'Idealne Wakacje', type: 'text' },
        { page: 'home', section: 'hero_cards', key: 'card2_description', value: 'Cisza, spokój i kontakt z natura. Wypoczynek jakiego szukasz.', type: 'text' },
        { page: 'home', section: 'hero_cards', key: 'card3_title', value: 'Ekologia i Natura', type: 'text' },
        { page: 'home', section: 'hero_cards', key: 'card3_description', value: 'Certyfikowany ekologiczny pensjonat. Dbamy o srodowisko.', type: 'text' },

        // Home page - Hero button
        { page: 'home', section: 'hero', key: 'button_text', value: 'Zobacz Apartamenty', type: 'text' },

        // Home page - Features cards (Taras/Pomost)
        { page: 'home', section: 'features_cards', key: 'card1_title', value: 'Taras', type: 'text' },
        { page: 'home', section: 'features_cards', key: 'card1_subtitle', value: 'Z widokiem', type: 'text' },
        { page: 'home', section: 'features_cards', key: 'card2_title', value: 'Pomost', type: 'text' },
        { page: 'home', section: 'features_cards', key: 'card2_subtitle', value: 'Nad jeziorem', type: 'text' },

        // Home page - Features descriptions (4 feature boxes)
        { page: 'home', section: 'features_list', key: 'paw_description', value: 'Pensjonat przyjazny psom. Twoj czworonozny przyjaciel jest u nas mile widziany i moze korzystac z calego terenu.', type: 'text' },
        { page: 'home', section: 'features_list', key: 'leaf_description', value: 'Certyfikowany ekologiczny obiekt. Korzystamy z energii odnawialnej i dbamy o minimalizacje naszego wplywu na srodowisko.', type: 'text' },
        { page: 'home', section: 'features_list', key: 'water_description', value: 'Bezposredni dostep do jeziora z wlasnym pomostem. Idealne miejsce na poranne plywanie lub wieczorny relaks.', type: 'text' },
        { page: 'home', section: 'features_list', key: 'kitchen_description', value: 'W pelni wyposaziona kuchnia w kazdym apartamencie. Lokalne produkty dostepne na zamowienie.', type: 'text' },

        // Home page - Location section
        { page: 'home', section: 'location', key: 'label', value: 'Mazury Zachodnie', type: 'text' },
        { page: 'home', section: 'location', key: 'title', value: 'Odkryj nasza lokalizacje', type: 'text' },
        { page: 'home', section: 'location', key: 'description_1', value: 'Czaplisko Siedlisko znajduje sie w malowniczej wsi Skitlawki, w samym sercu Mazur Zachodnich. Otoczeni lasami i jeziorami, oferujemy ucieczkę od zgiełku miasta.', type: 'text' },
        { page: 'home', section: 'location', key: 'description_2', value: 'Zaledwie 15 minut jazdy od Zalewa i 40 minut od Ostrody. Idealna baza wypadowa do odkrywania regionu — szlaki rowerowe, kajakowe i piesze na wyciagniecie reki.', type: 'text' },

        // Apartments page
        { page: 'apartments', section: 'hero', key: 'title', value: 'Apartamenty', type: 'text' },
        { page: 'apartments', section: 'content', key: 'subtitle', value: 'Wybierz swoj apartament', type: 'text' },

        // Contact page
        { page: 'contact', section: 'hero', key: 'title', value: 'Kontakt', type: 'text' },
        { page: 'contact', section: 'form', key: 'label', value: 'Napisz do nas', type: 'text' },
        { page: 'contact', section: 'form', key: 'title', value: 'Skontaktuj sie', type: 'text' },
        { page: 'contact', section: 'form', key: 'description', value: 'Masz pytania dotyczace rezerwacji lub pobytu? Chcesz dowiedziec sie wiecej o naszym pensjonacie? Napisz do nas, a odpowiemy najszybciej jak to mozliwe.', type: 'text' },
        { page: 'contact', section: 'info', key: 'address_street', value: 'Skitlawki 2A', type: 'text' },
        { page: 'contact', section: 'info', key: 'address_city', value: '14-230 Zalewo', type: 'text' },
        { page: 'contact', section: 'info', key: 'phone', value: '+48 123 456 789', type: 'text' },
        { page: 'contact', section: 'info', key: 'email', value: 'kontakt@czaplisko.pl', type: 'text' },
        { page: 'contact', section: 'info', key: 'region', value: 'Mazury Zachodnie', type: 'text' },
        { page: 'contact', section: 'info', key: 'checkin', value: '15:00 - 20:00', type: 'text' },
        { page: 'contact', section: 'info', key: 'checkout', value: 'do 11:00', type: 'text' },

        // FAQ page
        { page: 'faq', section: 'header', key: 'label', value: 'Pytania i odpowiedzi', type: 'text' },
        { page: 'faq', section: 'header', key: 'title', value: 'FAQ', type: 'text' },
        { page: 'faq', section: 'cta', key: 'title', value: 'Masz wiecej pytan?', type: 'text' },
        { page: 'faq', section: 'cta', key: 'description', value: 'Nasz zespol jest gotowy, aby pomoc Ci zaplanowac idealny pobyt.', type: 'text' },
        { page: 'faq', section: 'cta', key: 'button_text', value: 'Skontaktuj sie', type: 'text' },
        // FAQ items
        { page: 'faq', section: 'items', key: 'q1_question', value: 'Czy przyjmujecie zwierzeta?', type: 'text' },
        { page: 'faq', section: 'items', key: 'q1_answer', value: 'Tak! Jestesmy obiektem "Dog Friendly". Twoi czworononozni przyjaciele sa u nas zawsze mile widziani bez dodatkowych oplat.', type: 'text' },
        { page: 'faq', section: 'items', key: 'q2_question', value: 'Jakie sa godziny zameldowania?', type: 'text' },
        { page: 'faq', section: 'items', key: 'q2_answer', value: 'Doba hotelowa zaczyna sie o godzinie 15:00, a konczy o 11:00 nastepnego dnia.', type: 'text' },
        { page: 'faq', section: 'items', key: 'q3_question', value: 'Czy jest dostepny parking na miejscu?', type: 'text' },
        { page: 'faq', section: 'items', key: 'q3_answer', value: 'Oczywiscie. Zapewniamy bezplatny, monitorowany parking dla wszystkich naszych gosci bezposrednio przy pensjonacie.', type: 'text' },
        { page: 'faq', section: 'items', key: 'q4_question', value: 'Czy oferujecie sniadania?', type: 'text' },
        { page: 'faq', section: 'items', key: 'q4_answer', value: 'Tak, serwujemy pyszne sniadania oparte na lokalnych produktach ekologicznych od 8:00 do 10:30.', type: 'text' },
        { page: 'faq', section: 'items', key: 'q5_question', value: 'Jak daleko jest do najblizszego jeziora?', type: 'text' },
        { page: 'faq', section: 'items', key: 'q5_answer', value: 'Znajdujemy sie w bezposrednim sasiedztwie jeziora - zaledwie 5 minut spaceru przez nasz prywatny ogrod.', type: 'text' },
        { page: 'faq', section: 'items', key: 'q6_question', value: 'Czy apartamenty maja pelne wyposazenie kuchni?', type: 'text' },
        { page: 'faq', section: 'items', key: 'q6_answer', value: 'Tak, kazdy apartament posiada w pelni wyposazony aneks kuchenny z lodowka, kuchenka, czajnikiem i podstawowymi naczyniami.', type: 'text' },
        { page: 'faq', section: 'items', key: 'q7_question', value: 'Czy mozna przyjechac z wiekszym psem?', type: 'text' },
        { page: 'faq', section: 'items', key: 'q7_answer', value: 'Absolutnie tak! Mile widzimy psy kazdej wielkosci. Prosimy tylko o poinformowanie nas z wyprzedzeniem.', type: 'text' },

        // Gallery page
        { page: 'gallery', section: 'hero', key: 'title', value: 'Galeria', type: 'text' },
        { page: 'gallery', section: 'intro', key: 'title', value: 'Odkryj piekno Czaplisko Siedlisko', type: 'text' },
        { page: 'gallery', section: 'intro', key: 'description', value: 'Przegladaj zdjecia naszych apartamentow, otaczajacej natury i udogodnien. Pozwol, ze zabierzemy Cie w wirtualna podroz po naszym ekologicznym pensjonacie.', type: 'text' },
        { page: 'gallery', section: 'cta', key: 'title', value: 'Zarezerwuj swoj pobyt', type: 'text' },
        { page: 'gallery', section: 'cta', key: 'description', value: 'Przekonaj sie sam o uroku naszego pensjonatu. Skontaktuj sie z nami, aby zarezerwowac apartament.', type: 'text' },
        { page: 'gallery', section: 'cta', key: 'button_text', value: 'Kontakt', type: 'text' },

        // Pricing page
        { page: 'pricing', section: 'header', key: 'title', value: 'Cennik', type: 'text' },
        { page: 'pricing', section: 'header', key: 'subtitle', value: 'Sezonowe ceny apartamentow', type: 'text' },
        { page: 'pricing', section: 'high_season', key: 'description', value: 'Przezyj energie Mazur Zachodnich w pelnym rozkwicie. Dlugie dni, krystalicznie czysta woda i absolutny spokoj.', type: 'text' },
        { page: 'pricing', section: 'low_season', key: 'description', value: 'Przytul sie w naszym ekologicznym pensjonacie. Korzystaj ze specjalnych cen poza sezonem i ciesz sie spokojem.', type: 'text' },
        { page: 'pricing', section: 'cta', key: 'title', value: 'Gotowy zarezerwowac wypoczynek?', type: 'text' },
        { page: 'pricing', section: 'cta', key: 'button_text', value: 'Skontaktuj sie z nami', type: 'text' },

        // Footer
        { page: 'footer', section: 'visit', key: 'title', value: 'Odwiedz nas', type: 'text' },
        { page: 'footer', section: 'social', key: 'title', value: 'Social media', type: 'text' },
        { page: 'footer', section: 'address', key: 'line1', value: 'Czaplisko Siedlisko', type: 'text' },
        { page: 'footer', section: 'address', key: 'line2', value: 'Dog Friendly & Eco Guesthouse', type: 'text' },
        { page: 'footer', section: 'address', key: 'street', value: 'Skitlawki 2A', type: 'text' },
        { page: 'footer', section: 'address', key: 'city', value: '14-230 Zalewo', type: 'text' },
        { page: 'footer', section: 'social', key: 'facebook', value: 'https://facebook.com/czaplisko', type: 'text' },
        { page: 'footer', section: 'social', key: 'instagram', value: 'https://instagram.com/czaplisko', type: 'text' },
      ]

      for (const content of defaultContent) {
        await prisma.pageContent.create({
          data: content,
        })
      }

      console.log('[init-db] Created page content')
    }

    console.log('[init-db] Database initialization complete')
  } catch (error) {
    console.error(`[init-db] Error during database initialization (attempt ${attempt}):`, error)

    if (attempt < maxAttempts) {
      const delay = attempt * 2000 // Exponential backoff: 2s, 4s, 6s, 8s
      console.log(`[init-db] Retrying in ${delay / 1000} seconds...`)
      await sleep(delay)
      return initDatabase(attempt + 1, maxAttempts)
    } else {
      console.error('[init-db] Max attempts reached. Database initialization failed.')
    }
  }
}

export default defineNitroPlugin(async () => {
  // Add initial delay to let the database connection stabilize
  await sleep(3000)
  await initDatabase()
})
