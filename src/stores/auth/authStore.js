// src/stores/authStore.js
import { defineStore } from 'pinia';
import { login as apiLogin, logout as apiLogout } from '@/services/auth/authService';

// Es una buena práctica definir roles como constantes para mejorar la legibilidad.
const ACCESOTOTAL  = ["1"];
const AUDITOR  = ["1","3"];
const ADUTORCALIDAD  = ["1", "2"];


export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwtToken: localStorage.getItem('jwt_token') || null,
    roles: JSON.parse(localStorage.getItem('roles') || "[]"), // siempre array
    usuario: localStorage.getItem('usuario') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.jwtToken,
    isAllowed: (state) => state.roles.some(r => ACCESOTOTAL.includes(r)),
    isAuditor: (state) => state.roles.some(r => AUDITOR.includes(r)),
    isAudiCalidad: (state) => state.roles.some(r => ADUTORCALIDAD.includes(r)),
    
  },
  actions: {
    async login(usuario, password) {
      const result = await apiLogin(usuario, password);
    
      if (result.success) {
        this.jwtToken = result.data.token;

        // ⚡ Usar id_rol que viene del backend
          this.roles = result.data.rol
        ? String(result.data.rol).split(",").map(r => r.trim())
        : [];

        this.usuario = result.data.usuario;
        
        // Guardar en localStorage
        localStorage.setItem('jwt_token', this.jwtToken);
        localStorage.setItem('roles', JSON.stringify(this.roles));
        localStorage.setItem('usuario', this.usuario);

        return true;
      }
      return false;
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
