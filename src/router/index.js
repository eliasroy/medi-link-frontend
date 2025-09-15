import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
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
    path: '/doctors',
    name: 'Doctors',
    component: Doctors
  },
  {
    path: '/doctor/:doctorId/calendar',
    name: 'DoctorCalendar',
    component: DoctorCalendar,
    props: true
  },
  {
    path: '/appointment-form',
    name: 'AppointmentForm',
    component: AppointmentForm
  },
  {
    path: '/patient-appointments',
    name: 'PatientAppointments',
    component: PatientAppointments
  },
  {
    path: '/doctor-appointments',
    name: 'DoctorAppointments',
    component: DoctorAppointments
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router