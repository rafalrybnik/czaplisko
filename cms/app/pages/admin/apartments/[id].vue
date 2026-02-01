<template>
  <div>
    <div class="flex items-center gap-4 mb-6">
      <NuxtLink to="/admin/apartments" class="text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-gray-900">Edycja apartamentu</h1>
    </div>

    <div v-if="apartment" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Form -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Informacje podstawowe</h2>

          <form @submit.prevent="handleSave" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nazwa</label>
              <input
                v-model="form.name"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Opis</label>
              <textarea
                v-model="form.description"
                rows="6"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Udogodnienia</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="(amenity, index) in form.amenities"
                  :key="index"
                  class="px-3 py-1 bg-[#78b3ce]/10 text-[#4a6b8a] rounded-full text-sm flex items-center gap-2"
                >
                  {{ amenity }}
                  <button type="button" @click="removeAmenity(index)" class="hover:text-red-500">
                    &times;
                  </button>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="newAmenity"
                  type="text"
                  placeholder="Dodaj udogodnienie..."
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none"
                  @keydown.enter.prevent="addAmenity"
                />
                <button
                  type="button"
                  @click="addAmenity"
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Dodaj
                </button>
              </div>
            </div>

            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {{ error }}
            </div>

            <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              Zapisano pomyślnie!
            </div>

            <button
              type="submit"
              :disabled="saving"
              class="w-full py-3 px-4 bg-[#78b3ce] hover:bg-[#4a6b8a] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {{ saving ? 'Zapisywanie...' : 'Zapisz zmiany' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Gallery Preview -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Galeria</h2>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="media in apartment.media?.slice(0, 4)"
              :key="media.id"
              class="aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <img :src="media.urlCompressed" :alt="media.alt" class="w-full h-full object-cover" />
            </div>
          </div>
          <NuxtLink
            :to="`/admin/media?apartmentId=${apartment.id}`"
            class="block w-full text-center mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Zarządzaj galerią
          </NuxtLink>
        </div>

        <!-- Pricing Summary -->
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Cennik</h2>
          <div class="space-y-3">
            <div v-for="pricing in apartment.pricing" :key="pricing.id" class="p-3 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">
                {{ pricing.seasonType === 'high' ? 'Sezon wysoki' : 'Sezon niski' }}
              </p>
              <p class="font-semibold text-gray-900">{{ pricing.pricePerNight }} zł/noc</p>
              <p class="text-xs text-gray-500">
                Dostawka: {{ pricing.extraBedPrice }} zł | Min. {{ pricing.minStayNights }} nocy
              </p>
            </div>
          </div>
          <NuxtLink
            to="/admin/pricing"
            class="block w-full text-center mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Edytuj cennik
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

const route = useRoute()
const id = route.params.id as string

const { data: apartment, refresh } = await useFetch(`/api/admin/apartments/${id}`)

const form = reactive({
  name: apartment.value?.name || '',
  description: apartment.value?.description || '',
  amenities: [...(apartment.value?.amenities || [])] as string[],
})

const newAmenity = ref('')
const saving = ref(false)
const error = ref('')
const success = ref(false)

watch(apartment, (val) => {
  if (val) {
    form.name = val.name
    form.description = val.description
    form.amenities = [...(val.amenities || [])]
  }
})

function addAmenity() {
  if (newAmenity.value.trim()) {
    form.amenities.push(newAmenity.value.trim())
    newAmenity.value = ''
  }
}

function removeAmenity(index: number) {
  form.amenities.splice(index, 1)
}

async function handleSave() {
  saving.value = true
  error.value = ''
  success.value = false

  try {
    await $fetch(`/api/admin/apartments/${id}`, {
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
</script>
