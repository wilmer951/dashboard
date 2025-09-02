<template>
  <div class="max-w-xl mx-auto p-8 bg-white rounded-3xl shadow-2xl">

    <form @submit.prevent="submitForm" class="space-y-6">
      <div class="relative">
        <input
          v-model="form.usuario"
          type="text"
          id="usuario"
          class="block w-full px-4 pt-5 pb-1 rounded-lg border-2 border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          placeholder=" "
          required
        />
        <label
          for="usuario"
          class="absolute top-2 left-4 text-gray-500 text-xs duration-300 transform -translate-y-2 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-2 peer-focus:scale-75 peer-focus:-translate-y-2"
        >
          Usuario
        </label>
      </div>

      <div class="relative">
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

      <div class="relative">
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

      <div class="relative">
        <select
          v-model.number="form.perfil"
          id="perfil"
          class="block w-full px-4 pt-5 pb-1 rounded-lg border-2 border-gray-300 shadow-sm appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
          required
        >
          <option disabled value="" class="text-gray-400">Seleccione perfil</option>
          <option :value="1">Administrador</option>
          <option :value="2">Editor</option>
          <option :value="3">Invitado</option>
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

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Roles</label>
        <select
          v-model="form.rol"
          multiple
          class="mt-1 block w-full rounded-lg border-2 border-gray-300 shadow-sm transition-all duration-200 focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm p-3 h-32 focus:outline-none"
          required
        >
          <option :value="1">Rol 1</option>
          <option :value="2">Rol 2</option>
          <option :value="3">Rol 3</option>
        </select>
      </div>

      <div class="pt-4">
        <button
          type="submit"
          class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
        >
          Guardar
        </button>
      </div>

      <!-- <pre class="mt-6 bg-gray-50 text-gray-700 p-4 rounded-xl border border-gray-200 text-sm overflow-auto">{{ form }}</pre>-->
    </form>
  </div>
</template>

<script setup>
import { watch,reactive } from "vue";

const props = defineProps({
  mode: String, // create | edit | reset
  datauser:Object

  
  
})

console.log(props.datauser);


const emit = defineEmits(["submit"]);

const form = reactive({
  usuario: "",
  nombres: "",
  password: "",
  perfil: "",
  rol: [],
});



// 👇 Observa cuando cambien el modo o el datauser
watch(
  () => [props.mode, props.datauser],
  ([mode, user]) => {
    if (mode === "edit" && user) {
      form.usuario = user.username || "";
      form.nombres = user.name || "";
      form.password = ""; // normalmente no se precarga
      form.perfil = user.id_perfil || "";
      form.rol = user.role ? [...user.role] : [];
    } else if (mode === "create") {
      // limpiar formulario en modo crear
      form.usuario = "";
      form.nombres = "";
      form.password = "";
      form.perfil = "";
      form.rol = [];
    }
  },
  { immediate: true } // ejecuta también al montar el componente
);



const submitForm = () => {
  emit("submit", { ...form }); // directo como objeto
};



</script>