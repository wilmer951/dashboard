import { defineStore } from 'pinia'
import { listPerfiles } from '@/services/users/perfilService';

export const usePerfilesStore = defineStore('perfiles', {

  state: () => ({
    perfiles: [],           // Aquí se guardan los roles
    perfilescargados: false // Evita consultar la API más de una vez
  }),

  actions: {
    async cargarPerfiles() {

        
      if (this.perfilescargados) return; // Ya están cargados, no vuelvas a pedirlos

      try {
        const response = await listPerfiles(); // Llamas al servicio
        this.perfiles = response;
        this.perfilescargados = true;  // Marcas como cargados
        console.log("Perfiles cargados desde el store.",this.perfiles)       
      } catch (error) {
        console.error('Error cargando roles desde el store:', error);
      }
    }
  }





  
  


})