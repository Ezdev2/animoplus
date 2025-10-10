import { useAuthStore } from '@/stores/authPinia.js'
import { useRouter } from 'vue-router'

// Intercepteur d'authentification amélioré avec gestion gracieuse
export class AuthInterceptor {
  constructor() {
    this.isRefreshing = false
    this.failedQueue = []
    this.maxRetries = 3
    this.retryDelay = 1000
  }

  // Traiter la queue des requêtes en attente
  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve(token)
      }
    })
    this.failedQueue = []
  }

  // Attendre avec délai progressif
  async delay(ms, attempt = 1) {
    const delayTime = ms * Math.pow(2, attempt - 1) // Délai exponentiel
    return new Promise(resolve => setTimeout(resolve, delayTime))
  }

  // Vérifier si l'erreur est récupérable
  isRecoverableError(error) {
    const status = error.response?.status
    const isNetworkError = !error.response && error.code === 'NETWORK_ERROR'
    const isTimeoutError = error.code === 'ECONNABORTED'
    
    return status === 401 || status === 500 || status === 502 || status === 503 || isNetworkError || isTimeoutError
  }

  // Intercepteur de réponse avec gestion intelligente
  createResponseInterceptor(apiClient) {
    return async (error) => {
      const originalRequest = error.config
      const authStore = useAuthStore()

      // Log détaillé de l'erreur
      console.log('🔍 Analyse erreur API:', {
        url: originalRequest?.url,
        method: originalRequest?.method?.toUpperCase(),
        status: error.response?.status,
        message: error.response?.data?.message,
        isRecoverable: this.isRecoverableError(error),
        retryCount: originalRequest._retryCount || 0
      })

      // Gestion spécifique des erreurs 401 (token expiré)
      if (error.response?.status === 401 && !originalRequest._retry) {
        return this.handleTokenRefresh(apiClient, originalRequest, error)
      }

      // Gestion des erreurs récupérables avec retry
      if (this.isRecoverableError(error) && !originalRequest._noRetry) {
        return this.handleRetryableError(apiClient, originalRequest, error)
      }

      // Gestion des erreurs non récupérables
      this.handleNonRecoverableError(error)
      
      return Promise.reject(error)
    }
  }

  // Gestion du refresh token
  async handleTokenRefresh(apiClient, originalRequest, error) {
    if (this.isRefreshing) {
      // Si un refresh est déjà en cours, mettre en queue
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject })
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return apiClient(originalRequest)
      })
    }

    originalRequest._retry = true
    this.isRefreshing = true

    try {
      console.log('🔄 Tentative de refresh token...')
      
      const authStore = useAuthStore()
      const refreshSuccess = await authStore.refreshToken()
      
      if (refreshSuccess) {
        console.log('✅ Token refreshé avec succès')
        
        // Récupérer le nouveau token
        const newToken = this.getUnifiedToken()
        
        // Traiter la queue des requêtes en attente
        this.processQueue(null, newToken)
        
        // Retry la requête originale
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } else {
        throw new Error('Échec du refresh token')
      }
      
    } catch (refreshError) {
      console.error('❌ Échec du refresh token:', refreshError)
      
      // Traiter la queue avec l'erreur
      this.processQueue(refreshError, null)
      
      // Déconnexion gracieuse au lieu de redirection brutale
      await this.handleGracefulLogout(refreshError)
      
      return Promise.reject(refreshError)
    } finally {
      this.isRefreshing = false
    }
  }

  // Gestion des erreurs récupérables avec retry
  async handleRetryableError(apiClient, originalRequest, error) {
    const retryCount = originalRequest._retryCount || 0
    
    if (retryCount >= this.maxRetries) {
      console.error(`❌ Échec après ${this.maxRetries} tentatives:`, error.message)
      return Promise.reject(error)
    }

    originalRequest._retryCount = retryCount + 1
    
    console.log(`🔄 Tentative ${retryCount + 1}/${this.maxRetries} pour ${originalRequest.url}`)
    
    // Attendre avant de retry
    await this.delay(this.retryDelay, retryCount + 1)
    
    return apiClient(originalRequest)
  }

  // Gestion des erreurs non récupérables
  handleNonRecoverableError(error) {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    switch (status) {
      case 403:
        console.error('🚫 Accès refusé - Permissions insuffisantes')
        this.showUserNotification('Accès refusé', 'Vous n\'avez pas les permissions nécessaires', 'warning')
        break
      case 404:
        console.error('🔍 Ressource non trouvée')
        break
      case 422:
        console.error('📝 Données invalides:', message)
        break
      case 429:
        console.error('⏱️ Trop de requêtes')
        this.showUserNotification('Ralentissez', 'Trop de requêtes envoyées', 'warning')
        break
      default:
        console.error('❌ Erreur API:', message)
    }
  }

  // Déconnexion gracieuse avec notification
  async handleGracefulLogout(error) {
    try {
      const authStore = useAuthStore()
      
      // Notification à l'utilisateur
      this.showUserNotification(
        'Session expirée', 
        'Votre session a expiré. Vous allez être redirigé vers la page de connexion.', 
        'info'
      )
      
      // Attendre un peu pour que l'utilisateur voie la notification
      await this.delay(2000)
      
      // Déconnexion propre
      await authStore.clearAuth()
      
      // Redirection douce vers login
      const router = useRouter()
      router.push('/login')
      
    } catch (logoutError) {
      console.error('❌ Erreur lors de la déconnexion gracieuse:', logoutError)
      // Fallback vers redirection directe si nécessaire
      window.location.href = '/login'
    }
  }

  // Afficher une notification à l'utilisateur
  showUserNotification(title, message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${title} - ${message}`)
    
    // Utiliser le système de toast global
    if (window.globalToast) {
      const fullMessage = `${title}: ${message}`
      
      switch (type) {
        case 'error':
          window.globalToast.showConnectionError(fullMessage)
          break
        case 'warning':
          window.globalToast.warning(fullMessage)
          break
        case 'success':
          window.globalToast.showConnectionRestored(fullMessage)
          break
        default:
          window.globalToast.info(fullMessage)
      }
    }
  }

  // Récupérer le token unifié
  getUnifiedToken() {
    try {
      const data = localStorage.getItem('data')
      return data ? JSON.parse(data)?.token : null
    } catch (error) {
      console.error('❌ Erreur lecture token unifié:', error)
      return null
    }
  }
}

// Instance singleton
export const authInterceptor = new AuthInterceptor()
