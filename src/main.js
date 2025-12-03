import { createApp } from 'vue'
import './style.css'
import app from './app.vue'
import router from './router/index.js'

const vueApp = createApp(app)
vueApp.use(router)

// Esperar a que el router esté listo antes de montar la app evita un "flicker"
// donde la ruta inicial todavía no está resuelta y el layout por defecto aparece brevemente.
router.isReady().then(() => {
	vueApp.mount('#app')
})