import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion des animaux perdus/trouvés (Coopération)
 */
export const lostAnimalsService = {
  /**
   * Récupérer la liste des annonces avec filtres
   */
  async getLostAnimals(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Filtres disponibles
      if (options.type && options.type !== 'all') params.append('type', options.type)
      if (options.animal_type) params.append('animal_type', options.animal_type)
      if (options.search) params.append('search', options.search)
      if (options.latitude) params.append('latitude', options.latitude)
      if (options.longitude) params.append('longitude', options.longitude)
      if (options.radius) params.append('radius', options.radius)
      if (options.status) params.append('status', options.status)
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.LOST_ANIMALS.LIST}?${queryString}` : API_ENDPOINTS.LOST_ANIMALS.LIST
      
      console.log('🔍 Récupération des annonces:', url)
      const response = await apiClient.get(url)
      
      console.log('📦 Réponse API annonces:', response.data)
      
      // La réponse API a cette structure : { success: true, data: { current_page, data: [...], ... } }
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data?.data || apiResponse.data || [],
        pagination: {
          current_page: apiResponse.data?.current_page || 1,
          last_page: apiResponse.data?.last_page || 1,
          per_page: apiResponse.data?.per_page || 15,
          total: apiResponse.data?.total || 0,
          from: apiResponse.data?.from || 0,
          to: apiResponse.data?.to || 0
        },
        message: apiResponse.message || 'Annonces récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération annonces:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des annonces'
      }
    }
  },

  /**
   * Récupérer le détail d'une annonce
   */
  async getLostAnimalById(id) {
    try {
      console.log('🔍 Récupération annonce:', id)
      const response = await apiClient.get(API_ENDPOINTS.LOST_ANIMALS.DETAIL(id))
      
      console.log('📦 Détail annonce:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Annonce récupérée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération annonce:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération de l\'annonce'
      }
    }
  },

  /**
   * Créer une nouvelle annonce
   */
  async createLostAnimal(animalData) {
    try {
      console.log('📝 Création annonce:', animalData)
      
      // Préparer les données pour FormData si des photos sont présentes
      let requestData
      let config = {}
      
      if (animalData.photos && animalData.photos.length > 0) {
        // Upload avec photos
        requestData = new FormData()
        
        // Ajouter tous les champs
        Object.keys(animalData).forEach(key => {
          if (key === 'photos') {
            // Ajouter les photos
            animalData.photos.forEach((photo, index) => {
              requestData.append(`photos[${index}]`, photo)
            })
          } else if (animalData[key] !== null && animalData[key] !== undefined) {
            requestData.append(key, animalData[key])
          }
        })
        
        // Laisser Axios gérer automatiquement le Content-Type pour FormData (avec boundary)
        config.headers = {}
      } else {
        // Données JSON simples
        requestData = animalData
        config.headers = { 'Content-Type': 'application/json' }
      }
      
      console.log('🚀 Envoi requête POST vers:', API_ENDPOINTS.LOST_ANIMALS.CREATE)
      console.log('📦 Données envoyées:', requestData)
      console.log('📋 Config:', config)
      
      const response = await apiClient.post(API_ENDPOINTS.LOST_ANIMALS.CREATE, requestData, config)
      
      console.log('📊 Status de la réponse:', response.status)
      console.log('✅ Réponse complète:', response)
      console.log('📄 Données de la réponse:', response.data)
      
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Annonce créée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur création annonce:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la création de l\'annonce'
      }
    }
  },

  /**
   * Modifier une annonce existante
   */
  async updateLostAnimal(id, updateData) {
    try {
      console.log('✏️ Modification annonce:', id, updateData)
      const response = await apiClient.put(API_ENDPOINTS.LOST_ANIMALS.UPDATE(id), updateData)
      
      console.log('✅ Annonce modifiée:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Annonce modifiée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur modification annonce:', error)
      throw error
    }
  },

  /**
   * Supprimer une annonce
   */
  async deleteLostAnimal(id) {
    try {
      console.log('🗑️ Suppression annonce:', id)
      const response = await apiClient.delete(API_ENDPOINTS.LOST_ANIMALS.DELETE(id))
      
      console.log('✅ Annonce supprimée:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Annonce supprimée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur suppression annonce:', error)
      throw error
    }
  },

  /**
   * Marquer une annonce comme résolue (animal retrouvé)
   */
  async resolveLostAnimal(id, resolutionData = {}) {
    try {
      console.log('🎉 Résolution annonce:', id, resolutionData)
      const response = await apiClient.post(API_ENDPOINTS.LOST_ANIMALS.RESOLVE(id), resolutionData)
      
      console.log('✅ Annonce résolue:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Annonce marquée comme résolue'
      }
    } catch (error) {
      console.error('❌ Erreur résolution annonce:', error)
      throw error
    }
  },

  /**
   * Recherche géographique avancée
   */
  async searchByLocation(latitude, longitude, radius = 5, options = {}) {
    try {
      const searchOptions = {
        latitude,
        longitude,
        radius,
        ...options
      }
      
      console.log('🌍 Recherche géographique:', searchOptions)
      return await this.getLostAnimals(searchOptions)
    } catch (error) {
      console.error('❌ Erreur recherche géographique:', error)
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche géographique'
      }
    }
  },

  /**
   * Ajouter des photos à une annonce existante
   */
  async addPhotos(animalId, photos) {
    try {
      console.log('📸 Ajout photos:', animalId, photos.length)
      
      const formData = new FormData()
      photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo)
      })
      
      const response = await apiClient.post(
        API_ENDPOINTS.LOST_ANIMALS.ADD_PHOTOS(animalId), 
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )
      
      console.log('✅ Photos ajoutées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Photos ajoutées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur ajout photos:', error)
      throw error
    }
  },

  /**
   * Supprimer une photo
   */
  async deletePhoto(photoId) {
    try {
      console.log('🗑️ Suppression photo:', photoId)
      const response = await apiClient.delete(API_ENDPOINTS.LOST_ANIMALS.DELETE_PHOTO(photoId))
      
      console.log('✅ Photo supprimée:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Photo supprimée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur suppression photo:', error)
      throw error
    }
  },

  // === MODÉRATION (Vétérinaires) ===

  /**
   * Récupérer les annonces en attente de modération
   */
  async getPendingAnimals(options = {}) {
    try {
      console.log('⏳ Récupération annonces en attente')
      
      const params = new URLSearchParams()
      
      // Filtres disponibles
      if (options.type && options.type !== 'all') params.append('type', options.type)
      if (options.animal_type) params.append('animal_type', options.animal_type)
      if (options.search) params.append('search', options.search)
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.LOST_ANIMALS.PENDING}?${queryString}` : API_ENDPOINTS.LOST_ANIMALS.PENDING
      
      console.log('🔍 URL annonces en attente:', url)
      const response = await apiClient.get(url)
      
      console.log('📦 Réponse API annonces en attente:', response.data)
      
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data?.data || apiResponse.data || [],
        pagination: {
          current_page: apiResponse.data?.current_page || 1,
          last_page: apiResponse.data?.last_page || 1,
          per_page: apiResponse.data?.per_page || 15,
          total: apiResponse.data?.total || 0,
          from: apiResponse.data?.from || 0,
          to: apiResponse.data?.to || 0
        },
        filters: apiResponse.filters || { status: 'pending' },
        message: apiResponse.message || 'Annonces en attente récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération annonces en attente:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des annonces en attente'
      }
    }
  },

  /**
   * Récupérer les annonces approuvées
   */
  async getApprovedAnimals(options = {}) {
    try {
      console.log('✅ Récupération annonces approuvées')
      
      const params = new URLSearchParams()
      
      // Filtres disponibles
      if (options.type && options.type !== 'all') params.append('type', options.type)
      if (options.animal_type) params.append('animal_type', options.animal_type)
      if (options.search) params.append('search', options.search)
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.LOST_ANIMALS.APPROVED}?${queryString}` : API_ENDPOINTS.LOST_ANIMALS.APPROVED
      
      console.log('🔍 URL annonces approuvées:', url)
      const response = await apiClient.get(url)
      
      console.log('📦 Réponse API annonces approuvées:', response.data)
      
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data?.data || apiResponse.data || [],
        pagination: {
          current_page: apiResponse.data?.current_page || 1,
          last_page: apiResponse.data?.last_page || 1,
          per_page: apiResponse.data?.per_page || 15,
          total: apiResponse.data?.total || 0,
          from: apiResponse.data?.from || 0,
          to: apiResponse.data?.to || 0
        },
        filters: apiResponse.filters || { status: 'approved' },
        message: apiResponse.message || 'Annonces approuvées récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération annonces approuvées:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des annonces approuvées'
      }
    }
  },

  /**
   * Récupérer les annonces rejetées
   */
  async getRejectedAnimals(options = {}) {
    try {
      console.log('❌ Récupération annonces rejetées')
      
      const params = new URLSearchParams()
      
      // Filtres disponibles
      if (options.type && options.type !== 'all') params.append('type', options.type)
      if (options.animal_type) params.append('animal_type', options.animal_type)
      if (options.search) params.append('search', options.search)
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.LOST_ANIMALS.REJECTED}?${queryString}` : API_ENDPOINTS.LOST_ANIMALS.REJECTED
      
      console.log('🔍 URL annonces rejetées:', url)
      const response = await apiClient.get(url)
      
      console.log('📦 Réponse API annonces rejetées:', response.data)
      
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data?.data || apiResponse.data || [],
        pagination: {
          current_page: apiResponse.data?.current_page || 1,
          last_page: apiResponse.data?.last_page || 1,
          per_page: apiResponse.data?.per_page || 15,
          total: apiResponse.data?.total || 0,
          from: apiResponse.data?.from || 0,
          to: apiResponse.data?.to || 0
        },
        filters: apiResponse.filters || { status: 'rejected' },
        message: apiResponse.message || 'Annonces rejetées récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération annonces rejetées:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des annonces rejetées'
      }
    }
  },

  /**
   * Récupérer les annonces résolues
   */
  async getResolvedAnimals(options = {}) {
    try {
      console.log('🎉 Récupération annonces résolues')
      
      const params = new URLSearchParams()
      
      // Filtres disponibles
      if (options.type && options.type !== 'all') params.append('type', options.type)
      if (options.animal_type) params.append('animal_type', options.animal_type)
      if (options.search) params.append('search', options.search)
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.LOST_ANIMALS.RESOLVED}?${queryString}` : API_ENDPOINTS.LOST_ANIMALS.RESOLVED
      
      console.log('🔍 URL annonces résolues:', url)
      const response = await apiClient.get(url)
      
      console.log('📦 Réponse API annonces résolues:', response.data)
      
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data?.data || apiResponse.data || [],
        pagination: {
          current_page: apiResponse.data?.current_page || 1,
          last_page: apiResponse.data?.last_page || 1,
          per_page: apiResponse.data?.per_page || 15,
          total: apiResponse.data?.total || 0,
          from: apiResponse.data?.from || 0,
          to: apiResponse.data?.to || 0
        },
        filters: apiResponse.filters || { status: 'resolved' },
        message: apiResponse.message || 'Annonces résolues récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération annonces résolues:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des annonces résolues'
      }
    }
  },

  /**
   * Approuver une annonce (vétérinaires uniquement)
   */
  async approveLostAnimal(id, approvalData = {}) {
    try {
      console.log('✅ Approbation annonce:', id, approvalData)
      const response = await apiClient.post(API_ENDPOINTS.LOST_ANIMALS.APPROVE(id), approvalData)
      
      console.log('✅ Annonce approuvée:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Annonce approuvée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur approbation annonce:', error)
      throw error
    }
  },

  /**
   * Rejeter une annonce (vétérinaires uniquement)
   */
  async rejectLostAnimal(id, rejectionData = {}) {
    try {
      console.log('❌ Rejet annonce:', id, rejectionData)
      const response = await apiClient.post(API_ENDPOINTS.LOST_ANIMALS.REJECT(id), rejectionData)
      
      console.log('✅ Annonce rejetée:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Annonce rejetée'
      }
    } catch (error) {
      console.error('❌ Erreur rejet annonce:', error)
      throw error
    }
  },

  /**
   * Résoudre une annonce (marquer comme trouvée/résolue)
   */
  async resolveLostAnimal(id, resolutionData = {}) {
    try {
      console.log('🎉 Résolution annonce:', id, resolutionData)
      const response = await apiClient.post(API_ENDPOINTS.LOST_ANIMALS.RESOLVE(id), resolutionData)
      
      console.log('✅ Annonce résolue:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Annonce résolue avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur résolution annonce:', error)
      throw error
    }
  },

  /**
   * Notifier les utilisateurs dans une zone géographique
   */
  async notifyArea(animalId, notificationData) {
    try {
      console.log('📧 Notification zone:', animalId, notificationData)
      const response = await apiClient.post(API_ENDPOINTS.LOST_ANIMALS.NOTIFY_AREA(animalId), notificationData)
      
      console.log('✅ Notifications envoyées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Notifications envoyées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur notification zone:', error)
      throw error
    }
  },

  /**
   * Récupérer mes annonces (utilisateur connecté)
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getMyAnimals(options = {}) {
    try {
      console.log('👤 Récupération de mes annonces')
      
      const searchOptions = {
        my_animals: true,
        ...options
      }
      
      return await this.getLostAnimals(searchOptions)
    } catch (error) {
      console.error('❌ Erreur récupération mes annonces:', error)
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération de mes annonces'
      }
    }
  },

  /**
   * Récupérer les statistiques des annonces
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAnimalsStats() {
    try {
      console.log('📊 Récupération statistiques annonces')
      const response = await apiClient.get(API_ENDPOINTS.LOST_ANIMALS.STATS)
      
      console.log('📊 Statistiques annonces:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Statistiques récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques'
      }
    }
  },

  /**
   * Récupérer MES annonces (toutes, peu importe le statut)
   * @param {Object} options - Options de filtrage et pagination
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getMyAnimals(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Filtres disponibles selon la collection Postman
      if (options.status) params.append('status', options.status) // pending, approved, rejected
      if (options.type && options.type !== 'all') params.append('type', options.type) // lost, found
      if (options.animal_type) params.append('animal_type', options.animal_type) // chien, chat, etc.
      if (options.search) params.append('search', options.search)
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.LOST_ANIMALS.MY_ANIMALS}?${queryString}` : API_ENDPOINTS.LOST_ANIMALS.MY_ANIMALS
      
      console.log('🔍 Récupération de mes annonces:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Mes annonces récupérées:', response.data)
      
      // Gestion de différents formats de réponse API
      let animalsData = []
      let paginationData = null
      
      if (response.data.data && response.data.data.data) {
        // Format paginé: { success: true, data: { data: [...], current_page: 1, ... } }
        animalsData = response.data.data.data
        paginationData = {
          current_page: response.data.data.current_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total,
          last_page: response.data.data.last_page
        }
        console.log('📦 Format paginé détecté, annonces extraites:', animalsData.length)
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Format simple: { success: true, data: [...] }
        animalsData = response.data.data
        console.log('📦 Format simple détecté, annonces extraites:', animalsData.length)
      } else if (Array.isArray(response.data)) {
        // Format direct: [...]
        animalsData = response.data
        console.log('📦 Format direct détecté, annonces extraites:', animalsData.length)
      }
      
      return {
        success: true,
        data: animalsData,
        pagination: paginationData,
        filters: options,
        message: response.data.message || 'Mes annonces récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération mes annonces:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération de vos annonces'
      }
    }
  }
}

export default lostAnimalsService
