import { createRouter, createWebHistory } from "vue-router";
import Login from './views/auth/login.vue'
import Main from "./components/layout/main.vue";
import Dashboard from "./views/dashboardView.vue"
import PageNotFound from "./views/PageNotFound.vue";
import Users from "./views/users/users.vue";
import home from "./views/homeView.vue";
import calidad from "./views/module/calidadview.vue";
import auditor from "./views/module/auditorView.vue";





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
      { path: 'users', name: 'users', component: Users, meta: { guard: "isAllowed" } },
      { path: 'home', name: 'home', component: home },
      { path: 'calidad', name: 'calidad', component: calidad }, 
      { path: 'auditor', name: 'auditor', component: auditor }, 
      
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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
 


    if (requiresAuth) {
      if (!authStore.isAuthenticated) {
        console.warn("No autenticado, redirigiendo a login...");
        return next({ name: "login" });
      }

      try {
    
        // 🔐 Si la ruta tiene un guard específico
        if (to.meta.guard && !authStore[to.meta.guard]) {
          return next({ name: "dashboard" }); // o un 403
        }

        return next();
      } catch (error) {
        console.error("Error al validar token:", error);
        await authStore.logout();
        return next({ name: "login" });
      }
    } else {
      if (authStore.isAuthenticated && to.name === "login") {
        return next({ name: "dashboard" });
      }
      return next();
    }

});



export default router;