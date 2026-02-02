<script setup lang="ts">
const route = useRoute()
const mobileMenuOpen = ref(false)

const { editMode } = useEditMode()
const { get } = usePageContent('global')

// Fetch navigation from API
const { data: navigationData } = await useFetch('/api/public/navigation')

const navItems = computed(() => {
  if (navigationData.value && navigationData.value.length > 0) {
    return navigationData.value.map((item: any) => ({
      name: item.label,
      path: item.path,
    }))
  }
  // Fallback if API fails
  return [
    { name: 'Start', path: '/' },
    { name: 'Apartamenty', path: '/apartamenty' },
    { name: 'Cennik', path: '/cennik' },
    { name: 'Galeria', path: '/galeria' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Kontakt', path: '/kontakt' },
  ]
})

function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

// Close menu on route change
watch(() => route.path, () => {
  closeMobileMenu()
})
</script>

<template>
  <header class="w-full bg-white font-['Montserrat'] sticky top-0 z-[100] shadow-sm md:relative md:shadow-none">
    <!-- Top Utility Bar -->
    <div class="bg-[#4a6b8a] text-white py-2 px-4 md:px-24 flex justify-between items-center text-[11px] font-medium tracking-wider">
      <div class="flex items-center space-x-4 md:space-x-8">
        <!-- <div class="flex items-center space-x-3">
          <span class="font-bold border-b border-white">PL</span>
          <span class="cursor-pointer hover:opacity-70 transition-opacity">EN</span>
        </div> -->
        <!-- <div class="flex items-center space-x-5 border-l border-white/20 pl-4 md:pl-6"> -->
        <div class="flex items-center space-x-5 pl-4 md:pl-6">
            <a href="https://www.facebook.com/czapliskosiedlisko" target="_blank" rel="noopener noreferrer"
            class="hover:text-[#78b3ce] transition-colors duration-300" aria-label="Facebook">
            <i class="fab fa-facebook-f text-[13px]"></i>
          </a>
          <a href="https://www.instagram.com/czapliskosiedliskodogfriendly/" target="_blank" rel="noopener noreferrer"
            class="hover:text-[#78b3ce] transition-colors duration-300" aria-label="Instagram">
            <i class="fab fa-instagram text-[13px]"></i>
          </a>
        </div>
      </div>

      <div class="hidden md:flex items-center space-x-8">
        <NuxtLink to="/apartamenty" class="flex items-center space-x-2 hover:opacity-70 transition-opacity">
          <i class="far fa-star"></i>
          <span class="uppercase text-[10px] font-bold tracking-[0.1em]">APARTAMENTY</span>
        </NuxtLink>
        <NuxtLink to="/kontakt" class="flex items-center space-x-2 hover:opacity-70 transition-opacity">
          <i class="fas fa-map-marker-alt"></i>
          <span class="uppercase text-[10px] font-bold tracking-[0.1em]">KONTAKT</span>
        </NuxtLink>
      </div>

      <!-- Mobile Contact Quick-Link -->
      <div class="md:hidden flex items-center">
        <a href="tel:+48123456789" class="text-white hover:text-[#78b3ce] transition-colors p-1" aria-label="Zadzwon">
          <i class="fas fa-phone-alt"></i>
        </a>
      </div>
    </div>

    <!-- Main Brand Section -->
    <div class="px-6 py-4 md:py-10 flex flex-row md:flex-col items-center justify-between md:justify-center relative bg-white border-b border-gray-50 md:border-none">
      <!-- Logo Section -->
      <NuxtLink v-if="!editMode" to="/" class="flex flex-col items-center group">
        <EditableImage
          page="global"
          section="header"
          content-key="logo"
          fallback="https://cdn.czapliskosiedlisko.pl/defaults/logo-czaplisko.png"
          alt="Czaplisko Siedlisko Logo"
          class="h-14 sm:h-16 md:h-56 lg:h-64 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </NuxtLink>
      <div v-else class="flex flex-col items-center">
        <EditableImage
          page="global"
          section="header"
          content-key="logo"
          fallback="https://cdn.czapliskosiedlisko.pl/defaults/logo-czaplisko.png"
          alt="Czaplisko Siedlisko Logo"
          class="h-14 sm:h-16 md:h-56 lg:h-64 w-auto object-contain"
        />
      </div>

      <!-- Mobile Menu Button -->
      <button
        @click="toggleMobileMenu"
        class="md:hidden relative z-[150] w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full text-[#4a6b8a] shadow-sm active:scale-90 transition-all"
        aria-label="Menu"
      >
        <div class="w-6 h-5 flex flex-col justify-between items-center">
          <span
            class="block w-full h-0.5 bg-current transition-all duration-300"
            :class="{ 'rotate-45 translate-y-2': mobileMenuOpen }"
          ></span>
          <span
            class="block w-full h-0.5 bg-current transition-all duration-300"
            :class="{ 'opacity-0': mobileMenuOpen }"
          ></span>
          <span
            class="block w-full h-0.5 bg-current transition-all duration-300"
            :class="{ '-rotate-45 -translate-y-2': mobileMenuOpen }"
          ></span>
        </div>
      </button>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden md:block border-t border-b border-gray-100 bg-white">
      <div class="max-w-7xl mx-auto px-6 py-4 flex justify-center">
        <ul class="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 text-[13px] font-normal text-gray-500">
          <li v-for="item in navItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              class="hover:text-gray-900 transition-colors uppercase tracking-wider relative group py-2"
              :class="{ 'text-gray-900 font-medium': isActive(item.path) }"
            >
              {{ item.name }}
              <span
                class="absolute bottom-0 left-0 w-full h-0.5 bg-[#78b3ce] transition-transform duration-300 origin-left"
                :class="isActive(item.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'"
              ></span>
            </NuxtLink>
          </li>
          <li class="ml-4">
            <button class="bg-[#78b3ce] text-white px-7 py-2 text-[12px] font-bold uppercase tracking-[0.1em] hover:bg-[#1a2b3c] transition-all shadow-md">
              REZERWUJ
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Mobile Menu Overlay -->
    <div
      class="md:hidden fixed inset-0 z-[140] bg-white transition-all duration-500 ease-in-out transform"
      :class="mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <div class="h-[80px] flex items-center px-6 border-b border-gray-100">
          <span class="text-[#4a6b8a] font-bold text-[14px] tracking-[0.2em] uppercase">Menu</span>
        </div>

        <div class="flex-1 overflow-y-auto px-10 py-12 flex flex-col">
          <ul class="space-y-8">
            <li v-for="item in navItems" :key="item.path">
              <NuxtLink
                :to="item.path"
                @click="closeMobileMenu"
                class="text-[22px] uppercase tracking-[0.2em] block w-full text-left transition-all duration-300"
                :class="isActive(item.path) ? 'text-[#78b3ce] font-bold' : 'text-gray-500 font-light'"
              >
                {{ item.name }}
              </NuxtLink>
            </li>
          </ul>

          <div class="mt-16 space-y-10">
            <button class="w-full bg-[#78b3ce] text-white py-5 font-bold uppercase tracking-[0.4em] text-[12px] shadow-lg">
              REZERWUJ ONLINE
            </button>

            <div class="flex justify-center space-x-12 pb-6">
              <a href="https://facebook.com" target="_blank" class="text-3xl text-gray-300 hover:text-[#4a6b8a] transition-colors">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" class="text-3xl text-gray-300 hover:text-[#78b3ce] transition-colors">
                <i class="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div class="p-10 bg-gray-50 text-center border-t border-gray-100">
          <p class="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Mazury Zachodnie, Polska</p>
          <p class="text-[12px] text-[#4a6b8a] uppercase tracking-[0.2em] mt-2 font-bold">+48 123 456 789</p>
        </div>
      </div>
    </div>
  </header>
</template>
