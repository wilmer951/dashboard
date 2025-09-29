<!-- components/ServerTable.vue -->
<template>

<div v-if="loading">Cargando datos del historial...</div>
<div v-if="error" class="error">{{ error }}</div>


  <vue-good-table
    :columns="column"
    :rows="rows"
    mode="remote"
    :pagination-options="paginationOptions" 
    :search-options="{ enabled: true }"
   @page-change="onPageChange"
   @per-page-change="onPerPageChange"
   @search="onSearch"
  />
</template>

// components/ServerTable.vue (Corregido)
<script setup>
import { ref, onMounted, computed } from 'vue';
import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import { listHistoryLogin } from '@/services/auditoria/loginHistoryService';

const loading = ref(true);
const error = ref(null);

const props = defineProps({
  column: Array,
  perPage: {
    type: Number,
    default: 10
  }
});

const rows = ref([]);
const totalRows = ref(0);
const searchTerm = ref('');
const currentPage = ref(1);
const perPage=ref(props.perPage);

const paginationOptions = computed(() => ({
  enabled: true,
  perPage: perPage.value,
  total: totalRows.value,
}));



const cargarHistoryLogin = async () => {
  error.value = null;
  loading.value = true;

  try {
    const response = await listHistoryLogin(currentPage.value, perPage.value, searchTerm.value);

    if (response.status === false) {
      error.value = response.mensaje;
      throw new Error(response.mensaje);
    } 

    rows.value = response.data.data; 
    const newTotal = Number(response.data.pagination.total);
    // Solo actualiza el total si es la primera vez o si el nuevo total es mayor.
    // Esto previene que el total se reduzca incorrectamente en cambios de página.
    if (totalRows.value === 0 || newTotal > totalRows.value) {
      totalRows.value = newTotal;
    }
    currentPage.value = response.data.pagination.current_page || 1;

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const onSearch = (params) => {
  searchTerm.value = params.searchTerm;
  currentPage.value = 1; // Reiniciar a la primera página en cada búsqueda
  cargarHistoryLogin();
};

const onPerPageChange = (params) => {
  const { currentPerPage } = params;
  perPage.value = currentPerPage;
  currentPage.value = 1; // Siempre vuelve a la página 1 al cambiar items por página
  cargarHistoryLogin();
};

const onPageChange = (params) => {
  const { currentPage: newPage } = params;
  currentPage.value = newPage;
  cargarHistoryLogin();
};

onMounted(cargarHistoryLogin);
</script>
