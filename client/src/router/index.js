import { createRouter, createWebHistory } from 'vue-router'


import nota from '../views/HelloWorld.vue'
import login from '../views/login.vue'
import createAccount from '../views/create.vue'



const routes = [
  { path: '/notes', component: nota},
  { path: '/login', component: login},
  { path: '/createAccount', component: createAccount},

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router