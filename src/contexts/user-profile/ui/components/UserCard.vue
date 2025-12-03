<template>
  <div class="w-full bg-white rounded-2xl border border-blue-100 overflow-hidden shadow-sm">
    <div class="p-4 flex items-start gap-4">
      <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.121 17.804A8 8 0 1118.879 6.196 8 8 0 015.12 17.804z"/></svg>
      </div>
      <div class="flex-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-semibold text-base text-neutral-800">{{ user.name }}</p>
          </div>
          <!-- Removed small stats (Posts / IA / Desde) per user as requested -->
        </div>

        <p class="text-sm text-neutral-600 mt-3">{{ user.bio || '' }}</p>
        <div class="mt-4 flex gap-3">
          <router-link :to="`/profile/${user.id}`" class="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:opacity-95">Ver perfil</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ user: Object })
</script>
