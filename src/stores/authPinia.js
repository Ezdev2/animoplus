import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth/authService.js'
import { tokenService } from '../services/auth/tokenService.js'
import { useUserStore } from './user.js'

export const useAuthStore = defineStore('auth', () => {
  // État
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)
  const initializationComplete = ref(false)

  // Store utilisateur
  const userStore = useUserStore()

  // Getters
  const role = computed(() => userStore.user?.user_type || null)
  const isClient = computed(() => role.value === 'client')
  const isPro = computed(() => role.value === 'veterinarian')
  const user = computed(() => userStore.user)

  // Actions
  const setAuthenticated = (value) => {
    isAuthenticated.value = value
    if (!value) {
      userStore.clearUser()
    }
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  // Initialisation de l'authentification au démarrage de l'app
  const initAuth = async () => {
    if (initializationComplete.value) return

    loading.value = true
    clearError()

    try {
      const authResult = await authService.checkAuth()
      
      if (authResult.isAuthenticated && authResult.user) {
        setAuthenticated(true)
        userStore.setUser(authResult.user)
      } else {
        setAuthenticated(false)
      }
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', err)
      setAuthenticated(false)
    } finally {
      loading.value = false
      initializationComplete.value = true
    }
  }

  // Connexion
  const login = async (credentials) => {
    loading.value = true
    clearError()

    try {
      const result = await authService.login(credentials)
      
      if (result.success) {
        setAuthenticated(true)
        userStore.setUser(result.data.user)
        return { success: true, user: result.data.user }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de la connexion'
      setError(errorMessage)
      console.error('Erreur login:', err)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Connexion simulée (pour compatibilité avec l'ancien système)
  const loginAs = async (roleType) => {
    loading.value = true
    clearError()

    try {
      // Simulation d'un utilisateur selon le rôle
      const mockUser = {
        id: Date.now(),
        email: roleType === 'client' ? 'client@example.com' : 'pro@example.com',
        firstName: roleType === 'client' ? 'Client' : 'Professionnel',
        lastName: 'Test',
        role: roleType,
        avatar: null
      }

      // Simuler un token
      const mockToken = 'mock-jwt-token-' + Date.now()
      tokenService.setToken(mockToken)
      tokenService.setUserData(mockUser)

      setAuthenticated(true)
      userStore.setUser(mockUser)

      return { success: true, user: mockUser }
    } catch (err) {
      const errorMessage = 'Erreur lors de la connexion simulée'
      setError(errorMessage)
      console.error('Erreur loginAs:', err)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Inscription
  const register = async (userData) => {
    loading.value = true
    clearError()

    try {
      const result = await authService.register(userData)
      
      if (result.success) {
        setAuthenticated(true)
        userStore.setUser(result.data.user)
        return { success: true, user: result.data.user }
      } else {
        setError(result.error)
        return { success: false, error: result.error }
      }
    } catch (err) {
      const errorMessage = 'Erreur lors de l\'inscription'
      setError(errorMessage)
      console.error('Erreur register:', err)
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Déconnexion
  const logout = async () => {
    loading.value = true
    clearError()

    try {
      await authService.logout()
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err)
    } finally {
      setAuthenticated(false)
      loading.value = false
    }
  }

  // Rafraîchir le token
  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken()
      return result.success
    } catch (err) {
      console.error('Erreur refresh token:', err)
      setAuthenticated(false)
      return false
    }
  }

  // Vérifier l'authentification
  const checkAuth = async () => {
    if (!initializationComplete.value) {
      await initAuth()
    }
    return isAuthenticated.value
  }

  // Méthodes utilitaires pour compatibilité
  const hasRole = (roleToCheck) => {
    if (Array.isArray(roleToCheck)) {
      return roleToCheck.includes(role.value)
    }
    return role.value === roleToCheck
  }

  // Nettoyer complètement l'authentification
  const clearAuth = () => {
    tokenService.clearAuth()
    setAuthenticated(false)
    clearError()
  }

  return {
    // État
    isAuthenticated,
    loading,
    error,
    initializationComplete,
    
    // Getters
    role,
    isClient,
    isPro,
    user,
    
    // Actions
    initAuth,
    login,
    loginAs,
    register,
    logout,
    refreshToken,
    checkAuth,
    hasRole,
    clearAuth,
    setError,
    clearError
  }
})
