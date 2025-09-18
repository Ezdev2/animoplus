// Service de gestion sécurisée des tokens JWT

const TOKEN_KEY = 'animoplus_token'
const REFRESH_TOKEN_KEY = 'animoplus_refresh_token'
const USER_DATA_KEY = 'animoplus_user_data'

export const tokenService = {
  // Récupérer le token d'accès
  getToken() {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error)
      return null
    }
  },

  // Récupérer le refresh token
  getRefreshToken() {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    } catch (error) {
      console.error('Erreur lors de la récupération du refresh token:', error)
      return null
    }
  },

  // Sauvegarder les tokens
  setTokens(token, refreshToken) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
      }
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tokens:', error)
    }
  },

  // Sauvegarder uniquement le token d'accès
  setToken(token) {
    try {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error)
    }
  },

  // Supprimer tous les tokens
  clearTokens() {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      localStorage.removeItem(USER_DATA_KEY)
    } catch (error) {
      console.error('Erreur lors de la suppression des tokens:', error)
    }
  },

  // Vérifier si un token existe
  hasToken() {
    return !!this.getToken()
  },

  // Décoder le payload du JWT (sans vérification de signature)
  decodeToken(token = null) {
    try {
      const tokenToUse = token || this.getToken()
      if (!tokenToUse) return null

      const payload = tokenToUse.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error)
      return null
    }
  },

  // Vérifier si le token est expiré
  isTokenExpired(token = null) {
    try {
      const decoded = this.decodeToken(token)
      if (!decoded || !decoded.exp) return true

      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch (error) {
      console.error('Erreur lors de la vérification d\'expiration:', error)
      return true
    }
  },

  // Récupérer les données utilisateur du localStorage
  getUserData() {
    try {
      const userData = localStorage.getItem(USER_DATA_KEY)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error)
      return null
    }
  },

  // Sauvegarder les données utilisateur
  setUserData(userData) {
    try {
      if (userData) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données utilisateur:', error)
    }
  },

  // Récupérer le rôle de l'utilisateur depuis le token ou les données
  getUserRole() {
    try {
      // D'abord essayer depuis les données utilisateur
      const userData = this.getUserData()
      if (userData?.user_type) {
        return userData.user_type
      }
      if (userData?.role) {
        return userData.role
      }

      // Sinon depuis le token
      const decoded = this.decodeToken()
      return decoded?.user_type || decoded?.role || null
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle:', error)
      return null
    }
  },

  // Vérifier si l'utilisateur a un rôle spécifique
  hasRole(role) {
    const userRole = this.getUserRole()
    if (Array.isArray(role)) {
      return role.includes(userRole)
    }
    return userRole === role
  },

  // Nettoyer complètement l'authentification
  clearAuth() {
    this.clearTokens()
    console.log('Authentification nettoyée')
  }
}
