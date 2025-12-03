<template>
  <div class="flex-1 mx-auto w-full max-w-6xl space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold">Posts</h2>
        <p class="text-sm text-neutral-500">Revisar y moderar posts</p>
      </div>
    </header>

    <section class="rounded-2xl border border-blue-100 p-4">
      <div class="space-y-3">
        <div v-for="p in posts" :key="p.id" class="p-3 rounded-lg bg-white border">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium">{{ p.title }}</p>
              <p class="text-xs text-neutral-500">Autor #{p.authorId} · Categoria #{p.categoryId}</p>
            </div>
            <div class="text-sm text-neutral-500">ID #{p.id}</div>
          </div>
          <p class="mt-2 text-sm text-neutral-600">{{ p.body && p.body.slice(0,200) }}{{ p.body && p.body.length > 200 ? '…' : '' }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_BASE } from '../../../../config/api.js'

const posts = ref([])

async function fetchPosts(){
  try{
    const token = localStorage.getItem('accessToken')
    const res = await fetch(`${API_BASE}/api/v1/posts`, { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
    if (res.ok) posts.value = await res.json()
  }catch(e){ console.warn(e) }
}

onMounted(fetchPosts)
</script>

<style scoped>
</style>
