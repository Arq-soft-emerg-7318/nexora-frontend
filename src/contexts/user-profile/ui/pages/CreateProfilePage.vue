<template>
  <div class="min-h-screen flex items-start justify-center bg-linear-to-br from-white via-blue-50 to-blue-100 py-10">
    <div class="w-full max-w-5xl mx-6 rounded-2xl border border-blue-200/50 bg-white/60 backdrop-blur-sm p-6 shadow-sm">
      <div class="flex items-center gap-4 mb-6">
        <img src="/src/assets/images/logo.png" alt="Nexora Logo" class="w-16 h-16" />
        <div>
          <h2 class="text-2xl font-semibold text-neutral-800">Completa tu perfil</h2>
          <p class="text-sm text-neutral-600">Termina tu registro para acceder al panel</p>
        </div>
      </div>
      <form class="grid grid-cols-2 gap-6" @submit.prevent="submitProfile">
        <div class="col-span-1">
          <label class="text-xs text-neutral-600 font-medium">Nombre</label>
          <input v-model="firstName" type="text" required class="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm bg-transparent text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
        </div>
        <div class="col-span-1">
          <label class="text-xs text-neutral-600 font-medium">Apellido</label>
          <input v-model="lastName" type="text" required class="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm bg-transparent text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
        </div>

        <div class="col-span-2">
          <label class="text-xs text-neutral-600 font-medium">Email</label>
          <input v-model="email" type="email" required class="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm bg-transparent text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
        </div>

        <div class="col-span-1">
          <label class="text-xs text-neutral-600 font-medium">Teléfono</label>
          <input v-model="phone" type="text" class="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm bg-transparent text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
        </div>
        <div class="col-span-1">
          <label class="text-xs text-neutral-600 font-medium">Tipo de documento</label>
          <select v-model="documentType" class="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm bg-transparent text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
            <option value="DNI">DNI</option>
            <option value="Carnet de extranjería">Carnet de extranjería</option>
          </select>
        </div>

        <div class="col-span-1">
          <label class="text-xs text-neutral-600 font-medium">Número de documento</label>
          <input v-model="documentNumber" type="text" class="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm bg-transparent text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition" />
        </div>
        <div class="col-span-1">
          <label class="text-xs text-neutral-600 font-medium">Dirección</label>
          <input v-model="direction" type="text" class="mt-2 w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm bg-transparent text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
        </div>

        <div class="col-span-2 mt-4">
          <div v-if="error" class="text-sm text-red-400 mb-2">{{ error }}</div>
          <div v-if="success" class="text-sm text-green-300 mb-2 flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 5 11.586a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>{{ success }}</div>
          <div class="flex gap-4">
            <button :disabled="submitting" type="submit" class="flex-1 h-12 rounded-xl bg-linear-to-r from-blue-600 to-blue-300 text-white font-medium hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-3">
              <span v-if="submitting" class="spinner-small" aria-hidden></span>
              <span>{{ submitting ? 'Guardando...' : 'Guardar perfil' }}</span>
            </button>
            <button type="button" class="h-12 px-5 rounded-lg border border-neutral-200 text-sm text-neutral-600 hover:bg-neutral-50 transition" @click="skipProfile">Omitir</button>
          </div>
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
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const direction = ref('')
const documentNumber = ref('')
const documentType = ref('DNI')
const phone = ref('')
const error = ref('')
const success = ref('')
const submitting = ref(false)

function skipProfile() {
  // marcar como creado y permitir acceso al dashboard
  localStorage.setItem('profileCreated', '1')
  router.push('/dashboard')
}

async function submitProfile() {
  error.value = ''
  success.value = ''
  const token = localStorage.getItem('accessToken')
  if (!token) {
    error.value = 'No autorizado. Por favor inicia sesión.'
    router.push('/login')
    return
  }

  try {
    submitting.value = true
    const body = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      direction: direction.value,
      documentNumber: documentNumber.value,
      documentType: documentType.value,
      phone: phone.value
    }
    // Intentar crear perfil con POST primero
    let res = await fetch(`${API_BASE}/api/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    // Si POST no está permitido o retorna error, intentar PUT (actualizar/crear)
    if (!res.ok) {
      // fallback a PUT
      res = await fetch(`${API_BASE}/api/v1/profiles`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      error.value = err.message || `Error ${res.status}`
      submitting.value = false
      return
    }

    const data = await res.json().catch(() => ({}))
    success.value = 'Perfil guardado correctamente.'
    // Guardar el perfil en localStorage para uso en la UI
    try { localStorage.setItem('profile', JSON.stringify(data)) } catch (e) {}
    // Marcar que el usuario ya creó su profile para permitir acceder al dashboard
    localStorage.setItem('profileCreated', '1')
    // Después de crear/actualizar el profile, redirigir al dashboard
    setTimeout(() => router.push('/dashboard'), 900)
    submitting.value = false
  } catch (e) {
    error.value = 'Error de red: ' + (e.message || '')
    submitting.value = false
  }
}
</script>

<style scoped>
.spinner-small{border:3px solid rgba(255,255,255,0.12);border-top-color:rgba(255,255,255,0.9);border-radius:9999px;width:14px;height:14px;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* Inputs glow */
input, select { caret-color: #fff }

</style>
          @keyframes spin{to{transform:rotate(360deg)}}
