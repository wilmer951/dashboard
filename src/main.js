import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Asumiendo que tienes un archivo de configuración para el router

// Importa tu archivo CSS principal aquí. ¡Este es el paso clave!
import './style.css'

createApp(App).use(router).mount('#app')