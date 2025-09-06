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
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                ID Usuario
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Usuario
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Nombres
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Rol
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
              >
                Último Login
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody
            class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800"
          >
            <tr
              v-for="user in users"
              :key="user.id"
              class="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td
                class="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ user.id }}
              </td>
              <td
                class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300"
              >
                {{ user.username }}
              </td>
              <td
                class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300"
              >
                {{ user.name }}
              </td>
              <td
                class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300"
              >
                {{ user.role }}
              </td>
              <td
                class="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300"
              >
                {{ user.lastLogin }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <span
                  :class="[
                    'inline-flex rounded-full px-2 text-xs font-semibold leading-5',
                    user.estado === 1
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                  ]"
                >
                  {{ user.estado === 1 ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td
                class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
              >
                <div class="flex items-center justify-end space-x-4">
                  <button
                    class="rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    @click="abrirModal('edit',user)"
                  >
                    Editar
                  </button>
                  <button
                    class="rounded-md bg-amber-500 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    @click="abrirModal('reset',user)"
                  >
                    Rest. contraseña
                  </button>

                    <button
                    class="rounded-md bg-amber-500 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    @click="abrirModal('delete',user)"
                  >
                    Eliminar
                  </button>



                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación (aún estática, pendiente conectar al backend) -->
      <div
        class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800 sm:px-6"
      >
        <div class="flex flex-1 justify-between sm:hidden">
          <a
            href="#"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >Anterior</a
          >
          <a
            href="#"
            class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >Siguiente</a
          >
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Mostrando <span class="font-medium">1</span> a
              <span class="font-medium">10</span> de
              <span class="font-medium">97</span> resultados
            </p>
          </div>
          <div>
            <nav
              class="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <a
                href="#"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span class="sr-only">Anterior</span>
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                aria-current="page"
                class="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >1</a
              >
              <a
                href="#"
                class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-700"
                >2</a
              >
              <a
                href="#"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span class="sr-only">Siguiente</span>
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->

    <UserModal 
      v-if="mostrarModal"
      :visible="mostrarModal" 
      :mode="modalMode" 
      :selectedUser="usuarioSeleccionado"
      :error="error"
      :success="success"
      @close="cerrarModal"
      @save="generarusuario"
      
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


const rolesStore = useRolesStore();
const perfilStore = usePerfilesStore();


// Estado reactivo
const mostrarModal = ref(false);
const users = ref([]);
const loading = ref(true);
const error = ref(null);
const success = ref(null);

const usuarioSeleccionado = ref(null);
const modalMode = ref("create");


function abrirModal(mode, user = null) {

  error.value = ""
  success.value = ""

  
     const userForModal = { ...user }; 

  // Check if the user and the role exist before attempting to split
  if (userForModal && userForModal.id_rol) {
    // Split the comma-separated string into an array
    userForModal.role = userForModal.id_rol.split(',');
  }
   
  modalMode.value = mode
  usuarioSeleccionado.value = userForModal;
  mostrarModal.value = true
}




const cerrarModal = () => {
  // 🔑 Al cerrar, resetea todos los estados relacionados
  
  mostrarModal.value = false
  modalMode.value = "create"
  usuarioSeleccionado.value = null;
}


const cargarUsuarios = async () => {



  error.value = null;
  loading.value = true;
  try {
    console.log(await listUsers());
    users.value = await listUsers();  // ya viene transformado
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};


const generarusuario = (payload) => {
  const { data, mode } = payload;

  switch (mode) {
    case "create":
      guardarUsuario(data);
      break;
    case "edit":
      editarUsuario(data);
      break;
    case "reset":
      resetearContrasena(data);
      break;
    case "delete":
      eliminarUsuario(data);
      break;
    default:
      console.error("Modo no reconocido:", mode);
      break;
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
      return;
    }

    success.value = response.mensaje || successMessage;
    error.value = null;

    if (refresh) {
      await cargarUsuarios();
    }

    setTimeout(() => {
      cerrarModal();
    }, 3000);

  } catch (err) {
    console.error(`Error en ${apiFunction.name}:`, err);
    error.value = err.message || 'Ocurrió un error inesperado.';
    success.value = null;
  }
};

const guardarUsuario = (data) => {
  handleApiCall(createUser, data, {
    successMessage: "Usuario creado con éxito.",
    errorMessage: "Ocurrió un error al crear el usuario.",
  });
};

const editarUsuario = (data) => {
  handleApiCall(updateUser, data, {
    successMessage: "Usuario actualizado con éxito.",
    errorMessage: "Ocurrió un error al actualizar el usuario.",
  });
};

const eliminarUsuario = (data) => {
  handleApiCall(deleteUser, data, {
    successMessage: "Usuario eliminado con éxito.",
    errorMessage: "Ocurrió un error al eliminar el usuario.",
  });
};

const resetearContrasena = (data) => {
  handleApiCall(resetPassword, data, {
    successMessage: "Contraseña reseteada con éxito.",
    errorMessage: "Ocurrió un error al resetear la contraseña.",
    refresh: false,
  });
};

onMounted(async () => {
  await cargarUsuarios()
  await rolesStore.cargarRoles()
  await perfilStore.cargarPerfiles()
})
</script>   
