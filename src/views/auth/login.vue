<template>
  <!-- Contenedor principal que centra el formulario y aplica un fondo sutil -->
  <div class="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
    
    <!-- Tarjeta del formulario con sombra, bordes redondeados y espaciado -->
    <div class="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
      
      <!-- Encabezado con título -->
      <div>
        <h2 class="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Inicia sesión
        </h2>
      </div>

      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Formulario con espaciado entre elementos -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <!-- Campo de Usuario -->
          <div>
            <label for="username" class="sr-only">Usuario</label>
            <input 
              id="username" 
              name="username" 
              type="text" 
              autocomplete="username" 
              required 
              v-model="username"
              class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm" 
              placeholder="Usuario"
            >
          </div>
          <!-- Campo de Contraseña -->
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              autocomplete="current-password" 
              required 
              v-model="password"
              class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm" 
              placeholder="Contraseña"
            >
          </div>
        </div>

        <!-- Botón de envío -->
        <div>
          <button type="submit" :disabled="loading" class="group relative flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800">
            <span v-if="loading" class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ loading ? 'Ingresando...' : 'Iniciar sesión' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth/authStore'; 



const router = useRouter();
const authStore = useAuthStore(); 



const username = ref('');
const password = ref('');
const errorMessage = ref(null);
const loading = ref(false);

const handleLogin = async () => {
  errorMessage.value = null;
  loading.value = true;
  
  const { success, message } = await authStore.login(username.value, password.value);

  loading.value = false;

  console.log('Login result:', { success, message });

  if (success) {

     console.log('Redirigiendo a /dashboard');
    // Asumiendo que t
    // ienes una ruta '/dashboard' en tu router
    router.push('/dashboard');
  } else {
    errorMessage.value = message;
  }
};
</script>