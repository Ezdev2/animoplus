import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '../pages/Homepage/Homepage.vue'
import AskAppointment from '@/pages/Homepage/AskAppointment.vue'
import Login from '@/pages/Authentication/Login.vue'
import Dashboard from '@/pages/Dashboard/Dashboard.vue'
import Animals from '@/pages/Animals/Animals.vue'
import Documents from '@/pages/Documents/Documents.vue'
import ProfilePage from '@/pages/Profile/ProfilePage.vue'
import SpecialityPage from '@/pages/Speciality/SpecialityPage.vue'
import Message from '@/pages/Message/Message.vue'
import Appointment from '@/pages/appointment/components/AppointmentPage.vue'
import Services from '@/pages/Services/ServicesPage.vue'
import Tasks from '@/pages/Tasks/components/TasksComponents.vue'
import Accounting from '@/pages/Accounting/Accounting.vue'
import StockPage from '@/pages/StockManagement/StockPage.vue'

import { auth } from '@/stores/auth.js'
import Specialist from '@/pages/Homepage/Specialist.vue'
import SignUp from '@/pages/Authentication/SignUp.vue'
import ResetPassword from '@/pages/Authentication/ResetPassword.vue'
import LostAnimal from '@/pages/LostAnimal/LostAnimal.vue'
import ManagePatient from '@/pages/ManagePatient/ManagePatient.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Homepage,
      meta: { requiresGuest: true } // accessible seulement si NON connecté
    },
    {
      path: '/specialist',
      name: 'specialist',
      component: Specialist,
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: SignUp,
      meta: { requiresGuest: true }
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPassword,
      meta: { requiresGuest: true }
    },
    {
      path: '/ask-appointment',
      name: 'ask-appointment',
      component: AskAppointment,
      meta: { requiresGuest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true } // nécessite d’être connecté
    },
    {
      path: '/animals',
      name: 'animals',
      component: Animals,
      meta: { requiresAuth: true }
    },
    {
      path: '/documents',
      name: 'documents',
      component: Documents,
      meta: { requiresAuth: true }
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfilePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/speciality',
      name: 'speciality',
      component: SpecialityPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/lost-animal',
      name: 'lost-animal',
      component: LostAnimal,
      meta: { requiresAuth: true }
    },
    {
      path: '/message',
      name: 'message',
      component: Message,
      meta: { requiresAuth: true }
    },
    {
      path: '/appointment',
      name: 'appointment',
      component: Appointment,
      meta: { requiresAuth: true } 
    },
    {
      path: '/manage-patient',
      name: 'manage-patient',
      component: ManagePatient,
      meta: { requiresAuth: true }
    },
    {
      path: '/services',
      name: 'services',
      component: Services,
      meta: { requiresAuth: true }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks,
      meta: { requiresAuth: true }
    },
    {
      path: '/accounting',
      name: 'accounting',
      component: Accounting,
      meta: { requiresAuth: true }
    },
    {
      path: '/stockManagement',
      name: 'stockManagement',
      component: StockPage,
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = auth.isAuthenticated

  // Si connecté et essaie d’aller sur la home (/) → redirection vers dashboard
  if (to.path === '/' && isAuthenticated) {
    return next('/dashboard')
  }

  // Si route réservée aux non-connectés et qu'on est connecté → dashboard
  if (to.meta.requiresGuest && isAuthenticated) {
    return next('/dashboard')
  }

  // Si route protégée et qu’on n’est PAS connecté → redirection vers /ask-appointment
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  return next()
})

export default router
