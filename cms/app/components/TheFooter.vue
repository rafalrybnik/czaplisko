<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-white border-t border-gray-100 font-['Montserrat']">
    <!-- Main Footer Info Area -->
    <div class="max-w-7xl mx-auto px-6 md:px-24 py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Visit Us Column -->
      <div>
        <h4 class="text-[28px] font-normal text-gray-700 mb-10 tracking-tight">Odwiedz nas</h4>
        <div class="text-[14px] text-gray-500 space-y-2 font-light tracking-wide">
          <p class="mb-4">Czaplisko Siedlisko</p>
          <p class="mb-4">Dog Friendly & Eco Guesthouse</p>
          <p class="mt-6">Skitlawki 2A</p>
          <p>14-230 Zalewo</p>
        </div>
      </div>

      <!-- Social Media Column -->
      <div>
        <h4 class="text-[28px] font-normal text-gray-700 mb-10 tracking-tight">Social media</h4>
        <div class="flex space-x-6 items-center">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            class="w-12 h-12 flex items-center justify-center border border-gray-400 text-[#4a6b8a] text-xl hover:text-white hover:bg-[#4a6b8a] hover:border-[#4a6b8a] transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 512 512" class="w-5 h-5 fill-current">
              <path d="M425.614 86.349C382.172 42.901 322.253 16.07 255.96 16.07c-66.292 0-126.209 26.831-169.652 70.278C42.865 129.793 16.029 189.707 16.029 256c0 66.29 26.836 126.209 70.279 169.652 43.443 43.447 103.359 70.276 169.652 70.276 66.293 0 126.212-26.829 169.654-70.276C469.057 382.209 495.896 322.29 495.896 256c0-66.292-26.838-126.206-70.282-169.651zm-13.149 326.15c-40.121 39.993-95.394 64.702-156.505 64.702-61.109 0-116.379-24.709-156.367-64.702-39.991-40.117-64.833-95.385-64.833-156.498 0-61.111 24.842-116.379 64.833-156.367 39.988-39.988 95.258-64.835 156.367-64.835 61.111 0 116.384 24.847 156.505 64.835 39.988 39.988 64.698 95.256 64.698 156.367 0 61.113-24.71 116.381-64.698 156.498z"></path>
              <path d="M276 187.316c0-9.433 4.537-13.316 9.061-13.316H314v-43h-39.307C232.58 131 222 164.729 222 184.925V204h-24v48h24v126h54V252h32.705l1.595-18.752L313.225 204H276v-16.684z"></path>
            </svg>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            class="w-12 h-12 flex items-center justify-center border border-gray-400 text-[#4a6b8a] text-xl hover:text-white hover:bg-[#78b3ce] hover:border-[#78b3ce] transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="w-5 h-5 stroke-current fill-none">
              <rect width="256" height="256" fill="none"></rect>
              <circle cx="128" cy="128" r="40" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"></circle>
              <rect width="184" height="184" x="36" y="36" stroke-linecap="round" stroke-linejoin="round" stroke-width="8" rx="48"></rect>
              <circle cx="180" cy="76" r="8" fill="currentColor" stroke="none"></circle>
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Copyright Bar -->
    <div class="bg-[#4a6b8a] text-white py-5 px-6 md:px-24 flex flex-col md:flex-row justify-between items-center text-[11px] font-medium tracking-wide">
      <p class="mb-4 md:mb-0 opacity-90">
        Czaplisko Siedlisko - Dog Friendly & Eco Guesthouse &copy; {{ currentYear }} | Realizacja: <a href="https://kadmos.pl" target="_blank" rel="noopener noreferrer" class="hover:text-[#78b3ce] transition-colors">Kadmos</a>
      </p>

      <div class="flex items-center space-x-12">
        <!-- Small Secondary Socials -->
        <div class="flex items-center space-x-4 mr-6 border-r border-white/20 pr-10">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="hover:text-[#78b3ce] transition-colors">FB</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="hover:text-[#78b3ce] transition-colors">IG</a>
        </div>

        <div class="flex items-center gap-6 opacity-60">
          <i class="fab fa-cc-visa text-lg hover:opacity-100 transition-opacity"></i>
          <i class="fab fa-cc-mastercard text-lg hover:opacity-100 transition-opacity"></i>
          <i class="fab fa-stripe text-lg hover:opacity-100 transition-opacity"></i>
          <i class="fab fa-cc-paypal text-lg hover:opacity-100 transition-opacity"></i>
        </div>
      </div>
    </div>
  </footer>
</template>
