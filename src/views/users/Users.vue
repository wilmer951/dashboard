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


    <!-- Contenedor de la tabla -->
    
      <div class="overflow-x-auto">
         
            <DataTable
                :columns="columns"
                :rows="users"
                :loading="loading"
                :error="error"
                :entity="'users'"
              >
                <!-- Slot personalizado para columna "estado" -->
                <template #column-estado="props">
                  <div class="flex justify-center">
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
                </template>

                <!-- Slot personalizado para columna "acciones" -->
                <template #column-acciones="props">
                  <div class="flex space-x-2 justify-end">
                    <button 
                      class="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      @click="abrirModal('edit', props.row)"
                    >
                      Editar
                    </button>

                    <button
                      class="rounded-md bg-amber-500 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                      @click="abrirModal('reset', props.row)"
                    >
                      Rest. contraseña
                    </button>

                    <button 
                      class="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                      @click="abrirModal('delete', props.row)"
                    >
                      Eliminar
                    </button>
                  </div>
                </template>
            </DataTable>


      
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
import { listUsers, createUser,deleteUser, updateUser,resetPassword } from '@/services/users/userService.js';
import { useRolesStore } from '@/stores/users/userRolesStore';
import { usePerfilesStore } from '@/stores/users/userPerfilesStore';
import Swal from 'sweetalert2';
import DataTable from '@/components/common/DataTable.vue';




// 1. Store instances
const rolesStore = useRolesStore();
const perfilStore = usePerfilesStore();



// 2. Component State
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const success = ref(null);


// Modal State
const mostrarModal = ref(false);
const usuarioSeleccionado = ref(null);
const modalMode = ref("create");



const columns = [
  { label: "ID", field: "id", type: "number" },
  { label: "Usuario", field: "username" },
  { label: "Nombre", field: "name" },
  { label: "Rol", field: "roleNames" },
  { label: "Perfil", field: "perfilNombre", sortable: false },
  { label: "Email", field: "email" },
  { label: "Último Login", field: "lastLogin" },
  { label: "Estado", field: "estado", sortable: false },
  { label: "Acciones", field: "acciones", sortable: false },
          ];



// 3. Functions
// Modal Handling
function abrirModal(mode, user = null) {
  error.value = ""
  success.value = ""

  const userForModal = { ...user }; 

  // El API devuelve los roles como un string separado por comas (id_rol).
  // Lo convertimos a un array de IDs para que el <select multiple> del formulario funcione correctamente.
  if (userForModal && userForModal.id_rol) {
    userForModal.role = userForModal.id_rol.split(',').map(Number);
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

    if (userList.status=== false) {
      error.value = userList.mensaje;
      
      throw new Error(userList.mensaje);
      
    } 


    users.value = userList.data;  // ya viene transformado
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const handleApiCall = async (apiFunction, data, { successMessage, errorMessage, refresh = true }) => {
  // `error` y `success` deben estar definidos en el scope padre (ej. ref() en Vue.js)
  // Asegúrate de que `error` y `success` son variables reactivas (refs)
  const error = ref(''); // Ejemplo de cómo podrían estar definidos

  try {
    const response = await apiFunction(data);

    // Si la respuesta no es exitosa (status !== true)
    if (response.status !== true) {
      // Extraer el título del mensaje, si existe, o usar el errorMessage proporcionado
      

      // Extraer los errores detallados de forma segura
      const detailedErrors = response?.errors || {};

      // Generar la cadena de errores detallados si existen
          const allErrors = Object.values(detailedErrors)
              .flat()
              .join("\n");

      // Asignar el mensaje de error final: errores detallados, mensaje general, o mensaje por defecto
      // Usamos 'error.value' asumiendo que es una ref de Vue.js
      error.value = allErrors || response?.mensaje || 'Ocurrió un error inesperado.';

      // Mostrar alerta de SweetAlert2 con el error
      Swal.fire({
        title: response.mensaje || errorMessage || "Error",
        icon: "error",
        text: error.value,
        confirmButtonText: "OK",
        draggable: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      return; // Salir de la función si hubo un error
    }

    // Si la respuesta fue exitosa (status === true)
    cerrarModal(); // Asumiendo que esta función cierra un modal

    // Mostrar alerta de SweetAlert2 con el éxito
    Swal.fire({
      title: response.mensaje || successMessage || "Éxito",
      icon: "success",
      confirmButtonText: "OK",
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // Si se presionó OK y la opción refresh está activa, recargar datos
        if (refresh) cargarUsuarios(); // Asumiendo que cargarUsuarios es la función a llamar
      }
    });

  } catch (err) {
    // Manejar errores de red o excepciones inesperadas
    console.error(`Error inesperado en ${apiFunction.name}:`, err);
    // Asignar el mensaje de error a error.value
    error.value = err.message || 'Ocurrió un error inesperado en la comunicación.';
    // Limpiar cualquier valor de éxito previo si aplica
    // success.value = null; // Asumiendo que 'success' es también una ref

    // Mostrar alerta de SweetAlert2 para el error de catch
    Swal.fire({
      title: errorMessage || "Error de Comunicación",
      icon: "error",
      text: error.value,
      confirmButtonText: "OK",
      draggable: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });
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

  try {

  await rolesStore.cargarRoles()
  await perfilStore.cargarPerfiles()
  await cargarUsuarios()
  } catch (err) {
    console.error('Error en la carga inicial global:', err);
    // Mostrar alerta global, redireccionar, etc.
  }finally {
    loading.value = false;
  }


  
})
</script>   
