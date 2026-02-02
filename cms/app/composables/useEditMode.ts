export interface ContentChange {
  page: string
  section: string
  key: string
  value: string
  type: 'text' | 'richtext' | 'image'
  metadata?: Record<string, unknown>
}

export function useEditMode() {
  const isAdmin = useState<boolean>('isAdmin', () => false)
  const adminEmail = useState<string>('adminEmail', () => '')
  const editMode = useState<boolean>('editMode', () => false)
  const pendingChanges = useState<Map<string, ContentChange>>('pendingChanges', () => new Map())
  const isSaving = useState<boolean>('isSaving', () => false)

  const isDirty = computed(() => pendingChanges.value.size > 0)
  const changeCount = computed(() => pendingChanges.value.size)

  // Check if user is admin on mount
  async function checkAdminStatus() {
    try {
      const response = await $fetch<{ email: string }>('/api/auth/me', {
        credentials: 'include',
      })
      isAdmin.value = true
      adminEmail.value = response.email
    } catch {
      isAdmin.value = false
      adminEmail.value = ''
      editMode.value = false
    }
  }

  function toggleEditMode() {
    if (editMode.value && isDirty.value) {
      // If exiting edit mode with unsaved changes, confirm
      if (!confirm('Masz niezapisane zmiany. Czy na pewno chcesz je odrzucić?')) {
        return
      }
      discardChanges()
    }
    editMode.value = !editMode.value
  }

  function enableEditMode() {
    editMode.value = true
    if (import.meta.client) {
      document.body.classList.add('edit-mode-active')
    }
  }

  function disableEditMode() {
    editMode.value = false
    if (import.meta.client) {
      document.body.classList.remove('edit-mode-active')
    }
  }

  function registerChange(
    page: string,
    section: string,
    key: string,
    value: string,
    type: 'text' | 'richtext' | 'image' = 'text',
    metadata?: Record<string, unknown>
  ) {
    const changeKey = `${page}:${section}:${key}`
    pendingChanges.value.set(changeKey, { page, section, key, value, type, metadata })
    // Trigger reactivity
    pendingChanges.value = new Map(pendingChanges.value)
  }

  function discardChanges() {
    pendingChanges.value.clear()
    pendingChanges.value = new Map()
  }

  async function saveAllChanges(): Promise<boolean> {
    if (pendingChanges.value.size === 0) {
      return true
    }

    isSaving.value = true

    try {
      const items = Array.from(pendingChanges.value.values())

      await $fetch('/api/admin/content/bulk', {
        method: 'PUT',
        body: { items },
        credentials: 'include',
      })

      // Clear pending changes after successful save
      discardChanges()

      // Refresh page content
      await refreshNuxtData()

      return true
    } catch (error) {
      console.error('Failed to save changes:', error)
      alert('Błąd podczas zapisywania zmian. Spróbuj ponownie.')
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function cancelEditing() {
    if (isDirty.value) {
      if (!confirm('Masz niezapisane zmiany. Czy na pewno chcesz je odrzucić?')) {
        return
      }
    }
    discardChanges()
    disableEditMode()
    // Refresh to restore original content
    await refreshNuxtData()
  }

  return {
    isAdmin,
    adminEmail,
    editMode,
    isDirty,
    changeCount,
    isSaving,
    pendingChanges,
    checkAdminStatus,
    toggleEditMode,
    enableEditMode,
    disableEditMode,
    registerChange,
    discardChanges,
    saveAllChanges,
    cancelEditing,
  }
}
