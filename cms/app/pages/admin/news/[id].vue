<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/news" class="text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Edycja aktualności</h1>
    </div>

    <div v-if="newsItem" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tytuł</label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Zajawka (opcjonalnie)</label>
              <textarea
                v-model="form.excerpt"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Treść</label>
              <textarea
                v-model="form.content"
                rows="12"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none resize-none font-mono text-sm"
              />
            </div>

            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {{ error }}
            </div>

            <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              Zapisano pomyślnie!
            </div>

            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 py-3 px-4 bg-[#78b3ce] hover:bg-[#4a6b8a] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Zapisywanie...' : 'Zapisz zmiany' }}
              </button>
              <button
                type="button"
                :disabled="saving"
                @click="togglePublish"
                class="py-3 px-6 font-medium rounded-lg transition-colors disabled:opacity-50"
                :class="newsItem.status === 'published' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-600 text-white hover:bg-green-700'"
              >
                {{ newsItem.status === 'published' ? 'Ukryj' : 'Opublikuj' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Obraz główny</h2>
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#78b3ce] transition-colors cursor-pointer"
            @click="triggerFileInput"
          >
            <div v-if="form.featureImage" class="relative">
              <img :src="form.featureImage" class="w-full rounded-lg" />
              <button
                type="button"
                @click.stop="form.featureImage = ''"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div v-else>
              <IconPhoto class="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p class="text-gray-500 text-sm">Kliknij aby dodać obraz</p>
            </div>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileUpload"
          />
          <p v-if="uploading" class="text-sm text-gray-500 mt-2 text-center">Przesyłanie...</p>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Status:</span>
              <span
                class="px-2 py-0.5 rounded-full text-xs"
                :class="newsItem.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
              >
                {{ newsItem.status === 'published' ? 'Opublikowany' : 'Szkic' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Utworzono:</span>
              <span>{{ formatDate(newsItem.createdAt) }}</span>
            </div>
            <div v-if="newsItem.publishedAt" class="flex justify-between">
              <span class="text-gray-500">Opublikowano:</span>
              <span>{{ formatDate(newsItem.publishedAt) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Slug:</span>
              <span class="font-mono text-xs">{{ newsItem.slug }}</span>
            </div>
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

const route = useRoute()
const id = route.params.id as string

const { data: newsItem, refresh } = await useFetch(`/api/admin/news/${id}`)

const fileInput = ref<HTMLInputElement>()

const form = reactive({
  title: newsItem.value?.title || '',
  excerpt: newsItem.value?.excerpt || '',
  content: newsItem.value?.content || '',
  featureImage: newsItem.value?.featureImage || '',
})

const saving = ref(false)
const uploading = ref(false)
const error = ref('')
const success = ref(false)

watch(newsItem, (val) => {
  if (val) {
    form.title = val.title
    form.excerpt = val.excerpt || ''
    form.content = val.content
    form.featureImage = val.featureImage || ''
  }
})

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', 'news')

    const response = await $fetch<{ urlCompressed: string }>('/api/admin/media/upload', {
      method: 'POST',
      body: formData,
    })

    form.featureImage = response.urlCompressed
  } catch (e) {
    console.error(e)
    error.value = 'Błąd podczas przesyłania obrazu'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

async function handleSubmit() {
  saving.value = true
  error.value = ''
  success.value = false

  try {
    await $fetch(`/api/admin/news/${id}`, {
      method: 'PUT',
      body: form,
    })
    success.value = true
    await refresh()
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (e: any) {
    error.value = e.data?.message || 'Wystąpił błąd podczas zapisywania'
  } finally {
    saving.value = false
  }
}

async function togglePublish() {
  saving.value = true
  try {
    await $fetch(`/api/admin/news/${id}`, {
      method: 'PUT',
      body: { status: newsItem.value?.status === 'published' ? 'draft' : 'published' },
    })
    await refresh()
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
