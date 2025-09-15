// src/composables/usePermissions.js
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth/authStore';


export function usePermissions() {
  const authStore = useAuthStore();

  const canAccessModule = (moduleName) => {
    return authStore.canAccessModule(moduleName);
  };

  // Aliases para mayor claridad en componentes (opcional)
  const canAccessUsers = computed(() => canAccessModule('users'));
  const canAccessVentas = computed(() => canAccessModule('ventas'));

  return {
    canAccessModule
  };
}
