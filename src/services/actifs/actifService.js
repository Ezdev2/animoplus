import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion des actifs (produits d'inventaire)
 * Basé sur la collection Postman Actifs_Collection
 */
export const actifService = {
  /**
   * Récupérer tous les actifs avec pagination et filtres
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAllActifs(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres
      if (options.search) params.append('search', options.search)
      if (options.type) params.append('type', options.type)
      if (options.active_only !== undefined) params.append('active_only', options.active_only)
      if (options.with_stocks !== undefined) params.append('with_stocks', options.with_stocks)
      if (options.with_deleted !== undefined) params.append('with_deleted', options.with_deleted)
      if (options.min_price) params.append('min_price', options.min_price)
      if (options.max_price) params.append('max_price', options.max_price)
      if (options.min_seuil) params.append('min_seuil', options.min_seuil)
      if (options.max_seuil) params.append('max_seuil', options.max_seuil)
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.ACTIFS.LIST}?${queryString}` : API_ENDPOINTS.ACTIFS.LIST
      
      console.log('🔍 Récupération des actifs:', url)
      const response = await apiClient.get(url)
      
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data || [],
        pagination: apiResponse.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: 15,
          total: 0
        },
        summary: apiResponse.summary || {
          total_actifs: 0,
          active_actifs: 0,
          inactive_actifs: 0
        },
        message: apiResponse.message || 'Actifs récupérés avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération actifs:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des actifs'
      }
    }
  },

  /**
   * Récupérer un actif par son ID
   * @param {string} id - ID de l'actif
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getActifById(id) {
    try {
      console.log('🔍 Récupération de l\'actif:', id)
      const response = await apiClient.get(API_ENDPOINTS.ACTIFS.DETAIL(id))
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Actif récupéré avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération actif:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération de l\'actif'
      }
    }
  },

  /**
   * Créer un nouvel actif
   * @param {Object} actifData - Données de l'actif
   * @returns {Promise<Object>} Réponse de l'API
   */
  async createActif(actifData) {
    try {
      console.log('📝 Création d\'un actif:', actifData)
      const response = await apiClient.post(API_ENDPOINTS.ACTIFS.CREATE, actifData)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Actif créé avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur création actif:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la création de l\'actif'
      }
    }
  },

  /**
   * Mettre à jour un actif
   * @param {string} id - ID de l'actif
   * @param {Object} actifData - Données à mettre à jour
   * @returns {Promise<Object>} Réponse de l'API
   */
  async updateActif(id, actifData) {
    try {
      console.log('📝 Mise à jour de l\'actif:', id, actifData)
      const response = await apiClient.put(API_ENDPOINTS.ACTIFS.UPDATE(id), actifData)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Actif mis à jour avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour actif:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la mise à jour de l\'actif'
      }
    }
  },

  /**
   * Supprimer un actif (soft delete)
   * @param {string} id - ID de l'actif
   * @returns {Promise<Object>} Réponse de l'API
   */
  async deleteActif(id) {
    try {
      console.log('🗑️ Suppression de l\'actif:', id)
      const response = await apiClient.delete(API_ENDPOINTS.ACTIFS.DELETE(id))
      
      return {
        success: true,
        message: response.data.message || 'Actif supprimé avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur suppression actif:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression de l\'actif'
      }
    }
  },


  /**
   * Rechercher des actifs
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} options - Options de recherche
   * @returns {Promise<Object>} Réponse de l'API
   */
  async searchActifs(searchTerm, options = {}) {
    try {
      const params = new URLSearchParams()
      params.append('q', searchTerm)
      
      if (options.type) params.append('type', options.type)
      if (options.active_only !== undefined) params.append('active_only', options.active_only)
      if (options.limit) params.append('limit', options.limit)
      
      const queryString = params.toString()
      const url = `${API_ENDPOINTS.ACTIFS.SEARCH}?${queryString}`
      
      console.log('🔍 Recherche d\'actifs:', searchTerm, options)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data || [],
        message: response.data.message || 'Recherche effectuée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur recherche actifs:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la recherche'
      }
    }
  },

}

export default actifService
