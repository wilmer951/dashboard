import { createRouter, createWebHistory } from "vue-router";
import Login from './views/auth/login.vue'
import Main from "./components/layout/main.vue";
import Dashboard from "./views/dashboardView.vue"
import PageNotFound from "./views/PageNotFound.vue";
import Forbidden from "./views/ForbiddenView.vue";
import Users from "./views/users/Users.vue";
import home from "./views/homeView.vue";
import calidad from "./views/module/calidadview.vue";
import auditoria from "./views/module/auditorView.vue";
import { usePermissions } from "./composable/usePermissions";





import { useAuthStore } from './stores/auth/authStore';



const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { requiresAuth: false } 
  },
  {
    path: '/',
    component: Main,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' }, // Redirige la ruta raíz '/' a '/dashboard'
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
      { path: 'users', name: 'users', component: Users, meta: { requiredModule: 'users' } },
      { path: 'home', name: 'home', component: home},
      { path: 'forbidden', name: 'forbidden',name: 'forbidden',component: Forbidden},
      { path: 'calidad', name: 'calidad', component: calidad,meta: { requiredModule: 'calidad' } }, 
      { path: 'auditoria', name: 'auditoria', component: auditoria,meta: { requiredModule: 'auditoria' } }, 
      
    ]
  },
  // La ruta de captura (catch-all) debe ir siempre al final
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: PageNotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});



router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { canAccessModule } = usePermissions(); // 👈 importamos desde el composable

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredModule = to.meta.requiredModule;

  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.warn("No autenticado, redirigiendo a login...");
      return next({ name: "login" });
    }

    try {
      const isTokenValid = await authStore.checkTokenValidity();

      if (!isTokenValid) {
        return next({ name: "login" });
      }

      // 🔐 Verifica acceso al módulo requerido
      if (requiredModule && !canAccessModule(requiredModule)) {
        console.warn(`Acceso denegado al módulo: ${requiredModule}`);
        return next({ name: "forbidden" }); // o redirige a una página 403 si prefieres
      }

      return next();
    } catch (error) {
      console.error("Error al validar token:", error);
      await authStore.logout();
      return next({ name: "login" });
    }
  } else {
    // Si ya está autenticado y va a login, redirige al dashboard
    if (authStore.isAuthenticated && to.name === "login") {
      return next({ name: "dashboard" });
    }
    return next();
  }
});


export default router;