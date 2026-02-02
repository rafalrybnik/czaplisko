interface User {
  email: string
}

export function useAuth() {
  const user = useState<User | null>('auth-user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  async function fetchUser() {
    try {
      const data = await $fetch<User>('/api/auth/me')
      user.value = data
      return data
    } catch {
      user.value = null
      return null
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch<{ success: boolean; user: User }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = data.user
    return data
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/')
  }

  return {
    user: readonly(user),
    isAuthenticated,
    fetchUser,
    login,
    logout,
  }
}
