import { createRouter, createWebHistory } from "vue-router";
import Login from './views/auth/login.vue'
import Main from "./components/layout/main.vue";
import Dashboard from "./views/dashboard.vue"
import PageNotFound from "./views/PageNotFound.vue";
import Users from "./views/users/users.vue";





import { isAuthenticated, login, logout,isTokenValid } from "./services/auth/authService";   



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
      { path: 'users', name: 'users', component: Users }
      
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
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (isAuthenticated()) {
    const valid = await isTokenValid();

    if (valid) {
      if (to.name === 'login') {
        next({ name: 'dashboard' });
      } else {
        next();
      }
    } else {
      logout();
      next(requiresAuth ? { name: 'login' } : undefined);
    }
  } else {
    next(requiresAuth ? { name: 'login' } : undefined);
  }
});



export default router;