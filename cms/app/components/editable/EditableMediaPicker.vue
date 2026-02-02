<script setup lang="ts">
interface MediaItem {
  id: string
  urlOriginal: string
  urlCompressed: string
  alt: string | null
  category: string
}

const emit = defineEmits<{
  select: [url: string, alt?: string]
  close: []
}>()

const mediaItems = ref<MediaItem[]>([])
const isLoading = ref(true)
const searchQuery = ref('')
const selectedCategory = ref<string>('all')

const categories = ['all', 'gallery', 'apartment', 'news', 'content']

const filteredMedia = computed(() => {
  let items = mediaItems.value

  if (selectedCategory.value !== 'all') {
    items = items.filter((item) => item.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter((item) =>
      item.alt?.toLowerCase().includes(query) ||
      item.urlOriginal.toLowerCase().includes(query)
    )
  }

  return items
})

async function loadMedia() {
  isLoading.value = true
  try {
    const data = await $fetch<MediaItem[]>('/api/admin/media', {
      credentials: 'include',
    })
    mediaItems.value = data
  } catch (error) {
    console.error('Failed to load media:', error)
  } finally {
    isLoading.value = false
  }
}

function selectMedia(item: MediaItem) {
  emit('select', item.urlCompressed || item.urlOriginal, item.alt ?? undefined)
}

function close() {
  emit('close')
}

// Handle escape key
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

onMounted(() => {
  loadMedia()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div class="media-picker-overlay" @click.self="close">
      <div class="media-picker">
        <div class="media-picker__header">
          <h2>Wybierz obrazek</h2>
          <button type="button" class="media-picker__close" @click="close">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="media-picker__filters">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Szukaj..."
            class="media-picker__search"
          />
          <select v-model="selectedCategory" class="media-picker__category">
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat === 'all' ? 'Wszystkie' : cat }}
            </option>
          </select>
        </div>

        <div v-if="isLoading" class="media-picker__loading">
          Ładowanie...
        </div>

        <div v-else-if="filteredMedia.length === 0" class="media-picker__empty">
          Brak obrazków do wyświetlenia
        </div>

        <div v-else class="media-picker__grid">
          <button
            v-for="item in filteredMedia"
            :key="item.id"
            type="button"
            class="media-picker__item"
            @click="selectMedia(item)"
          >
            <img
              :src="item.urlCompressed || item.urlOriginal"
              :alt="item.alt || 'Obrazek'"
              loading="lazy"
            />
            <span v-if="item.alt" class="media-picker__item-alt">{{ item.alt }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.media-picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.media-picker {
  background: white;
  border-radius: 0.5rem;
  max-width: 900px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.media-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.media-picker__header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.media-picker__close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s;
}

.media-picker__close:hover {
  color: #111827;
}

.media-picker__filters {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.media-picker__search {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.media-picker__search:focus {
  outline: none;
  border-color: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.media-picker__category {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background: white;
}

.media-picker__loading,
.media-picker__empty {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

.media-picker__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  overflow-y: auto;
}

.media-picker__item {
  aspect-ratio: 1;
  border: 2px solid transparent;
  border-radius: 0.375rem;
  overflow: hidden;
  cursor: pointer;
  background: #f3f4f6;
  position: relative;
  transition: border-color 0.2s, transform 0.2s;
}

.media-picker__item:hover {
  border-color: #f59e0b;
  transform: scale(1.02);
}

.media-picker__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-picker__item-alt {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
