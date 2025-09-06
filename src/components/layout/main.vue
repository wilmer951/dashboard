<template>
  <div class="flex h-screen bg-gray-100 font-sans dark:bg-gray-900">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 md:relative md:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="h-16 flex-shrink-0 px-6 flex items-center border-b dark:border-gray-700">
          <h1 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Dashboard</h1>
        </div>

        <!-- Navegación -->
        <nav class="flex-1 space-y-2 overflow-y-auto p-4">
          <router-link to="/home" class="flex items-center rounded-lg px-4 py-2.5 text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="ml-4">Home</span>
          </router-link>
          <router-link to="/acerca" class="flex items-center rounded-lg px-4 py-2.5 text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="ml-4">Acerca de</span>
          </router-link>
          <router-link v-if="authStore.isAuthenticated && authStore.isAllowed" to="/users" class="flex items-center rounded-lg px-4 py-2.5 text-gray-600 transition-colors duration-200 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197"></path></svg>
            <span class="ml-4">Usuarios</span>
          </router-link>
        </nav>

        <!-- Botón de Logout -->
        <div class="p-4 border-t dark:border-gray-700">
          <button @click="logout" class="flex w-full items-center rounded-lg px-4 py-2.5 text-gray-600 transition-colors duration-200 hover:bg-red-100 hover:text-red-700 dark:text-gray-400 dark:hover:bg-red-700/20 dark:hover:text-red-400">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span class="ml-4">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay para cerrar sidebar en móvil -->
    <div v-if="isSidebarOpen" class="fixed inset-0 z-20 bg-black opacity-50 md:hidden" @click="isSidebarOpen = false"></div>

    <!-- Contenido Principal -->
    <div class="flex flex-1 flex-col">
      <!-- Header -->
      <header class="flex h-16 flex-shrink-0 items-center justify-between bg-white px-6 shadow-md dark:bg-gray-800">
        <!-- Botón para menú móvil -->
        <button @click="isSidebarOpen = !isSidebarOpen" class="rounded p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring md:hidden">
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        
        <!-- Espacio para otros elementos del header, como un buscador o perfil de usuario -->
        <div class="flex-1"></div>
        <div>
            <span v-if="authStore.isAuthenticated && authStore.isAllowed" class="text-gray-700 dark:text-gray-300">Bienvenido {{ authStore.usuario }}</span>
        </div>
      </header>


      <!-- Contenido de la página -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view></router-view>
      </main>

      <!-- Footer -->
      <footer class="bg-white py-3 text-center text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        © 2025 Mi Aplicación Vue
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth/authStore';





const router = useRouter();
const isSidebarOpen = ref(false);
const authStore = useAuthStore(); 



const logout = () => {
  authStore.logout();     // Lógica de limpieza centralizada
  router.push('/login'); // Redirección después del logout
};
</script>

<style>
/* Estilos para el link activo */
.router-link-exact-active {
  @apply bg-indigo-50 text-indigo-600 dark:bg-gray-700 dark:text-white;
}
</style>
