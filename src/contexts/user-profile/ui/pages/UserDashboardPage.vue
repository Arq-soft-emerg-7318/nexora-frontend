<template>
  <div class="flex-1 mx-auto w-full max-w-6xl space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
      <div>
        <h2 class="text-2xl font-semibold">Usuarios</h2>
        <p class="text-sm text-neutral-500">Lista y estadísticas del sistema</p>
      </div>

      <div class="flex gap-4 w-full md:w-auto">
        <StatCard title="Usuarios" :value="users.length">
          <template #icon>👥</template>
        </StatCard>
        <StatCard title="Posts" :value="postsCount">
          <template #icon>✍️</template>
        </StatCard>
        <StatCard title="Con archivos" :value="postsWithFiles">
          <template #icon>📎</template>
        </StatCard>
      </div>
    </div>
  
      <section class="mt-4">
        <BarChartSimple v-if="chartData.length" :data="chartData" :width="700" :height="220" />
      </section>

    <div class="w-full">
      <SearchBar placeholder="Buscar post o usuarios …" />
    </div>

    <section class="rounded-2xl border border-blue-100 w-full">
      <header class="px-6 pt-6 pb-4 text-lg font-semibold">Estadísticas de Posts</header>
      <div class="px-6 pb-6 space-y-4 w-full">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="rounded-xl border border-blue-100 bg-white p-4">
            <p class="text-sm text-neutral-600">Total de posts</p>
            <p class="text-2xl font-semibold mt-2">{{ postsCount }}</p>
          </div>
          <div class="rounded-xl border border-blue-100 bg-white p-4">
            <p class="text-sm text-neutral-600">Posts con archivos</p>
            <p class="text-2xl font-semibold mt-2">{{ postsWithFiles }}</p>
          </div>
          <div class="rounded-xl border border-blue-100 bg-white p-4">
            <p class="text-sm text-neutral-600">Comunidades con más posts</p>
            <ul class="mt-2 text-sm text-neutral-700 space-y-1">
              <li v-for="c in topCommunities" :key="c.id" class="flex justify-between">
                <span>{{ c.name || ('Comunidad ' + c.id) }}</span>
                <span class="font-medium">{{ c.count }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-blue-100 w-full">
      <header class="px-6 pt-6 pb-4 text-lg font-semibold">Usuarios Registrados</header>
      <div class="px-6 pb-6 space-y-4 w-full">
        <div v-if="loading" class="p-6 text-center text-neutral-500">Cargando usuarios…</div>
        <div v-else-if="error" class="p-4 rounded bg-yellow-50 text-sm text-yellow-700">Error cargando usuarios: {{ error }}</div>
        <div v-else-if="users.length === 0" class="p-6 text-center text-neutral-500">No hay usuarios para mostrar.</div>
        <UserCard v-for="u in users" :key="u.id" :user="u" />

        <details class="mt-4 text-sm text-neutral-600">
          <summary class="cursor-pointer">Mostrar datos crudos (debug)</summary>
          <pre class="whitespace-pre-wrap mt-2 text-xs bg-neutral-50 p-3 rounded">{{ JSON.stringify(usersRaw, null, 2) }}</pre>
        </details>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatCard from '../../../../components/StatCard.vue'
import SearchBar from '../../../../components/SearchBar.vue'
import UserCard from '../components/UserCard.vue'
import BarChartSimple from '../../../social/ui/components/BarChartSimple.vue'
import { API_BASE } from '../../../../config/api.js'
import localUsers from '../../../../data/users.json'
import localPosts from '../../../../data/posts.json'
import localCommunities from '../../../../data/communities.json'

const users = ref([])
const usersRaw = ref(null)
const loading = ref(false)
const error = ref('')
const posts = ref([])
const postsRaw = ref(null)
const postsCount = ref(0)
const postsWithFiles = ref(0)
const topCommunities = ref([])
const communities = ref([])
const chartData = ref([])

async function fetchUsers(){
  loading.value = true
  error.value = ''
  try{
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/api/v1/users`, { headers })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${body}`)
    }
    const data = await res.json()
    console.log('Users fetched for /dashboard:', data)
    // keep raw for debugging
    usersRaw.value = data

    // normalize into shape expected by UserCard
    const list = Array.isArray(data) ? data : (data.items || data.data || [])
    users.value = list.map(u => ({
      id: u.id,
      name: u.name || u.username || u.email || `Usuario ${u.id}`,
      title: u.title || (u.roles ? u.roles.join(', ') : ''),
      email: u.email || '',
      posts: u.posts ?? 0,
      aiPosts: u.aiPosts ?? 0,
      since: u.since || ''
    }))
  }catch(e){
    console.error('Error fetching users:', e)
    error.value = e.message || String(e)
    // fallback to local data file
    console.log('Usando fallback local `data/users.json`')
    usersRaw.value = localUsers
    users.value = localUsers.map(u => ({
      id: u.id,
      name: u.name || u.username || `Usuario ${u.id}`,
      title: u.title || '',
      email: u.email || '',
      posts: u.posts ?? 0,
      aiPosts: u.aiPosts ?? 0,
      since: u.since || ''
    }))
  }finally{
    loading.value = false
  }
}

async function fetchPosts(){
  try{
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/api/v1/posts`, { headers })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${txt}`)
    }
    const data = await res.json()
    console.log('Posts fetched for /dashboard:', data)
    postsRaw.value = data
    const list = Array.isArray(data) ? data : (data.items || data.data || [])
    posts.value = list
    postsCount.value = list.length
    postsWithFiles.value = list.filter(p => p.fileUrl || p.fileId).length

    // compute posts per community
    const counts = {}
    for(const p of list){
      const cid = p.communityId ?? null
      if (cid == null) continue
      counts[cid] = (counts[cid] || 0) + 1
    }
    const arr = Object.keys(counts).map(k => ({ id: k, count: counts[k] }))
    arr.sort((a,b) => b.count - a.count)

    // Map community ids to names if we have communities list
    const mapped = arr.map(item => {
      const c = communities.value.find(x => String(x.id) === String(item.id))
      return { id: item.id, count: item.count, name: c ? c.name : null }
    })
    topCommunities.value = mapped.slice(0,6)
    // prepare chart data (posts per community)
    chartData.value = mapped.map(m => ({ label: m.name || (`Comunidad ${m.id}`), value: m.count }))
  }catch(e){
    console.warn('Error fetching posts, using local posts.json', e)
    postsRaw.value = localPosts
    posts.value = localPosts
    postsCount.value = localPosts.length
    postsWithFiles.value = localPosts.filter(p => p.fileUrl || p.fileId).length
    // compute top communities from local data if communityId present
    const counts = {}
    for(const p of localPosts){
      const cid = p.communityId ?? null
      if (cid == null) continue
      counts[cid] = (counts[cid] || 0) + 1
    }
    const arr = Object.keys(counts).map(k => ({ id: k, count: counts[k] }))
    arr.sort((a,b) => b.count - a.count)
    const mapped = arr.map(item => ({ id: item.id, count: item.count, name: (localCommunities.find(c=>String(c.id)===String(item.id))||{}).name || null }))
    topCommunities.value = mapped.slice(0,6)
  }
}

onMounted(() => { fetchUsers(); fetchPosts() })
</script>
