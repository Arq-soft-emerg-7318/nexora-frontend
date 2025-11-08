<template>
  <article class="rounded-2xl border border-blue-100 p-5 bg-white">
    <header class="flex items-start gap-3">
      <img :src="post.author.avatar" class="w-10 h-10 rounded-full object-cover" />
      <div class="leading-tight">
        <p class="font-medium text-sm">{{ post.author.name }}</p>
        <p class="text-[11px] text-neutral-500">{{ post.timeAgo }} · <span class="inline-flex px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px]">IA</span></p>
      </div>
    </header>
    <div class="mt-4 leading-tight">
      <h3 class="font-medium text-sm">{{ post.title }}</h3>
      <p class="text-xs text-neutral-600 mt-2">{{ post.excerpt }}</p>
    </div>
    <footer class="flex items-center gap-6 text-neutral-500 text-xs mt-4">
      <span>🤍 {{ post.likes }}</span>
      <span>💬 {{ post.comments }}</span>
    </footer>
  </article>
</template>
<script setup>
defineProps({ post: Object })
</script>
