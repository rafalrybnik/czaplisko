<script setup lang="ts">
const props = defineProps<{
  page: string
  section: string
  contentKey: string
  fallback?: string
  alt?: string
  class?: string
}>()

const { editMode, registerChange } = useEditMode()
const { get, getMetadata } = usePageContent(props.page)

const showPicker = ref(false)

const currentValue = computed(() => get(props.section, props.contentKey, props.fallback ?? ''))
const currentAlt = computed(() => {
  const meta = getMetadata(props.section, props.contentKey)
  return (meta?.alt as string) ?? props.alt ?? ''
})

function openPicker(event: Event) {
  if (editMode.value) {
    event.preventDefault()
    event.stopPropagation()
    showPicker.value = true
  }
}

function handleImageSelected(url: string, alt?: string) {
  registerChange(props.page, props.section, props.contentKey, url, 'image', alt ? { alt } : undefined)
  showPicker.value = false
}

function closePicker() {
  showPicker.value = false
}
</script>

<template>
  <div
    :class="[
      'editable-image-wrapper',
      { 'editable-image-wrapper--active': editMode },
    ]"
    @click="openPicker"
  >
    <img
      :src="currentValue"
      :alt="currentAlt"
      :class="props.class"
    />

    <div v-if="editMode" class="editable-image-overlay">
      <div class="editable-image-overlay__icon">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Zmień obrazek</span>
      </div>
    </div>

    <EditableMediaPicker
      v-if="showPicker"
      @select="handleImageSelected"
      @close="closePicker"
    />
  </div>
</template>

<style scoped>
.editable-image-wrapper {
  position: relative;
  display: inline-block;
}

.editable-image-wrapper--active {
  cursor: pointer;
}

.editable-image-wrapper--active::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 2px dashed #f59e0b;
  pointer-events: none;
  transition: border-color 0.2s;
}

.editable-image-wrapper--active:hover::after {
  border-color: #d97706;
}

.editable-image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.editable-image-wrapper--active:hover .editable-image-overlay {
  opacity: 1;
}

.editable-image-overlay__icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
