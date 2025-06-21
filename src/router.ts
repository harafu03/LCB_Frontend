import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from './composables/useAuth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/board/:id',
    name: 'Board',
    component: () => import('./views/board/BoardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./views/auth/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./views/auth/Register.vue'),
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated.value) {
    // Redirect to login page if not authenticated
    next({ name: 'Login' });
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated.value) {
    // Redirect to home if already logged in
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
