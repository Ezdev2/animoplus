import axios from 'axios'
import { tokenService } from '../auth/tokenService.js'

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
    const token = tokenService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponse - Gestion automatique des erreurs
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Si erreur 401 et pas déjà en train de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Tentative de refresh du token
        const refreshToken = tokenService.getRefreshToken()
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          })
          
          const { access_token, refresh_token } = response.data
          tokenService.setTokens(access_token, refresh_token)
          
          // Retry la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${access_token}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        tokenService.clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Gestion d'autres erreurs
    if (error.response?.status === 403) {
      console.error('Accès refusé - Permissions insuffisantes')
    }

    return Promise.reject(error)
  }
)

export default apiClient
