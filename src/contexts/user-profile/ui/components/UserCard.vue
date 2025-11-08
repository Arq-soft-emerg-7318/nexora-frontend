<template>
  <div class="px-6 py-5 flex items-center justify-between bg-white rounded-2xl border border-blue-100">
    <div class="flex items-center gap-4">
      <img :src="user.avatar" alt="avatar" class="w-12 h-12 rounded-full object-cover" />
      <div class="leading-tight">
        <p class="font-medium text-sm">{{ user.name }}</p>
        <p class="text-xs text-neutral-500">{{ user.title }}</p>
        <p class="text-xs text-neutral-500">{{ user.email }}</p>
        <span class="inline-flex px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] mt-2">Activo</span>
      </div>
    </div>
    <div class="flex items-center gap-10 text-xs text-neutral-700">
      <div class="text-center">
        <p class="font-medium">Posts</p>
        <p>{{ user.posts }}</p>
      </div>
      <div class="text-center">
        <p class="font-medium">IA</p>
        <p>{{ user.aiPosts }}</p>
      </div>
      <div class="text-center">
        <p class="font-medium">Desde</p>
        <p>{{ user.since }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({ user: Object })
</script>
