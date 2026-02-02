<script setup lang="ts">
const props = defineProps<{
  page: string
  section: string
  contentKey: string
  tag?: string
  fallback?: string
  class?: string
}>()

const { editMode, registerChange } = useEditMode()
const { get } = usePageContent(props.page)

const editorRef = ref<HTMLElement | null>(null)

// Get the current value from DB or pending changes
const currentValue = computed(() => get(props.section, props.contentKey, props.fallback ?? ''))

// Initialize editor content when entering edit mode
watch(editMode, (isEditing, wasEditing) => {
  if (isEditing && !wasEditing) {
    // Entering edit mode - set editor content
    nextTick(() => {
      if (editorRef.value) {
        editorRef.value.innerText = currentValue.value
      }
    })
  }
})

function handleBlur() {
  if (!editorRef.value || !editMode.value) return

  const newValue = editorRef.value.innerText

  if (newValue !== currentValue.value) {
    registerChange(props.page, props.section, props.contentKey, newValue, 'text')
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    if (props.tag !== 'p' && props.tag !== 'div') {
      event.preventDefault()
      editorRef.value?.blur()
    }
  }
}

function handleClick(event: MouseEvent) {
  if (editMode.value) {
    event.preventDefault()
    event.stopPropagation()
  }
}
</script>

<template>
  <!-- Display mode: normal text, reactive to changes -->
  <component
    v-if="!editMode"
    :is="tag || 'span'"
    :class="props.class"
  >{{ currentValue }}</component>

  <!-- Edit mode: contenteditable, NOT reactive during typing -->
  <component
    v-else
    :is="tag || 'span'"
    ref="editorRef"
    :class="[props.class, 'editable-text', 'editable-text--active']"
    contenteditable="true"
    :data-placeholder="fallback"
    @blur="handleBlur"
    @keydown="handleKeydown"
    @click="handleClick"
  />
</template>

<style scoped>
.editable-text--active {
  outline: 2px dashed #f59e0b;
  outline-offset: 2px;
  cursor: text;
  min-width: 20px;
  min-height: 1em;
  transition: outline-color 0.2s;
}

.editable-text--active:hover {
  outline-color: #d97706;
}

.editable-text--active:focus {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
  background-color: rgba(245, 158, 11, 0.05);
}

.editable-text--active:empty::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
}
</style>
