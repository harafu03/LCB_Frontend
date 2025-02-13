import { createRouter, createWebHistory } from 'vue-router';

const routes: any[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue'),
  },
  {
    path: '/board',
    name: 'Board',
    component: () => import('./views/board/BoardView.vue'),
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router