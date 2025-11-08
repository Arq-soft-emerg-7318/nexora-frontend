<template>
  <div class="space-y-8">
    <h2 class="text-lg font-semibold">Publicaciones con IA</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatCard title="Total de Posts" :value="24589"><template #icon><img src="/src/assets/images/total-icon.png" alt="Posts Icon" class="w-6 object-cover" /></template></StatCard>
      <StatCard title="Engagement" :value="8432"><template #icon><img src="/src/assets/images/engan-icon.png" alt="Engagement Icon" class="w-6 object-cover" /></template></StatCard>
      <StatCard title="Usuarios Activos" :value="8432"><template #icon><img src="/src/assets/images/user-icon.png" alt="Active Users Icon" class="w-6 object-cover" /></template></StatCard>
    </div>
    <SearchBar placeholder="Buscar post o usuarios …" />
    <div class="space-y-6">
      <PostCard v-for="p in posts" :key="p.id" :post="p" />
    </div>
  </div>
</template>
<script setup>
import StatCard from '../../../../components/StatCard.vue'
import SearchBar from '../../../../components/SearchBar.vue'
import PostCard from '../components/PostCard.vue'
import posts from '../../../../data/posts.json'
</script>
