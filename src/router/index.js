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
import CacheManagementPage from '@/pages/Admin/CacheManagementPage.vue'

import { simpleGuard } from '@/router/simpleGuard.js'
import Specialist from '@/pages/Homepage/Specialist.vue'
import SignUp from '@/pages/Authentication/SignUp.vue'
import ResetPassword from '@/pages/Authentication/ResetPassword.vue'
import VerifyEmail from '@/pages/Authentication/VerifyEmail.vue'
import LostAnimal from '@/pages/LostAnimal/LostAnimal.vue'
import ManagePatient from '@/pages/ManagePatient/ManagePatient.vue'

// Pages d'erreur
import NotFound from '@/pages/Error/NotFound.vue'
import AccessDenied from '@/pages/Error/AccessDenied.vue'

// Pages de test
import CloudinaryTest from '@/pages/Test/CloudinaryTest.vue'
import CacheTestPage from '@/pages/Test/CacheTestPage.vue'
import ServiceTypesTestPage from '@/pages/Test/ServiceTypesTestPage.vue'
import AuthDebugPage from '@/pages/Debug/AuthDebugPage.vue'

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
      path: '/verify-email',
      name: 'verify-email',
      component: VerifyEmail,
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
      meta: { requiresAuth: true, roles: ['client', 'veterinarian', 'veterinarian_pro'] }
    },
    {
      path: '/animals',
      name: 'animals',
      component: Animals,
      meta: { requiresAuth: true, roles: ['client'] }
    },
    {
      path: '/documents',
      name: 'documents',
      component: Documents,
      meta: { requiresAuth: true, roles: ['client', 'veterinarian', 'veterinarian_pro'] }
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfilePage,
      meta: { requiresAuth: true, roles: ['client', 'veterinarian', 'veterinarian_pro'] }
    },
    {
      path: '/speciality',
      name: 'speciality',
      component: SpecialityPage,
      meta: { requiresAuth: true, roles: ['client'] }
    },
    {
      path: '/lost-animal',
      name: 'lost-animal',
      component: LostAnimal,
      meta: { requiresAuth: true, roles: ['client', 'veterinarian', 'veterinarian_pro'] }
    },
    {
      path: '/message',
      name: 'message',
      component: Message,
      meta: { requiresAuth: true, roles: ['client', 'veterinarian', 'veterinarian_pro'] }
    },
    {
      path: '/appointment',
      name: 'appointment',
      component: Appointment,
      meta: { requiresAuth: true, roles: ['client', 'veterinarian', 'veterinarian_pro'] }
    },
    {
      path: '/manage-patient',
      name: 'manage-patient',
      component: ManagePatient,
      meta: { requiresAuth: true, roles: ['veterinarian', 'veterinarian_pro'] }
    },
    {
      path: '/services',
      name: 'services',
      component: Services,
      meta: { requiresAuth: true, roles: ['veterinarian', 'veterinarian_pro'] }
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: Tasks,
      meta: { requiresAuth: true, roles: ['veterinarian', 'veterinarian_pro'] }
    },
    {
      path: '/accounting',
      name: 'accounting',
      component: Accounting,
      meta: { requiresAuth: true, roles: ['veterinarian', 'veterinarian_pro'] }
    },
    {
      path: '/stockManagement',
      name: 'stockManagement',
      component: StockPage,
      meta: { requiresAuth: true, roles: ['veterinarian', 'veterinarian_pro'] }
    },
    // Pages Pro (accessibles seulement aux vétérinaires Pro)
    {
      path: '/pro-dashboard',
      name: 'pro-dashboard',
      component: Dashboard, // Réutiliser le dashboard avec affichage conditionnel
      meta: { requiresAuth: true, roles: ['veterinarian_pro'] }
    },
    {
      path: '/pro-analytics',
      name: 'pro-analytics',
      component: () => import('@/pages/Pro/ProAnalytics.vue'),
      meta: { requiresAuth: true, roles: ['veterinarian_pro'] }
    },
    {
      path: '/pro-reports',
      name: 'pro-reports',
      component: () => import('@/pages/Pro/ProReports.vue'),
      meta: { requiresAuth: true, roles: ['veterinarian_pro'] }
    },
    // Administration
    {
      path: '/admin/cache-management',
      name: 'admin-cache-management',
      component: CacheManagementPage,
      meta: { requiresAuth: true, roles: ['veterinarian', 'veterinarian_pro'] } // Accessible aux vétérinaires et Pro
    },
    // Page d'accès refusé
    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDenied,
      meta: { requiresAuth: true }
    },
    // Pages de test (publiques)
    {
      path: '/test/cloudinary',
      name: 'cloudinary-test',
      component: CloudinaryTest,
      meta: { requiresGuest: false, requiresAuth: false } // Accessible à tous
    },
    {
      path: '/test/cache',
      name: 'cache-test',
      component: CacheTestPage,
      meta: { requiresAuth: true, roles: ['veterinarian'] } // Test pour vétérinaires
    },
    {
      path: '/test/service-types',
      name: 'service-types-test',
      component: ServiceTypesTestPage,
      meta: { requiresAuth: true, roles: ['veterinarian'] } // Test pour vétérinaires
    },
    {
      path: '/debug/auth',
      name: 'auth-debug',
      component: AuthDebugPage,
      meta: { requiresAuth: false } // Accessible même sans auth pour diagnostic
    },
    {
      path: '/test/service-type', // Alias sans "s"
      redirect: '/test/service-types'
    },
    // Route 404 - DOIT ÊTRE LA DERNIÈRE
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    }
  ],
})

router.beforeEach((to, from, next) => {
  // Utiliser le guard ultra-simple
  simpleGuard(to, from, next)
})

export default router
