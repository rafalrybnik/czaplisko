<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

useSeoMeta({
  title: 'Apartamenty | Czaplisko Siedlisko',
  description: 'Odkryj nasze luksusowe apartamenty w ekologicznym pensjonacie na Mazurach Zachodnich. Nowoczesny komfort i wiejski urok.',
})

const { data: apartments } = await useFetch('/api/public/apartments')

// Placeholder images for apartments without media
const placeholderImages = [
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
]

function getApartmentImage(apartment: any, index: number): string {
  if (apartment.media && apartment.media.length > 0) {
    return apartment.media[0].urlCompressed || apartment.media[0].urlOriginal
  }
  return placeholderImages[index % placeholderImages.length]
}
</script>

<template>
  <!-- Hero Banner -->
  <section class="relative h-[450px] w-full overflow-hidden">
    <div
      class="absolute inset-0 bg-cover bg-center"
      style="background-image: url('https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1920');"
    >
      <div class="absolute inset-0 bg-black/20"></div>
    </div>

    <div class="relative z-10 h-full flex items-center justify-center">
      <h1 class="text-6xl md:text-7xl font-light text-white tracking-[0.15em] uppercase">
        Apartamenty
      </h1>
    </div>

    <div class="absolute bottom-0 w-full h-[1px] bg-white/20"></div>
  </section>

  <!-- Content Section -->
  <section class="py-32 px-6 max-w-7xl mx-auto">
    <div class="text-center mb-20">
      <h2 class="text-4xl font-light text-gray-500 mb-4">Wybierz swoj apartament</h2>
      <div class="w-20 h-[1px] bg-[#78b3ce] mx-auto"></div>
    </div>

    <div v-if="apartments && apartments.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div
        v-for="(apartment, index) in apartments"
        :key="apartment.id"
        class="group cursor-pointer"
      >
        <NuxtLink :to="`/apartamenty/${apartment.slug}`">
          <div class="overflow-hidden h-72 mb-6 shadow-sm">
            <img
              :src="getApartmentImage(apartment, index)"
              :alt="apartment.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            >
          </div>
        </NuxtLink>
        <h3 class="text-xl font-light text-gray-700 mb-2">{{ apartment.name }}</h3>
        <p
          v-if="apartment.pricing && apartment.pricing.length > 0"
          class="text-[10px] tracking-widest text-gray-400 font-bold uppercase mb-4"
        >
          Od {{ apartment.pricing[0]?.pricePerNight }} PLN / Noc
        </p>
        <NuxtLink
          :to="`/apartamenty/${apartment.slug}`"
          class="text-[10px] tracking-[0.3em] font-bold text-[#78b3ce] border-b border-transparent hover:border-[#78b3ce] transition-all uppercase inline-block pb-1"
        >
          Zobacz szczegoly
        </NuxtLink>
      </div>
    </div>

    <div v-else class="text-center text-gray-400">
      <p>Brak dostepnych apartamentow.</p>
    </div>
  </section>
</template>
