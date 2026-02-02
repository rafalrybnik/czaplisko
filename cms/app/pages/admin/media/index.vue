<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Media</h1>
      <button
        @click="triggerFileInput"
        class="px-4 py-2 bg-[#78b3ce] text-white rounded-lg hover:bg-[#4a6b8a] transition-colors"
      >
        + Dodaj zdjęcie
      </button>
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileUpload"
      />
    </div>

    <!-- Hero Slider Section -->
    <div class="bg-white rounded-xl p-6 shadow-sm mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Slider Hero (strona główna)</h2>
      <p class="text-sm text-gray-500 mb-4">Wybierz 4 zdjęcia do karuzeli na stronie głównej</p>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="idx in 4"
          :key="idx"
          class="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-[#78b3ce] transition-colors cursor-pointer group"
          @click="openHeroImageSelector(idx)"
        >
          <img
            v-if="heroImages[idx]"
            :src="heroImages[idx]"
            :alt="`Hero image ${idx}`"
            class="w-full h-full object-cover"
          />
          <div v-else class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-gray-400">
              <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-xs">Zdjęcie {{ idx }}</span>
            </div>
          </div>
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span class="text-white text-sm font-medium">Zmień</span>
          </div>
          <div v-if="heroImages[idx]" class="absolute top-2 right-2">
            <button
              @click.stop="removeHeroImage(idx)"
              class="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Image Selector Modal -->
    <div
      v-if="heroSelectorOpen"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click="heroSelectorOpen = false"
    >
      <div
        class="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <div class="p-4 border-b flex items-center justify-between">
          <h3 class="text-lg font-semibold">Wybierz zdjęcie do slidera {{ selectedHeroSlot }}</h3>
          <button @click="heroSelectorOpen = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <div v-if="!media?.length" class="text-center text-gray-500 py-8">
            Brak zdjęć w bibliotece. Dodaj zdjęcia najpierw.
          </div>
          <div v-else class="grid grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="item in media"
              :key="item.id"
              class="aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#78b3ce] transition-all"
              @click="selectHeroImage(item)"
            >
              <img
                :src="item.urlCompressed"
                :alt="item.alt || 'Image'"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-4 mb-6">
      <div class="inline-flex bg-gray-100 rounded-lg p-1">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="activeCategory = cat.value"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="activeCategory === cat.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
        >
          {{ cat.label }}
        </button>
      </div>

      <select
        v-if="apartments?.length"
        v-model="selectedApartment"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none"
      >
        <option value="">Wszystkie apartamenty</option>
        <option v-for="apt in apartments" :key="apt.id" :value="apt.id">
          {{ apt.name }}
        </option>
      </select>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-blue-700">Przesyłanie {{ uploadProgress }} plików...</p>
    </div>

    <!-- Upload Error -->
    <div v-if="uploadError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-700">{{ uploadError }}</p>
      <button @click="uploadError = ''" class="text-sm text-red-500 underline mt-2">Zamknij</button>
    </div>

    <!-- Media Grid -->
    <div v-if="filteredMedia.length === 0" class="bg-white rounded-xl p-12 text-center text-gray-500 shadow-sm">
      <IconPhoto class="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p>Brak zdjęć w tej kategorii</p>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div
        v-for="item in filteredMedia"
        :key="item.id"
        class="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="aspect-square">
          <img
            :src="item.urlCompressed"
            :alt="item.alt || 'Image'"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            @click="openLightbox(item)"
            class="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            @click="deleteMedia(item.id)"
            class="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <!-- Category Badge -->
        <div class="absolute top-2 left-2">
          <span class="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
            {{ getCategoryLabel(item.category) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div
      v-if="lightboxImage"
      class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      @click="lightboxImage = null"
    >
      <button
        class="absolute top-4 right-4 text-white hover:text-gray-300"
        @click="lightboxImage = null"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        :src="lightboxImage.urlOriginal"
        :alt="lightboxImage.alt"
        class="max-w-full max-h-full object-contain"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const route = useRoute()

const { data: media, refresh } = await useFetch('/api/admin/media')
const { data: apartments } = await useFetch('/api/admin/apartments')
const { data: heroContent, refresh: refreshHeroContent } = await useFetch<Record<string, { value: string }>>('/api/public/content/home')

const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')
const lightboxImage = ref<any>(null)

// Hero slider state
const heroSelectorOpen = ref(false)
const selectedHeroSlot = ref(1)
const heroImages = computed(() => {
  const images: Record<number, string> = {}
  for (let i = 1; i <= 4; i++) {
    images[i] = heroContent.value?.hero_slider?.[`image_${i}`]?.value || ''
  }
  return images
})

function openHeroImageSelector(slot: number) {
  selectedHeroSlot.value = slot
  heroSelectorOpen.value = true
}

async function selectHeroImage(item: any) {
  try {
    await $fetch('/api/admin/content', {
      method: 'POST',
      body: {
        page: 'home',
        section: 'hero_slider',
        key: `image_${selectedHeroSlot.value}`,
        value: item.urlCompressed,
        type: 'image',
      },
    })
    await refreshHeroContent()
    heroSelectorOpen.value = false
  } catch (e) {
    console.error('Failed to save hero image:', e)
  }
}

async function removeHeroImage(slot: number) {
  try {
    await $fetch('/api/admin/content', {
      method: 'POST',
      body: {
        page: 'home',
        section: 'hero_slider',
        key: `image_${slot}`,
        value: '',
        type: 'image',
      },
    })
    await refreshHeroContent()
  } catch (e) {
    console.error('Failed to remove hero image:', e)
  }
}

const categories = [
  { label: 'Wszystkie', value: '' },
  { label: 'Galeria', value: 'gallery' },
  { label: 'Apartamenty', value: 'apartment' },
  { label: 'Aktualności', value: 'news' },
]

const activeCategory = ref(route.query.category as string || '')
const selectedApartment = ref(route.query.apartmentId as string || '')

const filteredMedia = computed(() => {
  if (!media.value) return []
  return media.value.filter((item: any) => {
    if (activeCategory.value && item.category !== activeCategory.value) return false
    if (selectedApartment.value && item.apartmentId !== selectedApartment.value) return false
    return true
  })
})

function getCategoryLabel(category: string) {
  const cat = categories.find(c => c.value === category)
  return cat?.label || category
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || files.length === 0) return

  uploading.value = true
  uploadProgress.value = files.length
  uploadError.value = ''

  for (const file of files) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', activeCategory.value || 'gallery')
      if (selectedApartment.value) {
        formData.append('apartmentId', selectedApartment.value)
      }

      await $fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
      })
    } catch (e: any) {
      console.error('Upload failed:', e)
      uploadError.value = e.data?.message || e.message || 'Błąd podczas przesyłania pliku'
    }
  }

  await refresh()
  uploading.value = false
  input.value = ''
}

async function deleteMedia(id: string) {
  if (!confirm('Czy na pewno chcesz usunąć to zdjęcie?')) return

  try {
    await $fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e) {
    console.error(e)
  }
}

function openLightbox(item: any) {
  lightboxImage.value = item
}
</script>
