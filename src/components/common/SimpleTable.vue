<template>
  <div class="space-y-6 bg-white p-4 rounded-lg shadow-md max-w-full overflow-x-auto">

    <!-- Cargando / Error -->
    <div v-if="loading" class="text-gray-600 text-sm">Cargando datos del historial...</div>
    <div v-if="error" class="text-red-500 font-semibold">{{ error }}</div>

    <div>
        <input type="text" name="search" v-model="search" placeholder="Buscar" id="search">
        
    </div>


    <!-- Tabla -->
    <table class="min-w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <thead class="bg-gray-200 text-gray-700 uppercase tracking-wide">
        <tr>
          <th
            v-for="header in headers"
            :key="header"
            class="px-4 py-2 border-b border-gray-300 whitespace-nowrap"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
       <tr v-for="item in paginatedData" :key="item.id" class="hover:bg-gray-100 transition-colors duration-200">
            <td v-for="header in headers" :key="header" class="px-4 py-2 border-b border-gray-100 whitespace-nowrap">
            <template v-if="header === 'acciones'">
                <button @click="$emit('edit', item)"
                class="mr-2 rounded bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700">Editar</button>
                <button @click="$emit('reset-password', item)"
                class="mr-2 rounded bg-amber-500 px-3 py-1 text-xs font-medium text-white hover:bg-amber-600">Reset Password</button>
                <button @click="$emit('delete', item)"
                class="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700">Eliminar</button>
            </template>
            <template v-else>
                {{ item[header] }}
            </template>
            </td>
        </tr>

        <!-- Sin datos -->
        <tr v-if="totalPages === 0">
          <td :colspan="headers.length" class="px-4 py-3 text-center text-gray-500">
            No hay datos disponibles.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Paginación mejorada -->
    <div class="flex justify-end items-center space-x-4">

    <span  v-if="totalPages > 0"  class="text-sm text-gray-700 select-none"></span>

    <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Página anterior"
      >
        <!-- Flecha izquierda -->
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
             viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <span class="text-sm text-gray-700 select-none">
        Página {{ currentPage }} de {{ totalPages }}
      </span>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="p-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Página siguiente"
      >
        <!-- Flecha derecha -->
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
             viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

  </div>
</template>


<script setup>
import { ref,onMounted,computed ,watch} from 'vue'
import debounce from 'lodash.debounce';


const props = defineProps({
  fetchData: {
    type: Function,
    required: true,
  },

    showActions: {
    type: Boolean,
    default: false
  }
});


const loading = ref(true);
const error = ref(null);
const headers = ref([]);
const rows = ref([]);

const paginatedData = computed(() => rows.value);

// Reactive state
const currentPage = ref(1)
const totalPages = ref(0);
const perPage = ref(10);

const totalItems = ref(0);



const search = ref('');


const debouncedLoadData = debounce((page) => {
  loadData(page);
}, 500); // 300 ms de espera




watch(search, () => {
  currentPage.value = 1;
  debouncedLoadData(1);
});








const loadData = async (page = 1) => { // Acepta la página como argumento
  error.value = null;
  loading.value = true;

  try {
    // 1. Usa currentPage.value y props.perPage para la llamada
    const response = await props.fetchData(page, perPage.value, search.value);
    console.log("respuesta en el compoente ",response);


    if (response.status === false) {
      error.value = response.mensaje;
      throw new Error(response.mensaje);
    } 

    
    headers.value = response.data.data.length > 0
        ? Object.keys(response.data.data[0])
        : [];
    console.log("Headers:", headers);
    rows.value = response.data.data; 


    totalItems.value = Number(response.data.pagination.total || 0);
    totalPages.value = Math.ceil((response.data.pagination.total || 0) / perPage.value);
    

    currentPage.value = response.data.pagination.current_page || 1;

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};


const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    loadData(currentPage.value);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    loadData(currentPage.value);
  }
};








onMounted(() => {
  console.log("cargando");
  loadData(currentPage.value); // Llama con la página inicial
});






</script>
