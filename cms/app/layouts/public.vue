<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-800 antialiased font-['Montserrat']">
    <TheHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>
