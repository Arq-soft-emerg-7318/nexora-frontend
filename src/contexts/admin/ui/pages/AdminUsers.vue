<template>
  <div class="flex-1 mx-auto w-full max-w-6xl space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold">Usuarios</h2>
        <p class="text-sm text-neutral-500">Administrar usuarios y roles</p>
      </div>
    </header>

    <section class="rounded-2xl border border-blue-100 p-4">
      <table class="w-full text-left">
        <thead>
          <tr class="text-sm text-neutral-500">
            <th class="p-2">ID</th>
            <th class="p-2">Username / Email</th>
            <th class="p-2">Roles</th>
            <th class="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id" class="border-t">
            <td class="p-2 text-sm">{{ u.id }}</td>
            <td class="p-2 text-sm">{{ u.username || u.email }}</td>
            <td class="p-2 text-sm">{{ (u.roles || []).join(', ') }}</td>
            <td class="p-2 text-sm">
              <button class="px-3 py-1 rounded bg-blue-600 text-white text-xs">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_BASE } from '../../../../config/api.js'

const users = ref([])

async function fetchUsers(){
  try{
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${API_BASE}/api/v1/users`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
    if (res.ok) users.value = await res.json()
  }catch(e){ console.warn(e) }
}

onMounted(fetchUsers)
</script>

<style scoped>
</style>
