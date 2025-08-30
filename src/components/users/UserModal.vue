<template>
  <Modal 
    :visible="visible" 
    :title="modalTitle" 
    @close="$emit('close')"
  >
    <div v-if="mode === 'create'">
      <p>Formulario de creación de usuario</p>
    </div>

    <div v-else-if="mode === 'edit'">
      <p>Editando usuario: <b>{{ user?.name }}</b></p>
    </div>

    <div v-else-if="mode === 'reset'">
      <p>¿Seguro que deseas resetear la contraseña de <b>{{ user?.name }}</b>?</p>
      <button class="bg-yellow-500 text-white px-3 py-1 rounded">Confirmar Reset</button>
    </div>
  </Modal>
  
</template>

<script setup>

import { computed } from 'vue'
import Modal from '../common/Modal.vue'

const props = defineProps({
  visible: Boolean,
  mode: String, // create | edit | reset
  user: Object
})

defineEmits(["close"])

const modalTitle = computed(() => {
  if (props.mode === "create") return "Crear Usuario"
  if (props.mode === "edit") return "Editar Usuario"
  if (props.mode === "reset") return "Resetear Contraseña"
  return ""
})
</script>
