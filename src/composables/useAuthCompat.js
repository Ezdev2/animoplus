// Composable de compatibilité pour migrer progressivement vers useSimpleAuth
// Fournit la même API que useAuth.js mais utilise useSimpleAuth en arrière-plan

import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSimpleAuth } from './useSimpleAuth.js'

export function useAuthCompat() {
  const auth = useSimpleAuth()
  const router = useRouter()

  // États réactifs compatibles avec l'ancienne API
  const isAuthenticated = computed(() => auth.isAuthenticated.value)
  const isLoading = computed(() => auth.isLoading.value)
  const error = computed(() => null) // Simplifié pour l'instant
  const user = computed(() => auth.getCurrentUser.value)
  const role = computed(() => {
    const currentUser = auth.getCurrentUser.value
    if (!currentUser) return null
    return currentUser.user_type || currentUser.role || 'client'
  })

  // Getters de rôle
  const isClient = computed(() => role.value === 'client')
  const isPro = computed(() => role.value === 'veterinarian')

  // Actions d'authentification compatibles
  const login = async (credentials) => {
    console.log('🔄 useAuthCompat - Login avec:', credentials.email)
    
    try {
      // Utiliser le service d'authentification existant
      const { authService } = await import('../services/auth/authService.js')
      const result = await authService.login(credentials)
      
      if (result.success) {
        // Sauvegarder avec useSimpleAuth
        auth.login(result.data.token, result.data.refreshToken, result.data.user)
        
        // Redirection
        await router.push('/dashboard')
        return { success: true, user: result.data.user }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      console.error('❌ useAuthCompat - Erreur login:', err)
      return { success: false, error: 'Erreur de connexion' }
    }
  }

  const loginAs = async (roleType) => {
    console.log('🔄 useAuthCompat - LoginAs:', roleType)
    
    // Simulation d'un utilisateur selon le rôle
    const mockUser = {
      id: Date.now(),
      email: roleType === 'client' ? 'client@example.com' : 'pro@example.com',
      name: roleType === 'client' ? 'Client Test' : 'Professionnel Test',
      user_type: roleType === 'client' ? 'client' : 'veterinarian'
    }

    // Simuler un token
    const mockToken = 'mock-jwt-token-' + Date.now()
    
    // Sauvegarder avec useSimpleAuth
    auth.login(mockToken, null, mockUser)
    
    // Redirection
    await router.push('/dashboard')
    return { success: true, user: mockUser }
  }

  const register = async (userData) => {
    console.log('🔄 useAuthCompat - Register')
    
    try {
      const { authService } = await import('../services/auth/authService.js')
      const result = await authService.register(userData)
      
      if (result.success) {
        auth.login(result.data.token, result.data.refreshToken, result.data.user)
        await router.push('/dashboard')
        return { success: true, user: result.data.user }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      console.error('❌ useAuthCompat - Erreur register:', err)
      return { success: false, error: 'Erreur d\'inscription' }
    }
  }

  const logout = async () => {
    console.log('🔄 useAuthCompat - Logout')
    auth.logout()
    await router.push('/login')
  }

  // Vérification des permissions
  const hasRole = (roleToCheck) => {
    if (Array.isArray(roleToCheck)) {
      return roleToCheck.includes(role.value)
    }
    return role.value === roleToCheck
  }

  const hasPermission = (permission) => {
    // Simplifié pour l'instant
    return true
  }

  // Initialisation de l'authentification
  const initAuth = async () => {
    console.log('🔄 useAuthCompat - InitAuth')
    return auth.init()
  }

  // Vérification de l'authentification
  const checkAuth = async () => {
    return auth.isAuthenticated.value
  }

  // Gestion des erreurs
  const clearError = () => {
    // Simplifié pour l'instant
  }

  // Méthodes utilitaires
  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push('/login')
      return false
    }
    return true
  }

  const requireRole = (requiredRole) => {
    if (!requireAuth()) return false
    
    if (!hasRole(requiredRole)) {
      router.push('/dashboard')
      return false
    }
    return true
  }

  const requireGuest = () => {
    if (isAuthenticated.value) {
      router.push('/dashboard')
      return false
    }
    return true
  }

  return {
    // États
    isAuthenticated,
    isLoading,
    error,
    user,
    role,
    isClient,
    isPro,

    // Actions
    login,
    loginAs,
    register,
    logout,
    initAuth,
    checkAuth,
    clearError,

    // Permissions
    hasRole,
    hasPermission,

    // Utilitaires
    requireAuth,
    requireRole,
    requireGuest
  }
}

export default useAuthCompat
