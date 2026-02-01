<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Nawigacja</h1>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-[#78b3ce] text-white rounded-lg hover:bg-[#4a6b8a] transition-colors"
      >
        + Dodaj link
      </button>
    </div>

    <!-- Info -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <p class="text-blue-800 text-sm">
        Przeciagnij elementy, aby zmienic ich kolejnosc. Zmiany sa zapisywane automatycznie.
      </p>
    </div>

    <!-- Navigation Items List -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div v-if="isLoading" class="p-8 text-center text-gray-500">
        Ladowanie...
      </div>

      <div v-else-if="items.length === 0" class="p-8 text-center text-gray-500">
        <p class="mb-4">Brak elementow nawigacji.</p>
        <p class="text-sm">Kliknij "Dodaj link" aby utworzyc pierwszy element menu.</p>
      </div>

      <div v-else class="divide-y">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          draggable="true"
          @dragstart="handleDragStart($event, index)"
          @dragover.prevent="handleDragOver($event, index)"
          @drop="handleDrop($event, index)"
          @dragend="handleDragEnd"
          :class="{ 'bg-blue-50': dragOverIndex === index }"
        >
          <!-- Drag Handle -->
          <div class="cursor-grab text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
            </svg>
          </div>

          <!-- Order Number -->
          <span class="text-sm text-gray-400 w-8">{{ index + 1 }}</span>

          <!-- Label -->
          <div class="flex-1">
            <p class="font-medium text-gray-900">{{ item.label }}</p>
            <p class="text-sm text-gray-500">{{ item.path }}</p>
          </div>

          <!-- Active Status -->
          <button
            @click="toggleActive(item)"
            class="px-3 py-1 text-xs rounded-full transition-colors"
            :class="item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
          >
            {{ item.isActive ? 'Aktywny' : 'Ukryty' }}
          </button>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              @click="editItem(item)"
              class="p-2 text-gray-500 hover:text-[#78b3ce] transition-colors"
              title="Edytuj"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </button>
            <button
              @click="confirmDelete(item)"
              class="p-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Usun"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal || editingItem"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold text-gray-900 mb-4">
          {{ editingItem ? 'Edytuj link' : 'Dodaj nowy link' }}
        </h2>

        <form @submit.prevent="saveItem" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Etykieta</label>
            <input
              v-model="form.label"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent"
              placeholder="np. Start, Kontakt"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Sciezka URL</label>
            <input
              v-model="form.path"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent"
              placeholder="np. /, /kontakt, /apartamenty"
            >
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="form.isActive"
              type="checkbox"
              id="isActive"
              class="w-4 h-4 text-[#78b3ce] border-gray-300 rounded focus:ring-[#78b3ce]"
            >
            <label for="isActive" class="text-sm text-gray-700">Aktywny (widoczny w menu)</label>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="flex-1 px-4 py-2 bg-[#78b3ce] text-white rounded-lg hover:bg-[#4a6b8a] transition-colors disabled:opacity-50"
            >
              {{ isSaving ? 'Zapisywanie...' : (editingItem ? 'Zapisz' : 'Dodaj') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="deletingItem"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="deletingItem = null"
    >
      <div class="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
        <h2 class="text-xl font-bold text-gray-900 mb-4">Potwierdz usuniecie</h2>
        <p class="text-gray-600 mb-6">
          Czy na pewno chcesz usunac link "{{ deletingItem.label }}"? Ta akcja jest nieodwracalna.
        </p>
        <div class="flex gap-3">
          <button
            @click="deletingItem = null"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Anuluj
          </button>
          <button
            @click="deleteItem"
            :disabled="isDeleting"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {{ isDeleting ? 'Usuwanie...' : 'Usun' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})

interface NavigationItem {
  id: string
  label: string
  path: string
  order: number
  isActive: boolean
}

const { data, refresh } = await useFetch<NavigationItem[]>('/api/admin/navigation')
const items = computed(() => data.value || [])
const isLoading = ref(false)

// Modal state
const showAddModal = ref(false)
const editingItem = ref<NavigationItem | null>(null)
const deletingItem = ref<NavigationItem | null>(null)

// Form state
const form = reactive({
  label: '',
  path: '',
  isActive: true,
})

const isSaving = ref(false)
const isDeleting = ref(false)

// Drag & drop state
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function handleDragStart(event: DragEvent, index: number) {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
  }
}

function handleDragOver(event: DragEvent, index: number) {
  dragOverIndex.value = index
}

function handleDragEnd() {
  draggedIndex.value = null
  dragOverIndex.value = null
}

async function handleDrop(event: DragEvent, targetIndex: number) {
  if (draggedIndex.value === null || draggedIndex.value === targetIndex) {
    handleDragEnd()
    return
  }

  const itemsCopy = [...items.value]
  const [draggedItem] = itemsCopy.splice(draggedIndex.value, 1)
  itemsCopy.splice(targetIndex, 0, draggedItem)

  // Update order for all items
  const reorderData = itemsCopy.map((item, idx) => ({
    id: item.id,
    order: idx,
  }))

  try {
    await $fetch('/api/admin/navigation/reorder', {
      method: 'POST',
      body: { items: reorderData },
    })
    await refresh()
  } catch (error) {
    console.error('Failed to reorder:', error)
  }

  handleDragEnd()
}

function editItem(item: NavigationItem) {
  editingItem.value = item
  form.label = item.label
  form.path = item.path
  form.isActive = item.isActive
}

function confirmDelete(item: NavigationItem) {
  deletingItem.value = item
}

function closeModal() {
  showAddModal.value = false
  editingItem.value = null
  form.label = ''
  form.path = ''
  form.isActive = true
}

async function saveItem() {
  isSaving.value = true

  try {
    if (editingItem.value) {
      await $fetch(`/api/admin/navigation/${editingItem.value.id}`, {
        method: 'PUT',
        body: {
          label: form.label,
          path: form.path,
          isActive: form.isActive,
        },
      })
    } else {
      await $fetch('/api/admin/navigation', {
        method: 'POST',
        body: {
          label: form.label,
          path: form.path,
          isActive: form.isActive,
        },
      })
    }

    await refresh()
    closeModal()
  } catch (error) {
    console.error('Failed to save:', error)
  } finally {
    isSaving.value = false
  }
}

async function deleteItem() {
  if (!deletingItem.value) return

  isDeleting.value = true

  try {
    await $fetch(`/api/admin/navigation/${deletingItem.value.id}`, {
      method: 'DELETE',
    })

    await refresh()
    deletingItem.value = null
  } catch (error) {
    console.error('Failed to delete:', error)
  } finally {
    isDeleting.value = false
  }
}

async function toggleActive(item: NavigationItem) {
  try {
    await $fetch(`/api/admin/navigation/${item.id}`, {
      method: 'PUT',
      body: { isActive: !item.isActive },
    })
    await refresh()
  } catch (error) {
    console.error('Failed to toggle active:', error)
  }
}
</script>
