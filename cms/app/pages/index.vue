<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

useSeoMeta({
  title: 'Czaplisko Siedlisko | Dog Friendly & Eco Guesthouse',
  description: 'Ekologiczny pensjonat przyjazny psom w sercu Mazur Zachodnich. Nowoczesny komfort w rustykalnym wydaniu.',
})

// Fetch data from API
const { data: apartments } = await useFetch('/api/public/apartments')
const { data: newsResponse } = await useFetch('/api/public/news')

// Page content for inline editing
const { get } = usePageContent('home')

const news = computed(() => newsResponse.value?.data?.slice(0, 3) || [])

// Hero slider logic
const currentSlide = ref(0)
const slides = [
  { image: 'https://cdn.czapliskosiedlisko.pl/defaults/hero-pensjonat.jpg', alt: 'Pensjonat zewnatrz' },
  { image: 'https://cdn.czapliskosiedlisko.pl/defaults/hero-dom-jezioro.jpg', alt: 'Dom nad jeziorem' },
  { image: 'https://cdn.czapliskosiedlisko.pl/defaults/hero-wellness.jpg', alt: 'Wellness i spa' },
  { image: 'https://cdn.czapliskosiedlisko.pl/defaults/hero-wnetrze.jpg', alt: 'Przytulne wnetrze' },
]

let slideInterval: ReturnType<typeof setInterval> | null = null

function goToSlide(index: number) {
  currentSlide.value = index
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000)
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<template>
  <!-- Hero Section -->
  <section class="relative min-h-[600px] md:h-[800px] w-full bg-[#1a2b3c] overflow-hidden flex items-center">
    <!-- Background Image Carousel -->
    <div
      v-for="(slide, index) in slides"
      :key="index"
      class="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
      :class="index === currentSlide ? 'opacity-70' : 'opacity-0'"
    >
      <img
        :src="slide.image"
        :alt="slide.alt"
        class="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear"
        :class="{ 'scale-110': index === currentSlide }"
      >
    </div>

    <!-- Gradient Overlays -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/60 md:from-black/50 via-transparent to-transparent"></div>
    <div class="absolute inset-0 bg-black/10"></div>

    <div class="relative z-10 container mx-auto h-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 py-12 lg:py-0">
      <!-- Left Side: Vertical Tabs -->
      <div class="flex flex-col space-y-4 md:space-y-6 w-full lg:w-[350px] mt-12 lg:mt-0 order-2 lg:order-1">
        <div class="p-6 md:p-8 border-l-4 transition-all duration-500 transform hover:-translate-y-1 bg-white/10 border-[#78b3ce] translate-x-2">
          <EditableText
            page="home"
            section="hero_cards"
            content-key="card1_title"
            tag="h3"
            class="text-white font-bold text-[10px] md:text-[11px] uppercase tracking-[0.25em] mb-2 md:mb-3"
            fallback="Komfortowe Pokoje"
          />
          <EditableText
            page="home"
            section="hero_cards"
            content-key="card1_description"
            tag="p"
            class="text-gray-300 text-[10px] md:text-[11px] leading-relaxed font-light opacity-80"
            fallback="Przestronne apartamenty z widokiem na jezioro i las. Idealne dla rodzin z psami."
          />
        </div>
        <div class="p-6 md:p-8 border-l-4 transition-all duration-500 transform hover:-translate-y-1 bg-white/5 border-transparent hover:bg-white/10">
          <EditableText
            page="home"
            section="hero_cards"
            content-key="card2_title"
            tag="h3"
            class="text-white font-bold text-[10px] md:text-[11px] uppercase tracking-[0.25em] mb-2 md:mb-3"
            fallback="Idealne Wakacje"
          />
          <EditableText
            page="home"
            section="hero_cards"
            content-key="card2_description"
            tag="p"
            class="text-gray-300 text-[10px] md:text-[11px] leading-relaxed font-light opacity-80"
            fallback="Cisza, spokój i kontakt z natura. Wypoczynek jakiego szukasz."
          />
        </div>
        <div class="p-6 md:p-8 border-l-4 transition-all duration-500 transform hover:-translate-y-1 bg-white/5 border-transparent hover:bg-white/10">
          <EditableText
            page="home"
            section="hero_cards"
            content-key="card3_title"
            tag="h3"
            class="text-white font-bold text-[10px] md:text-[11px] uppercase tracking-[0.25em] mb-2 md:mb-3"
            fallback="Ekologia i Natura"
          />
          <EditableText
            page="home"
            section="hero_cards"
            content-key="card3_description"
            tag="p"
            class="text-gray-300 text-[10px] md:text-[11px] leading-relaxed font-light opacity-80"
            fallback="Certyfikowany ekologiczny pensjonat. Dbamy o srodowisko."
          />
        </div>
      </div>

      <!-- Right Side: Main Hero Content -->
      <div class="w-full lg:w-1/2 text-center lg:text-right order-1 lg:order-2">
        <EditableText
          page="home"
          section="hero"
          content-key="label"
          tag="p"
          class="text-[#78b3ce] text-[10px] md:text-[11px] tracking-[0.6em] font-bold uppercase mb-4 animate-pulse"
          fallback="ODKRYJ SPOKOJ"
        />
        <EditableText
          page="home"
          section="hero"
          content-key="title"
          tag="h1"
          class="text-4xl md:text-6xl lg:text-8xl font-light text-white mb-6 md:mb-8 tracking-tight leading-[1.1]"
          fallback="Relaksujace Wakacje"
        />
        <EditableText
          page="home"
          section="hero"
          content-key="description"
          tag="p"
          class="text-[13px] md:text-base font-light leading-relaxed text-gray-200 mb-8 md:mb-12 max-w-lg lg:ml-auto opacity-100 mx-auto lg:mx-0"
          fallback="Przezyj niezapomniane chwile na Mazurach Zachodnich. Nasz ekologiczny pensjonat to idealne miejsce na wypoczynek w otoczeniu dziewiczej natury i absolutnego spokoju."
        />
        <div class="flex flex-col sm:flex-row justify-center lg:justify-end gap-4 md:gap-6">
          <NuxtLink
            to="/apartamenty"
            class="px-10 md:px-14 py-4 md:py-5 border border-white text-[10px] md:text-[11px] tracking-[0.45em] uppercase text-white hover:bg-white hover:text-[#1a2b3c] transition-all duration-500 font-bold"
          >
            <EditableText
              page="home"
              section="hero"
              content-key="button_text"
              tag="span"
              fallback="Zobacz Apartamenty"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Navigation Indicators -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 lg:left-auto lg:right-24 lg:translate-x-0 z-20 flex space-x-4">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        class="group relative h-1 transition-all duration-500"
        :class="index === currentSlide ? 'w-12 bg-[#78b3ce]' : 'w-6 bg-white/40 hover:bg-white/60'"
        :aria-label="`Slajd ${index + 1}`"
      >
        <span class="absolute -top-6 left-0 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
          {{ String(index + 1).padStart(2, '0') }}
        </span>
      </button>
    </div>
  </section>

  <!-- Intro Section -->
  <section class="py-16 md:py-24 bg-white">
    <div class="max-w-4xl mx-auto text-center px-6">
      <EditableText
        page="home"
        section="intro"
        content-key="label"
        tag="p"
        class="text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.5em] font-bold text-[#78b3ce] uppercase mb-4 md:mb-6"
        fallback="Witamy w Czaplisku"
      />
      <EditableText
        page="home"
        section="intro"
        content-key="title"
        tag="h2"
        class="text-3xl md:text-5xl font-light text-gray-700 leading-tight mb-6 md:mb-8"
        fallback="Twoja oaza spokoju w sercu Mazur Zachodnich"
      />
      <EditableText
        page="home"
        section="intro"
        content-key="description"
        tag="p"
        class="text-[13px] md:text-[14px] text-gray-400 font-light leading-relaxed max-w-2xl mx-auto mb-10 md:mb-12"
        fallback="Przezyj prawdziwa harmonie z natura. Nasz ekologiczny pensjonat oferuje unikalne polaczenie nowoczesnego komfortu i wiejskiego uroku, gdzie kazdy gosc — rowniez ten czworonozny — jest traktowany z krolewska troska."
      />
      <div class="flex justify-center gap-6 md:gap-10 opacity-80 text-[#78b3ce]">
        <i class="fas fa-leaf text-2xl md:text-3xl"></i>
        <i class="fas fa-paw text-2xl md:text-3xl"></i>
        <i class="fas fa-solar-panel text-2xl md:text-3xl"></i>
        <i class="fas fa-recycle text-2xl md:text-3xl"></i>
      </div>
    </div>
  </section>

  <!-- Apartments Preview Section -->
  <section class="pb-16 md:pb-24 bg-white">
    <div class="text-center mb-12 md:mb-16">
      <p class="text-[9px] md:text-[10px] tracking-[0.5em] font-bold text-gray-300 uppercase mb-3">Luksusowe Pokoje</p>
      <h2 class="text-4xl md:text-5xl font-light text-gray-600 tracking-tight">Nasze Apartamenty</h2>
      <div class="w-20 h-[1px] bg-[#78b3ce] mx-auto mt-6"></div>
    </div>
    <NuxtLink
      to="/apartamenty"
      class="block mt-12 md:mt-16 w-full h-[350px] md:h-[600px] overflow-hidden relative cursor-pointer group"
    >
      <EditableImage
        page="home"
        section="apartments_preview"
        content-key="image"
        fallback="https://cdn.czapliskosiedlisko.pl/defaults/apartments-preview.jpg"
        alt="Widok apartamentu"
        class="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
      />
      <div class="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700 pointer-events-none"></div>
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span class="bg-white/95 px-8 md:px-12 py-3 md:py-5 text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] font-bold uppercase text-[#1a2b3c] shadow-2xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Odkryj Apartamenty
        </span>
      </div>
    </NuxtLink>
  </section>

  <!-- Features Section -->
  <section class="py-16 md:py-32 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden bg-white">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start mb-16 md:mb-28">
      <div class="lg:col-span-5 text-center lg:text-right lg:pr-12">
        <EditableText
          page="home"
          section="features"
          content-key="title"
          tag="h2"
          class="text-3xl md:text-[48px] font-light text-gray-500 leading-[1.2] tracking-tight"
          fallback="Najlepszy wypoczynek nad jeziorem na Mazurach Zachodnich"
        />
      </div>

      <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        <EditableBackground
          page="home"
          section="features_cards"
          content-key="card1_image"
          fallback="https://cdn.czapliskosiedlisko.pl/defaults/feature-taras.jpg"
          class="relative h-[280px] md:h-[340px] group overflow-hidden shadow-xl bg-cover bg-center"
        >
          <div class="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
          <div class="absolute inset-0 p-8 md:p-12 flex flex-col justify-end pointer-events-none">
            <EditableText
              page="home"
              section="features_cards"
              content-key="card1_title"
              tag="h3"
              class="text-white text-2xl md:text-3xl font-light tracking-wide drop-shadow-md pointer-events-auto"
              fallback="Taras"
            />
            <EditableText
              page="home"
              section="features_cards"
              content-key="card1_subtitle"
              tag="p"
              class="text-[#78b3ce] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] mt-2 drop-shadow-sm pointer-events-auto"
              fallback="Z widokiem"
            />
          </div>
        </EditableBackground>
        <EditableBackground
          page="home"
          section="features_cards"
          content-key="card2_image"
          fallback="https://cdn.czapliskosiedlisko.pl/defaults/feature-pomost.jpg"
          class="relative h-[280px] md:h-[340px] group overflow-hidden shadow-xl bg-cover bg-center"
        >
          <div class="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
          <div class="absolute inset-0 p-8 md:p-12 flex flex-col justify-end pointer-events-none">
            <EditableText
              page="home"
              section="features_cards"
              content-key="card2_title"
              tag="h3"
              class="text-white text-2xl md:text-3xl font-light tracking-wide drop-shadow-md pointer-events-auto"
              fallback="Pomost"
            />
            <EditableText
              page="home"
              section="features_cards"
              content-key="card2_subtitle"
              tag="p"
              class="text-[#78b3ce] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] mt-2 drop-shadow-sm pointer-events-auto"
              fallback="Nad jeziorem"
            />
          </div>
        </EditableBackground>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-12 md:gap-y-20 max-w-5xl mx-auto">
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-10 items-start sm:items-center md:items-start group">
        <div class="flex-shrink-0 w-[60px] h-[60px] md:w-[70px] md:h-[70px] border border-gray-100 flex items-center justify-center p-3 shadow-sm hover:shadow-md transition-all duration-300 rounded-full bg-white">
          <i class="fas fa-paw text-2xl text-[#78b3ce]"></i>
        </div>
        <div>
          <EditableText
            page="home"
            section="features_list"
            content-key="paw_description"
            tag="p"
            class="text-[12px] md:text-[13px] text-gray-400 leading-[1.8] md:leading-[2] mb-3 md:mb-5 font-light"
            fallback="Pensjonat przyjazny psom. Twoj czworonozny przyjaciel jest u nas mile widziany i moze korzystac z calego terenu."
          />
          <NuxtLink
            to="/faq"
            class="text-[9px] md:text-[10px] font-bold tracking-[0.35em] uppercase text-[#1a2b3c] hover:text-[#78b3ce] transition-colors inline-block border-b border-gray-100 pb-1"
          >
            WIECEJ INFO
          </NuxtLink>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-10 items-start sm:items-center md:items-start group">
        <div class="flex-shrink-0 w-[60px] h-[60px] md:w-[70px] md:h-[70px] border border-gray-100 flex items-center justify-center p-3 shadow-sm hover:shadow-md transition-all duration-300 rounded-full bg-white">
          <i class="fas fa-leaf text-2xl text-[#78b3ce]"></i>
        </div>
        <div>
          <EditableText
            page="home"
            section="features_list"
            content-key="leaf_description"
            tag="p"
            class="text-[12px] md:text-[13px] text-gray-400 leading-[1.8] md:leading-[2] mb-3 md:mb-5 font-light"
            fallback="Certyfikowany ekologiczny obiekt. Korzystamy z energii odnawialnej i dbamy o minimalizacje naszego wplywu na srodowisko."
          />
          <NuxtLink
            to="/faq"
            class="text-[9px] md:text-[10px] font-bold tracking-[0.35em] uppercase text-[#1a2b3c] hover:text-[#78b3ce] transition-colors inline-block border-b border-gray-100 pb-1"
          >
            WIECEJ INFO
          </NuxtLink>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-10 items-start sm:items-center md:items-start group">
        <div class="flex-shrink-0 w-[60px] h-[60px] md:w-[70px] md:h-[70px] border border-gray-100 flex items-center justify-center p-3 shadow-sm hover:shadow-md transition-all duration-300 rounded-full bg-white">
          <i class="fas fa-water text-2xl text-[#78b3ce]"></i>
        </div>
        <div>
          <EditableText
            page="home"
            section="features_list"
            content-key="water_description"
            tag="p"
            class="text-[12px] md:text-[13px] text-gray-400 leading-[1.8] md:leading-[2] mb-3 md:mb-5 font-light"
            fallback="Bezposredni dostep do jeziora z wlasnym pomostem. Idealne miejsce na poranne plywanie lub wieczorny relaks."
          />
          <NuxtLink
            to="/kontakt"
            class="text-[9px] md:text-[10px] font-bold tracking-[0.35em] uppercase text-[#1a2b3c] hover:text-[#78b3ce] transition-colors inline-block border-b border-gray-100 pb-1"
          >
            WIECEJ INFO
          </NuxtLink>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-10 items-start sm:items-center md:items-start group">
        <div class="flex-shrink-0 w-[60px] h-[60px] md:w-[70px] md:h-[70px] border border-gray-100 flex items-center justify-center p-3 shadow-sm hover:shadow-md transition-all duration-300 rounded-full bg-white">
          <i class="fas fa-utensils text-2xl text-[#78b3ce]"></i>
        </div>
        <div>
          <EditableText
            page="home"
            section="features_list"
            content-key="kitchen_description"
            tag="p"
            class="text-[12px] md:text-[13px] text-gray-400 leading-[1.8] md:leading-[2] mb-3 md:mb-5 font-light"
            fallback="W pelni wyposaziona kuchnia w kazdym apartamencie. Lokalne produkty dostepne na zamowienie."
          />
          <NuxtLink
            to="/apartamenty"
            class="text-[9px] md:text-[10px] font-bold tracking-[0.35em] uppercase text-[#1a2b3c] hover:text-[#78b3ce] transition-colors inline-block border-b border-gray-100 pb-1"
          >
            WIECEJ INFO
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>

  <!-- Location Section -->
  <section class="bg-[#1a2b3c] flex flex-col lg:flex-row min-h-screen lg:min-h-[700px]">
    <EditableBackground
      page="home"
      section="location"
      content-key="image"
      fallback="https://cdn.czapliskosiedlisko.pl/defaults/location-map.jpg"
      class="lg:w-1/2 relative min-h-[300px] md:min-h-[450px] lg:min-h-full bg-cover bg-center"
    >
      <div class="absolute inset-0 bg-black/20 lg:bg-black/10 pointer-events-none"></div>
    </EditableBackground>

    <div class="lg:w-1/2 p-10 md:p-16 lg:p-24 flex flex-col justify-center text-white">
      <EditableText
        page="home"
        section="location"
        content-key="label"
        tag="p"
        class="text-[9px] md:text-[10px] tracking-[0.5em] uppercase font-bold text-[#78b3ce] mb-6"
        fallback="Mazury Zachodnie"
      />
      <EditableText
        page="home"
        section="location"
        content-key="title"
        tag="h2"
        class="text-4xl md:text-5xl lg:text-6xl font-light mb-8 md:mb-12 tracking-tight leading-tight"
        fallback="Odkryj nasza lokalizacje"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 text-[12px] md:text-[13px] leading-[1.8] md:leading-[2] text-gray-300 font-light">
        <EditableText
          page="home"
          section="location"
          content-key="description_1"
          tag="p"
          fallback="Czaplisko Siedlisko znajduje sie w malowniczej wsi Skitlawki, w samym sercu Mazur Zachodnich. Otoczeni lasami i jeziorami, oferujemy ucieczkę od zgiełku miasta."
        />
        <EditableText
          page="home"
          section="location"
          content-key="description_2"
          tag="p"
          fallback="Zaledwie 15 minut jazdy od Zalewa i 40 minut od Ostrody. Idealna baza wypadowa do odkrywania regionu — szlaki rowerowe, kajakowe i piesze na wyciagniecie reki."
        />
      </div>

      <div class="mt-12 md:mt-16 pt-8 md:pt-10 border-t border-white/10">
        <NuxtLink
          to="/kontakt"
          class="text-[9px] md:text-[10px] tracking-[0.4em] uppercase border-b border-white/30 pb-2 hover:border-[#78b3ce] hover:text-[#78b3ce] transition-all inline-block"
        >
          Zobacz na mapie
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- News Section -->
  <section v-if="news.length > 0" class="py-16 md:py-32 bg-white overflow-hidden">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16 md:mb-28">
        <EditableText
          page="home"
          section="news"
          content-key="title"
          tag="h2"
          class="text-4xl md:text-[54px] font-light text-gray-600 mb-5 tracking-tight"
          fallback="Aktualnosci"
        />
        <EditableText
          page="home"
          section="news"
          content-key="label"
          tag="p"
          class="text-[9px] md:text-[10px] tracking-[0.7em] text-gray-300 font-bold uppercase"
          fallback="- BLOG -"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-[1200px] mx-auto">
        <article
          v-for="item in news"
          :key="item.id"
          class="bg-white border border-gray-50 shadow-sm relative group overflow-visible"
        >
          <div v-if="item.featureImage" class="relative h-48 overflow-hidden">
            <img
              :src="item.featureImage"
              :alt="item.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            >
          </div>
          <div class="p-8 md:p-10">
            <p class="text-[9px] uppercase tracking-[0.3em] text-[#78b3ce] font-bold mb-4">Aktualnosci</p>
            <h3 class="text-xl md:text-2xl font-light mb-4 text-gray-700 leading-tight">{{ item.title }}</h3>
            <p v-if="item.excerpt" class="text-[12px] md:text-[13px] leading-[1.8] text-gray-400 font-light mb-6">
              {{ item.excerpt }}
            </p>
            <div class="flex items-center text-[10px] text-gray-300 font-bold border-t border-gray-50 pt-6">
              <span class="flex items-center space-x-2">
                <i class="far fa-calendar"></i>
                <span>{{ new Date(item.publishedAt).toLocaleDateString('pl-PL') }}</span>
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
