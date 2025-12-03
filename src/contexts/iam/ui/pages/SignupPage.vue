<template>
  <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-blue-50 to-blue-100">
    <div class="w-[560px] rounded-2xl border border-blue-200/50 bg-white/60 backdrop-blur-sm px-14 py-12 shadow-sm">
      <h1 class="text-xl font-semibold text-center">Crear cuenta - Nexora</h1>
      <p class="text-sm text-neutral-600 text-center mt-1 mb-6">Registra un nuevo usuario con rol <strong>USER_ADMIN</strong></p>
      <form class="space-y-5" @submit.prevent="signup">
        <div class="space-y-2">
          <label class="text-sm font-medium">Correo electrónico</label>
          <div class="rounded-full border border-neutral-200 flex items-center gap-2 px-4 py-2 bg-neutral-50">
            <input type="email" v-model="username" class="flex-1 bg-transparent outline-none text-sm" placeholder="tu.correo@ejemplo.com" required />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Contraseña</label>
          <div class="rounded-full border border-neutral-200 flex items-center gap-2 px-4 py-2 bg-neutral-50">
            <input type="password" v-model="password" class="flex-1 bg-transparent outline-none text-sm" placeholder="••••••••••" required />
          </div>
        </div>

        <div v-if="message" :class="messageClass">{{ message }}</div>

        <button type="submit" class="w-full h-11 rounded-xl bg-linear-to-r from-green-600 to-green-300 text-white font-medium mt-4 hover:opacity-90 transition">Crear cuenta</button>

        <div class="flex items-center justify-center mt-4">
          <router-link to="/login" class="text-sm text-blue-600 hover:underline">Volver al login</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { API_BASE } from '../../../../config/api.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const message = ref('')

const messageClass = computed(() => (message.value && message.value.startsWith('Error')) ? 'text-sm text-red-600' : 'text-sm text-green-600')

async function signup() {
  message.value = ''
  try {
    const res = await fetch(`${API_BASE}/api/v1/authentication/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value, roles: ['GUEST'] })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      message.value = err.message || `Error ${res.status}`
      return
    }
    message.value = 'Cuenta creada correctamente. Iniciando sesión...'
    // Intentar login automático
    await loginAfterSignup()
  } catch (e) {
    message.value = 'Error de red: ' + (e.message || '')
  }
}

async function loginAfterSignup() {
  try {
    const res = await fetch(`${API_BASE}/api/v1/authentication/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      message.value = 'Cuenta creada pero login automático falló: ' + (err.message || `Error ${res.status}`)
      return
    }
    const data = await res.json().catch(() => ({}))
    if (data?.accessToken) localStorage.setItem('accessToken', data.accessToken)
    // Después del registro y login automático, llevar al usuario a crear su profile
    router.push('/create-profile')
  } catch (e) {
    message.value = 'Cuenta creada pero login automático falló: ' + (e.message || '')
  }
}
</script>
