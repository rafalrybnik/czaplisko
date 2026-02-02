<script setup lang="ts">
const {
  isAdmin,
  adminEmail,
  editMode,
  isDirty,
  changeCount,
  isSaving,
  checkAdminStatus,
  enableEditMode,
  disableEditMode,
  saveAllChanges,
  cancelEditing,
} = useEditMode()

const route = useRoute()

// Determine admin links based on current page
interface AdminLink {
  label: string
  path: string
  icon: string
}

const adminLinks = computed<AdminLink[]>(() => {
  const path = route.path

  // Home page has news
  if (path === '/') {
    return [
      { label: 'Aktualności', path: '/admin/news', icon: 'newspaper' },
    ]
  }

  // Apartments list or detail
  if (path.startsWith('/apartamenty')) {
    return [
      { label: 'Apartamenty', path: '/admin/apartments', icon: 'building' },
    ]
  }

  // Gallery
  if (path === '/galeria') {
    return [
      { label: 'Media', path: '/admin/media', icon: 'image' },
    ]
  }

  // Pricing
  if (path === '/cennik') {
    return [
      { label: 'Cennik', path: '/admin/pricing', icon: 'currency' },
    ]
  }

  return []
})

// Global click handler to prevent link navigation in edit mode
function handleGlobalClick(event: MouseEvent) {
  if (!editMode.value) return

  // Find if click target or any parent is a link
  let target = event.target as HTMLElement | null
  while (target) {
    if (target.tagName === 'A' && target.getAttribute('href')) {
      // Check if the click is on an editable element
      const isEditableClick = (event.target as HTMLElement).closest('.editable-text--active')
      if (isEditableClick) {
        // Allow editing but prevent navigation
        event.preventDefault()
        event.stopPropagation()
        return
      }
      // Prevent any link navigation in edit mode (except toolbar buttons)
      if (!target.closest('.admin-toolbar')) {
        event.preventDefault()
        event.stopPropagation()
      }
      return
    }
    target = target.parentElement
  }
}

// Check admin status on mount and set up global click handler
onMounted(() => {
  checkAdminStatus()
  document.addEventListener('click', handleGlobalClick, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick, true)
})

async function handleSave() {
  const success = await saveAllChanges()
  if (success) {
    disableEditMode()
  }
}

function handleCancel() {
  cancelEditing()
}

function handleEdit() {
  enableEditMode()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="toolbar">
      <div v-if="isAdmin" class="admin-toolbar-wrapper">
        <div class="admin-toolbar">
          <!-- View Mode -->
          <template v-if="!editMode">
            <div class="admin-toolbar__info">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="admin-toolbar__email">{{ adminEmail }}</span>
            </div>

            <div class="admin-toolbar__divider"></div>

            <button
              type="button"
              class="admin-toolbar__button admin-toolbar__button--primary"
              @click="handleEdit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edytuj stronę</span>
            </button>

            <!-- Admin panel link -->
            <div class="admin-toolbar__divider"></div>
            <NuxtLink
              to="/admin"
              class="admin-toolbar__button admin-toolbar__button--secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Panel</span>
            </NuxtLink>

            <!-- Admin panel links for business content -->
            <template v-if="adminLinks.length > 0">
              <div class="admin-toolbar__divider"></div>
              <NuxtLink
                v-for="link in adminLinks"
                :key="link.path"
                :to="link.path"
                class="admin-toolbar__button admin-toolbar__button--secondary"
              >
                <svg v-if="link.icon === 'newspaper'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <svg v-else-if="link.icon === 'building'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <svg v-else-if="link.icon === 'image'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg v-else-if="link.icon === 'currency'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ link.label }}</span>
              </NuxtLink>
            </template>
          </template>

          <!-- Edit Mode -->
          <template v-else>
            <div class="admin-toolbar__info admin-toolbar__info--editing">
              <div class="admin-toolbar__pulse"></div>
              <span>Tryb edycji</span>
              <span v-if="isDirty" class="admin-toolbar__badge">
                {{ changeCount }}
              </span>
            </div>

            <div class="admin-toolbar__divider"></div>

            <div class="admin-toolbar__actions">
              <button
                type="button"
                class="admin-toolbar__button admin-toolbar__button--success"
                :disabled="isSaving || !isDirty"
                @click="handleSave"
              >
                <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{{ isSaving ? 'Zapisuję...' : 'Zapisz' }}</span>
              </button>

              <button
                type="button"
                class="admin-toolbar__button admin-toolbar__button--cancel"
                :disabled="isSaving"
                @click="handleCancel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Anuluj</span>
              </button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.admin-toolbar-wrapper {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9990;
}

.admin-toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;

  /* Liquid Glass Effect */
  background: rgba(30, 30, 30, 0.65);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);

  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 1rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8125rem;
}

.admin-toolbar__info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
}

.admin-toolbar__info--editing {
  color: rgba(255, 255, 255, 0.9);
}

.admin-toolbar__pulse {
  width: 8px;
  height: 8px;
  background: #34d399;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}

.admin-toolbar__email {
  font-size: 0.8125rem;
  font-weight: 400;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-toolbar__badge {
  background: rgba(245, 158, 11, 0.9);
  color: #1a1a1a;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  min-width: 1.25rem;
  text-align: center;
}

.admin-toolbar__divider {
  width: 1px;
  height: 1.25rem;
  background: rgba(255, 255, 255, 0.15);
}

.admin-toolbar__actions {
  display: flex;
  gap: 0.5rem;
}

.admin-toolbar__button {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4375rem 0.875rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.admin-toolbar__button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.admin-toolbar__button--primary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-toolbar__button--primary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.2);
}

.admin-toolbar__button--secondary {
  background: rgba(120, 179, 206, 0.2);
  color: #78b3ce;
  border: 1px solid rgba(120, 179, 206, 0.3);
  text-decoration: none;
}

.admin-toolbar__button--secondary:hover {
  background: rgba(120, 179, 206, 0.35);
  border-color: rgba(120, 179, 206, 0.5);
  color: white;
}

.admin-toolbar__button--success {
  background: rgba(16, 185, 129, 0.85);
  color: white;
}

.admin-toolbar__button--success:hover:not(:disabled) {
  background: rgba(16, 185, 129, 1);
  transform: translateY(-1px);
}

.admin-toolbar__button--cancel {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.admin-toolbar__button--cancel:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Transition */
.toolbar-enter-active,
.toolbar-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.toolbar-enter-from,
.toolbar-leave-to {
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
}

/* Animation for spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .admin-toolbar-wrapper {
    left: 1rem;
    right: 1rem;
    transform: none;
  }

  .admin-toolbar {
    width: 100%;
    justify-content: space-between;
  }

  .admin-toolbar__email {
    display: none;
  }
}
</style>
