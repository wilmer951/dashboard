<template>
  <Modal 
    :title="title" 
    @close="$emit('close')"
    :visible="visible"
  >
    <div class="space-y-6">
      <!-- Título de sección -->
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Filtros para {{ entity }}</h3>


      <!-- Filtros -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="datestart" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de inicio</label>
          <input
            type="date"
            id="datestart"
            v-model="datestart"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <div>
          <label for="dateend" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha de fin</label>
          <input
            type="date"
            id="dateend"
            v-model="dateend"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          @click="exportar('excel')"
          class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700"
        >
          Exportar Excel
        </button>
        <button
          @click="exportar('pdf')"
          class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700"
        >
          Exportar PDF
        </button>
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref } from 'vue'
import Modal from '@/components/common/Modal.vue'
import { useTodayDate } from '@/composable/useTodayDate'

const { getTodayDate } = useTodayDate()

const emit = defineEmits(['close', 'export'])


const props = defineProps({
  visible: Boolean,
  title: {
    type: String,
    default: 'Exportar data'
  },
  entity: String
  
})





console.log(props.entity);

const datestart = ref(getTodayDate())
const dateend = ref(getTodayDate())

function exportar(tipo) {
  // Lógica de exportación
  console.log(`Exportando ${tipo} desde ${datestart.value} hasta ${dateend.value}`)

   emit('export', {
    tipofile: tipo,
    datestart: datestart.value,
    dateend: dateend.value,
    entity: props.entity
    
  })
  emit('close')
  
}
</script>



