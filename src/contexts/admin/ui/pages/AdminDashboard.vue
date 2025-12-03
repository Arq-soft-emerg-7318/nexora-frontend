<template>
  <div class="flex-1 mx-auto w-full max-w-6xl space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold">Admin Dashboard</h2>
        <p class="text-sm text-neutral-500">Resumen rápido de la plataforma</p>
      </div>
    </header>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Usuarios" :value="usersCount">
        <template #icon>👥</template>
      </StatCard>
      <StatCard title="Posts" :value="postsCount">
        <template #icon>✍️</template>
      </StatCard>
      <StatCard title="Suscripciones" :value="subsCount">
        <template #icon>💳</template>
      </StatCard>
      <StatCard title="Comunidades" :value="communitiesCount">
        <template #icon>🏘️</template>
      </StatCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <section class="rounded-2xl border border-blue-100 p-4">
          <h3 class="text-lg font-semibold mb-3">Últimos posts</h3>
          <div class="space-y-3">
            <div v-for="p in recentPosts" :key="p.id" class="flex items-center justify-between p-3 rounded-lg bg-white">
              <div>
                <p class="font-medium">{{ p.title }}</p>
                <p class="text-xs text-neutral-500">Autor #{p.authorId} · Reacciones: {{ p.reactions ?? 0 }}</p>
              </div>
              <div class="text-sm text-neutral-500">ID #{p.id}</div>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-blue-100 p-4">
          <h3 class="text-lg font-semibold mb-3">Últimos usuarios</h3>
          <div class="space-y-3">
            <div v-for="u in recentUsers" :key="u.id" class="flex items-center justify-between p-3 rounded-lg bg-white">
              <div>
                <p class="font-medium">{{ u.username || u.email || ('Usuario ' + u.id) }}</p>
                <p class="text-xs text-neutral-500">Roles: {{ (u.roles || []).join(', ') }}</p>
              </div>
              <div class="text-sm text-neutral-500">ID #{u.id}</div>
            </div>
          </div>
        </section>
      </div>

      <aside class="space-y-6">
        <section class="rounded-2xl border border-blue-100 p-4">
          <h4 class="text-sm font-medium mb-3">Top comunidades por posts</h4>
          <ul class="text-sm text-neutral-700 space-y-2">
            <li v-for="c in topCommunities" :key="c.id" class="flex justify-between">
              <span>{{ c.name || ('Comunidad ' + c.id) }}</span>
              <span class="font-medium">{{ c.count }}</span>
            </li>
          </ul>
        </section>

        <section class="rounded-2xl border border-blue-100 p-4">
          <h4 class="text-sm font-medium mb-3">Top autores (por posts)</h4>
          <ul class="text-sm text-neutral-700 space-y-2">
            <li v-for="a in topAuthors" :key="a.authorId" class="flex justify-between">
              <span>Autor #{a.authorId}</span>
              <span class="font-medium">{{ a.count }}</span>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatCard from '../../../../components/StatCard.vue'
import { API_BASE } from '../../../../config/api.js'
import localCommunities from '../../../../data/communities.json'

const usersCount = ref(0)
const postsCount = ref(0)
const subsCount = ref(0)
const communitiesCount = ref(0)

const recentUsers = ref([])
const recentPosts = ref([])
const topCommunities = ref([])
const topAuthors = ref([])

async function fetchAll(){
  const token = localStorage.getItem('accessToken')
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

  try{
    const [uRes, pRes, sRes, cRes] = await Promise.all([
      fetch(`${API_BASE}/api/v1/users`, { headers }),
      fetch(`${API_BASE}/api/v1/posts`, { headers }),
      fetch(`${API_BASE}/api/v1/subscriptions/admin`, { headers }),
      fetch(`${API_BASE}/api/v1/communities`, { headers })
    ])

    const users = await (uRes.ok ? uRes.json() : [])
    const posts = await (pRes.ok ? pRes.json() : [])
    const subs = await (sRes.ok ? sRes.json() : [])
    const comm = await (cRes.ok ? cRes.json() : [])

    // counts
    usersCount.value = Array.isArray(users) ? users.length : (users.total ?? 0)
    postsCount.value = Array.isArray(posts) ? posts.length : (posts.total ?? 0)
    subsCount.value = Array.isArray(subs) ? subs.length : (subs.total ?? 0)
    communitiesCount.value = Array.isArray(comm) ? comm.length : (comm.total ?? 0)

    // recents
    recentUsers.value = Array.isArray(users) ? users.slice(0,5) : []
    recentPosts.value = Array.isArray(posts) ? posts.slice(0,5) : []

    // posts per community
    const countsByCommunity = {}
    if (Array.isArray(posts)){
      for(const p of posts){
        const cid = p.communityId ?? null
        if (cid == null) continue
        countsByCommunity[cid] = (countsByCommunity[cid] || 0) + 1
      }
    }
    // map communities array to include counts
    const commWithCounts = Array.isArray(comm) ? comm.map(c => ({ id: c.id, name: c.name, count: countsByCommunity[c.id] || 0 })) : []
    commWithCounts.sort((a,b) => b.count - a.count)
    topCommunities.value = commWithCounts.slice(0,6)

    // posts per author
    const countsByAuthor = {}
    if (Array.isArray(posts)){
      for(const p of posts){
        const aid = p.authorId ?? 0
        countsByAuthor[aid] = (countsByAuthor[aid] || 0) + 1
      }
    }
    const authorsArr = Object.keys(countsByAuthor).map(k => ({ authorId: k, count: countsByAuthor[k] }))
    authorsArr.sort((a,b) => b.count - a.count)
    topAuthors.value = authorsArr.slice(0,6)

  }catch(e){
    console.warn('fetch admin data error', e)
  }
}

async function fetchCommunities(){
  try{
    const token = localStorage.getItem('accessToken')
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    const res = await fetch(`${API_BASE}/api/v1/communities/all`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.items || data.data || [])
    // replace communities in topCommunities mapping if names are available
    const mapNames = {}
    for(const c of list) mapNames[c.id] = c.name || c.title || `Comunidad ${c.id}`
    // update any topCommunities entries
    topCommunities.value = topCommunities.value.map(tc => ({ ...tc, name: mapNames[tc.id] || tc.name }))
    // also set communitiesCount if possible
    // (if fetchAll didn't set it or to override)
    // communitiesCount.value = list.length
  }catch(e){
    console.warn('Could not fetch /communities/all, keeping local fallback', e)
    // nothing else; existing topCommunities remain
  }
}

onMounted(()=>{ fetchAll(); fetchCommunities() })
</script>

<style scoped>
</style>
