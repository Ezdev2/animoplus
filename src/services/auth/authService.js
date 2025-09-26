import { apiClient } from '../api/config.js'
import { API_ENDPOINTS } from '../api/endpoints.js'
import { tokenService } from './tokenService.js'

// Service d'authentification avec toutes les méthodes API
export const authService = {
  // Connexion utilisateur
  async login(credentials) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
      const { access_token, refresh_token, user } = response.data

      // Sauvegarder les tokens et données utilisateur
      tokenService.setTokens(access_token, refresh_token)
      tokenService.setUserData(user)

      return {
        success: true,
        data: { token: access_token, refreshToken: refresh_token, user }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de connexion'
      }
    }
  },

  // Inscription utilisateur
  async register(userData) {
    try {
      console.log('🚀 Tentative d\'inscription avec authService:', {
        endpoint: API_ENDPOINTS.AUTH.REGISTER,
        userData: { ...userData, password: '[MASQUÉ]', password_confirmation: '[MASQUÉ]' }
      })
      
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData)
      
      console.log('✅ Réponse API inscription:', {
        status: response.status,
        data: response.data
      })
      
      // Pour l'inscription avec vérification email, on ne sauvegarde PAS les tokens
      // car l'utilisateur doit d'abord vérifier son email
      console.log('📧 Inscription réussie, vérification email requise')
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      })
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur d\'inscription'
      }
    }
  },

  // Déconnexion
  async logout() {
    try {
      // Appeler l'API de déconnexion si un token existe
      if (tokenService.hasToken()) {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion API:', error)
      // Continuer même si l'API échoue
    } finally {
      // Nettoyer les tokens localement
      tokenService.clearAuth()
    }
  },

  // Rafraîchir le token
  async refreshToken() {
    try {
      const refreshToken = tokenService.getRefreshToken()
      if (!refreshToken) {
        throw new Error('Aucun refresh token disponible')
      }

      const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
        refreshToken
      })

      const { access_token, refresh_token } = response.data
      tokenService.setTokens(access_token, refresh_token)

      return {
        success: true,
        data: { token: access_token, refreshToken: refresh_token }
      }
    } catch (error) {
      console.error('Erreur lors du refresh du token:', error)
      tokenService.clearAuth()
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de rafraîchissement'
      }
    }
  },

  // Récupérer le profil utilisateur actuel
  async getCurrentUser() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.AUTH.ME)
      const user = response.data

      // Mettre à jour les données utilisateur locales
      tokenService.setUserData(user)

      return {
        success: true,
        data: user
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de récupération du profil'
      }
    }
  },

  // Demande de réinitialisation de mot de passe
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de réinitialisation'
      }
    }
  },

  // Changement de mot de passe
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de changement de mot de passe'
      }
    }
  },

  // Vérification d'email
  async verifyEmail(email, token) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
        email,
        token
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la vérification d\'email:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de vérification d\'email'
      }
    }
  },

  // Renvoyer l'email de vérification
  async resendVerification(email) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, {
        email
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors du renvoi de vérification:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur de renvoi de vérification'
      }
    }
  },

  // Vérifier l'état d'authentification
  async checkAuth() {
    try {
      // Vérifier si on a un token
      const token = tokenService.getToken()
      if (!token) {
        return { isAuthenticated: false, user: null }
      }

      // Vérifier si le token est expiré
      if (tokenService.isTokenExpired()) {
        // Essayer de rafraîchir le token
        const refreshResult = await this.refreshToken()
        if (!refreshResult.success) {
          return { isAuthenticated: false, user: null }
        }
      }

      // Récupérer les données utilisateur
      let userData = tokenService.getUserData()
      
      // Si pas de données utilisateur en local, les récupérer de l'API
      if (!userData) {
        const userResult = await this.getCurrentUser()
        if (userResult.success) {
          userData = userResult.data
        } else {
          return { isAuthenticated: false, user: null }
        }
      }

      return {
        isAuthenticated: true,
        user: userData
      }
    } catch (error) {
      console.error('Erreur lors de la vérification d\'authentification:', error)
      tokenService.clearAuth()
      return { isAuthenticated: false, user: null }
    }
  },

  // Méthodes utilitaires
  isAuthenticated() {
    return tokenService.hasToken() && !tokenService.isTokenExpired()
  },

  getCurrentUserRole() {
    return tokenService.getUserRole()
  },

  hasRole(role) {
    return tokenService.hasRole(role)
  }
}
