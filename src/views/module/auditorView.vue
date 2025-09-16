<template>

<h1>auditor</h1>
<div v-if="loading">Cargando datos del historial...</div>
<div v-if="error" class="error">{{ error }}</div>

<vue-good-table
                    :columns="columns"
                    :rows="usersHistory"
                    :search-options="{ enabled: true }"
                    :pagination-options="{ enabled: true, perPage: 5 }"
                  >
              
                <template #table-row="props">
                    <span v-if="props.column.field === 'index'">
                      {{ props.index + 1 }}
                    </span>
                    <span v-else>
                      {{ props.formattedRow[props.column.field] }}
                    </span>
                  </template>

                </vue-good-table>



</template>


<script setup> 

import { onMounted,ref } from 'vue';
import  {listHistoryLogin} from '@/services/auditoria/loginHistoryService'


const usersHistory = ref([]);
const loading = ref(true);
const error = ref(null);




const columns = [
  { label: "ID", field: "index", type: "number" }, 
  { label: "Usuario", field: "username" },
  { label: "IP", field: "ip_address" },
  { label: "Last_login", field: "logged_in_at" },
  ];





const cargarHistoryLogin = async () => {
  error.value = null;
  loading.value = true;
  try {
    const userList = await listHistoryLogin();

    if (userList.status=== false) {
      error.value = userList.mensaje;
      
      throw new Error(userList.mensaje);
      
    } 


    usersHistory.value = userList.data;  // ya viene transformado

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};










onMounted(async () => {
  await cargarHistoryLogin();




  
})


  

</script>

