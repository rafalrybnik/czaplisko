<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white rounded-xl p-6 shadow-sm"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
          </div>
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center"
            :class="stat.bgColor"
          >
            <component :is="stat.icon" class="w-6 h-6" :class="stat.iconColor" />
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl p-6 shadow-sm mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Szybkie akcje</h2>
      <div class="flex flex-wrap gap-3">
        <NuxtLink
          to="/admin/news/create"
          class="px-4 py-2 bg-[#78b3ce] text-white rounded-lg hover:bg-[#4a6b8a] transition-colors"
        >
          + Nowa aktualność
        </NuxtLink>
        <NuxtLink
          to="/admin/media"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Zarządzaj galerią
        </NuxtLink>
        <NuxtLink
          to="/admin/pricing"
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Edytuj cennik
        </NuxtLink>
      </div>
    </div>

    <!-- Recent News -->
    <div class="bg-white rounded-xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Ostatnie aktualności</h2>
        <NuxtLink to="/admin/news" class="text-[#78b3ce] hover:underline text-sm">
          Zobacz wszystkie
        </NuxtLink>
      </div>

      <div v-if="news.length === 0" class="text-gray-500 text-center py-8">
        Brak aktualności
      </div>

      <div v-else class="divide-y">
        <div
          v-for="item in news"
          :key="item.id"
          class="py-3 flex items-center justify-between"
        >
          <div>
            <p class="font-medium text-gray-900">{{ item.title }}</p>
            <p class="text-sm text-gray-500">
              {{ formatDate(item.createdAt) }}
              <span
                class="ml-2 px-2 py-0.5 text-xs rounded-full"
                :class="item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
              >
                {{ item.status === 'published' ? 'Opublikowany' : 'Szkic' }}
              </span>
            </p>
          </div>
          <NuxtLink
            :to="`/admin/news/${item.id}`"
            class="text-[#78b3ce] hover:underline text-sm"
          >
            Edytuj
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { data: apartmentsData } = await useFetch('/api/admin/apartments')
const { data: newsData } = await useFetch('/api/admin/news')
const { data: mediaData } = await useFetch('/api/admin/media')

const apartments = computed(() => apartmentsData.value || [])
const news = computed(() => (newsData.value || []).slice(0, 5))
const media = computed(() => mediaData.value || [])

const stats = computed(() => [
  {
    label: 'Apartamenty',
    value: apartments.value.length,
    icon: 'IconBuilding',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Aktualności',
    value: newsData.value?.length || 0,
    icon: 'IconNews',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    label: 'Zdjęcia',
    value: media.value.length,
    icon: 'IconPhoto',
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    label: 'Opublikowane',
    value: newsData.value?.filter((n: any) => n.status === 'published').length || 0,
    icon: 'IconNews',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
])

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>
