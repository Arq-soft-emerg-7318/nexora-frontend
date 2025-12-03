<template>
  <article class="rounded-2xl border border-blue-100 p-5 bg-white">
    <header class="flex items-start gap-3">
      <img :src="post.author.avatar" class="w-10 h-10 rounded-full object-cover" />
      <div class="leading-tight">
        <p class="font-medium text-sm">{{ post.author.name }}</p>
        <p class="text-[11px] text-neutral-500">{{ post.timeAgo }} · <span class="inline-flex px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px]">IA</span></p>
      props: {
        post: { type: Object, required: true }
      }
      <h3 class="font-medium text-sm">{{ post.title }}</h3>
      <p class="text-xs text-neutral-600 mt-2">{{ post.excerpt }}</p>
      <div class="p-4 bg-white rounded shadow">
        <div class="flex items-start gap-4">
          <img :src="post.author?.avatar || '/src/assets/images/user-icon.png'" alt="avatar" class="w-12 h-12 rounded-full object-cover" />
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-semibold">{{ post.author?.name || 'Anónimo' }}</div>
                <div class="text-xs text-neutral-500">{{ post.timeAgo || '' }}</div>
              </div>
              <div class="text-sm text-neutral-600">{{ post.likes || 0 }} ❤️</div>
            </div>
            <h3 class="mt-3 font-medium">{{ post.title }}</h3>
            <p class="mt-2 text-sm text-neutral-700">{{ post.excerpt }}</p>

            <!-- Image preview when available -->
            <div v-if="post.fileUrl" class="mt-3">
              <a :href="post.fileUrl" target="_blank" class="block rounded overflow-hidden border">
                <img :src="post.fileUrl" alt="post image" class="w-full h-48 object-cover" onerror="this.style.display='none'" />
              <template>
                <article class="rounded-2xl border border-blue-100 p-5 bg-white">
                  <header class="flex items-start gap-3">
                    <img :src="post.author?.avatar || '/src/assets/images/user-icon.png'" class="w-10 h-10 rounded-full object-cover" />
                    <div class="leading-tight flex-1">
                      <p class="font-medium text-sm">{{ post.author?.name || 'Anónimo' }}</p>
                      <p class="text-[11px] text-neutral-500">
                        {{ post.timeAgo || '' }}
                        <span v-if="post.isAI" class="inline-flex px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 text-[10px] ml-2">IA</span>
                      </p>
                    </div>
                  </header>

                  <h3 class="font-medium text-sm mt-4">{{ post.title }}</h3>
                  <p class="text-xs text-neutral-600 mt-2">{{ post.excerpt }}</p>

                  <div v-if="post.fileUrl" class="mt-3">
                    <a :href="post.fileUrl" target="_blank" class="block rounded overflow-hidden border">
                      <img :src="post.fileUrl" alt="post image" class="w-full h-48 object-cover" @error="hideImage" />
                    </a>
                  </div>

                  <div class="mt-3 text-xs text-neutral-500 flex items-center gap-3">
                    <span>{{ post.comments || 0 }} comentarios</span>
                    <span>{{ post.likes || 0 }} ❤️</span>
                    <a v-if="post.fileUrl" :href="post.fileUrl" target="_blank" class="text-blue-600">Abrir archivo</a>
                  </div>
                </article>
              </template>

              <script>
              export default {
                name: 'PostCard',
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
