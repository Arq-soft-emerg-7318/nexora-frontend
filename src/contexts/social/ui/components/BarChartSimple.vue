<template>
  <div class="w-full">
    <svg :width="width" :height="height" class="w-full block">
      <g v-for="(d, i) in data" :key="d.label">
        <rect
          :x="padding + i * barStep"
          :y="height - padding - (d.value / maxVal) * innerHeight"
          :width="barWidth"
          :height="(d.value / maxVal) * innerHeight"
          :fill="colors[i % colors.length]"
          rx="4"
        />
        <text
          :x="padding + i * barStep + barWidth / 2"
          :y="height - padding + 14"
          text-anchor="middle"
          class="text-[10px] fill-neutral-600"
        >{{ d.label }}</text>
      </g>
      <!-- y labels -->
      <g>
        <text v-for="n in 5" :key="n" :x="6" :y="padding + (5 - n) * (innerHeight / 5) + 4" class="text-[10px] fill-neutral-500">{{ Math.round(maxVal * (n-1) / 4) }}</text>
      </g>
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Array, default: () => [] },
  width: { type: [Number, String], default: 600 },
  height: { type: Number, default: 180 },
  colors: { type: Array, default: () => ['#60A5FA','#34D399','#F59E0B','#A78BFA'] }
})

const padding = 28
const heightNum = Number(props.height || 180)
const widthNum = Number(props.width || 600)
const innerHeight = heightNum - padding * 2
const count = Math.max(1, (props.data || []).length)
const barStep = (widthNum - padding * 2) / count
const barWidth = Math.max(12, barStep * 0.7)
const maxVal = Math.max(1, ...(props.data.map(d => d.value || 0)))
</script>

<style scoped>
svg { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial }
</style>
