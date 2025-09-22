import axios from 'axios'

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

const getUnifiedRefreshToken = () => {
  const data = getUnifiedData()
  return data?.refreshToken || null
}

const setUnifiedTokens = (token, refreshToken) => {
  try {
    const data = getUnifiedData() || {}
    data.token = token
    data.refreshToken = refreshToken
    data.loginTime = Date.now()
    localStorage.setItem('data', JSON.stringify(data))
    console.log('✅ Tokens mis à jour dans le système unifié')
  } catch (error) {
    console.error('❌ Erreur sauvegarde tokens unifiés:', error)
  }
}

const clearUnifiedAuth = () => {
  try {
    localStorage.removeItem('data')
    console.log('🧹 Données d\'authentification unifiées supprimées')
  } catch (error) {
    console.error('❌ Erreur suppression données unifiées:', error)
  }
}

// Configuration de base de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://laravel-backend-4yxv.onrender.com/api'

// Création de l'instance Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 secondes au lieu de 10
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Intercepteur de requête - Ajouter le token automatiquement
apiClient.interceptors.request.use(
  (config) => {
    const token = getUnifiedToken()
    
    // Debug: Log des informations de la requête
    console.log('🚀 Requête API:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'Aucun token',
      source: 'système unifié'
    })
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ Token unifié ajouté à la requête')
    } else {
      console.warn('⚠️ Aucun token unifié disponible pour la requête')
    }
    
    return config
  },
  (error) => {
    console.error('❌ Erreur dans l\'intercepteur de requête:', error)
    return Promise.reject(error)
  }
)

// Variable pour éviter les refresh multiples simultanés
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Intercepteur de réponse - Gestion automatique des erreurs
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse API réussie:', response.config.url)
    return response
  },
  async (error) => {
    const originalRequest = error.config

    console.log('❌ Erreur API:', {
      url: originalRequest.url,
      method: originalRequest.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message,
      fullResponse: error.response?.data,
      hasToken: !!originalRequest.headers.Authorization
    })

    // Si erreur 401 (token expiré/invalide)
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre en queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        console.log('🔄 Token expiré, tentative de refresh avec système unifié...')
        
        const refreshToken = getUnifiedRefreshToken()
        if (!refreshToken) {
          throw new Error('Aucun refresh token unifié disponible')
        }

        // Appel API refresh avec le bon format
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken // Format attendu par l'API
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })
        
        const { access_token, refresh_token } = response.data
        
        // Sauvegarder les nouveaux tokens dans le système unifié
        setUnifiedTokens(access_token, refresh_token)
        
        console.log('✅ Token refreshé avec succès dans le système unifié')
        
        // Traiter la queue des requêtes en attente
        processQueue(null, access_token)
        
        // Retry la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return apiClient(originalRequest)
        
      } catch (refreshError) {
        console.error('❌ Échec du refresh token:', refreshError)
        
        // Traiter la queue avec l'erreur
        processQueue(refreshError, null)
        
        // Nettoyer les tokens du système unifié et rediriger vers login
        clearUnifiedAuth()
        
        // Redirection vers login si pas déjà sur la page de login
        if (window.location.pathname !== '/login') {
          console.log('🚪 Redirection vers login après échec refresh...')
          window.location.href = '/login'
        }
        
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Gestion d'autres erreurs
    if (error.response?.status === 403) {
      console.error('🚫 Accès refusé - Permissions insuffisantes')
    }

    return Promise.reject(error)
  }
)

export default apiClient
