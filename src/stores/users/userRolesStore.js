import { defineStore } from 'pinia'
import { listRoles } from '@/services/users/rolesService'

export const useRolesStore = defineStore('roles', {

  state: () => ({
    roles: [],           // Aquí se guardan los roles
    rolesCargados: false // Evita consultar la API más de una vez
  }),

  actions: {
    async cargarRoles() {

        
      if (this.rolesCargados) return; // Ya están cargados, no vuelvas a pedirlos
   
      try {

        
          
        const response = await listRoles(); // Llamas al servicio
        this.roles = response;        // Guardas los roles
        this.rolesCargados = true;  // Marcas como cargados
        console.log("Roles cargados en el store:", this.roles);
      } catch (error) {
        console.error('Error cargando roles desde el store:', error);
      }
    }
  }





  
  


})