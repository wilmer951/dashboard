<template>
  <Modal 
    :title="modalTitle" 
    @close="$emit('close')"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <h3 class="text-2xl font-bold text-gray-900">{{ modalTitle }}</h3>


      </div>
    </template>

    
      <UsersForm 
      :datauser="props.selectedUser"
      :mode="mode"
      @submit="handleSubmit"/>
    


  </Modal>
</template>

<script setup>

import { computed } from 'vue'
import Modal from '@/components/common/Modal.vue'
import UsersForm from '@/components/users/UsersForm.vue'



const props = defineProps({
  mode: String, // create | edit | reset
  selectedUser:Object

  
  
})


 

const emit = defineEmits(["close", "save"]); // 👈 re-emite el save al padre

const handleSubmit = (data) => {
  emit("save", data); // 🚀 re-emite al padre (Users.vue)
};


const modalTitle = computed(() => {
  if (props.mode === "create") return "Crear Usuario"
  if (props.mode === "edit") return "Editar Usuario"
  if (props.mode === "reset") return "Resetear Contraseña"
  if (props.mode === "delete") return "Eliminar Usuario"
  return ""
})
</script>
