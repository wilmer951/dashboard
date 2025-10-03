import { defineStore } from "pinia";
import { validarLicencia } from "@/services/licenses/licenseService";

export const useLicenseStore = defineStore('license', {
  state: () => ({
    licenseStatus: 'INVALID',
    validatedAt: null, // nueva propiedad para saber cuándo se validó
  }),

  actions: {
    async validarLicencia(force = false) {
      const now = Date.now();
      const VALID_FOR = 720 * 60 * 1000; // 10 minutos

      // Si ya está validada y no ha expirado, y no se está forzando, no volver a validar
      if (
        this.licenseStatus === 'active' &&
        this.validatedAt &&
        now - this.validatedAt < VALID_FOR &&
        !force
      ) {
        return { statusLicence: this.licenseStatus };
      }

      try {
        const result = await validarLicencia();
        this.licenseStatus = result.status;
        this.validatedAt = Date.now(); // actualiza tiempo

        return { statusLicence: result.status };
      } catch (error) {
        console.error("❌ Error validando licencia:", error);
        this.licenseStatus = 'INVALID';
        this.validatedAt = null;
        return { statusLicence: 'INVALID' };
      }
    },

    // 🔁 Nueva acción: verificación periódica automática
    iniciarVerificacionPeriodica() {
      // Cada 5 minutos (ajustable)
        console.log("⏱️ Iniciando verificación periódica de licencia");
      const INTERVAL = 720 * 60 * 1000;
        console.log
      // Guardamos el ID del intervalo si quieres detenerlo luego
      this._intervalId = setInterval(async () => {
        const result = await this.validarLicencia(true); // fuerza revalidación

        if (result.statusLicence !== 'active') {
          window.location.reload(); // o redirige al login
        }
      }, INTERVAL);
    },

    detenerVerificacionPeriodica() {
      if (this._intervalId) {
        clearInterval(this._intervalId);
        this._intervalId = null;
      }
    },
  }
});
