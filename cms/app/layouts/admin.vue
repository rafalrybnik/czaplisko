<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-[#1a2b3c] text-white transform transition-transform duration-200 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <NuxtLink to="/admin" class="text-lg font-semibold">
          Czaplisko CMS
        </NuxtLink>
        <button class="lg:hidden" @click="sidebarOpen = false">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="p-4 space-y-1">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
          :class="isActive(item.to) ? 'bg-[#78b3ce] text-white' : 'text-gray-300 hover:bg-white/10'"
        >
          <component :is="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </NuxtLink>

        <div class="pt-4 mt-4 border-t border-white/10">
          <a
            href="/"
            target="_blank"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Strona główna
          </a>
        </div>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-8 h-8 bg-[#78b3ce] rounded-full flex items-center justify-center">
            {{ user?.email?.charAt(0).toUpperCase() }}
          </div>
          <span class="text-sm truncate">{{ user?.email }}</span>
        </div>
        <button
          class="w-full px-3 py-2 text-sm text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
          @click="handleLogout"
        >
          Wyloguj się
        </button>
      </div>
    </aside>

    <!-- Mobile header -->
    <div class="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b h-16 flex items-center px-4">
      <button @click="sidebarOpen = true">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <span class="ml-4 font-semibold">Czaplisko CMS</span>
    </div>

    <!-- Main content -->
    <main class="lg:ml-64 min-h-screen pt-16 lg:pt-0">
      <div class="p-6">
        <slot />
      </div>
    </main>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { user, logout } = useAuth()
const sidebarOpen = ref(false)

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'IconHome' },
  { to: '/admin/apartments', label: 'Apartamenty', icon: 'IconBuilding' },
  { to: '/admin/pricing', label: 'Cennik', icon: 'IconCurrency' },
  { to: '/admin/news', label: 'Aktualności', icon: 'IconNews' },
  { to: '/admin/media', label: 'Media', icon: 'IconPhoto' },
  { to: '/admin/navigation', label: 'Nawigacja', icon: 'IconMenu' },
]

function isActive(path: string) {
  if (path === '/admin') {
    return route.path === '/admin'
  }
  return route.path.startsWith(path)
}

async function handleLogout() {
  await logout()
}

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>
