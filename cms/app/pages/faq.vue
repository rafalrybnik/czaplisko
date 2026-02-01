<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

useSeoMeta({
  title: 'FAQ | Czaplisko Siedlisko',
  description: 'Najczesciej zadawane pytania o pensjonacie Czaplisko Siedlisko. Dowiedz sie o polityce dla zwierzat, godzinach zameldowania, parkingu i sniadaniach.',
})

// FAQ items - could be fetched from API in the future
const faqItems = ref([
  {
    question: 'Czy przyjmujecie zwierzeta?',
    answer: 'Tak! Jestesmy obiektem "Dog Friendly". Twoi czworononozni przyjaciele sa u nas zawsze mile widziani bez dodatkowych oplat.',
    open: false,
  },
  {
    question: 'Jakie sa godziny zameldowania?',
    answer: 'Doba hotelowa zaczyna sie o godzinie 15:00, a konczy o 11:00 nastepnego dnia.',
    open: false,
  },
  {
    question: 'Czy jest dostepny parking na miejscu?',
    answer: 'Oczywiscie. Zapewniamy bezplatny, monitorowany parking dla wszystkich naszych gosci bezposrednio przy pensjonacie.',
    open: false,
  },
  {
    question: 'Czy oferujecie sniadania?',
    answer: 'Tak, serwujemy pyszne sniadania oparte na lokalnych produktach ekologicznych od 8:00 do 10:30.',
    open: false,
  },
  {
    question: 'Jak daleko jest do najblizszego jeziora?',
    answer: 'Znajdujemy sie w bezposrednim sasiedztwie jeziora - zaledwie 5 minut spaceru przez nasz prywatny ogrod.',
    open: false,
  },
  {
    question: 'Czy apartamenty maja pelne wyposazenie kuchni?',
    answer: 'Tak, kazdy apartament posiada w pelni wyposazony aneks kuchenny z lodowka, kuchenka, czajnikiem i podstawowymi naczyniami.',
    open: false,
  },
  {
    question: 'Czy mozna przyjechac z wiekszym psem?',
    answer: 'Absolutnie tak! Mile widzimy psy kazdej wielkosci. Prosimy tylko o poinformowanie nas z wyprzedzeniem.',
    open: false,
  },
])

function toggleFaq(index: number) {
  faqItems.value[index].open = !faqItems.value[index].open
}
</script>

<template>
  <main class="flex-grow bg-white font-['Montserrat']">
    <div class="bg-white py-24 px-6 max-w-3xl mx-auto">
      <div class="text-center mb-16">
        <p class="text-[10px] tracking-[0.6em] font-bold text-[#78b3ce] uppercase mb-4">Pytania i odpowiedzi</p>
        <h1 class="text-5xl font-light text-gray-700 tracking-tight">FAQ</h1>
        <div class="w-16 h-[1px] bg-gray-200 mx-auto mt-8"></div>
      </div>

      <div class="space-y-4">
        <div
          v-for="(item, index) in faqItems"
          :key="index"
          class="border-b border-gray-100 py-6"
        >
          <button
            class="w-full flex justify-between items-center text-left"
            @click="toggleFaq(index)"
          >
            <span class="text-lg font-light text-gray-700 tracking-tight">{{ item.question }}</span>
            <span class="text-[#78b3ce] transition-transform duration-300" :class="{ 'rotate-45': item.open }">
              <i class="fas fa-plus"></i>
            </span>
          </button>
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            leave-active-class="transition-all duration-200 ease-in"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-40"
            leave-from-class="opacity-100 max-h-40"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-if="item.open" class="overflow-hidden mt-4">
              <p class="text-[14px] text-gray-400 font-light leading-relaxed">
                {{ item.answer }}
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <div class="mt-20 bg-gray-50 p-12 text-center">
        <h3 class="text-xl font-light text-gray-600 mb-4">Masz wiecej pytan?</h3>
        <p class="text-sm text-gray-400 mb-8">Nasz zespol jest gotowy, aby pomoc Ci zaplanowac idealny pobyt.</p>
        <NuxtLink
          to="/kontakt"
          class="inline-block bg-[#1a2b3c] text-white px-10 py-4 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-[#78b3ce] transition-all"
        >
          Skontaktuj sie
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
