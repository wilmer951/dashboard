<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="p-4 text-blue-600 text-sm">Cargando datos...</div>

    <!-- Error -->
    <div v-else-if="error" class="p-4 text-red-600 text-sm">{{ error }}</div>

    <!-- Tabla -->
    <div v-else class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
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
defineProps({
  columns: Array,
  rows: Array,
  loading: Boolean,
  error: String,
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
    default: 5
  }
})
</script>
