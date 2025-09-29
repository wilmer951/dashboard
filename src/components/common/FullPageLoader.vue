<!-- FullPageLoader.vue -->
<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white dark:bg-gray-900 text-center p-6 rounded-lg shadow-lg">
        <div class="loader mb-4"></div>
        <p class="text-sm text-gray-700 dark:text-gray-200">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>

defineProps({
  visible: Boolean,
  message: {
    type: String,
    default: "Cargando, por favor espera...",
  },
});
</script>