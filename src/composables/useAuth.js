import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authPinia.js'
import { useUserStore } from '../stores/user.js'

// Composable réactif pour l'authentification
export function useAuth() {
  const authStore = useAuthStore()
  const userStore = useUserStore()
  const router = useRouter()

  // États réactifs
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const isLoading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)
  const user = computed(() => userStore.user)
  const role = computed(() => userStore.user?.user_type || null)

  // Getters de rôle
  const isClient = computed(() => role.value === 'client')
  const isPro = computed(() => role.value === 'veterinarian')

  // Actions d'authentification
  const login = async (credentials) => {
    const result = await authStore.login(credentials)
    if (result.success) {
      // Redirection après connexion réussie
      await router.push('/dashboard')
    }
    return result
  }

  const loginAs = async (roleType) => {
    const result = await authStore.loginAs(roleType)
    if (result.success) {
      // Redirection après connexion réussie
      await router.push('/dashboard')
    }
    return result
  }

  const register = async (userData) => {
    const result = await authStore.register(userData)
    if (result.success) {
      // Redirection après inscription réussie
      await router.push('/dashboard')
    }
    return result
  }

  const logout = async () => {
    await authStore.logout()
    // Redirection vers la page de connexion
    await router.push('/login')
  }

  // Vérification des permissions
  const hasRole = (roleToCheck) => {
    return authStore.hasRole(roleToCheck)
  }

  const hasPermission = (permission) => {
    return userStore.hasPermission(permission)
  }

  // Initialisation de l'authentification
  const initAuth = async () => {
    await authStore.initAuth()
  }

  // Vérification de l'authentification
  const checkAuth = async () => {
    return await authStore.checkAuth()
  }

  // Gestion des erreurs
  const clearError = () => {
    authStore.clearError()
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
      // Rediriger vers une page d'erreur ou dashboard
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

  // Watchers pour la navigation automatique
  const setupAuthWatchers = () => {
    // Watcher pour rediriger automatiquement selon l'état d'auth
    // (peut être utilisé dans App.vue ou dans un plugin)
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
    requireGuest,
    setupAuthWatchers
  }
}
