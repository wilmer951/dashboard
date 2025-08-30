<template>
  <div 
    v-if="visible" 
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md animate-fade-in">
      <!-- Header -->
      <div class="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">{{ title }}</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
      </div>

      <!-- Contenido dinámico -->
      <div class="p-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
  title: String
})

defineEmits(["close"])
</script>
