<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

const route = useRoute()
const slug = route.params.slug as string

const { data: apartment, error } = await useFetch(`/api/public/apartments/${slug}`)

if (error.value || !apartment.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Apartament nie zostal znaleziony',
  })
}

useSeoMeta({
  title: `${apartment.value.name} | Czaplisko Siedlisko`,
  description: apartment.value.description?.substring(0, 160) || `Apartament ${apartment.value.name} w pensjonacie Czaplisko Siedlisko`,
})

// Gallery handling
const currentImageIndex = ref(0)
const lightboxOpen = ref(false)

const galleryImages = computed(() => {
  if (apartment.value?.media && apartment.value.media.length > 0) {
    return apartment.value.media.map((m: any) => ({
      src: m.urlCompressed || m.urlOriginal,
      alt: m.alt || apartment.value?.name,
    }))
  }
  return [
    { src: 'https://cdn.czapliskosiedlisko.pl/defaults/gallery-1.jpg', alt: 'Pokoj glowny' },
    { src: 'https://cdn.czapliskosiedlisko.pl/defaults/apartment-bathroom.jpg', alt: 'Lazienka' },
    { src: 'https://cdn.czapliskosiedlisko.pl/defaults/apartment-bedroom.jpg', alt: 'Sypialnia' },
    { src: 'https://cdn.czapliskosiedlisko.pl/defaults/apartment-view.jpg', alt: 'Widok' },
  ]
})

const currentImage = computed(() => galleryImages.value[currentImageIndex.value])

function selectImage(index: number) {
  currentImageIndex.value = index
}

function openLightbox() {
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % galleryImages.value.length
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

// Keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (!lightboxOpen.value) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') prevImage()
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})

// Parse amenities
const amenities = computed(() => {
  if (!apartment.value?.amenities) return []
  if (Array.isArray(apartment.value.amenities)) return apartment.value.amenities
  try {
    return JSON.parse(apartment.value.amenities)
  } catch {
    return []
  }
})

// Amenity icons mapping
const amenityIcons: Record<string, string> = {
  'WiFi': 'fas fa-wifi',
  'TV': 'fas fa-tv',
  'Kuchnia': 'fas fa-utensils',
  'Lazienka': 'fas fa-bath',
  'Taras': 'fas fa-umbrella-beach',
  'Parking': 'fas fa-parking',
  'Grill': 'fas fa-fire',
  'Klimatyzacja': 'fas fa-snowflake',
  'Ogrzewanie': 'fas fa-temperature-high',
  'Pralka': 'fas fa-tshirt',
  'Psy mile widziane': 'fas fa-paw',
  'default': 'fas fa-check',
}

function getAmenityIcon(amenity: string): string {
  return amenityIcons[amenity] || amenityIcons['default']
}
</script>

<template>
  <main class="flex-grow bg-white font-['Montserrat']">
    <section class="py-12 md:py-20 px-6 max-w-7xl mx-auto">
      <!-- Title Section -->
      <div class="mb-10">
        <h1 class="text-3xl md:text-5xl font-light text-gray-700 tracking-wide mb-2">
          {{ apartment.name }}
        </h1>
        <div class="flex items-center text-gray-400 text-xs tracking-widest uppercase">
          <span class="mr-4">Czaplisko Siedlisko</span>
          <div class="flex text-[#78b3ce] space-x-0.5 text-sm">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Left Column: Gallery & Details -->
        <div class="lg:col-span-2">
          <!-- Main Gallery Image -->
          <div
            class="relative w-full h-[400px] sm:h-[500px] bg-black mb-1 overflow-hidden group cursor-pointer"
            @click="openLightbox"
          >
            <img
              :src="currentImage.src"
              :alt="currentImage.alt"
              class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            >
            <div class="absolute bottom-4 right-4 text-white/70 hover:text-white transition-colors">
              <i class="fas fa-expand text-2xl"></i>
            </div>
          </div>

          <!-- Thumbnails -->
          <div v-if="galleryImages.length > 1" class="grid grid-cols-4 gap-1 mb-12">
            <div
              v-for="(image, index) in galleryImages.slice(0, 4)"
              :key="index"
              class="h-24 cursor-pointer overflow-hidden transition-opacity"
              :class="index === currentImageIndex ? 'opacity-100 border-2 border-[#78b3ce]' : 'opacity-60 hover:opacity-100 border-2 border-transparent'"
              @click="selectImage(index)"
            >
              <img :src="image.src" :alt="image.alt" class="w-full h-full object-cover">
            </div>
          </div>

          <!-- Info Bar Icons -->
          <div class="flex flex-wrap border-b border-gray-100 pb-10 mb-10 justify-around sm:justify-between gap-y-8">
            <div class="flex flex-col items-center text-center w-1/2 sm:w-auto">
              <div class="w-12 h-12 text-gray-300 text-3xl mb-3 flex items-center justify-center">
                <i class="far fa-user"></i>
              </div>
              <span class="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-[0.1em] uppercase">
                4 Gosci
              </span>
            </div>
            <div class="flex flex-col items-center text-center w-1/2 sm:w-auto">
              <div class="w-12 h-12 text-gray-300 text-3xl mb-3 flex items-center justify-center">
                <i class="far fa-square"></i>
              </div>
              <span class="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-[0.1em] uppercase">
                40 m²
              </span>
            </div>
            <div v-if="apartment.pricing && apartment.pricing.length > 0" class="flex flex-col items-center text-center w-1/2 sm:w-auto">
              <div class="w-12 h-12 text-gray-300 text-3xl mb-3 flex items-center justify-center">
                <i class="fas fa-bed"></i>
              </div>
              <span class="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-[0.1em] uppercase">
                {{ apartment.pricing[0]?.pricePerNight }} PLN / Noc
              </span>
            </div>
            <div class="flex flex-col items-center text-center w-1/2 sm:w-auto">
              <div class="w-12 h-12 text-gray-300 text-3xl mb-3 flex items-center justify-center">
                <i class="fas fa-paw"></i>
              </div>
              <span class="text-[10px] sm:text-[11px] font-bold text-gray-400 tracking-[0.1em] uppercase">
                Dog Friendly
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-6 text-gray-400 text-[13px] sm:text-[14px] font-light leading-7 sm:leading-8 mb-16">
            <p>{{ apartment.description }}</p>
          </div>

          <!-- Amenities -->
          <div v-if="amenities.length > 0" class="border-t border-gray-100 pt-10">
            <h2 class="text-2xl sm:text-3xl font-light text-gray-700 mb-8 sm:mb-10">Udogodnienia</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
              <div
                v-for="amenity in amenities"
                :key="amenity"
                class="flex items-center space-x-4"
              >
                <i :class="getAmenityIcon(amenity)" class="text-gray-300 text-xl w-6 text-center"></i>
                <span class="text-[11px] sm:text-[12px] font-bold text-gray-400 tracking-wider">
                  {{ amenity }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Booking Widget -->
        <div class="lg:col-span-1">
          <div class="bg-[#5d6c7b] p-8 text-white text-center sticky top-28">
            <div class="mb-8">
              <p class="text-[9px] tracking-[0.2em] font-bold uppercase opacity-60 mb-4">Zarezerwuj pobyt</p>
              <p class="text-lg font-light">
                Skontaktuj sie z nami, aby zarezerwowac ten apartament
              </p>
            </div>

            <div v-if="apartment.pricing && apartment.pricing.length > 0" class="mb-8 border-t border-white/10 pt-8">
              <p class="text-[9px] tracking-[0.2em] font-bold uppercase opacity-60 mb-2">Cena od</p>
              <p class="text-4xl font-light">
                {{ apartment.pricing[0]?.pricePerNight }} <span class="text-lg">PLN</span>
              </p>
              <p class="text-[10px] opacity-60 mt-1">za noc</p>
            </div>

            <NuxtLink
              to="/kontakt"
              class="block w-full bg-[#78b3ce] hover:bg-[#9dcfe6] text-white font-bold py-4 text-[11px] tracking-[0.2em] uppercase transition-colors shadow-lg text-center"
            >
              Kontakt
            </NuxtLink>

            <a
              href="tel:+48123456789"
              class="block w-full mt-4 border border-white/30 hover:bg-white/10 text-white font-bold py-4 text-[11px] tracking-[0.2em] uppercase transition-colors text-center"
            >
              +48 123 456 789
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center"
        @click.self="closeLightbox"
      >
        <!-- Close Button -->
        <button
          class="absolute top-6 right-6 text-white/50 hover:text-white text-4xl transition-colors z-[1010]"
          @click="closeLightbox"
        >
          <i class="fas fa-times"></i>
        </button>

        <!-- Navigation - Left -->
        <button
          class="absolute left-4 md:left-8 text-white/30 hover:text-white text-5xl transition-all hover:scale-110 z-[1010]"
          @click.stop="prevImage"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <!-- Main Image Container -->
        <div class="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center">
          <img
            :src="currentImage.src"
            :alt="currentImage.alt"
            class="max-w-full max-h-[85vh] object-contain shadow-2xl"
          >
          <!-- Image Counter -->
          <div class="mt-4 text-white/50 text-[11px] font-bold tracking-[0.5em] uppercase">
            {{ currentImageIndex + 1 }} / {{ galleryImages.length }}
          </div>
        </div>

        <!-- Navigation - Right -->
        <button
          class="absolute right-4 md:right-8 text-white/30 hover:text-white text-5xl transition-all hover:scale-110 z-[1010]"
          @click.stop="nextImage"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </Teleport>
  </main>
</template>
