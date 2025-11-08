<template>
  <div class="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 flex items-center gap-3">
    <span class="text-blue-400 text-base">🔍</span>
    <input :placeholder="placeholder" class="bg-transparent outline-none flex-1 text-neutral-700 placeholder:text-neutral-400 text-sm" />
  </div>
</template>
<script setup>
const props = defineProps({ placeholder: { type: String, default: 'Buscar…' } })
</script>
