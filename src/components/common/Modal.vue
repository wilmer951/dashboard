<!-- src/components/common/Modal.vue -->
<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 animate-fade-in"
    >
      <!-- Header -->
      <div class="flex justify-between items-center px-4 py-3 border-b dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h2>
        <button
          @click="emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
        >
          ✕
        </button>
      </div>

      <!-- Body slot -->
      <div class="p-4 text-gray-800 dark:text-gray-100">
        <slot />
      </div>

      <!-- Optional footer -->
      <div v-if="$slots.footer" class="px-4 py-3 border-t dark:border-gray-700">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Modal'
  }
})

const emit = defineEmits(['close'])
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>
