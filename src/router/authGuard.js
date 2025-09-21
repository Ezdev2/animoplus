// Guard d'authentification sans boucles
import { authChecker } from '@/utils/authChecker.js'

// Pages qui nécessitent une authentification
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profil',
  '/profile',
  '/animals',
  '/appointments',
  '/patients',
  '/manage-patient'
]

// Pages publiques (pas d'authentification requise)
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password'
]

// Pages par défaut selon le rôle
const DEFAULT_ROUTES = {
  authenticated: '/dashboard',
  unauthenticated: '/login'
}

export const authGuard = {
  
  // Vérifier si une route nécessite une authentification
  requiresAuth(path) {
    return PROTECTED_ROUTES.some(route => path.startsWith(route))
  },

  // Vérifier si une route est publique
  isPublicRoute(path) {
    return PUBLIC_ROUTES.some(route => path.startsWith(route))
  },

  // Déterminer où rediriger l'utilisateur
  getRedirectPath(currentPath, isAuthenticated) {
    console.log('🛡️ Détermination de la redirection:', {
      currentPath,
      isAuthenticated,
      requiresAuth: this.requiresAuth(currentPath),
      isPublic: this.isPublicRoute(currentPath)
    })

    // Si l'utilisateur est authentifié
    if (isAuthenticated) {
      // S'il est sur une page publique (login), le rediriger vers dashboard
      if (this.isPublicRoute(currentPath)) {
        console.log('✅ Utilisateur authentifié sur page publique → Dashboard')
        return DEFAULT_ROUTES.authenticated
      }
      // Sinon, le laisser sur sa page actuelle
      console.log('✅ Utilisateur authentifié sur page protégée → Rester')
      return null // Pas de redirection
    }

    // Si l'utilisateur n'est pas authentifié
    if (!isAuthenticated) {
      // S'il essaie d'accéder à une page protégée, le rediriger vers login
      if (this.requiresAuth(currentPath)) {
        console.log('❌ Utilisateur non authentifié sur page protégée → Login')
        return DEFAULT_ROUTES.unauthenticated
      }
      // S'il est déjà sur une page publique, le laisser
      console.log('✅ Utilisateur non authentifié sur page publique → Rester')
      return null // Pas de redirection
    }

    return null
  },

  // Fonction principale du guard
  checkRoute(to, from, next) {
    console.log('🛡️ Auth Guard - Vérification route:', {
      to: to.path,
      from: from.path
    })

    // TEMPORAIRE: Désactiver les redirections pour debug
    console.log('⚠️ GUARD TEMPORAIREMENT DÉSACTIVÉ POUR DEBUG')
    console.log('🔄 Synchronisation forcée...')
    
    // Forcer la synchronisation
    authChecker.syncAll()
    const isAuth = authChecker.isAuthenticated()
    
    console.log('📊 État après sync:', {
      isAuthenticated: isAuth,
      path: to.path,
      hasToken: !!authChecker.getToken(),
      hasUserData: !!authChecker.getUserData()
    })
    
    // LAISSER PASSER TOUTES LES ROUTES POUR L'INSTANT
    console.log(`✅ Accès autorisé (mode debug) à: ${to.path}`)
    next()
    
    // CODE ORIGINAL COMMENTÉ TEMPORAIREMENT
    /*
    const finalAuthState = authChecker.isAuthenticated()
    const redirectPath = this.getRedirectPath(to.path, finalAuthState)

    if (redirectPath) {
      console.log(`🚀 Redirection: ${to.path} → ${redirectPath}`)
      next(redirectPath)
    } else {
      console.log(`✅ Accès autorisé à: ${to.path}`)
      next()
    }
    */
  },

  // Fonction pour forcer une vérification et redirection si nécessaire
  forceCheck() {
    const currentPath = window.location.pathname
    const isAuth = authChecker.isAuthenticated()
    const redirectPath = this.getRedirectPath(currentPath, isAuth)

    if (redirectPath && redirectPath !== currentPath) {
      console.log(`🚀 Redirection forcée: ${currentPath} → ${redirectPath}`)
      window.location.href = redirectPath
      return true
    }

    return false
  }
}

export default authGuard
