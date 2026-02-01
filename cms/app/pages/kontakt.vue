<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

useSeoMeta({
  title: 'Kontakt | Czaplisko Siedlisko',
  description: 'Skontaktuj sie z pensjonatem Czaplisko Siedlisko. Wyslij wiadomosc, znajdz nasza lokalizacje na Mazurach Zachodnich.',
})

// Form state
const form = reactive({
  name: '',
  email: '',
  message: '',
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

async function handleSubmit() {
  isSubmitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  try {
    // For now, just simulate submission
    // TODO: Implement actual email sending via API
    await new Promise(resolve => setTimeout(resolve, 1000))

    submitSuccess.value = true
    form.name = ''
    form.email = ''
    form.message = ''
  } catch (error) {
    submitError.value = 'Wystapil blad podczas wysylania wiadomosci. Sprobuj ponownie.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="flex-grow bg-white font-['Montserrat'] overflow-hidden">
    <!-- Contact Hero Section -->
    <section class="relative h-[300px] md:h-[550px] w-full flex items-center justify-center overflow-hidden">
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1920');"
      >
        <div class="absolute inset-0 bg-black/30 md:bg-black/20"></div>
      </div>
      <div class="relative z-10 text-center px-4">
        <h1 class="text-4xl sm:text-6xl md:text-[85px] font-light text-white tracking-[0.1em] md:tracking-[0.2em] uppercase opacity-95">
          Kontakt
        </h1>
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="py-16 md:py-24 px-6 md:px-24 max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
        <!-- Left Column: Form -->
        <div class="flex flex-col">
          <p class="text-[10px] md:text-[11px] tracking-[0.4em] font-bold text-gray-400 uppercase mb-4">
            Napisz do nas
          </p>
          <h2 class="text-4xl md:text-[54px] font-light text-gray-600 mb-6 md:mb-8 tracking-tight">
            Skontaktuj sie
          </h2>
          <p class="text-[13px] md:text-[14px] text-gray-400 font-light leading-relaxed mb-10 md:mb-12">
            Masz pytania dotyczace rezerwacji lub pobytu? Chcesz dowiedziec sie wiecej o naszym pensjonacie?
            Napisz do nas, a odpowiemy najszybciej jak to mozliwe.
          </p>

          <!-- Success Message -->
          <div v-if="submitSuccess" class="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm">
            Dziekujemy za wiadomosc! Odpowiemy najszybciej jak to mozliwe.
          </div>

          <!-- Error Message -->
          <div v-if="submitError" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            {{ submitError }}
          </div>

          <form class="space-y-4 md:space-y-6" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Imie i nazwisko"
                  required
                  class="w-full bg-gray-50 border-none px-6 py-4 text-[13px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#78b3ce]"
                >
              </div>
              <div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="Email"
                  required
                  class="w-full bg-gray-50 border-none px-6 py-4 text-[13px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#78b3ce]"
                >
              </div>
            </div>
            <div>
              <textarea
                v-model="form.message"
                rows="6"
                placeholder="Wiadomosc"
                required
                class="w-full bg-gray-50 border-none px-6 py-4 text-[13px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#78b3ce] resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-[#78b3ce] text-white py-4 md:py-5 text-[11px] md:text-[12px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase hover:bg-[#66a1bc] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Wysylanie...' : 'Wyslij wiadomosc' }}
            </button>
          </form>
        </div>

        <!-- Right Column: Map & Info Grid -->
        <div class="flex flex-col">
          <!-- Map Iframe -->
          <div class="w-full h-[250px] sm:h-[300px] md:h-[380px] bg-gray-100 mb-10 md:mb-12 relative grayscale group shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2379.1234567890123!2d19.6234567!3d53.9876543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTPCsDU5JzE1LjYiTiAxOcKwMzcnMjQuNCJF!5e0!3m2!1spl!2spl!4v1234567890123"
              class="w-full h-full border-0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Lokalizacja Czaplisko Siedlisko"
            ></iframe>
          </div>

          <!-- Contact Info Grid -->
          <div class="grid grid-cols-2 gap-y-8 md:gap-y-10 gap-x-4 border-t border-gray-100 pt-8 md:pt-10">
            <div>
              <p class="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase mb-2">
                Adres:
              </p>
              <p class="text-[13px] md:text-[14px] text-gray-400 font-light">Skitlawki 2A</p>
              <p class="text-[13px] md:text-[14px] text-gray-400 font-light">14-230 Zalewo</p>
            </div>
            <div>
              <p class="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase mb-2">
                Telefon:
              </p>
              <p class="text-[13px] md:text-[14px] text-gray-400 font-light">+48 123 456 789</p>
            </div>
            <div>
              <p class="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase mb-2">
                Region:
              </p>
              <p class="text-[13px] md:text-[14px] text-gray-400 font-light">Mazury Zachodnie</p>
            </div>
            <div>
              <p class="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase mb-2">
                Email:
              </p>
              <p class="text-[13px] md:text-[14px] text-gray-400 font-light">kontakt@czaplisko.pl</p>
            </div>
            <div>
              <p class="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase mb-2">
                Zameldowanie:
              </p>
              <p class="text-[13px] md:text-[14px] text-gray-400 font-light">15:00 - 20:00</p>
            </div>
            <div>
              <p class="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase mb-2">
                Wymeldowanie:
              </p>
              <p class="text-[13px] md:text-[14px] text-gray-400 font-light">do 11:00</p>
            </div>
          </div>

          <!-- Large CTA Phone -->
          <div class="mt-12 md:mt-16 text-center lg:text-left">
            <a href="tel:+48123456789" class="text-4xl sm:text-5xl md:text-[75px] font-light text-gray-500 tracking-tight leading-none hover:text-[#78b3ce] transition-colors">
              +48 123 456 789
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
