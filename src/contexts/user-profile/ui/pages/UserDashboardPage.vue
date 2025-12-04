<template>
  <div class="flex-1 mx-auto w-full max-w-6xl space-y-6 p-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Usuarios</h1>
        <p class="text-sm text-gray-500">Gestión y estadísticas de usuarios del sistema</p>
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
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="p-6 bg-gradient-to-br from-blue-200 to-blue-300 text-gray-800 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Total Usuarios</p>
            <p class="text-3xl font-bold mt-1">{{ users.length }}</p>
            <p class="text-xs mt-2 opacity-70">Registrados en el sistema</p>
          </div>
          <div class="p-4 bg-white bg-opacity-40 rounded-full">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="p-6 bg-gradient-to-br from-purple-200 to-purple-300 text-gray-800 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Total Posts</p>
            <p class="text-3xl font-bold mt-1">{{ postsCount }}</p>
            <p class="text-xs mt-2 opacity-70">Publicaciones totales</p>
          </div>
          <div class="p-4 bg-white bg-opacity-40 rounded-full">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="p-6 bg-gradient-to-br from-indigo-200 to-indigo-300 text-gray-800 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Con Archivos</p>
            <p class="text-3xl font-bold mt-1">{{ postsWithFiles }}</p>
            <p class="text-xs mt-2 opacity-70">Posts con archivos</p>
          </div>
          <div class="p-4 bg-white bg-opacity-40 rounded-full">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </div>
        </div>
      </div>

      <div class="p-6 bg-gradient-to-br from-sky-200 to-sky-300 text-gray-800 rounded-xl shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-80">Promedio Posts</p>
            <p class="text-3xl font-bold mt-1">{{ avgPostsPerUser }}</p>
            <p class="text-xs mt-2 opacity-70">Por usuario</p>
          </div>
          <div class="p-4 bg-white bg-opacity-40 rounded-full">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráfico de comunidades -->
    <div class="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Posts por Comunidad</h2>
      <div v-if="chartData.length === 0" class="text-center py-8 text-gray-500">
        No hay datos disponibles
      </div>
      <div v-else class="space-y-4">
        <div v-for="item in chartData.slice(0, 6)" :key="item.label" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="font-medium text-gray-700">{{ item.label }}</span>
            <span class="text-gray-500">{{ item.value }} posts</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3">
            <div
                class="bg-gradient-to-r from-blue-300 to-indigo-300 h-3 rounded-full transition-all duration-500"
                :style="{ width: `${(item.value / maxChartValue) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros y búsqueda -->
    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar usuarios por nombre o email..."
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            @input="filterUsers"
        />
        <select
            v-model="sortBy"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            @change="filterUsers"
        >
          <option value="name">Ordenar por nombre</option>
          <option value="posts">Ordenar por posts</option>
          <option value="recent">Más recientes</option>
        </select>
        <select
            v-model="filterRole"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            @change="filterUsers"
        >
          <option value="">Todos los roles</option>
          <option value="admin">Administradores</option>
          <option value="user">Usuarios</option>
          <option value="moderator">Moderadores</option>
        </select>
      </div>
    </div>

    <!-- Top usuarios más activos -->
    <div class="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Usuarios Más Activos</h2>
      <div v-if="topActiveUsers.length === 0" class="text-center py-8 text-gray-500">
        No hay datos disponibles
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
            v-for="(user, index) in topActiveUsers"
            :key="user.id"
            class="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center text-gray-800 font-bold text-xl">
            {{ index + 1 }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-semibold truncate text-gray-800">{{ user.name }}</p>
            <p class="text-sm text-gray-500 truncate">{{ user.email }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ user.posts }} posts publicados</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de usuarios -->
    <div class="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold text-gray-800">Lista de Usuarios ({{ filteredUsers.length }})</h2>
        <button
            @click="exportUsers"
            class="px-4 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors text-sm flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar CSV
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent"></div>
        <p class="mt-2 text-gray-500">Cargando usuarios…</p>
      </div>

      <div v-else-if="error" class="p-4 rounded-lg bg-red-50 text-sm text-red-700">
        Error cargando usuarios: {{ error }}
      </div>

      <div v-else-if="filteredUsers.length === 0" class="text-center py-8 text-gray-500">
        No se encontraron usuarios con los filtros aplicados
      </div>

      <div v-else class="space-y-3">
        <div
            v-for="user in paginatedUsers"
            :key="user.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-4 flex-1">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center text-gray-800 font-bold text-lg">
              {{ getInitials(user.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="font-semibold text-gray-800">{{ user.name }}</p>
                <span v-if="user.title" class="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                  {{ user.title }}
                </span>
              </div>
              <p class="text-sm text-gray-500">{{ user.email }}</p>
              <div class="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span>{{ user.posts || 0 }} posts</span>
                <span v-if="user.aiPosts">• {{ user.aiPosts }} con IA</span>
                <span v-if="user.since">• Desde {{ user.since }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
                @click="viewUserDetails(user)"
                class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                title="Ver perfil"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            <button
                @click="editUser(user)"
                class="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                title="Editar usuario"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
                @click="deleteUser(user.id)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar usuario"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="filteredUsers.length > usersPerPage" class="mt-6 flex justify-center gap-2">
          <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
              'px-4 py-2 rounded-lg transition-colors',
              currentPage === page
                ? 'bg-blue-400 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de detalles del usuario -->
    <div
        v-if="selectedUser"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        @click.self="selectedUser = null"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold text-gray-800">{{ selectedUser.name }}</h2>
          <button
              @click="selectedUser = null"
              class="text-gray-500 hover:text-gray-700"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full flex items-center justify-center text-gray-800 font-bold text-3xl">
              {{ getInitials(selectedUser.name) }}
            </div>
            <div>
              <p class="text-lg font-semibold text-gray-800">{{ selectedUser.name }}</p>
              <p class="text-sm text-gray-500">{{ selectedUser.email }}</p>
              <p v-if="selectedUser.title" class="text-sm text-gray-600 mt-1">{{ selectedUser.title }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-gray-600">Posts totales</p>
              <p class="text-2xl font-bold text-blue-600">{{ selectedUser.posts || 0 }}</p>
            </div>
            <div class="p-3 bg-purple-50 rounded-lg">
              <p class="text-sm text-gray-600">Posts con IA</p>
              <p class="text-2xl font-bold text-purple-600">{{ selectedUser.aiPosts || 0 }}</p>
            </div>
          </div>
          <div>
            <h3 class="font-semibold text-gray-700 mb-1">Usuario ID</h3>
            <p class="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
              {{ selectedUser.id }}
            </p>
          </div>
          <div v-if="selectedUser.since">
            <h3 class="font-semibold text-gray-700 mb-1">Miembro desde</h3>
            <p class="text-sm text-gray-600">{{ selectedUser.since }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { API_BASE } from '../../../../config/api.js'
import localUsers from '../../../../data/users.json'
import localPosts from '../../../../data/posts.json'
import localCommunities from '../../../../data/communities.json'

const users = ref([])
const filteredUsers = ref([])
const loading = ref(false)
const error = ref('')
const posts = ref([])
const postsCount = ref(0)
const postsWithFiles = ref(0)
const communities = ref([])
const chartData = ref([])
const searchQuery = ref('')
const sortBy = ref('name')
const filterRole = ref('')
const selectedUser = ref(null)
const currentPage = ref(1)
const usersPerPage = 10

const avgPostsPerUser = computed(() => {
  return users.value.length > 0 ? Math.round((postsCount.value / users.value.length) * 10) / 10 : 0
})

const maxChartValue = computed(() => {
  return Math.max(...chartData.value.map(item => item.value), 1)
})

const topActiveUsers = computed(() => {
  return [...users.value]
      .sort((a, b) => (b.posts || 0) - (a.posts || 0))
      .slice(0, 6)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / usersPerPage)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage
  const end = start + usersPerPage
  return filteredUsers.value.slice(start, end)
})

function getInitials(name) {
  if (!name) return '?'
  return name.slice(0, 2).toUpperCase()
}

function filterUsers() {
  let result = [...users.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(u =>
        u.name?.toLowerCase().includes(query) || u.email?.toLowerCase().includes(query)
    )
  }

  if (filterRole.value) {
    result = result.filter(u => u.title?.toLowerCase().includes(filterRole.value))
  }

  if (sortBy.value === 'name') {
    result.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  } else if (sortBy.value === 'posts') {
    result.sort((a, b) => (b.posts || 0) - (a.posts || 0))
  } else if (sortBy.value === 'recent') {
    result.sort((a, b) => (b.id || 0) - (a.id || 0))
  }

  filteredUsers.value = result
  currentPage.value = 1
}

function viewUserDetails(user) {
  selectedUser.value = user
}

function editUser(user) {
  alert(`Editar usuario: ${user.name}\n(Función por implementar)`)
}

async function deleteUser(userId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return

  try {
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${API_BASE}/api/v1/users/${userId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (res.ok) {
      users.value = users.value.filter(u => u.id !== userId)
      filterUsers()
      alert('Usuario eliminado exitosamente')
    } else {
      alert('Error al eliminar el usuario')
    }
  } catch (e) {
    console.error('Error deleting user:', e)
    alert('Error al eliminar el usuario')
  }
}

function exportUsers() {
  const csv = [
    ['ID', 'Nombre', 'Email', 'Rol', 'Posts', 'Posts IA', 'Desde'].join(','),
    ...filteredUsers.value.map(u => [
      u.id, u.name, u.email, u.title || '', u.posts || 0, u.aiPosts || 0, u.since || ''
    ].join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

async function fetchUsers() {
  loading.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/api/v1/users`, { headers })

    if (!res.ok) {
      const body = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${body}`)
    }

    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.items || data.data || [])

    // Obtener posts de cada usuario
    const usersWithPosts = await Promise.all(
        list.map(async (u) => {
          let userPosts = 0
          let userAiPosts = 0

          try {
            const postsRes = await fetch(`${API_BASE}/api/v1/posts/user/${u.id}`, { headers })
            if (postsRes.ok) {
              const postsData = await postsRes.json()
              const postsList = Array.isArray(postsData) ? postsData : (postsData.items || postsData.data || [])
              userPosts = postsList.length
              userAiPosts = postsList.filter(p => p.aiGenerated || p.isAiGenerated).length
            }
          } catch (e) {
            console.warn(`Error fetching posts for user ${u.id}:`, e)
          }

          return {
            id: u.id,
            name: u.name || u.username || u.email || `Usuario ${u.id}`,
            title: u.title || (u.roles ? u.roles.join(', ') : ''),
            email: u.email || '',
            posts: userPosts,
            aiPosts: userAiPosts,
            since: u.since || u.createdAt || ''
          }
        })
    )

    users.value = usersWithPosts
    filterUsers()
  } catch (e) {
    console.error('Error fetching users:', e)
    error.value = e.message || String(e)
    users.value = localUsers.map(u => ({
      id: u.id,
      name: u.name || u.username || `Usuario ${u.id}`,
      title: u.title || '',
      email: u.email || '',
      posts: u.posts ?? 0,
      aiPosts: u.aiPosts ?? 0,
      since: u.since || ''
    }))
    filterUsers()
  } finally {
    loading.value = false
  }
}

async function fetchPosts() {
  try {
    const token = localStorage.getItem('accessToken')
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/api/v1/posts`, { headers })

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      throw new Error(`HTTP ${res.status} ${txt}`)
    }

    const data = await res.json()
    const list = Array.isArray(data) ? data : (data.items || data.data || [])

    posts.value = list
    postsCount.value = list.length
    postsWithFiles.value = list.filter(p => p.fileUrl || p.fileId).length

    const counts = {}
    for (const p of list) {
      const cid = p.communityId ?? null
      if (cid == null) continue
      counts[cid] = (counts[cid] || 0) + 1
    }

    const arr = Object.keys(counts).map(k => ({ id: k, count: counts[k] }))
    arr.sort((a, b) => b.count - a.count)

    const mapped = arr.map(item => {
      const c = communities.value.find(x => String(x.id) === String(item.id))
      return { id: item.id, count: item.count, name: c ? c.name : null }
    })

    chartData.value = mapped.map(m => ({
      label: m.name || `Comunidad ${m.id}`,
      value: m.count
    }))
  } catch (e) {
    console.warn('Error fetching posts, using local posts.json', e)
    posts.value = localPosts
    postsCount.value = localPosts.length
    postsWithFiles.value = localPosts.filter(p => p.fileUrl || p.fileId).length
  }
}

async function refreshData() {
  await fetchUsers()
  await fetchPosts()
  alert('Datos actualizados exitosamente')
}

onMounted(() => {
  communities.value = localCommunities
  fetchUsers()
  fetchPosts()
})
</script>