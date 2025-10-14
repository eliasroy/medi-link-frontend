import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Panel from '../views/Panel.vue'
import Doctors from '../views/Doctors.vue'
import DoctorCalendar from '../views/DoctorCalendar.vue'
import AppointmentForm from '../views/AppointmentForm.vue'
import PatientAppointments from '../views/PatientAppointments.vue'
import DoctorAppointments from '../views/DoctorAppointments.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/panel',
    name: 'Panel',
    component: Panel,
    meta: { requiresAuth: true }
  },
  {
    path: '/doctors',
    name: 'Doctors',
    component: Doctors,
    meta: { requiresAuth: true }
  },
  {
    path: '/doctor/:doctorId/calendar',
    name: 'DoctorCalendar',
    component: DoctorCalendar,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/appointment-form',
    name: 'AppointmentForm',
    component: AppointmentForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/patient-appointments',
    name: 'PatientAppointments',
    component: PatientAppointments,
    meta: { requiresAuth: true }
  },
  {
    path: '/doctor-appointments',
    name: 'DoctorAppointments',
    component: DoctorAppointments,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token') !== null

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router