<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1a2b3c] to-[#4a6b8a] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Czaplisko CMS</h1>
          <p class="text-gray-500 mt-2">Panel administracyjny</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none transition-all"
              placeholder="admin@czaplisko.pl"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Hasło
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78b3ce] focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 px-4 bg-[#78b3ce] hover:bg-[#4a6b8a] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Logowanie...</span>
            <span v-else>Zaloguj się</span>
          </button>
        </form>
      </div>

      <p class="text-center text-white/60 text-sm mt-6">
        Czaplisko Siedlisko &copy; {{ new Date().getFullYear() }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  try {
    await login(email.value, password.value)
    await router.push('/admin')
  } catch (e: any) {
    error.value = e.data?.message || 'Nieprawidłowy email lub hasło'
  } finally {
    loading.value = false
  }
}
</script>
