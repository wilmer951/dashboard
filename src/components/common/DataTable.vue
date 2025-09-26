<template>




  <div>
    <!-- Loading -->
    <FullPageLoader :visible="loading" :message="'Cargando, por favor espera...'"/>


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
import FullPageLoader from '@/components/common/FullPageLoader.vue';
import { defineProps } from 'vue';




defineProps({
  columns: Array,
  rows: Array,
  loading: Boolean,
  error: String,
  message: String,
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
</script>
