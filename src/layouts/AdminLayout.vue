<template>
  <div class="min-h-screen bg-white text-neutral-900 flex flex-col">
    <header class="h-[72px] flex items-center border-b border-neutral-200">
      <div class="mx-auto w-full max-w-6xl px-6 flex items-center gap-6">
        <div class="flex items-center gap-3 font-semibold text-sm">
          <img :src="logoUrl" alt="Nexora Logo" class="w-9 h-9 rounded-2xl object-cover" />
          <div>
            <h1 class="text-base font-semibold leading-none">Nexora Admin</h1>
            <p class="text-[11px] text-neutral-500 leading-tight">Panel de administración</p>
          </div>
        </div>
        <!-- La pastilla NO va en la navbar según diseño -->
        <div class="ml-auto">
          <button @click="logout" class="h-9 px-4 rounded-full border border-neutral-200 text-sm hover:bg-neutral-50">Salir</button>
        </div>
      </div>
    </header>
    <main class="flex-1 px-6 py-10 mx-auto w-full max-w-6xl">
      <!-- Pastilla centrada debajo del header, como en el mock -->
      <div class="w-full flex justify-center mb-10">
        <SegmentedTabs :tabs="tabs" v-model="activeTab" @change="onTabChange" />
      </div>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SegmentedTabs from '../components/SegmentedTabs.vue'

const router = useRouter()
const route = useRoute()

// Assets
const logoUrl = new URL('../assets/images/logo.png', import.meta.url).href
const dashboardIcon = new URL('../assets/images/dash-icon.png', import.meta.url).href
const postsIcon = new URL('../assets/images/ia-icon.png', import.meta.url).href

const tabs = [
  { key: 'dashboard', label: 'Dashboard', to: '/dashboard', iconSrc: dashboardIcon },
  { key: 'posts-ia', label: 'Posts IA', to: '/posts-ia', iconSrc: postsIcon }
]

const activeTab = ref(tabs.find(t => t.to === route.path)?.key || 'dashboard')

watch(() => route.path, (p) => {
  activeTab.value = tabs.find(t => t.to === p)?.key || 'dashboard'
})

function onTabChange(key){
  const tab = tabs.find(t => t.key === key)
  if(tab) router.push(tab.to)
}

function logout(){
  router.push('/login')
}
</script>
