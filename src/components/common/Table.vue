<!-- components/ServerTable.vue -->
<template>

<div v-if="loading">Cargando datos del historial...</div>
<div v-if="error" class="error">{{ error }}</div>


  <vue-good-table
    :columns="column"
    :rows="rows"
    :pagination-options="{
      enabled: true,
      perPage: perPage.value,
      mode: 'server',
      total: totalRows,
      
    }"
    :search-options="{ enabled: true }"
    @on-page-change="onPageChange"
  />
</template>

// components/ServerTable.vue (Corregido)
<script setup>
import { ref, onMounted, watch } from 'vue';
import { VueGoodTable } from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import { listHistoryLogin } from '@/services/auditoria/loginHistoryService';

const loading = ref(true);
const error = ref(null);

const props = defineProps({
  column: Array,
  perPage: {
    type: Number,
    default: 20
  }
});

const rows = ref([]);
const totalRows = ref(0);
const currentPage = ref(1);
const perPage=ref(props.perPage);




const cargarHistoryLogin = async (page = 1) => { // Acepta la página como argumento
  error.value = null;
  loading.value = true;

  try {
    // 1. Usa currentPage.value y props.perPage para la llamada
    const response = await listHistoryLogin(page, perPage.value);
    console.log("respuesta en el compoente ",response);


    if (response.status === false) {
      error.value = response.mensaje;
      throw new Error(response.mensaje);
    } 

    // 2. Accede a los datos y la paginación correctamente
    rows.value = response.data.data; 
    totalRows.value = response.data.pagination.total || 0;
    console.log("total row",totalRows.value);
    currentPage.value = response.data.pagination.current_page || 1;

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const onPageChange = ({ currentPage }) => {
  cargarHistoryLogin(currentPage); // Pasa la página recibida
};

onMounted(() => {
  console.log("cargando");
  cargarHistoryLogin(currentPage.value); // Llama con la página inicial
});
</script>
