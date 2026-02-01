<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Cennik</h1>

    <!-- Pricing Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apartament</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sezon</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cena/noc</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dostawka</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min. nocy</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Akcje</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="price in pricing" :key="price.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {{ price.apartment?.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="price.seasonType === 'high' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'"
                >
                  {{ price.seasonType === 'high' ? 'Wysoki' : 'Niski' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-900">{{ price.pricePerNight }} zł</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ price.extraBedPrice }} zł</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ price.minStayNights }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <button
                  @click="editPrice(price)"
                  class="text-[#78b3ce] hover:text-[#4a6b8a] font-medium"
                >
                  Edytuj
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Season Ranges -->
    <div class="bg-white rounded-xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-900">Zakresy sezonu wysokiego</h2>
        <button
          @click="showAddSeason = true"
          class="px-4 py-2 bg-[#78b3ce] text-white rounded-lg hover:bg-[#4a6b8a] transition-colors"
        >
          + Dodaj zakres
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="season in seasons"
          :key="season.id"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div>
            <p class="font-medium text-gray-900">{{ season.label }}</p>
            <p class="text-sm text-gray-500">
              {{ formatDate(season.startDate) }} - {{ formatDate(season.endDate) }}
            </p>
          </div>
          <div class="flex gap-2">
            <button @click="editSeason(season)" class="text-[#78b3ce] hover:text-[#4a6b8a]">
              Edytuj
            </button>
            <button @click="deleteSeason(season.id)" class="text-red-500 hover:text-red-700">
              Usuń
            </button>
          </div>
        </div>
      </div>

      <p v-if="seasons?.length === 0" class="text-gray-500 text-center py-8">
        Brak zdefiniowanych zakresów. Wszystkie daty są traktowane jako sezon niski.
      </p>
    </div>

    <!-- Edit Price Modal -->
    <div v-if="editingPrice" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Edytuj cennik: {{ editingPrice.apartment?.name }} ({{ editingPrice.seasonType === 'high' ? 'wysoki' : 'niski' }})
        </h3>

        <form @submit.prevent="savePrice" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cena za noc (zł)</label>
            <input
              v-model.number="priceForm.pricePerNight"
              type="number"
              min="0"
              step="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dostawka (zł)</label>
            <input
              v-model.number="priceForm.extraBedPrice"
              type="number"
              min="0"
              step="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Minimalna liczba nocy</label>
            <input
              v-model.number="priceForm.minStayNights"
              type="number"
              min="1"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none"
            />
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="editingPrice = null"
              class="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              :disabled="savingPrice"
              class="flex-1 py-2 px-4 bg-[#78b3ce] text-white rounded-lg hover:bg-[#4a6b8a] transition-colors disabled:opacity-50"
            >
              {{ savingPrice ? 'Zapisywanie...' : 'Zapisz' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Season Modal -->
    <div v-if="showAddSeason || editingSeason" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingSeason ? 'Edytuj zakres' : 'Dodaj zakres sezonu wysokiego' }}
        </h3>

        <form @submit.prevent="saveSeason" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nazwa</label>
            <input
              v-model="seasonForm.label"
              type="text"
              placeholder="np. Wakacje letnie"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Od</label>
              <input
                v-model="seasonForm.startDate"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Do</label>
              <input
                v-model="seasonForm.endDate"
                type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div v-if="seasonError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {{ seasonError }}
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="closeSeasonModal"
              class="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              :disabled="savingSeason"
              class="flex-1 py-2 px-4 bg-[#78b3ce] text-white rounded-lg hover:bg-[#4a6b8a] transition-colors disabled:opacity-50"
            >
              {{ savingSeason ? 'Zapisywanie...' : 'Zapisz' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

const { data: pricing, refresh: refreshPricing } = await useFetch('/api/admin/pricing')
const { data: seasons, refresh: refreshSeasons } = await useFetch('/api/admin/seasons')

// Price editing
const editingPrice = ref<any>(null)
const savingPrice = ref(false)
const priceForm = reactive({
  pricePerNight: 0,
  extraBedPrice: 0,
  minStayNights: 1,
})

function editPrice(price: any) {
  editingPrice.value = price
  priceForm.pricePerNight = Number(price.pricePerNight)
  priceForm.extraBedPrice = Number(price.extraBedPrice)
  priceForm.minStayNights = price.minStayNights
}

async function savePrice() {
  savingPrice.value = true
  try {
    await $fetch(`/api/admin/pricing/${editingPrice.value.id}`, {
      method: 'PUT',
      body: priceForm,
    })
    await refreshPricing()
    editingPrice.value = null
  } catch (e) {
    console.error(e)
  } finally {
    savingPrice.value = false
  }
}

// Season editing
const showAddSeason = ref(false)
const editingSeason = ref<any>(null)
const savingSeason = ref(false)
const seasonError = ref('')
const seasonForm = reactive({
  label: '',
  startDate: '',
  endDate: '',
})

function editSeason(season: any) {
  editingSeason.value = season
  seasonForm.label = season.label
  seasonForm.startDate = season.startDate.split('T')[0]
  seasonForm.endDate = season.endDate.split('T')[0]
}

function closeSeasonModal() {
  showAddSeason.value = false
  editingSeason.value = null
  seasonError.value = ''
  seasonForm.label = ''
  seasonForm.startDate = ''
  seasonForm.endDate = ''
}

async function saveSeason() {
  savingSeason.value = true
  seasonError.value = ''

  try {
    if (editingSeason.value) {
      await $fetch(`/api/admin/seasons/${editingSeason.value.id}`, {
        method: 'PUT',
        body: seasonForm,
      })
    } else {
      await $fetch('/api/admin/seasons', {
        method: 'POST',
        body: seasonForm,
      })
    }
    await refreshSeasons()
    closeSeasonModal()
  } catch (e: any) {
    seasonError.value = e.data?.message || 'Wystąpił błąd'
  } finally {
    savingSeason.value = false
  }
}

async function deleteSeason(id: string) {
  if (!confirm('Czy na pewno chcesz usunąć ten zakres?')) return

  try {
    await $fetch(`/api/admin/seasons/${id}`, { method: 'DELETE' })
    await refreshSeasons()
  } catch (e) {
    console.error(e)
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
</script>
