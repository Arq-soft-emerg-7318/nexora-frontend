<template>
    <div class="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-blue-50 to-blue-100">
        <div class="w-[560px] rounded-2xl border border-blue-200/50 bg-white/60 backdrop-blur-sm px-14 py-12 shadow-sm">
            <img src="/src/assets/images/logo.png" alt="Nexora Logo" class="mx-auto w-16 h-16 mb-4" />
            <h1 class="text-xl font-semibold text-center">Nexora Admin</h1>
            <p class="text-sm text-neutral-600 text-center mt-1 mb-8">Ingresa a tu panel de administración</p>
            <form class="space-y-5" @submit.prevent="login">
                <div class="space-y-2">
                    <label class="text-sm font-medium">Correo electrónico</label>
                    <div class="rounded-full border border-neutral-200 flex items-center gap-2 px-4 py-2 bg-neutral-50">
                        <img src="/src/assets/images/icon-email.png" alt="Lock Icon" class="w-4 h-4 opacity-40" />
                        <input type="input" v-model="username" class="flex-1 bg-transparent outline-none text-sm"
                            placeholder="tu.correo@ejemplo.com" required />
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-sm font-medium">Contraseña</label>
                    <div class="rounded-full border border-neutral-200 flex items-center gap-2 px-4 py-2 bg-neutral-50">
                        <img src="/src/assets/images/icon-password.png" alt="Lock Icon" class="w-4 h-4 opacity-40" />
                        <input type="password" v-model="password" class="flex-1 bg-transparent outline-none text-sm"
                            placeholder="••••••••••" required />
                    </div>
                </div>
                <div v-if="error" class="text-sm text-red-600">{{ error }}</div>
                <div v-if="debug" class="text-xs text-neutral-500 break-words mb-2"><strong>Debug:</strong> <pre class="whitespace-pre-wrap">{{ debug }}</pre></div>
                <button type="submit"
                    :disabled="loading"
                    class="w-full h-11 rounded-xl bg-linear-to-r from-blue-600 to-blue-300 text-white font-medium mt-4 hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
                    <span v-if="loading" class="spinner" aria-hidden></span>
                    <span>{{ loading ? 'Iniciando...' : 'Iniciar sesión' }}</span>
                </button>
                <div class="flex items-center justify-between mt-3">
                    <router-link to="/signup" class="text-sm text-blue-600 hover:underline">Crear cuenta</router-link>
                    <button type="button" class="text-sm text-neutral-500" @click="fillTest">Rellenar prueba</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_BASE } from '../../../../config/api.js'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const debug = ref('')

function extractToken(obj) {
    if (!obj) return null
    return obj.accessToken || obj.access_token || obj.token || obj.jwt || (obj.data && (obj.data.accessToken || obj.data.token)) || null
}

async function login() {
    loading.value = true
    error.value = ''
    debug.value = ''
    try {
        const res = await fetch(`${API_BASE}/api/v1/authentication/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username.value, password: password.value })
        })
        const text = await res.text()
        let data = {}
        try { data = JSON.parse(text) } catch (_) { data = { raw: text } }
        if (!res.ok) {
            error.value = (data && (data.message || data.error)) || `Error ${res.status}`
            debug.value = JSON.stringify(data)
            loading.value = false
            return
        }
        const token = extractToken(data)
        if (!token) {
            error.value = 'No se encontró token en la respuesta del servidor.'
            debug.value = JSON.stringify(data)
            loading.value = false
            return
        }
        localStorage.setItem('accessToken', token)
        // Después del login, ir al dashboard en lugar de forzar completar perfil
        router.push({ name: 'dashboard' })
    } catch (e) {
        error.value = e.message || 'Error de red'
    } finally {
        loading.value = false
    }
}

// Helper para pruebas rápidas
function fillTest() {
    username.value = 'admin@example.com'
    password.value = 'password123'
}
</script>

<style scoped>
.spinner{border:4px solid rgba(255,255,255,0.15);border-top-color:white;border-radius:9999px;width:18px;height:18px;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
</style>
