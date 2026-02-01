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

const fileInput = ref<HTMLInputElement>()
const uploading = ref(false)
const uploadProgress = ref(0)
const lightboxImage = ref<any>(null)

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
    } catch (e) {
      console.error('Upload failed:', e)
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
