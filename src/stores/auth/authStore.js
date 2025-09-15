// src/stores/authStore.js
import { defineStore } from 'pinia';
import { login as apiLogin, logout as apiLogout, isTokenValid as apiIstokeninvalid } from '@/services/auth/authService';

// Es una buena práctica definir roles como constantes para mejorar la legibilidad.
const ACCESOTOTAL  = [1];
const AUDITOR  = [1, 3];
const ADUTORCALIDAD  = [1, 2];


export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwtToken: localStorage.getItem('jwt_token') || null,
    roles: JSON.parse(localStorage.getItem('roles') || "[]"), // siempre array  
    usuario: localStorage.getItem('usuario') || null,
    modules: JSON.parse(localStorage.getItem('modules') || "[]"),
  }),
  getters: {
    isAuthenticated: (state) => !!state.jwtToken,
  
      // Verifica si el usuario puede acceder a un módulo por nombre
    canAccessModule: (state) => {
      return (moduleName) => state.modules.includes(moduleName);
    }
    
  },
  actions: {
    async login(usuario, password) {
      const result = await apiLogin(usuario, password);

      if (result.success=== true) {
        

        this.jwtToken = result.data.access_token;
        

        // ⚡ Usar id_rol que viene del backend
       this.roles = result.data.roles ? result.data.roles : [];
        this.usuario = result.data.username;
        this.modules = result.data.modules;
        
        // Guardar en localStorage
        
        localStorage.setItem('jwt_token', this.jwtToken);
        localStorage.setItem('roles', JSON.stringify(this.roles));
        localStorage.setItem('modules', JSON.stringify(this.modules));
        localStorage.setItem('usuario', this.usuario);

        return { success: true, message: "Login exitoso" };
      }
    return result;
    },






  // Nueva acción para validar el token
async checkTokenValidity() {
      
      try {
        if (!this.jwtToken) return false;

        const valid = await apiIstokeninvalid(this.jwtToken);
  
        if (!valid) {
          await this.logout();
          return false;
        }
        return valid;
      } catch (error) {
        
        await this.logout();
        return false;
      } finally {
        this.isCheckingAuth = false; // Marca que la verificación inicial ha terminado
      }
    },








    logout() {
      this.jwtToken = null;
      this.roles = [];
      this.usuario = null;

      localStorage.clear(); // o removeItem('jwt_token') / removeItem('roles') / removeItem('usuario')
      apiLogout();
    }
  }
});
