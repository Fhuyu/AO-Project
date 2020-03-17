import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Battleboard',
    component: () => import(/* webpackChunkName: "battleboard" */ '../views/Battleboard.vue')
  },
  {
    path: '/killboard/:id',
    name: 'Killboard',
    component: () => import(/* webpackChunkName: "killboard" */ '../views/Killboard.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
