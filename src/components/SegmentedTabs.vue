<template>
  <!-- Pastilla grande según diseño -->
  <div class="inline-flex items-center bg-[#cfe1f8] rounded-full p-2 gap-2 select-none">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="relative rounded-full text-[15px] font-medium flex items-center gap-3 transition-colors px-6 h-12"
      :class="tab.key === modelValue ? 'bg-white shadow ring-1 ring-blue-100 text-neutral-900' : 'text-neutral-800/80 hover:text-neutral-900'"
      @click="$emit('update:modelValue', tab.key); $emit('change', tab.key)"
    >
      <span v-if="tab.iconSrc" class="grid place-items-center w-7 h-7 rounded-lg ring-1 ring-neutral-300 overflow-hidden">
        <img :src="tab.iconSrc" alt="" class="w-5 h-5 object-contain" />
      </span>
      <span v-else-if="tab.icon" class="grid place-items-center w-7 h-7 rounded-lg ring-1 ring-neutral-300 text-[13px]">
        {{ tab.icon }}
      </span>
      {{ tab.label }}
    </button>
  </div>
  
</template>
<script setup>
defineProps({
  tabs: { type: Array, required: true },
  modelValue: { type: String, required: true }
})
</script>
