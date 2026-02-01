export default defineNuxtRouteMiddleware(async (to) => {
  // Only check auth for admin routes (except login)
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return
  }

  const { user, fetchUser } = useAuth()

  // If we don't have user data, try to fetch it
  if (!user.value) {
    await fetchUser()
  }

  // If still no user, redirect to login
  if (!user.value) {
    return navigateTo('/admin/login')
  }
})
