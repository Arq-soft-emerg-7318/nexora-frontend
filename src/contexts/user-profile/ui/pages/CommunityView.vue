<template>
  <div class="flex-1 mx-auto w-full max-w-4xl space-y-6">
    <div v-if="loading" class="p-6 text-center text-neutral-500">Cargando posts de la comunidad…</div>
    <div v-else-if="error" class="p-4 rounded bg-yellow-50 text-sm text-yellow-700">Error: {{ error }}</div>
    <div v-else>
      <div class="rounded-2xl border border-blue-100 p-6 bg-white">
        <h2 class="text-2xl font-semibold">{{ communityName || ('Comunidad ' + id) }}</h2>
        <p class="text-sm text-neutral-500">Posts: {{ posts.length }}</p>
      </div>

      <section class="space-y-3">
        <div v-for="p in posts" :key="p.id" class="p-4 rounded-lg bg-white border">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ p.title }}</p>
              <p class="text-xs text-neutral-500">Autor #{p.authorId} · Reacciones: {{ p.reactions ?? 0 }}</p>
            </div>
            <div class="text-sm text-neutral-500">ID #{p.id}</div>
          </div>
          <p class="mt-2 text-sm text-neutral-600">{{ p.body && p.body.slice(0,240) }}{{ p.body && p.body.length > 240 ? '…' : '' }}</p>
          <div v-if="p.fileUrl" class="mt-2"><a :href="p.fileUrl" target="_blank" class="text-sm text-blue-600">Ver archivo</a></div>
        </div>
      </section>

      <details class="mt-4 text-sm text-neutral-600">
        <summary class="cursor-pointer">Mostrar JSON crudo</summary>
        <pre class="whitespace-pre-wrap mt-2 text-xs bg-neutral-50 p-3 rounded">{{ JSON.stringify(postsRaw, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { API_BASE } from '../../../../config/api.js'
import localPosts from '../../../../data/posts.json'
import localCommunities from '../../../../data/communities.json'

const route = useRoute()
const id = route.params.id

const posts = ref([])
const postsRaw = ref(null)
const communityName = ref('')
const loading = ref(false)
const error = ref('')

async function fetchCommunityPosts(cid){
  loading.value = true
  error.value = ''
  try{
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/api/v1/posts/community/${cid}`, { headers })
    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${txt}`)
    }
    const data = await res.json()
    postsRaw.value = data
    const list = Array.isArray(data) ? data : (data.items || data.data || [])
    posts.value = list
  }catch(e){
    console.warn('Error fetching community posts, using local fallback', e)
    postsRaw.value = localPosts.filter(p => String(p.communityId) === String(cid))
    posts.value = postsRaw.value
    if (posts.value.length === 0) {
      // if empty, show all as fallback
      postsRaw.value = localPosts
      posts.value = localPosts
    }
  }finally{
    // try to set community name from API or local
    const comm = localCommunities.find(c => String(c.id) === String(cid))
    communityName.value = comm ? comm.name : ''
    loading.value = false
  }
}

onMounted(() => { if (id) fetchCommunityPosts(id) })
</script>

<style scoped>
</style>
