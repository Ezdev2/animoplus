// Guard d'authentification ultra-simple
import { getGlobalAuth } from '@/composables/useSimpleAuth.js'

// Pages qui nécessitent une connexion
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profil',
  '/profile',
  '/animals',
  '/appointment',
  '/message',
  '/manage-patient',
  '/services',
  '/tasks',
  '/accounting',
  '/stockManagement',
  '/documents',
  '/speciality',
  '/lost-animal'
]

// Pages publiques (accessibles uniquement si NON connecté)
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/reset-password',
  '/forgot-password',
  '/ask-appointment',
  '/',
  '/specialist'
]

export const simpleGuard = (to, from, next) => {
  console.log('🛡️ Simple Guard - Navigation:', { 
    from: from.path, 
    to: to.path,
    timestamp: new Date().toLocaleTimeString()
  })
  
  // Vérification directe du localStorage pour éviter les problèmes de réactivité
  const data = localStorage.getItem('data')
  let isAuth = false
  let userData = null
  let userRole = null
  
  if (data) {
    try {
      const parsed = JSON.parse(data)
      isAuth = !!(parsed.token && parsed.user && parsed.user.id)
      userData = parsed.user
      userRole = userData?.user_type || userData?.role || 'client'
    } catch (error) {
      console.error('❌ Guard - Erreur parsing data:', error)
      isAuth = false
    }
  }
  
  // Déterminer le type de route
  const isPublicRoute = PUBLIC_ROUTES.some(route => to.path === route || to.path.startsWith(route + '/'))
  const isProtectedRoute = PROTECTED_ROUTES.some(route => to.path === route || to.path.startsWith(route + '/'))
  
  // Vérifier les permissions par rôle
  const requiredRoles = to.meta?.roles
  const hasRoleAccess = !requiredRoles || requiredRoles.includes(userRole)
  
  console.log('📊 Guard - État détaillé:', {
    isAuthenticated: isAuth,
    user: userData?.name || 'Aucun',
    userRole: userRole,
    hasToken: !!data,
    toPath: to.path,
    fromPath: from.path,
    isPublicRoute,
    isProtectedRoute,
    requiredRoles,
    hasRoleAccess
  })
  
  // RÈGLE 1: Si utilisateur connecté et va sur page publique → dashboard
  if (isAuth && isPublicRoute) {
    console.log('🔄 Guard - Utilisateur connecté sur page publique, redirection vers dashboard')
    return next('/dashboard')
  }
  
  // RÈGLE 2: Si utilisateur non connecté et va sur page protégée → login
  if (!isAuth && isProtectedRoute) {
    console.log('🚫 Guard - Utilisateur non connecté sur page protégée, redirection vers login')
    return next('/login')
  }
  
  // RÈGLE 3: Si utilisateur connecté mais n'a pas le bon rôle → access denied
  if (isAuth && isProtectedRoute && !hasRoleAccess) {
    console.log('🚫 Guard - Accès refusé pour le rôle:', userRole, 'requis:', requiredRoles)
    return next({
      path: '/access-denied',
      query: { 
        required: requiredRoles?.join(' ou '),
        current: userRole,
        attempted: to.path
      }
    })
  }
  
  // RÈGLE 4: Sinon laisser passer
  console.log('✅ Guard - Accès autorisé pour:', to.path)
  next()
}

export default simpleGuard
