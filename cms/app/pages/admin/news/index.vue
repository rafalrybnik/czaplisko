<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Aktualności</h1>
      <NuxtLink
        to="/admin/news/create"
        class="px-4 py-2 bg-[#78b3ce] text-white rounded-lg hover:bg-[#4a6b8a] transition-colors"
      >
        + Nowa aktualność
      </NuxtLink>
    </div>

    <!-- Filter -->
    <div class="mb-6">
      <div class="inline-flex bg-gray-100 rounded-lg p-1">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="activeFilter = filter.value"
          class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
          :class="activeFilter === filter.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <!-- News List -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div v-if="filteredNews.length === 0" class="p-8 text-center text-gray-500">
        Brak aktualności
      </div>

      <div v-else class="divide-y">
        <div
          v-for="item in filteredNews"
          :key="item.id"
          class="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
        >
          <!-- Feature Image -->
          <div class="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            <img
              v-if="item.featureImage"
              :src="item.featureImage"
              :alt="item.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              <IconNews class="w-8 h-8" />
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-gray-900 truncate">{{ item.title }}</h3>
            <p class="text-sm text-gray-500 line-clamp-1">{{ item.excerpt || stripHtml(item.content) }}</p>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-xs text-gray-400">{{ formatDate(item.createdAt) }}</span>
              <span
                class="px-2 py-0.5 text-xs rounded-full"
                :class="item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
              >
                {{ item.status === 'published' ? 'Opublikowany' : 'Szkic' }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="toggleStatus(item)"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              :title="item.status === 'published' ? 'Ukryj' : 'Opublikuj'"
            >
              <svg v-if="item.status === 'published'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <NuxtLink
              :to="`/admin/news/${item.id}`"
              class="p-2 text-gray-400 hover:text-[#78b3ce] rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </NuxtLink>
            <button
              @click="deleteNews(item.id)"
              class="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { data: news, refresh } = await useFetch('/api/admin/news')

const filters = [
  { label: 'Wszystkie', value: 'all' },
  { label: 'Opublikowane', value: 'published' },
  { label: 'Szkice', value: 'draft' },
]

const activeFilter = ref('all')

const filteredNews = computed(() => {
  if (!news.value) return []
  if (activeFilter.value === 'all') return news.value
  return news.value.filter((n: any) => n.status === activeFilter.value)
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '').slice(0, 100)
}

async function toggleStatus(item: any) {
  try {
    await $fetch(`/api/admin/news/${item.id}`, {
      method: 'PUT',
      body: { status: item.status === 'published' ? 'draft' : 'published' },
    })
    await refresh()
  } catch (e) {
    console.error(e)
  }
}

async function deleteNews(id: string) {
  if (!confirm('Czy na pewno chcesz usunąć tę aktualność?')) return

  try {
    await $fetch(`/api/admin/news/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (e) {
    console.error(e)
  }
}
</script>
