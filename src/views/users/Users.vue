<template>
  <div>
  <div class="space-y-6">
    <!-- Encabezado de la página -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Gestión de Usuarios
      </h1>
      <button
        class="mt-4 md:mt-0 flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        @click.prevent="abrirModal('create')"
      >
        <svg
          class="h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Crear Usuario
      </button>
    </div>

    <!-- Indicadores -->
    <div v-if="loading" class="p-4 text-blue-600 text-sm">
      Cargando usuarios...
    </div>
    <div v-if="error" class="p-4 text-red-600 text-sm">
      {{ error }}
    </div>

    <!-- Contenedor de la tabla -->
    <div
      v-if="!loading && !error"
      class="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800"
    >
      <div class="overflow-x-auto">
        
              <vue-good-table
                    :columns="columns"
                    :rows="users"
                    :search-options="{ enabled: true }"
                    :pagination-options="{ enabled: true, perPage: 5 }"
                  >
                
                <template #table-row="props">
              
                      <div v-if="props.column.field === 'estado'" class="flex justify-center">
                        <span
                           v-if="props.row.estado == 1"  
                          class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                        >
                          Activo
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
                        >
                          Inactivo
                        </span>
                      </div>


                      <div v-if="props.column.field === 'acciones'" class="flex space-x-2 justify-end">


                        <button 
                        class="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        @click="abrirModal('edit', props.row)">Editar</button>
                        
                        <button
                        class="rounded-md bg-amber-500 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        @click="abrirModal('reset', props.row)">Rest. contraseña</button>
                        
                        <button 
                        class="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        @click="abrirModal('delete', props.row)">Eliminar</button>
                      </div>

                </template>
                </vue-good-table>
      </div>
    </div>
  </div>

  <!-- Modal -->
    <UserModal 
      v-if="mostrarModal"
      :visible="mostrarModal" 
      :mode="modalMode" 
      :selectedUser="usuarioSeleccionado"
      @close="cerrarModal"
      @save="handleUserAction"
  />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import UserModal from '@/components/users/UserModal.vue';
import { listUsers, createUser,deleteUser, updateUser } from '@/services/users/userService.js';
import { resetPassword } from '@/services/users/passwordService';
import { useRolesStore } from '@/stores/users/userRolesStore';
import { usePerfilesStore } from '@/stores/users/userPerfilesStore';
import Swal from 'sweetalert2';




// 1. Store instances
const rolesStore = useRolesStore();
const perfilStore = usePerfilesStore();

const columns = [
  { label: "ID", field: "id", type: "number" },
  { label: "Usuario", field: "username" },
  { label: "Nombre", field: "name" },
  { label: "Rol", field: "role" },
  { label: "Último Login", field: "lastLogin" },
  { label: "Estado", field: "estado", sortable: false },
  { label: "Acciones", field: "acciones", sortable: false },

];

// 2. Component State
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const success = ref(null);

// Modal State
const mostrarModal = ref(false);
const usuarioSeleccionado = ref(null);
const modalMode = ref("create");

// 3. Functions
// Modal Handling
function abrirModal(mode, user = null) {
  error.value = ""
  success.value = ""

  const userForModal = { ...user }; 

  // El API devuelve los roles como un string separado por comas (id_rol).
  // Lo convertimos a un array de IDs para que el <select multiple> del formulario funcione correctamente.
  if (userForModal && userForModal.id_rol) {
    userForModal.role = userForModal.id_rol.split(',');
  }
   
  modalMode.value = mode
  usuarioSeleccionado.value = userForModal;
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  modalMode.value = "create"
  usuarioSeleccionado.value = null;
}

// API Call Handling
const cargarUsuarios = async () => {
  error.value = null;
  loading.value = true;
  try {
    const userList = await listUsers();
    console.log("Usuarios cargados:", userList);
    users.value = userList;  // ya viene transformado
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleApiCall = async (apiFunction, data, { successMessage, errorMessage, refresh = true }) => {
  try {
    console.log(`➡️ Ejecutando ${apiFunction.name} con:`, data);
    const response = await apiFunction(data);
    console.log("⬅️ Respuesta del servicio:", response);

    if (response.status !== "ok") {
      error.value = response.mensaje || errorMessage;
      success.value = null;

      
        Swal.fire({
          title: error.value,
          icon: "error",
          draggable: true
        });


      return;
    }

    success.value = response.mensaje || successMessage;
    error.value = null;


        Swal.fire({
        title: success.value,
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          
          cerrarModal();  
          if (refresh) cargarUsuarios();
        }
      });




  } catch (err) {
    console.error(`Error en ${apiFunction.name}:`, err);
    error.value = err.message || 'Ocurrió un error inesperado.';
    success.value = null;
  }
};

  const userActions = {
        create: (data) => handleApiCall(createUser, data, {
          successMessage: "Usuario creado con éxito.",
          errorMessage: "Ocurrió un error al crear el usuario.",
        }),
        edit: (data) => handleApiCall(updateUser, data, {
          successMessage: "Usuario actualizado con éxito.",
          errorMessage: "Ocurrió un error al actualizar el usuario.",
        }),
        delete: (data) => handleApiCall(deleteUser, data, {
          successMessage: "Usuario eliminado con éxito.",
          errorMessage: "Ocurrió un error al eliminar el usuario.",
        }),
        reset: (data) => handleApiCall(resetPassword, data, {
          successMessage: "Contraseña reseteada con éxito.",
          errorMessage: "Ocurrió un error al resetear la contraseña.",
          refresh: false,
        }),
      };

const handleUserAction = (payload) => {
  const { data, mode } = payload;
  const action = userActions[mode];
  if (action) {
    action(data);
  } else {
    console.error("Modo no reconocido:", mode);
    error.value = `La acción "${mode}" no es válida.`;
  }
};

onMounted(async () => {
  await cargarUsuarios()
  await rolesStore.cargarRoles()
  await perfilStore.cargarPerfiles()



  
})
</script>   
