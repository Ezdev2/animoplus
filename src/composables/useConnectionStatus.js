import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authPinia.js'

/**
 * Composable pour gérer l'état de connexion et les problèmes réseau
 */
export function useConnectionStatus() {
  // États réactifs
  const isOnline = ref(navigator.onLine)
  const isConnecting = ref(false)
  const connectionError = ref(null)
  const lastConnectionCheck = ref(null)
  const failedRequestsCount = ref(0)
  const maxFailedRequests = 3

  // Store d'authentification
  const authStore = useAuthStore()

  // Computed
  const connectionStatus = computed(() => {
    if (!isOnline.value) return 'offline'
    if (isConnecting.value) return 'connecting'
    if (connectionError.value) return 'error'
    if (!authStore.isAuthenticated) return 'unauthenticated'
    return 'connected'
  })

  const shouldShowConnectionWarning = computed(() => {
    return failedRequestsCount.value >= maxFailedRequests || !isOnline.value
  })

  const connectionMessage = computed(() => {
    switch (connectionStatus.value) {
      case 'offline':
        return 'Vous êtes hors ligne. Vérifiez votre connexion internet.'
      case 'connecting':
        return 'Reconnexion en cours...'
      case 'error':
        return connectionError.value || 'Problème de connexion détecté.'
      case 'unauthenticated':
        return 'Session expirée. Reconnexion nécessaire.'
      default:
        return 'Connexion stable'
    }
  })

  // Gestionnaires d'événements réseau
  const handleOnline = () => {
    console.log('🌐 Connexion internet rétablie')
    isOnline.value = true
    connectionError.value = null
    failedRequestsCount.value = 0
    
    // Vérifier l'authentification après reconnexion
    checkAuthenticationStatus()
  }

  const handleOffline = () => {
    console.log('📡 Connexion internet perdue')
    isOnline.value = false
    connectionError.value = 'Connexion internet perdue'
  }

  // Vérifier le statut d'authentification
  const checkAuthenticationStatus = async () => {
    if (!isOnline.value) return

    try {
      isConnecting.value = true
      await authStore.checkAuth()
      lastConnectionCheck.value = new Date()
      connectionError.value = null
    } catch (error) {
      console.error('❌ Erreur vérification auth:', error)
      connectionError.value = 'Erreur de vérification de session'
    } finally {
      isConnecting.value = false
    }
  }

  // Signaler une requête échouée
  const reportFailedRequest = (error) => {
    failedRequestsCount.value++
    
    console.log(`📊 Requête échouée ${failedRequestsCount.value}/${maxFailedRequests}:`, {
      error: error.message,
      status: error.response?.status,
      url: error.config?.url
    })

    // Si trop d'échecs, marquer comme problème de connexion
    if (failedRequestsCount.value >= maxFailedRequests) {
      connectionError.value = 'Problèmes de connexion répétés détectés'
    }
  }

  // Signaler une requête réussie
  const reportSuccessfulRequest = () => {
    if (failedRequestsCount.value > 0) {
      console.log('✅ Connexion rétablie après échecs')
      failedRequestsCount.value = 0
      connectionError.value = null
    }
  }

  // Forcer une reconnexion
  const forceReconnect = async () => {
    console.log('🔄 Reconnexion forcée...')
    isConnecting.value = true
    connectionError.value = null
    failedRequestsCount.value = 0

    try {
      // Vérifier la connexion internet
      await fetch('/api/health', { method: 'HEAD' })
      
      // Vérifier l'authentification
      await checkAuthenticationStatus()
      
      console.log('✅ Reconnexion réussie')
    } catch (error) {
      console.error('❌ Échec de la reconnexion:', error)
      connectionError.value = 'Échec de la reconnexion'
    } finally {
      isConnecting.value = false
    }
  }

  // Réinitialiser les compteurs d'erreur
  const resetErrorCounters = () => {
    failedRequestsCount.value = 0
    connectionError.value = null
  }

  // Vérification périodique de la connexion
  let connectionCheckInterval = null

  const startConnectionMonitoring = () => {
    // Vérifier toutes les 30 secondes si authentifié
    connectionCheckInterval = setInterval(() => {
      if (authStore.isAuthenticated && isOnline.value) {
        checkAuthenticationStatus()
      }
    }, 30000)
  }

  const stopConnectionMonitoring = () => {
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval)
      connectionCheckInterval = null
    }
  }

  // Lifecycle
  onMounted(() => {
    // Écouter les événements réseau
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Démarrer la surveillance
    startConnectionMonitoring()
    
    // Vérification initiale
    checkAuthenticationStatus()
  })

  onUnmounted(() => {
    // Nettoyer les listeners
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    
    // Arrêter la surveillance
    stopConnectionMonitoring()
  })

  return {
    // États
    isOnline,
    isConnecting,
    connectionError,
    lastConnectionCheck,
    failedRequestsCount,
    
    // Computed
    connectionStatus,
    shouldShowConnectionWarning,
    connectionMessage,
    
    // Actions
    checkAuthenticationStatus,
    reportFailedRequest,
    reportSuccessfulRequest,
    forceReconnect,
    resetErrorCounters,
    startConnectionMonitoring,
    stopConnectionMonitoring
  }
}
