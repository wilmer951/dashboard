<template>
  <Modal 
    :title="modalTitle" 
    @close="$emit('close')"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h3 class="text-2xl font-bold text-gray-900">{{ modalTitle }}</h3>
        <button 
          @click="$emit('close')" 
          class="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </template>

    <div v-if="mode === 'create'">
      <UsersForm @submit="handleSubmit"/>
    </div>

    <div v-else-if="mode === 'edit'">
      </div>

    <div v-else-if="mode === 'reset'">
      <button class="bg-yellow-500 text-white px-3 py-1 rounded">Confirmar Reset</button>
    </div>

    <div v-if="error" class="mt-3 p-2 bg-red-100 text-red-700 rounded">
      ⚠️ {{ error }}
    </div>

    <div v-if="success" class="mt-3 p-2 bg-green-100 text-green-700 rounded">
      ✅ {{ success }}
    </div>
  </Modal>
</template>

<script setup>

import { computed } from 'vue'
import Modal from '@/components/common/Modal.vue'
import UsersForm from '@/components/users/UsersForm.vue'

 

const props = defineProps({
  mode: String, // create | edit | reset
  error: String,
  success: String
  
})


const emit = defineEmits(["close", "save"]); // 👈 re-emite el save al padre

const handleSubmit = (data) => {
  emit("save", data); // 🚀 re-emite al padre (Users.vue)
};


const modalTitle = computed(() => {
  if (props.mode === "create") return "Crear Usuario"
  if (props.mode === "edit") return "Editar Usuario"
  if (props.mode === "reset") return "Resetear Contraseña"
  return ""
})
</script>
