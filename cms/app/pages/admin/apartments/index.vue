<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Apartamenty</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="apartment in apartments"
        :key="apartment.id"
        class="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <!-- Apartment Image -->
        <div class="h-48 bg-gray-200 relative">
          <img
            v-if="apartment.media?.[0]"
            :src="apartment.media[0].urlCompressed"
            :alt="apartment.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <IconPhoto class="w-12 h-12" />
          </div>
        </div>

        <!-- Apartment Info -->
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ apartment.name }}</h2>
          <p class="text-gray-600 text-sm line-clamp-2 mb-4">{{ apartment.description }}</p>

          <!-- Amenities -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span
              v-for="amenity in apartment.amenities?.slice(0, 4)"
              :key="amenity"
              class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {{ amenity }}
            </span>
            <span
              v-if="apartment.amenities?.length > 4"
              class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              +{{ apartment.amenities.length - 4 }}
            </span>
          </div>

          <!-- Pricing Summary -->
          <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <p class="text-gray-500">Sezon niski</p>
              <p class="font-semibold text-gray-900">
                {{ getPricing(apartment, 'low')?.pricePerNight || '-' }} zł/noc
              </p>
            </div>
            <div>
              <p class="text-gray-500">Sezon wysoki</p>
              <p class="font-semibold text-gray-900">
                {{ getPricing(apartment, 'high')?.pricePerNight || '-' }} zł/noc
              </p>
            </div>
          </div>

          <NuxtLink
            :to="`/admin/apartments/${apartment.id}`"
            class="block w-full text-center py-2 px-4 bg-[#78b3ce] text-white rounded-lg hover:bg-[#4a6b8a] transition-colors"
          >
            Edytuj apartament
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

const { data: apartments } = await useFetch('/api/admin/apartments')

function getPricing(apartment: any, seasonType: string) {
  return apartment.pricing?.find((p: any) => p.seasonType === seasonType)
}
</script>
