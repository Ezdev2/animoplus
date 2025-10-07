import axios from 'axios'
import { authInterceptor } from './authInterceptor.js'

// Fonctions utilitaires pour accéder au système unifié
const getUnifiedData = () => {
  try {
    const data = localStorage.getItem('data')
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('❌ Erreur lecture données unifiées:', error)
    return null
  }
}

const getUnifiedToken = () => {
  const data = getUnifiedData()
  return data?.token || null
}

// Configuration de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://laravel-backend-4yxv.onrender.com/api'

// Création de l'instance Axios avec configuration améliorée
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 secondes (plus raisonnable)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Retry automatique pour les erreurs réseau
  retry: 3,
  retryDelay: 1000
})

// Intercepteur de requête - Ajouter le token automatiquement
apiClient.interceptors.request.use(
  (config) => {
    const token = getUnifiedToken()
    
    // Log moins verbeux en production
    if (import.meta.env.DEV) {
      console.log('🚀 Requête API:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        hasToken: !!token
      })
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    console.error('❌ Erreur dans l\'intercepteur de requête:', error)
    return Promise.reject(error)
  }
)

// Intercepteur de réponse amélioré avec gestion gracieuse
apiClient.interceptors.response.use(
  (response) => {
    // Signaler le succès au système de monitoring
    if (window.connectionStatus) {
      window.connectionStatus.reportSuccessfulRequest()
    }
    
    if (import.meta.env.DEV) {
      console.log('✅ Réponse API réussie:', response.config.url)
    }
    
    return response
  },
  async (error) => {
    // Signaler l'échec au système de monitoring
    if (window.connectionStatus) {
      window.connectionStatus.reportFailedRequest(error)
    }

    // Utiliser l'intercepteur d'authentification amélioré
    return authInterceptor.createResponseInterceptor(apiClient)(error)
  }
)

// Fonction utilitaire pour créer des requêtes avec retry automatique
export const createResilientRequest = (config) => {
  return apiClient({
    ...config,
    // Marquer comme requête résiliente
    _resilient: true
  })
}

// Fonction utilitaire pour les requêtes critiques (sans retry automatique)
export const createCriticalRequest = (config) => {
  return apiClient({
    ...config,
    // Marquer comme requête critique (pas de retry automatique)
    _noRetry: true
  })
}

// Fonction pour vérifier la santé de l'API
export const checkApiHealth = async () => {
  try {
    const response = await apiClient.get('/health', {
      timeout: 5000,
      _noRetry: true
    })
    return { healthy: true, latency: Date.now() - response.config.metadata?.startTime }
  } catch (error) {
    return { healthy: false, error: error.message }
  }
}

// Middleware pour ajouter des métadonnées de timing
apiClient.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() }
  return config
})

apiClient.interceptors.response.use(
  (response) => {
    const endTime = Date.now()
    const startTime = response.config.metadata?.startTime
    if (startTime) {
      response.duration = endTime - startTime
      
      // Log des requêtes lentes en développement
      if (import.meta.env.DEV && response.duration > 2000) {
        console.warn(`⏱️ Requête lente (${response.duration}ms):`, response.config.url)
      }
    }
    return response
  },
  (error) => {
    const endTime = Date.now()
    const startTime = error.config?.metadata?.startTime
    if (startTime) {
      error.duration = endTime - startTime
    }
    return Promise.reject(error)
  }
)

export default apiClient
