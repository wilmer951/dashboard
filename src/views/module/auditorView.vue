<template>

    <DataTable
                :columns="columns"
                :rows="data"
                :loading="loading"
                :error="error"
              >

      </DataTable>

</template>

<script setup>
import { ref,onMounted } from 'vue';

import DataTable from '@/components/common/DataTable.vue';
import { listHistoryLogin } from '@/services/auditoria/loginHistoryService';



// 2. Component State
const data = ref([]);
const loading = ref(true);
const error = ref(null);




const columns = [
  { label: 'ID', field: 'id' },
  { label: 'Username', field: 'username' },
  { label: 'IP Address', field: 'ip_address' },
  { label: 'Login Time', field: 'logged_in_at' },
  { label: 'User Agent', field: 'user_agent' },
];


const cargarHistoryLogin = async () => { // Acepta la página como argumento
  error.value = null;
  loading.value = true;

  try {
    // 1. Usa currentPage.value y props.perPage para la llamada
    const response = await listHistoryLogin();
    console.log("respuesta en el compoente ",response);


    if (response.status === false) {
      error.value = response.mensaje;
      throw new Error(response.mensaje);
    } 

    // 2. Accede a los datos y la paginación correctamente
    data.value = response.data; 


  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  
  cargarHistoryLogin(); // Llama con la página inicial
});
</script>

