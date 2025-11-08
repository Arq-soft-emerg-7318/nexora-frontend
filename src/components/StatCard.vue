<template>
  <div class="rounded-xl border border-blue-200 bg-white px-6 py-5 flex items-center gap-5">
    <div class="w-14 h-14 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xl">
      <slot name="icon">◆</slot>
    </div>
    <div class="leading-tight">
      <p class="text-neutral-700 text-sm font-medium">{{ title }}</p>
      <p class="font-semibold text-[15px] mt-2">{{ value.toLocaleString?.() ?? value }}</p>
    </div>
  </div>
</template>
<script setup>
defineProps({ title: String, value: [String, Number] })
</script>
