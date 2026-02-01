<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/news" class="text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Nowa aktualność</h1>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                placeholder="Tytuł aktualności..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Zajawka (opcjonalnie)</label>
              <textarea
                v-model="form.excerpt"
                rows="2"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none resize-none"
                placeholder="Krótki opis wyświetlany na liście..."
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Treść</label>
              <textarea
                v-model="form.content"
                rows="12"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none resize-none font-mono text-sm"
                placeholder="Treść aktualności (HTML dozwolony)..."
              />
              <p class="text-xs text-gray-500 mt-1">
                Możesz używać znaczników HTML: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;h2&gt;, &lt;h3&gt;
              </p>
            </div>

            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {{ error }}
            </div>

            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="saving"
                class="flex-1 py-3 px-4 bg-[#78b3ce] hover:bg-[#4a6b8a] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {{ saving ? 'Zapisywanie...' : 'Zapisz jako szkic' }}
              </button>
              <button
                type="button"
                :disabled="saving"
                @click="handlePublish"
                class="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Opublikuj
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
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Wskazówki</h2>
          <ul class="text-sm text-gray-600 space-y-2">
            <li>• Tytuł powinien być zwięzły i opisowy</li>
            <li>• Zajawka wyświetla się na liście aktualności</li>
            <li>• Treść może zawierać podstawowe formatowanie HTML</li>
            <li>• Obraz główny wyświetla się jako miniatura</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const router = useRouter()
const fileInput = ref<HTMLInputElement>()

const form = reactive({
  title: '',
  excerpt: '',
  content: '',
  featureImage: '',
  status: 'draft' as 'draft' | 'published',
})

const saving = ref(false)
const uploading = ref(false)
const error = ref('')

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
  form.status = 'draft'
  await save()
}

async function handlePublish() {
  form.status = 'published'
  await save()
}

async function save() {
  saving.value = true
  error.value = ''

  try {
    const response = await $fetch<{ id: string }>('/api/admin/news', {
      method: 'POST',
      body: form,
    })
    await router.push(`/admin/news/${response.id}`)
  } catch (e: any) {
    error.value = e.data?.message || 'Wystąpił błąd podczas zapisywania'
  } finally {
    saving.value = false
  }
}
</script>
