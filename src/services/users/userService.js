import { apiClient } from '../api/config.js'
import { API_ENDPOINTS } from '../api/endpoints.js'

// Service de gestion des utilisateurs
export const userService = {
  // Récupérer la liste des utilisateurs avec pagination et filtres
  async getUsers(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des utilisateurs'
      }
    }
  },

  // Récupérer un utilisateur par ID
  async getUser(id) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.SHOW(id))
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Utilisateur non trouvé'
      }
    }
  },

  // Créer un nouvel utilisateur
  async createUser(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, userData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création de l\'utilisateur'
      }
    }
  },

  // Mettre à jour un utilisateur
  async updateUser(id, userData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), userData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour'
      }
    }
  },

  // Supprimer un utilisateur
  async deleteUser(id) {
    try {
      await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id))
      return {
        success: true,
        message: 'Utilisateur supprimé avec succès'
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression'
      }
    }
  },

  // Rechercher des utilisateurs
  async searchUsers(query, filters = {}) {
    try {
      const params = { q: query, ...filters }
      const response = await apiClient.get(API_ENDPOINTS.USERS.SEARCH, { params })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche'
      }
    }
  },

  // Récupérer le profil de l'utilisateur connecté
  async getProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du profil'
      }
    }
  },

  // Mettre à jour le profil de l'utilisateur connecté (selon format Postman)
  async updateProfile(profileData) {
    try {
      // Format attendu par l'API selon Postman
      const apiData = {
        name: profileData.name,
        phone: profileData.phone,
        clinic_name: profileData.clinic_name || '',
        clinic_address: profileData.clinic_address || '',
        address: profileData.address
      }
      
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, apiData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du profil'
      }
    }
  },

  // Changer le mot de passe (selon format Postman)
  async changePassword(passwordData) {
    try {
      // Format attendu par l'API selon Postman
      const apiData = {
        current_password: passwordData.currentPassword,
        password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword
      }
      
      const response = await apiClient.put(API_ENDPOINTS.USERS.CHANGE_PASSWORD, apiData)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du changement de mot de passe'
      }
    }
  },

  // Désactiver le compte utilisateur
  async deactivateAccount(password) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USERS.DEACTIVATE, { password })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la désactivation du compte:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la désactivation du compte'
      }
    }
  },

  // Récupérer les sessions actives
  async getSessions() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.SESSIONS)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des sessions:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des sessions'
      }
    }
  },

  // Révoquer une session spécifique
  async revokeSession(tokenId) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.USERS.REVOKE_SESSION, {
        data: { token_id: tokenId }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la révocation de la session:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la révocation de la session'
      }
    }
  },

  // Révoquer toutes les sessions
  async revokeAllSessions() {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.USERS.REVOKE_ALL_SESSIONS)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la révocation de toutes les sessions:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la révocation de toutes les sessions'
      }
    }
  },

  // Upload d'avatar (fichier direct)
  async uploadAvatar(file) {
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await apiClient.post(API_ENDPOINTS.USERS.UPLOAD_AVATAR, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'avatar:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'upload de l\'avatar'
      }
    }
  },

  // Mettre à jour l'avatar avec une URL (ex: Cloudinary)
  async updateAvatarUrl(avatarUrl) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_AVATAR, {
        avatar: avatarUrl
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'avatar:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'avatar'
      }
    }
  }
}
