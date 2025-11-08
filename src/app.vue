<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AdminLayout from './layouts/AdminLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()
const layoutMap = { admin: AdminLayout, auth: AuthLayout }
const layoutComponent = computed(() => layoutMap[route.meta.layout || 'admin'] || AdminLayout)
</script>

<template>
	<component :is="layoutComponent">
		<RouterView />
	</component>
</template>


