import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authChecker } from '@/utils/authChecker.js'

// État global de l'authentification
const isAuthenticated = ref(false)
const authChecked = ref(false)
const authError = ref(null)

export const useAuthState = () => {
  const router = useRouter()

  // Vérifier l'état d'authentification avec la règle unique
  const checkAuthState = () => {
    console.log('🔍 Vérification état auth avec règle unique...')
    
    // Synchroniser d'abord tous les tokens et données
    const syncResult = authChecker.syncAll()
    
    // Utiliser la règle unique pour déterminer l'état
    const isAuth = authChecker.isAuthenticated()
    
    isAuthenticated.value = isAuth
    authChecked.value = true
    
    if (isAuth) {
      authError.value = null
      console.log('✅ Utilisateur authentifié')
    } else {
      authError.value = 'Authentification invalide'
      console.log('❌ Utilisateur non authentifié')
    }
    
    return isAuth
  }

  // Forcer une vérification complète avec l'API
  const verifyAuthWithAPI = async () => {
    const token = localStorage.getItem('animoplus_token')
    
    if (!token) {
      console.log('❌ Pas de token pour vérification API')
      isAuthenticated.value = false
      return false
    }

    try {
      // Utiliser fetch directement pour éviter les intercepteurs
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (response.ok) {
        const userData = await response.json()
        localStorage.setItem('animoplus_user_data', JSON.stringify(userData))
        isAuthenticated.value = true
        authError.value = null
        console.log('✅ Authentification vérifiée avec l\'API')
        return true
      } else {
        console.log('❌ Token invalide selon l\'API')
        isAuthenticated.value = false
        authError.value = 'Token invalide'
        return false
      }
    } catch (error) {
      console.log('🔌 Impossible de vérifier avec l\'API:', error.message)
      // En cas d'erreur réseau, on garde l'état local
      return checkAuthState()
    }
  }

  // Déconnexion propre
  const logout = () => {
    localStorage.removeItem('animoplus_token')
    localStorage.removeItem('animoplus_refresh_token')
    localStorage.removeItem('animoplus_user_data')
    isAuthenticated.value = false
    authError.value = null
    console.log('🚪 Déconnexion effectuée')
  }

  // Redirection intelligente
  const handleAuthRedirect = () => {
    const currentPath = window.location.pathname
    
    if (!isAuthenticated.value) {
      if (currentPath !== '/login' && currentPath !== '/register') {
        console.log('🚪 Redirection vers login depuis:', currentPath)
        router.push('/login')
      }
    } else {
      if (currentPath === '/login') {
        console.log('🏠 Redirection vers dashboard depuis login')
        router.push('/dashboard')
      }
    }
  }

  // Computed pour l'état d'authentification
  const authState = computed(() => ({
    isAuthenticated: isAuthenticated.value,
    isChecked: authChecked.value,
    error: authError.value,
    hasToken: !!localStorage.getItem('animoplus_token'),
    hasUserData: !!localStorage.getItem('animoplus_user_data')
  }))

  return {
    // État
    authState,
    isAuthenticated,
    authChecked,
    authError,
    
    // Méthodes
    checkAuthState,
    verifyAuthWithAPI,
    logout,
    handleAuthRedirect
  }
}
