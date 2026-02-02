interface ContentItem {
  value: string
  type: string
  metadata: unknown
}

interface ContentBySection {
  [key: string]: ContentItem
}

interface ContentResponse {
  [section: string]: ContentBySection
}

export function usePageContent(page: string) {
  const { data: content, refresh } = useAsyncData<ContentResponse>(
    `content-${page}`,
    () => $fetch<ContentResponse>(`/api/public/content/${page}`),
    {
      default: () => ({}),
    }
  )

  const { editMode, pendingChanges } = useEditMode()

  /**
   * Get text content for a specific section and key
   * Returns pending change value if in edit mode and changed, otherwise DB value or fallback
   */
  function get(section: string, key: string, fallback: string = ''): string {
    const changeKey = `${page}:${section}:${key}`

    // If in edit mode and we have a pending change, return that
    if (editMode.value && pendingChanges.value.has(changeKey)) {
      return pendingChanges.value.get(changeKey)!.value
    }

    // Otherwise return DB value or fallback
    return content.value?.[section]?.[key]?.value ?? fallback
  }

  /**
   * Get image URL for a specific section and key
   */
  function getImage(section: string, key: string, fallback: string = ''): string {
    return get(section, key, fallback)
  }

  /**
   * Check if a content item exists in the database
   */
  function exists(section: string, key: string): boolean {
    return !!content.value?.[section]?.[key]
  }

  /**
   * Get the type of content (text, richtext, image)
   */
  function getType(section: string, key: string): string {
    return content.value?.[section]?.[key]?.type ?? 'text'
  }

  /**
   * Get metadata for a content item
   */
  function getMetadata(section: string, key: string): Record<string, unknown> | null {
    const meta = content.value?.[section]?.[key]?.metadata
    return meta as Record<string, unknown> | null
  }

  return {
    content,
    refresh,
    get,
    getImage,
    exists,
    getType,
    getMetadata,
  }
}
