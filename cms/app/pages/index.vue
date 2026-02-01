<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1a2b3c] to-[#4a6b8a] text-white">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center max-w-2xl mx-auto">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Czaplisko Siedlisko</h1>
        <p class="text-xl text-white/80 mb-8">
          Ekologiczny pensjonat przyjazny psom w sercu Mazur Zachodnich
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/admin"
            class="px-8 py-3 bg-[#78b3ce] hover:bg-[#4a6b8a] rounded-lg font-medium transition-colors"
          >
            Panel Administracyjny
          </NuxtLink>
          <a
            href="/"
            class="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
          >
            Strona główna (wkrótce)
          </a>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
        <div class="bg-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
          <p class="text-3xl font-bold">{{ apartments?.length || 0 }}</p>
          <p class="text-white/70">Apartamenty</p>
        </div>
        <div class="bg-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
          <p class="text-3xl font-bold">{{ news?.length || 0 }}</p>
          <p class="text-white/70">Aktualności</p>
        </div>
        <div class="bg-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
          <p class="text-3xl font-bold">{{ media?.length || 0 }}</p>
          <p class="text-white/70">Zdjęcia</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: apartments } = await useFetch('/api/public/apartments')
const { data: newsData } = await useFetch('/api/public/news')
const { data: media } = await useFetch('/api/admin/media')

const news = computed(() => newsData.value?.data || [])
</script>
