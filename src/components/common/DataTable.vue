<template>




<filterexportTable
  v-if="mostrarModal"
  :visible="mostrarModal"
  :entity="entity"
  @close="cerrarModal"
  @export="handleExport"

> </filterexportTable>





<div class="flex flex-col md:flex-row md:items-center md:justify-between">
  <button
    class="mt-4 md:mt-0 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
    @click="abrirModal()"
  >
    <!-- Ícono de exportar -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="M3 14a1 1 0 011-1h4v-3H5a1 1 0 010-2h3V5H4a1 1 0 00-1 1v8zM13 7h3.586l-4.293-4.293a1 1 0 111.414-1.414L18.414 6H13a1 1 0 000 2z"
      />
    </svg>
    Exportar
  </button>
</div>


  <div>
    <!-- Loading -->
    <FullPageLoader :visible="cargando" :message="'Cargando, por favor espera...'"/>


    <!-- Error -->
    <div v-if="error" class="p-4 text-red-600 text-sm">{{ error }}</div>

    <!-- Tabla -->
    <div  class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div class="overflow-x-auto">

    

        <vue-good-table
          :columns="columns"
          :rows="rows"
          :search-options="{ enabled: search }"
          :pagination-options="{ enabled: pagination, perPage }"
        >
          <!-- Slot general para columnas personalizadas -->
          <template #table-row="props">
            <slot :name="`column-${props.column.field}`" v-bind="props">
              {{ props.formattedRow[props.column.field] }}
            </slot>
          </template>
        </vue-good-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,watch } from 'vue';
import FullPageLoader from '@/components/common/FullPageLoader.vue';
import { defineProps } from 'vue';
import filterexportTable from '@/components/common/filterexportTable.vue';  
import { generatorReport } from '@/services/reports/reportService';
import Swal from 'sweetalert2';


const mostrarModal = ref(false);

const cargando=ref(false);



function abrirModal(){

mostrarModal.value = true;


}


function cerrarModal(){

mostrarModal.value = false;


}






const props = defineProps({
  columns: Array,
  rows: Array,
  loading: Boolean,
  error: String,
  message: String,
  entity: String,
  search: {
    type: Boolean,
    default: true
  },
  pagination: {
    type: Boolean,
    default: true
  },
  perPage: {
    type: Number,
    default: 10
  }
})


const entity = ref(props.entity);




watch(() => props.entity, (newVal) => {
  entity.value = newVal
})



async  function  handleExport(exportFilterData){
   cargando.value = true;
   const response = await generatorReport(exportFilterData);

  if (response.status !== true) {
      cargando.value = false;
      
      Swal.fire({
        title: response.mensaje || "Error",
        icon: "error",
        text: response.mensaje,
        confirmButtonText: "OK",
          draggable: true,
          allowOutsideClick: false,
          allowEscapeKey: false,
      });




      error.value = response.mensaje;
      throw new Error(response.mensaje);


  } else {
   
     cargando.value = false;

  }



   };



</script>
