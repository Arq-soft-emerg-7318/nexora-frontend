<template>
  <div class="space-y-8">
    <h2 class="text-lg font-semibold">Gestión de Usuarios</h2>
    <!-- Solo dos tarjetas como en el diseño -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <StatCard title="Total de Posts" :value="24589">
        <template #icon>
            <img src="/src/assets/images/user-icon.png" alt="Users Icon" class="w-6 object-cover" />
        </template>
      </StatCard>
      <StatCard title="Activos (7d)" :value="8432">
        <template #icon>
            <img src="/src/assets/images/like-icon.png" alt="Active Users Icon" class="w-6 object-cover" />
        </template>
      </StatCard>
    </div>
    <SearchBar placeholder="Buscar post o usuarios …" />
    <section class="rounded-2xl border border-blue-100">
      <header class="px-8 pt-7 pb-4 text-lg font-semibold">Usuarios Registrados</header>
      <div class="px-6 pb-6 space-y-4">
        <UserCard v-for="u in users" :key="u.id" :user="u" />
      </div>
    </section>
  </div>
</template>
<script setup>
import StatCard from '../../../../components/StatCard.vue'
import SearchBar from '../../../../components/SearchBar.vue'
import UserCard from '../components/UserCard.vue'
import users from '../../../../data/users.json'
</script>
