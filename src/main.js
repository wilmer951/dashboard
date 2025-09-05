import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Asumiendo que tienes un archivo de configuración para el router
import { createPinia } from 'pinia'

// Importa tu archivo CSS principal aquí. ¡Este es el paso clave!
import './style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(router)

app.mount('#app')