<template>
  <div class="mx-auto w-full max-w-6xl space-y-8">
    <h2 class="text-lg font-semibold">Publicaciones con IA</h2>

    <!-- Resumen moved to Usuarios page as requested -->

    <SearchBar placeholder="Buscar post o usuarios …" />

    <div>
      <div v-if="loading" class="p-6 text-center text-neutral-500">Cargando posts…</div>
      <div v-else-if="error" class="p-4 rounded bg-yellow-50 text-sm text-yellow-700">Error cargando posts: {{ error }}</div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <PostCard v-for="p in posts" :key="p.id" :post="p" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import StatCard from '../../../../components/StatCard.vue'
import SearchBar from '../../../../components/SearchBar.vue'
import PostCard from '../components/PostCardFixed.vue'
import BarChartSimple from '../components/BarChartSimple.vue'
import localPosts from '../../../../data/posts.json'
import localCommunities from '../../../../data/communities.json'
import localUsers from '../../../../data/users.json'
import { API_BASE } from '../../../../config/api.js'

const posts = ref([])
const loading = ref(false)
const error = ref('')

const totalPosts = ref(0)
const engagement = ref(0)
const activeUsers = ref(0)
const chartData = ref([])

const communitiesMap = {}
const communitiesList = ref([])
const usersMap = {}

async function fetchUsers(){
  try{
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/api/v1/users`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.items || data.data || [])
    for(const u of list) usersMap[u.id] = u.username || u.email || (`Usuario ${u.id}`)
  }catch(e){
    console.warn('Error fetching users, using local', e)
    for(const u of localUsers) usersMap[u.id] = u.username || u.email || (`Usuario ${u.id}`)
  }
}

async function fetchCommunities(){
  try{
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/api/v1/communities/all`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    console.log('Communities fetched:', data)
    const list = Array.isArray(data) ? data : (data.items || data.data || [])
    communitiesList.value = list
    for(const c of list) {
      // support numeric/string id and common name/title fields
      const key = (typeof c.id === 'number') ? c.id : String(c.id)
      const name = c.name || c.title || c.displayName || (`Comunidad ${c.id}`)
      communitiesMap[key] = name
      // also map string version of id
      communitiesMap[String(key)] = name
    }
  }catch(e){
    console.warn('Error fetching communities, using local', e)
    for(const c of localCommunities) communitiesMap[c.id] = c.name
  }
}

async function fetchPosts(){
  loading.value = true
  error.value = ''
  try{
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/api/v1/posts`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.items || data.data || [])
    // normalize to local posts shape
    posts.value = list.map(p => ({
      id: p.id,
      // strip markdown bold markers (**)
      title: (p.title || '').replace(/\*\*/g, ''),
      excerpt: p.body ? (String(p.body).slice(0,120).replace(/\*\*/g, '')) : ((p.excerpt || '').slice(0,120).replace(/\*\*/g, '')),
      likes: p.reactions ?? 0,
      comments: p.comments ?? 0,
      timeAgo: p.timeAgo || '',
      author: { name: usersMap[p.authorId] || p.authorName || (`Usuario ${p.authorId}`), avatar: p.authorAvatar || '/src/assets/images/user-icon.png' },
      fileUrl: p.fileUrl || null,
      communityId: p.communityId ?? null,
      // try map lookup first, then fallback to searching the fetched communities list robustly
      communityName: (communitiesMap[p.communityId] || communitiesMap[String(p.communityId)] || communitiesMap[p.communityId?.toString?.()]) || (communitiesList.value.find(c => String(c.id) === String(p.communityId) || Number(c.id) === Number(p.communityId)) || {}).name || null
    }))

    // after normalizing posts, try to fetch likes count per post from API
    await fetchLikesForPosts()
    computeStats()
  }catch(e){
    console.warn('Error fetching posts, using local', e)
    posts.value = localPosts
    error.value = e.message || String(e)
  }finally{
    loading.value = false
  }
}

function computeStats(){
  const list = posts.value || []
  totalPosts.value = list.length
  engagement.value = list.reduce((s,p)=> s + (Number(p.likes)||0), 0)
  const authors = new Set(list.map(p=> p.author?.name || ''))
  activeUsers.value = authors.size

  // posts per community
  const byCommunity = {}
  for(const p of list){
    const name = p.communityName || ('Comunidad ' + (p.communityId ?? 'sin'))
    byCommunity[name] = (byCommunity[name] || 0) + 1
  }
  const arr = Object.keys(byCommunity).map(k=> ({ label: k, value: byCommunity[k] }))
  arr.sort((a,b)=> b.value - a.value)
  chartData.value = arr.slice(0,10)
}

function formatNumber(n){
  return (n || 0).toLocaleString()
}

async function fetchLikesForPosts(){
  if (!posts.value || posts.value.length === 0) return
  const token = localStorage.getItem('accessToken')
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
  await Promise.all(posts.value.map(async (post) => {
    try{
      if (!post.id) return
      const res = await fetch(`${API_BASE}/api/v1/likes/post/${post.id}/count`, { headers })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      if (data && typeof data.likes !== 'undefined') post.likes = data.likes
    }catch(err){
      // don't fail hard; keep previous likes
      console.warn('Could not fetch likes for post', post.id, err)
    }
  }))
}

onMounted(async ()=>{ await fetchUsers(); await fetchCommunities(); await fetchPosts() })
</script>
