<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

useSeoMeta({
  title: 'FAQ | Czaplisko Siedlisko',
  description: 'Najczesciej zadawane pytania o pensjonacie Czaplisko Siedlisko. Dowiedz sie o polityce dla zwierzat, godzinach zameldowania, parkingu i sniadaniach.',
})

const { get } = usePageContent('faq')

// FAQ item indices for iteration
const faqIndices = [1, 2, 3, 4, 5, 6, 7]
const openStates = ref<Record<number, boolean>>({})

function toggleFaq(index: number) {
  openStates.value[index] = !openStates.value[index]
}

function isOpen(index: number) {
  return openStates.value[index] ?? false
}
</script>

<template>
  <main class="flex-grow bg-white font-['Montserrat']">
    <div class="bg-white py-24 px-6 max-w-3xl mx-auto">
      <div class="text-center mb-16">
        <EditableText
          page="faq"
          section="header"
          content-key="label"
          tag="p"
          class="text-[10px] tracking-[0.6em] font-bold text-[#78b3ce] uppercase mb-4"
          fallback="Pytania i odpowiedzi"
        />
        <EditableText
          page="faq"
          section="header"
          content-key="title"
          tag="h1"
          class="text-5xl font-light text-gray-700 tracking-tight"
          fallback="FAQ"
        />
        <div class="w-16 h-[1px] bg-gray-200 mx-auto mt-8"></div>
      </div>

      <div class="space-y-4">
        <div
          v-for="idx in faqIndices"
          :key="idx"
          class="border-b border-gray-100 py-6"
        >
          <button
            class="w-full flex justify-between items-center text-left"
            @click="toggleFaq(idx)"
          >
            <EditableText
              page="faq"
              section="items"
              :content-key="`q${idx}_question`"
              tag="span"
              class="text-lg font-light text-gray-700 tracking-tight"
              :fallback="`Pytanie ${idx}`"
            />
            <span class="text-[#78b3ce] transition-transform duration-300 flex-shrink-0 ml-4" :class="{ 'rotate-45': isOpen(idx) }">
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
            <div v-if="isOpen(idx)" class="overflow-hidden mt-4">
              <EditableText
                page="faq"
                section="items"
                :content-key="`q${idx}_answer`"
                tag="p"
                class="text-[14px] text-gray-400 font-light leading-relaxed"
                :fallback="`Odpowiedz ${idx}`"
              />
            </div>
          </Transition>
        </div>
      </div>

      <div class="mt-20 bg-gray-50 p-12 text-center">
        <EditableText
          page="faq"
          section="cta"
          content-key="title"
          tag="h3"
          class="text-xl font-light text-gray-600 mb-4"
          fallback="Masz wiecej pytan?"
        />
        <EditableText
          page="faq"
          section="cta"
          content-key="description"
          tag="p"
          class="text-sm text-gray-400 mb-8"
          fallback="Nasz zespol jest gotowy, aby pomoc Ci zaplanowac idealny pobyt."
        />
        <NuxtLink
          to="/kontakt"
          class="inline-block bg-[#1a2b3c] text-white px-10 py-4 text-[10px] tracking-[0.3em] font-bold uppercase hover:bg-[#78b3ce] transition-all"
        >
          <EditableText
            page="faq"
            section="cta"
            content-key="button_text"
            tag="span"
            fallback="Skontaktuj sie"
          />
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
