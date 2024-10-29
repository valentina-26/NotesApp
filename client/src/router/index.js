// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/create.vue')
  },
  {
    path: '/notes',
    name: 'notes',
    component: () => import('../views/HelloWorld.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.name === 'notes' && !isAuthenticated) {
    next('/'); // Redirigir al login si la ruta es /notes y no está autenticado
  } else {
    next(); // Permitir la navegación
  }
});

export default router
