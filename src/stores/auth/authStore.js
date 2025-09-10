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
        
        
        console.log('Login successful, processing response...');


        this.jwtToken = result.data.access_token;
        console.log('Received token from backend:', result.data.access_token);
        console.log('User roles from backend:', result.data.roles);
        console.log('User name from backend:', result.data.username);

        // ⚡ Usar id_rol que viene del backend
       this.roles = result.data.roles ? result.data.roles : [];
        this.usuario = result.data.username;
        
        // Guardar en localStorage
        
        localStorage.setItem('jwt_token', this.jwtToken);
        localStorage.setItem('roles', JSON.stringify(this.roles));
        localStorage.setItem('usuario', this.usuario);

        return { success: true, message: "Login exitoso" };
      }
    return { success: false, message: result.message || "Usuario o contraseña incorrectos" };
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
