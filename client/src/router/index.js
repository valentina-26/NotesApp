import { createRouter, createWebHistory } from 'vue-router'

import doctor from '../views/HelloWorld.vue'
import centro from '../views/Centro.vue'
import nota from '../views/HelloWorld.vue'



const routes = [
  { path: '/notes', component: nota},
  { path: '/users', component: nota},

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router