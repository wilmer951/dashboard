<template>
  <div class="max-w-xl mx-auto p-8 bg-white rounded-3xl shadow-2xl">

        <p
          v-if="(mode === 'delete')"
          class="text-red-600 text-sm"
        >
          Estas seguro de eliminar este usuario?
        </p>


    <form @submit.prevent="submitForm" class="space-y-6">

        <input
          v-model="form.id"
          type="hidden"
          id="id_user"
          class="block w-full px-4 pt-5 pb-1 rounded-lg border-2 border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          
        />

      <div  class="relative">
        <input
          v-model="form.usuario"
          type="text"
          id="usuario"
          class="block w-full px-4 pt-5 pb-1 rounded-lg border-2 border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          placeholder=" "
          required
          :disabled="mode === 'edit' || mode === 'delete' || mode === 'reset'"
        />
        <label
          for="usuario"
          class="absolute top-2 left-4 text-gray-500 text-xs duration-300 transform -translate-y-2 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-2"
        >
          Usuario
        </label>
      </div>

      <div v-if="mode === 'create' || mode === 'edit'" class="relative">
        <input
          v-model="form.nombres"
          type="text"
          id="nombres"
          class="block w-full px-4 pt-5 pb-1 rounded-lg border-2 border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          placeholder=" "
          required
        />
        <label
          for="nombres"
          class="absolute top-2 left-4 text-gray-500 text-xs duration-300 transform -translate-y-2 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-2"
        >
          Nombres
        </label>
      </div>

      <div v-if="mode === 'create' || mode === 'reset'" class="relative" >
        <input
          v-model="form.password"
          type="password"
          id="password"
          class="block w-full px-4 pt-5 pb-1 rounded-lg border-2 border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          placeholder=" "
          required
        />
        <label
          for="password"
          class="absolute top-2 left-4 text-gray-500 text-xs duration-300 transform -translate-y-2 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-2"
        >
          Contraseña
        </label>
      </div>



    <div v-if="mode === 'create' || mode === 'reset'" class="relative">
      <input
        v-model="form.confirmarContrasena"
        type="password"
        id="confirmarContrasena"
        class="block w-full px-4 pt-5 pb-1 rounded-lg border-2 border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
        placeholder=" "
        required
      />
      <label
        for="confirmarContrasena"
        class="absolute top-2 left-4 text-gray-500 text-xs duration-300 transform -translate-y-2 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-2"
      >
        Confirmar Contraseña
      </label>

          <p
          v-if="(mode === 'create' || mode === 'reset') && form.password && form.confirmarContrasena && !contrasenasCoinciden"
          class="text-red-600 text-sm"
        >
          Las contraseñas no coinciden
        </p>
    </div>


      <div v-if="mode === 'create' || mode === 'edit'" class="relative">
        <select
          v-model="form.perfil"
          id="perfil"
          class="block w-full px-4 pt-5 pb-1 rounded-lg border-2 border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          required
        >
          <option disabled value="" class="text-gray-400">Seleccione perfil</option>
          <option v-for="perfil in perfilStore.perfiles" :key="perfil.id_perfil" :value="perfil.id_perfil">
            {{ perfil.nombre_perfil }}
    </option>
        </select>
        <label
          for="perfil"
          class="absolute top-2 left-4 text-gray-500 text-xs duration-300 transform -translate-y-2 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-2"
        >
          Perfil
        </label>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
          <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
        </div>
      </div>

      <div v-if="mode === 'create' || mode === 'edit'">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Roles</label>
        <select
          v-model="form.rol"
          multiple
          class="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm transition-all duration-200 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm p-3 h-32 focus:outline-none"
          required
        >

          <option v-for="rol in rolesStore.roles" :key="rol.id_rol" :value="rol.id_rol">
            {{ rol.nombre_rol }}
    </option>
          
        </select>
      </div>



       <div v-if="mode === 'edit'" class="relative">
        <select
          v-model.number="form.estado"
          id="estado"
          class="block w-full px-4 pt-5 pb-1 rounded-lg border-2 border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          required
        >
          <option disabled value="" class="text-gray-400">Seleccione perfil</option>
          <option :value="1">Activo</option>
          <option :value="0">Inactivo</option>
          
        </select>
        <label
          for="perfil"
          class="absolute top-2 left-4 text-gray-500 text-xs duration-300 transform -translate-y-2 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-2"
        >
          Perfil
        </label>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
          <svg class="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" fill-rule="evenodd"></path></svg>
        </div>
      </div>





      <div class="pt-4">
        <button  :disabled="(mode === 'create' || mode === 'reset') && !contrasenasCoinciden"   
          type="submit"
          class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
        >
          Enviar
          </button>

          
    
      </div>
      



      <!--  <pre class="mt-6 bg-gray-50 text-gray-700 p-4 rounded-xl border border-gray-200 text-sm overflow-auto">{{ form }}</pre>-->
    </form>
  </div>
</template>

<script setup>
import { watch, reactive,computed } from "vue";
import { useRolesStore } from "@/stores/users/userRolesStore";
import { usePerfilesStore } from "@/stores/users/userPerfilesStore";

const rolesStore = useRolesStore();
const perfilStore = usePerfilesStore();







const props = defineProps({
  mode: String, // create | edit | reset
  datauser: Object,
});



const form = reactive({
  id:null,
  usuario: "",
  nombres: "",
  password: "",
  perfil: "",
  rol: [],
  estado: "",
  confirmarContrasena: "",
});

/**
 * Reinicia el formulario a sus valores por defecto.
 */
const resetForm = () => {
  form.id=null;
  form.usuario = "";
  form.nombres = "";
  form.password = "";
  form.perfil = "";
  form.rol = [];
  form.estado = ""
};





/**
 * Observa los cambios en el modo del componente para inicializar o reiniciar el formulario.
 */
watch(
  () => props.mode,
  (newMode) => {
    // Si el modo es 'edit' y hay datos, carga la información del usuario
    if (newMode === "edit" && props.datauser) {
      form.id=props.datauser.id;
      form.usuario = props.datauser.username || "";
      form.nombres = props.datauser.name || "";
      form.password = ""; // Se deja vacío por seguridad
      form.perfil = props.datauser.id_perfil || "";
      form.rol = props.datauser.role ? [...props.datauser.role] : [];
      form.estado = props.datauser.estado || "";
    }
    // Si el modo es 'reset' y hay datos, solo prepara el formulario para la contraseña
    else if (newMode === "reset" && props.datauser) {
      // Limpia todos los campos excepto el de usuario para el restablecimiento
      form.id=props.datauser.id;
      form.usuario = props.datauser.username || "";
      form.nombres = "";
      form.password = "";
      form.perfil = "";
      form.rol = [];
    form.estado = props.datauser.estado || "";
    }

    else if (newMode === "delete" && props.datauser) {
      // Limpia todos los campos excepto el de usuario para el restablecimiento
      form.id=props.datauser.id;
      form.usuario = props.datauser.username || "";
      form.nombres = "";
      form.password = "";
      form.perfil = "";
      form.rol = [];
    form.estado = props.datauser.estado || "";
    }


    // Si el modo es 'create' o cualquier otro, reinicia el formulario
    else if (newMode === "create") {
      resetForm();
    }
  },
  { immediate: true }
);



const contrasenasCoinciden = computed(() => {
  return form.password === form.confirmarContrasena;
});





const submitForm = () => {
  emit("submit", { data: { ...form }, mode: props.mode });
};


const emit = defineEmits(["submit"]);

</script>