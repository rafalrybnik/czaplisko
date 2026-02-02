<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-800 antialiased font-['Montserrat']">
    <TheHeader />
    <main class="flex-grow">
      <slot />
    </main>
    <TheFooter />

    <!-- Admin Toolbar (renders at bottom when admin is logged in) -->
    <EditableAdminToolbar />
  </div>
</template>

<style>
/* Global styles for edit mode - visual indicator that links are disabled */
body.edit-mode-active a[href]:not(.admin-toolbar a):not(.admin-toolbar__button) {
  cursor: text !important;
}

/* Ensure editable elements inside links are clickable for editing */
body.edit-mode-active .editable-text--active {
  cursor: text !important;
}
</style>
