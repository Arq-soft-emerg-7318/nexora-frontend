<template>
  <div class="flex-1 mx-auto w-full max-w-3xl space-y-6">
    <div v-if="loading" class="p-6 text-center text-neutral-500">Cargando perfil…</div>
    <div v-else-if="error" class="p-4 rounded bg-yellow-50 text-sm text-yellow-700">Error: {{ error }}</div>
    <div v-else-if="!profile" class="p-6 text-center text-neutral-500">Perfil no encontrado.</div>
    <div v-else class="rounded-2xl border border-blue-100 p-6 bg-white">
      <h2 class="text-2xl font-semibold">{{ profile.firstName }} {{ profile.lastName }}</h2>
      <p class="text-sm text-neutral-500">Usuario ID: {{ profile.userId ?? profile.id }}</p>

      <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-neutral-500">Email</p>
          <p class="font-medium">{{ profile.email }}</p>
        </div>
        <div>
          <p class="text-xs text-neutral-500">Teléfono</p>
          <p class="font-medium">{{ profile.phone || '-' }}</p>
        </div>
        <div>
          <p class="text-xs text-neutral-500">Dirección</p>
          <p class="font-medium">{{ profile.direction || profile.address || '-' }}</p>
        </div>
        <div>
          <p class="text-xs text-neutral-500">Documento</p>
          <p class="font-medium">{{ profile.documentType || '-' }} - {{ profile.documentNumber || '-' }}</p>
        </div>
      </div>

      <div class="mt-6">
        <button @click="goBack" class="px-4 py-2 rounded-lg border border-neutral-200">Volver</button>
      </div>
    </div>

    <details class="mt-4 text-sm text-neutral-600">
      <summary class="cursor-pointer">Mostrar JSON crudo</summary>
      <pre class="whitespace-pre-wrap mt-2 text-xs bg-neutral-50 p-3 rounded">{{ JSON.stringify(profileRaw, null, 2) }}</pre>
    </details>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { API_BASE } from '../../../../config/api.js'

const route = useRoute()
const router = useRouter()

const profile = ref(null)
const profileRaw = ref(null)
const loading = ref(false)
const error = ref('')

async function fetchProfile(id){
  loading.value = true
  error.value = ''
  try{
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/api/v1/profiles/${id}`, { headers })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${txt}`)
    }
    const data = await res.json()
    console.log('Profile fetched:', data)
    profileRaw.value = data
    profile.value = data
  }catch(e){
    console.error('Error fetching profile:', e)
    error.value = e.message || String(e)
  }finally{
    loading.value = false
  }
}

onMounted(() => {
  const id = route.params.id
  if (!id) { error.value = 'No se especificó id de perfil'; return }
  fetchProfile(id)
})

function goBack(){ router.back() }
</script>

<style scoped>
</style>
