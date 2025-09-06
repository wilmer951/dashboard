// src/stores/authStore.js
import { defineStore } from 'pinia';
import { login as apiLogin, logout as apiLogout } from '@/services/auth/authService';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwtToken: localStorage.getItem('jwt_token') || null,
    rolId: localStorage.getItem('id_rol') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.jwtToken,
  },
  actions: {
    async login(usuario, password) {
      const result = await apiLogin(usuario, password);

      if (result.success) {
        this.jwtToken = result.data.token;
        this.rolId = result.data.rol;

        // Guardar en localStorage desde la store
        localStorage.setItem('jwt_token', this.jwtToken);
        localStorage.setItem('id_rol', this.rolId);

        return true;
      } else {
        return false;
      }
    },
    logout() {
      this.jwtToken = null;
      this.rolId = null;
    apiLogout();

    }
  }
});