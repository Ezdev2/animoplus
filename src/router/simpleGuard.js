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
  '/lost-animal',
  '/admin'  // Toutes les routes admin
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
      
      // Déterminer le rôle avec support des utilisateurs Pro
      let baseRole = userData?.user_type || userData?.role || 'client'
      
      // Si c'est un vétérinaire Pro, on garde les deux rôles
      if (baseRole === 'veterinarian_pro') {
        userRole = 'veterinarian_pro'
      } else {
        userRole = baseRole
      }
      
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
  let hasRoleAccess = !requiredRoles || requiredRoles.includes(userRole)
  
  // Si c'est un vétérinaire Pro, il a accès à toutes les pages des vétérinaires normaux
  if (userRole === 'veterinarian_pro' && requiredRoles && requiredRoles.includes('veterinarian')) {
    hasRoleAccess = true
  }
  
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
  
  // RÈGLE 1: Si utilisateur connecté et va sur page publique → dashboard approprié
  if (isAuth && isPublicRoute) {
    console.log('🔄 Guard - Utilisateur connecté sur page publique, redirection vers dashboard')
    // Rediriger les admins vers leur interface
    if (userRole === 'admin') {
      return next('/admin')
    }
    return next('/dashboard')
  }
  
  // RÈGLE 2: Si utilisateur non connecté et va sur page protégée → login
  if (!isAuth && isProtectedRoute) {
    console.log('🚫 Guard - Utilisateur non connecté sur page protégée, redirection vers login')
    return next('/login')
  }
  
  // RÈGLE 3: Si utilisateur connecté mais n'a pas le bon rôle
  if (isAuth && isProtectedRoute && !hasRoleAccess) {
    console.log('🚫 Guard - Accès refusé pour le rôle:', userRole, 'requis:', requiredRoles)
    
    // Cas spécial : Admin qui essaie d'accéder au dashboard normal → rediriger vers admin
    if (userRole === 'admin' && to.path === '/dashboard') {
      console.log('🔄 Guard - Admin redirigé vers interface admin')
      return next('/admin')
    }
    
    // Sinon, accès refusé normal
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
