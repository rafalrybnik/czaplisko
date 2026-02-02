<script setup lang="ts">
const props = defineProps<{
  page: string
  section: string
  contentKey: string
  fallback?: string
  class?: string
}>()

const slots = defineSlots<{
  default(): unknown
}>()

const { editMode, registerChange } = useEditMode()
const { get } = usePageContent(props.page)

const showPicker = ref(false)

const currentValue = computed(() => get(props.section, props.contentKey, props.fallback ?? ''))

const backgroundStyle = computed(() => ({
  backgroundImage: currentValue.value ? `url(${currentValue.value})` : undefined,
}))

function openPicker(event: Event) {
  if (editMode.value) {
    event.stopPropagation()
    showPicker.value = true
  }
}

function handleImageSelected(url: string) {
  registerChange(props.page, props.section, props.contentKey, url, 'image')
  showPicker.value = false
}

function closePicker() {
  showPicker.value = false
}
</script>

<template>
  <div
    :class="[
      props.class,
      'editable-background',
      { 'editable-background--active': editMode },
    ]"
    :style="backgroundStyle"
  >
    <slot />

    <button
      v-if="editMode"
      class="editable-background__button"
      type="button"
      @click="openPicker"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span>Zmień tło</span>
    </button>

    <EditableMediaPicker
      v-if="showPicker"
      @select="handleImageSelected"
      @close="closePicker"
    />
  </div>
</template>

<style scoped>
.editable-background {
  position: relative;
  background-size: cover;
  background-position: center;
}

.editable-background--active {
  outline: 2px dashed #f59e0b;
  outline-offset: -2px;
}

.editable-background__button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 10;
}

.editable-background__button:hover {
  background: rgba(0, 0, 0, 0.85);
}
</style>
