<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

useSeoMeta({
  title: 'Galeria | Czaplisko Siedlisko',
  description: 'Zobacz zdjecia naszego ekologicznego pensjonatu, apartamentow, otaczajacej natury i udogodnien na Mazurach Zachodnich.',
})

const { get } = usePageContent('gallery')

// Fetch gallery images from API
const { data: galleryData } = await useFetch('/api/public/gallery')

const galleryImages = computed(() => {
  if (galleryData.value && galleryData.value.length > 0) {
    return galleryData.value.map((m: any) => ({
      src: m.urlCompressed || m.urlOriginal,
      alt: m.alt || 'Galeria Czaplisko Siedlisko',
    }))
  }
  // Placeholder images
  return [
    { src: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200', alt: 'Galeria 1' },
    { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200', alt: 'Galeria 2' },
    { src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200', alt: 'Galeria 3' },
    { src: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200', alt: 'Galeria 4' },
    { src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=1200', alt: 'Galeria 5' },
    { src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200', alt: 'Galeria 6' },
    { src: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1200', alt: 'Galeria 7' },
    { src: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1200', alt: 'Galeria 8' },
  ]
})

// Lightbox state
const lightboxOpen = ref(false)
const currentImageIndex = ref(0)

const currentImage = computed(() => galleryImages.value[currentImageIndex.value])

function openLightbox(index: number) {
  currentImageIndex.value = index
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
</script>

<template>
  <main class="flex-grow bg-white overflow-hidden font-['Montserrat']">
    <!-- Gallery Hero -->
    <EditableBackground
      page="gallery"
      section="hero"
      content-key="background"
      fallback="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1920"
      class="relative h-[300px] md:h-[500px] w-full overflow-hidden bg-cover bg-center"
    >
      <div class="absolute inset-0 bg-black/20 pointer-events-none"></div>
      <div class="relative z-10 h-full flex items-center justify-center">
        <EditableText
          page="gallery"
          section="hero"
          content-key="title"
          tag="h1"
          class="text-5xl md:text-8xl font-light text-white tracking-[0.1em] md:tracking-[0.2em] uppercase opacity-90"
          fallback="Galeria"
        />
      </div>
    </EditableBackground>

    <!-- Intro Section -->
    <section class="py-16 md:py-24 px-6 max-w-7xl mx-auto">
      <div class="text-center">
        <EditableText
          page="gallery"
          section="intro"
          content-key="title"
          tag="h2"
          class="text-3xl md:text-4xl lg:text-5xl font-light text-gray-500 leading-tight tracking-tight mb-6"
          fallback="Odkryj piekno Czaplisko Siedlisko"
        />
        <EditableText
          page="gallery"
          section="intro"
          content-key="description"
          tag="p"
          class="text-gray-400 text-sm md:text-base font-light max-w-2xl mx-auto"
          fallback="Przegladaj zdjecia naszych apartamentow, otaczajacej natury i udogodnien. Pozwol, ze zabierzemy Cie w wirtualna podroz po naszym ekologicznym pensjonacie."
        />
        <div class="w-16 h-[1px] bg-[#78b3ce] mx-auto mt-8"></div>
      </div>
    </section>

    <!-- Image Grid -->
    <section class="pb-16 md:pb-24">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-0.5">
        <div
          v-for="(image, index) in galleryImages"
          :key="index"
          class="aspect-square overflow-hidden group cursor-pointer relative"
          @click="openLightbox(index)"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          >
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <i class="fas fa-search-plus text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 text-2xl"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 md:py-32 bg-[#1a2b3c] text-center">
      <EditableText
        page="gallery"
        section="cta"
        content-key="title"
        tag="h3"
        class="text-3xl md:text-4xl font-light text-white mb-6"
        fallback="Zarezerwuj swoj pobyt"
      />
      <EditableText
        page="gallery"
        section="cta"
        content-key="description"
        tag="p"
        class="text-gray-400 text-sm font-light max-w-xl mx-auto mb-10 px-6"
        fallback="Przekonaj sie sam o uroku naszego pensjonatu. Skontaktuj sie z nami, aby zarezerwowac apartament."
      />
      <NuxtLink
        to="/kontakt"
        class="inline-block bg-[#78b3ce] text-white px-12 py-5 text-[11px] tracking-[0.4em] font-bold uppercase hover:bg-white hover:text-[#1a2b3c] transition-all duration-500 shadow-xl"
      >
        <EditableText
          page="gallery"
          section="cta"
          content-key="button_text"
          tag="span"
          fallback="Kontakt"
        />
      </NuxtLink>
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
