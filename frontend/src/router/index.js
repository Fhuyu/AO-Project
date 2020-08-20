import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/attendance',
    name: 'Attendance',
    component: () => import(/* webpackChunkName: "battleboard" */ '../views/Attendance.vue')
  },
  {
    path: '/',
    name: 'Battleboard',
    component: () => import(/* webpackChunkName: "battleboard" */ '../views/Battleboard.vue')
  },
  {
    path: '/:guildName',
    name: 'Guild Battleboard',
    component: () => import(/* webpackChunkName: "battleboard" */ '../views/Battleboard.vue')
  },
  {
    path: '/killboard/:id',
    name: 'Killboard',
    component: () => import(/* webpackChunkName: "killboard" */ '../views/Killboard.vue')
  },
  {
    path: '/sort/:id',
    name: 'Sort',
    component: () => import(/* webpackChunkName: "sort" */ '../views/Sort.vue')
  },
  {
    path: '/handhold/:id',
    name: 'Sort',
    component: () => import(/* webpackChunkName: "sort" */ '../components/Handhold.vue')
  },
  
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
