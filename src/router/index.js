import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import( '../views/LoginView.vue')
  },
  
  {
    path: '/login',
    name: 'login',
    component: () => import( '../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import( '../views/RegisterView.vue')
  },
  {
    path: '/classes',
    name: 'classes',
    component: () => import( '../views/ClassesView.vue')
  },
  {
    path: '/student',
    name: 'student',
    component: () => import( '../views/StudentView.vue')
  },
  {
    path: '/attendance',
    name: 'attendance',
    component: () => import( '../views/AttendanceView.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import( '../views/TestView.vue')
  },


]

const router = new VueRouter({
  routes
})

export default router
