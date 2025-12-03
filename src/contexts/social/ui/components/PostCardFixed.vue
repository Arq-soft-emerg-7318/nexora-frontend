<template>
  <article class="rounded-2xl border border-blue-100 p-3 bg-white hover:shadow-lg transition-shadow duration-150">
    <header class="flex items-start gap-3">
      <img :src="post.author?.avatar || '/src/assets/images/user-icon.png'" class="w-10 h-10 rounded-full object-cover" />
      <div class="leading-tight flex-1">
        <p class="text-sm">
          <span class="text-[11px] text-neutral-500 mr-2">Autor:</span>
          <span class="font-medium text-sm">{{ post.author?.name || 'Anónimo' }}</span>
        </p>
        <p class="text-xs text-neutral-500 mt-1 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M3 6h18M3 14h18M3 18h18"/></svg>
          <span>{{ post.communityName || (post.communityId ? ('Comunidad ' + post.communityId) : 'Sin comunidad') }}</span>
        </p>
      </div>
    </header>

      <h3 class="text-sm mt-2 line-clamp-2">{{ post.title }}</h3>
      <p class="text-xs text-neutral-600 mt-1 line-clamp-3">{{ post.excerpt }}</p>

    <div v-if="post.fileUrl" class="mt-3">
      <a :href="post.fileUrl" target="_blank" class="block rounded overflow-hidden border">
        <img :src="post.fileUrl" alt="post image" class="w-full h-36 object-cover" @error="hideImage" />
      </a>
    </div>

    <div class="mt-3 text-xs text-neutral-500 flex items-center gap-3">
      <span>{{ post.likes || 0 }} ❤️</span>
      <span class="ml-auto inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px]">
        <svg v-if="post.communityName" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M7 7V4a2 2 0 012-2h6a2 2 0 012 2v3"/></svg>
        <span>{{ post.communityName || 'Sin comunidad' }}</span>
      </span>
    </div>
  </article>
</template>

<script>
export default {
  name: 'PostCardFixed',
  props: {
    post: { type: Object, required: true }
  },
  methods: {
    hideImage(e){ e.target.style.display = 'none' }
  }
}
</script>

<style scoped>
</style>
