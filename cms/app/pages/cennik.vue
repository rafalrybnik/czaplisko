<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

useSeoMeta({
  title: 'Cennik | Czaplisko Siedlisko',
  description: 'Sprawdz nasz sezonowy cennik apartamentow. Ceny na sezon letni i zimowy oraz oferty specjalne.',
})

const { get } = usePageContent('pricing')

// Fetch pricing data from API
const { data: pricingData } = await useFetch('/api/public/pricing')
const { data: apartments } = await useFetch('/api/public/apartments')

// Group pricing by season type
const highSeasonPricing = computed(() => {
  if (!pricingData.value?.pricing) return []
  return pricingData.value.pricing.filter((p: any) => p.seasonType === 'high')
})

const lowSeasonPricing = computed(() => {
  if (!pricingData.value?.pricing) return []
  return pricingData.value.pricing.filter((p: any) => p.seasonType === 'low')
})

// Get seasons info
const seasons = computed(() => pricingData.value?.seasons || [])

// Format season dates
function formatSeasonDates(seasonType: string): string {
  if (seasonType === 'high') {
    const highSeasons = seasons.value.filter((s: any) => s.label)
    if (highSeasons.length > 0) {
      return highSeasons.map((s: any) => s.label).join(', ')
    }
    return 'Maj - Wrzesien'
  }
  return 'Pazdziernik - Kwiecien'
}

// Get apartment name
function getApartmentName(apartmentId: string): string {
  const apt = apartments.value?.find((a: any) => a.id === apartmentId)
  return apt?.name || 'Apartament'
}

// Get apartment image
function getApartmentImage(apartmentId: string): string {
  const apt = apartments.value?.find((a: any) => a.id === apartmentId)
  if (apt?.media && apt.media.length > 0) {
    return apt.media[0].urlCompressed || apt.media[0].urlOriginal
  }
  // Placeholder images
  const placeholders = [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=200',
  ]
  const index = apartments.value?.findIndex((a: any) => a.id === apartmentId) || 0
  return placeholders[index % placeholders.length]
}

// Get apartment description
function getApartmentDescription(apartmentId: string): string {
  const apt = apartments.value?.find((a: any) => a.id === apartmentId)
  if (apt?.description) {
    return apt.description.substring(0, 80) + (apt.description.length > 80 ? '...' : '')
  }
  return 'Komfortowy apartament z pelnym wyposazeniem.'
}
</script>

<template>
  <main class="flex-grow bg-white overflow-hidden font-['Montserrat']">
    <!-- Page Header -->
    <section class="bg-gray-50 py-16 md:py-24 px-6 text-center">
      <EditableText
        page="pricing"
        section="header"
        content-key="title"
        tag="h1"
        class="text-4xl md:text-6xl font-light text-[#1a2b3c] tracking-tight mb-4 uppercase"
        fallback="Cennik"
      />
      <EditableText
        page="pricing"
        section="header"
        content-key="subtitle"
        tag="p"
        class="text-[10px] md:text-[12px] tracking-[0.5em] font-bold text-[#78b3ce] uppercase"
        fallback="Sezonowe ceny apartamentow"
      />
      <div class="w-16 h-[1px] bg-gray-200 mx-auto mt-10"></div>
    </section>

    <!-- High Season Section -->
    <section class="relative py-20 md:py-32">
      <div class="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -z-10"></div>

      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <!-- Label Content -->
        <div class="lg:col-span-4 sticky top-32">
          <div class="flex items-center space-x-4 mb-6">
            <i class="fas fa-sun text-[#78b3ce] text-3xl"></i>
            <h2 class="text-5xl md:text-7xl font-light text-gray-800 tracking-tight uppercase">
              Sezon
            </h2>
          </div>
          <EditableText
            page="pricing"
            section="high_season"
            content-key="description"
            tag="p"
            class="text-gray-400 text-sm font-light leading-loose max-w-xs mb-8"
            fallback="Przezyj energie Mazur Zachodnich w pelnym rozkwicie. Dlugie dni, krystalicznie czysta woda i absolutny spokoj."
          />
          <div class="flex space-x-2">
            <div class="w-10 h-[1px] bg-[#78b3ce] mt-3"></div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-gray-300">
              {{ formatSeasonDates('high') }}
            </span>
          </div>
        </div>

        <!-- Pricing Card -->
        <div class="lg:col-span-8">
          <div class="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-6 md:p-12 lg:p-16 relative">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-[#78b3ce]/5 rounded-full blur-3xl -z-10"></div>

            <template v-if="highSeasonPricing.length > 0">
              <div
                v-for="(pricing, index) in highSeasonPricing"
                :key="pricing.id"
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 md:py-8 border-b border-gray-100 last:border-0 gap-4 sm:gap-0 group hover:bg-gray-50/50 transition-colors px-4 -mx-4"
              >
                <div class="flex items-center space-x-6 md:space-x-10 flex-1">
                  <div class="w-16 h-16 md:w-20 md:h-20 overflow-hidden bg-gray-50 flex-shrink-0 shadow-sm">
                    <img
                      :src="getApartmentImage(pricing.apartmentId)"
                      :alt="getApartmentName(pricing.apartmentId)"
                      class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    >
                  </div>
                  <div>
                    <h3 class="text-base md:text-lg font-light text-gray-700 mb-1 tracking-tight">
                      {{ getApartmentName(pricing.apartmentId) }}
                    </h3>
                    <p class="text-[11px] md:text-[12px] text-gray-400 font-light leading-relaxed max-w-sm">
                      {{ getApartmentDescription(pricing.apartmentId) }}
                    </p>
                  </div>
                </div>
                <div class="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                  <span class="text-gray-900 text-lg md:text-xl font-light sm:mb-2">
                    {{ pricing.pricePerNight }} PLN
                  </span>
                  <span
                    v-if="index === 0"
                    class="text-[8px] font-bold tracking-[0.15em] text-white px-3 py-1.5 rounded-[1px] bg-[#78b3ce] uppercase shadow-sm"
                  >
                    POPULAR
                  </span>
                </div>
              </div>
            </template>

            <div v-else class="py-8 text-center text-gray-400">
              <p>Brak dostepnych cen dla sezonu wysokiego.</p>
            </div>

            <!-- Extra info -->
            <div class="mt-8 pt-8 border-t border-gray-100">
              <div class="flex flex-wrap gap-6 text-[11px] text-gray-400">
                <div v-if="highSeasonPricing[0]?.extraBedPrice" class="flex items-center space-x-2">
                  <i class="fas fa-bed text-[#78b3ce]"></i>
                  <span>Dostawka: {{ highSeasonPricing[0].extraBedPrice }} PLN/noc</span>
                </div>
                <div v-if="highSeasonPricing[0]?.minStayNights" class="flex items-center space-x-2">
                  <i class="fas fa-calendar-check text-[#78b3ce]"></i>
                  <span>Min. {{ highSeasonPricing[0].minStayNights }} nocy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Low Season Section -->
    <section class="relative py-20 md:py-32 bg-[#1a2b3c]">
      <EditableBackground
        page="pricing"
        section="low_season"
        content-key="background"
        fallback="https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&q=80&w=1920"
        class="absolute inset-0 overflow-hidden pointer-events-none opacity-10 bg-cover bg-center grayscale"
      />

      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        <!-- Pricing Card -->
        <div class="lg:col-span-8 order-2 lg:order-1">
          <div class="bg-white shadow-2xl p-6 md:p-12 lg:p-16">
            <template v-if="lowSeasonPricing.length > 0">
              <div
                v-for="(pricing, index) in lowSeasonPricing"
                :key="pricing.id"
                class="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 md:py-8 border-b border-gray-100 last:border-0 gap-4 sm:gap-0 group hover:bg-gray-50/50 transition-colors px-4 -mx-4"
              >
                <div class="flex items-center space-x-6 md:space-x-10 flex-1">
                  <div class="w-16 h-16 md:w-20 md:h-20 overflow-hidden bg-gray-50 flex-shrink-0 shadow-sm">
                    <img
                      :src="getApartmentImage(pricing.apartmentId)"
                      :alt="getApartmentName(pricing.apartmentId)"
                      class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    >
                  </div>
                  <div>
                    <h3 class="text-base md:text-lg font-light text-gray-700 mb-1 tracking-tight">
                      {{ getApartmentName(pricing.apartmentId) }}
                    </h3>
                    <p class="text-[11px] md:text-[12px] text-gray-400 font-light leading-relaxed max-w-sm">
                      {{ getApartmentDescription(pricing.apartmentId) }}
                    </p>
                  </div>
                </div>
                <div class="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto mt-2 sm:mt-0">
                  <span class="text-gray-900 text-lg md:text-xl font-light sm:mb-2">
                    {{ pricing.pricePerNight }} PLN
                  </span>
                  <span
                    v-if="index === 0"
                    class="text-[8px] font-bold tracking-[0.15em] text-white px-3 py-1.5 rounded-[1px] bg-[#1a2b3c] uppercase shadow-sm"
                  >
                    HOT DEAL
                  </span>
                </div>
              </div>
            </template>

            <div v-else class="py-8 text-center text-gray-400">
              <p>Brak dostepnych cen dla sezonu niskiego.</p>
            </div>

            <!-- Extra info -->
            <div class="mt-8 pt-8 border-t border-gray-100">
              <div class="flex flex-wrap gap-6 text-[11px] text-gray-400">
                <div v-if="lowSeasonPricing[0]?.extraBedPrice" class="flex items-center space-x-2">
                  <i class="fas fa-bed text-[#78b3ce]"></i>
                  <span>Dostawka: {{ lowSeasonPricing[0].extraBedPrice }} PLN/noc</span>
                </div>
                <div v-if="lowSeasonPricing[0]?.minStayNights" class="flex items-center space-x-2">
                  <i class="fas fa-calendar-check text-[#78b3ce]"></i>
                  <span>Min. {{ lowSeasonPricing[0].minStayNights }} nocy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Label Content -->
        <div class="lg:col-span-4 order-1 lg:order-2 lg:pl-12 sticky top-32">
          <div class="flex items-center space-x-4 mb-6">
            <i class="fas fa-snowflake text-[#78b3ce] text-3xl"></i>
            <h2 class="text-5xl md:text-7xl font-light text-white tracking-tight uppercase">
              Poza <span class="text-[#78b3ce]">Sezonem</span>
            </h2>
          </div>
          <EditableText
            page="pricing"
            section="low_season"
            content-key="description"
            tag="p"
            class="text-gray-400 text-sm font-light leading-loose max-w-xs mb-8"
            fallback="Przytul sie w naszym ekologicznym pensjonacie. Korzystaj ze specjalnych cen poza sezonem i ciesz sie spokojem."
          />
          <div class="flex space-x-2">
            <div class="w-10 h-[1px] bg-[#78b3ce] mt-3"></div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#78b3ce]">
              {{ formatSeasonDates('low') }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Booking CTA -->
    <section class="py-24 text-center">
      <EditableText
        page="pricing"
        section="cta"
        content-key="title"
        tag="h3"
        class="text-3xl font-light text-gray-700 mb-8"
        fallback="Gotowy zarezerwowac wypoczynek?"
      />
      <NuxtLink
        to="/kontakt"
        class="inline-block bg-[#78b3ce] text-white px-12 py-5 text-[11px] tracking-[0.4em] font-bold uppercase hover:bg-[#1a2b3c] transition-all duration-500 shadow-xl hover:shadow-2xl active:scale-95"
      >
        <EditableText
          page="pricing"
          section="cta"
          content-key="button_text"
          tag="span"
          fallback="Skontaktuj sie z nami"
        />
      </NuxtLink>
    </section>
  </main>
</template>
