<template>
  <div class="flex-1 mx-auto w-full max-w-7xl space-y-6 p-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Publicaciones con IA</h1>
        <p class="text-sm text-gray-500">Gestión y análisis de contenido generado con inteligencia artificial</p>
      </div>
      <button
          @click="refreshData"
          class="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Actualizar
      </button>
    </header>

    <!-- Tarjetas de estadísticas -->
    <div class="flex justify-center items-center">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">

      <div class="p-6 bg-gradient-to-br from-purple-200 to-purple-300 text-gray-800 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Total Reacciones</p>
            <p class="text-3xl font-bold mt-1">{{ stats.totalLikes }}</p>
            <p class="text-xs mt-2 opacity-70">Promedio: {{ stats.avgLikes }} por post</p>
          </div>
          <div class="p-4 bg-white bg-opacity-40 rounded-full">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="p-6 bg-gradient-to-br from-indigo-200 to-indigo-300 text-gray-800 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Con Archivos</p>
            <p class="text-3xl font-bold mt-1">{{ stats.postsWithFiles }}</p>
            <p class="text-xs mt-2 opacity-70">{{ stats.filesPercentage }}% del total</p>
          </div>
          <div class="p-4 bg-white bg-opacity-40 rounded-full">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="p-6 bg-gradient-to-br from-sky-200 to-sky-300 text-gray-800 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Autores Activos</p>
            <p class="text-3xl font-bold mt-1">{{ stats.uniqueAuthors }}</p>
            <p class="text-xs mt-2 opacity-70">Creando contenido</p>
          </div>
          <div class="p-4 bg-white bg-opacity-40 rounded-full">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Gráficos y Top Autores -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Gráfico de comunidades -->
      <div class="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Posts por Comunidad</h2>
        <div v-if="chartData.length === 0" class="text-center py-8 text-gray-500">
          No hay datos disponibles
        </div>
        <div v-else class="space-y-4">
          <div v-for="item in chartData" :key="item.label" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="font-medium text-gray-700">{{ item.label }}</span>
              <span class="text-gray-500">{{ item.value }} posts</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-3">
              <div
                  class="bg-gradient-to-r from-blue-300 to-indigo-300 h-3 rounded-full transition-all duration-500"
                  :style="{ width: ((item.value / maxChartValue) * 100) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top autores -->
      <div class="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Top Autores</h2>
        <div v-if="topAuthors.length === 0" class="text-center py-8 text-gray-500">
          No hay datos disponibles
        </div>
        <div v-else class="space-y-3">
          <div
              v-for="(author, index) in topAuthors"
              :key="author.id"
              class="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center text-gray-800 font-bold">
              {{ index + 1 }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold truncate text-gray-800">{{ author.name }}</p>
              <p class="text-xs text-gray-500">{{ author.posts }} posts • {{ author.likes }} likes</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar posts o autores..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
            v-model="selectedCommunity"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todas las comunidades</option>
          <option v-for="c in communities" :key="c.id" :value="c.id">
            {{ c.name || c.title }}
          </option>
        </select>
        <select
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="recent">Más recientes</option>
          <option value="likes">Más likes</option>
        </select>
        <label class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
          <input
              v-model="showOnlyAI"
              type="checkbox"
              class="w-4 h-4 text-blue-500"
          />
          <span class="text-sm text-gray-700">Solo posts con IA</span>
        </label>
      </div>
    </div>

    <!-- Lista de posts -->
    <div class="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">
        Publicaciones ({{ displayPosts.length }})
      </h2>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-400 border-t-transparent"></div>
        <p class="mt-4 text-gray-500">Cargando posts…</p>
      </div>

      <div v-else-if="error" class="p-4 rounded-lg bg-yellow-50 text-sm text-yellow-700">
        Error cargando posts: {{ error }}
      </div>

      <div v-else-if="displayPosts.length === 0" class="text-center py-12 text-gray-500">
        No se encontraron publicaciones con los filtros aplicados
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
            v-for="post in displayPosts"
            :key="post.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center text-gray-800 font-bold text-xs">
                {{ getInitials(post.authorName) }}
              </div>
              <div class="text-xs">
                <p class="font-semibold text-gray-800">{{ post.authorName }}</p>
                <p class="text-gray-500">{{ formatTimeAgo(post.createdAt) }}</p>
              </div>
            </div>
            <span v-if="post.aiGenerated" class="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              IA
            </span>
          </div>

          <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">{{ post.title }}</h3>
          <p class="text-sm text-gray-600 mb-3 line-clamp-3">{{ post.body }}</p>

          <!-- Imagen del post -->
          <div v-if="post.fileUrl" class="mb-3 rounded-lg overflow-hidden">
            <img
                :src="post.fileUrl"
                :alt="post.title"
                class="w-full h-40 object-cover"
                @error="handleImageError"
            />
          </div>

          <p v-if="post.communityName" class="text-xs text-gray-500 mb-3 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {{ post.communityName }}
          </p>

          <div class="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-200">
            <div class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {{ post.reactions }}
            </div>
            <div v-if="post.fileUrl" class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Archivo
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { API_BASE } from '../../../../config/api.js'
import localPosts from '../../../../data/posts.json'
import localCommunities from '../../../../data/communities.json'
import localUsers from '../../../../data/users.json'

const allPosts = ref([])
const communities = ref([])
const users = ref([])
const loading = ref(false)
const error = ref('')

const searchQuery = ref('')
const selectedCommunity = ref('')
const sortBy = ref('recent')
const showOnlyAI = ref(true)

const stats = computed(() => {
  const posts = displayPosts.value
  const aiPosts = posts.filter(p => p.aiGenerated)
  const totalLikes = posts.reduce((sum, p) => sum + (p.reactions || 0), 0)
  const postsWithFiles = posts.filter(p => p.fileUrl).length
  const uniqueAuthors = new Set(posts.map(p => p.authorId)).size

  return {
    totalPosts: posts.length,
    aiPosts: aiPosts.length,
    aiPercentage: posts.length > 0 ? Math.round((aiPosts.length / posts.length) * 100) : 0,
    totalLikes,
    postsWithFiles,
    filesPercentage: posts.length > 0 ? Math.round((postsWithFiles / posts.length) * 100) : 0,
    avgLikes: posts.length > 0 ? Math.round(totalLikes / posts.length) : 0,
    uniqueAuthors
  }
})

const chartData = computed(() => {
  const byCommunity = {}
  displayPosts.value.forEach(p => {
    const communityName = p.communityName || `Comunidad ${p.communityId || 'sin'}`
    byCommunity[communityName] = (byCommunity[communityName] || 0) + 1
  })

  return Object.entries(byCommunity)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
})

const maxChartValue = computed(() => {
  return Math.max(...chartData.value.map(item => item.value), 1)
})

const topAuthors = computed(() => {
  const byAuthor = {}
  displayPosts.value.forEach(p => {
    const authorName = p.authorName || `Usuario ${p.authorId}`
    if (!byAuthor[p.authorId]) {
      byAuthor[p.authorId] = {
        id: p.authorId,
        name: authorName,
        posts: 0,
        likes: 0
      }
    }
    byAuthor[p.authorId].posts++
    byAuthor[p.authorId].likes += (p.reactions || 0)
  })

  return Object.values(byAuthor)
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 5)
})

const displayPosts = computed(() => {
  let result = [...allPosts.value]



  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.body?.toLowerCase().includes(query) ||
        p.authorName?.toLowerCase().includes(query)
    )
  }

  if (selectedCommunity.value) {
    result = result.filter(p => String(p.communityId) === selectedCommunity.value)
  }

  if (sortBy.value === 'recent') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'likes') {
    result.sort((a, b) => (b.reactions || 0) - (a.reactions || 0))
  }

  return result
})

function getInitials(name) {
  if (!name) return '?'
  return name.slice(0, 2).toUpperCase()
}

function formatTimeAgo(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now - date
  const diffInMins = Math.floor(diffInMs / 60000)
  const diffInHours = Math.floor(diffInMs / 3600000)
  const diffInDays = Math.floor(diffInMs / 86400000)

  if (diffInMins < 60) return `Hace ${diffInMins} min`
  if (diffInHours < 24) return `Hace ${diffInHours}h`
  if (diffInDays < 7) return `Hace ${diffInDays}d`
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

function handleImageError(event) {
  event.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible'
}

async function fetchUsers() {
  try {
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/api/v1/users`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.items || data.data || [])
    users.value = list
    return list
  } catch (e) {
    console.warn('Error fetching users, using local', e)
    users.value = localUsers
    return localUsers
  }
}

async function fetchCommunities() {
  try {
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/api/v1/communities/all`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.items || data.data || [])
    communities.value = list
    return list
  } catch (e) {
    console.warn('Error fetching communities, using local', e)
    communities.value = localCommunities
    return localCommunities
  }
}

async function fetchPosts(usersList, communitiesList) {
  loading.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/api/v1/posts`, { headers })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.items || data.data || [])

    const usersMap = {}
    usersList.forEach(u => {
      usersMap[u.id] = u.name || u.username || u.email || `Usuario ${u.id}`
    })

    const communitiesMap = {}
    communitiesList.forEach(c => {
      communitiesMap[c.id] = c.name || c.title || `Comunidad ${c.id}`
    })

    allPosts.value = list.map(p => ({
      id: p.id,
      title: (p.title || '').replace(/\*\*/g, ''),
      body: p.body ? String(p.body).slice(0, 150) : '',
      authorId: p.authorId,
      authorName: usersMap[p.authorId] || `Usuario ${p.authorId}`,
      communityId: p.communityId,
      communityName: communitiesMap[p.communityId] || `Comunidad ${p.communityId}`,
      reactions: 0, // Se actualizará después
      comments: p.comments || 0,
      aiGenerated: p.aiGenerated || p.isAiGenerated || false,
      fileUrl: p.fileUrl || null,
      createdAt: p.createdAt || new Date().toISOString()
    }))

    // Obtener likes para cada post
    await fetchLikesForPosts()
  } catch (e) {
    console.warn('Error fetching posts, using local', e)
    error.value = e.message || String(e)
    allPosts.value = localPosts
  } finally {
    loading.value = false
  }
}

async function fetchLikesForPosts() {
  if (!allPosts.value || allPosts.value.length === 0) return

  const token = localStorage.getItem('accessToken')
  const headers = token ? { 'Authorization': `Bearer ${token}` } : {}

  await Promise.all(allPosts.value.map(async (post) => {
    try {
      if (!post.id) return
      const res = await fetch(`${API_BASE}/api/v1/likes/post/${post.id}/count`, { headers })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      // El backend puede devolver { likes: number } o { count: number } o solo un número
      if (typeof data === 'number') {
        post.reactions = data
      } else if (data && typeof data.likes !== 'undefined') {
        post.reactions = data.likes
      } else if (data && typeof data.count !== 'undefined') {
        post.reactions = data.count
      }
    } catch (err) {
      // Si falla, mantener el valor por defecto (0)
      console.warn('Could not fetch likes for post', post.id, err)
    }
  }))
}

async function refreshData() {
  const usersList = await fetchUsers()
  const communitiesList = await fetchCommunities()
  await fetchPosts(usersList, communitiesList)
}

onMounted(() => {
  refreshData()
})
</script>