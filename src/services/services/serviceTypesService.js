import { apiClient } from '../api/config.js'
import { API_ENDPOINTS } from '../api/endpoints.js'

/**
 * Service pour la gestion des types de services vétérinaires
 */
export const serviceTypesService = {
  
  /**
   * Récupérer tous les types de services avec filtres
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Liste des types de services
   */
  async getAllServiceTypes(options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Paramètres de pagination
      if (options.per_page) queryParams.append('per_page', options.per_page)
      if (options.page) queryParams.append('page', options.page)
      
      // Paramètres de recherche et filtrage
      if (options.search) queryParams.append('search', options.search)
      if (options.active_only) queryParams.append('active_only', 'true')
      if (options.with_services) queryParams.append('with_services', 'true')
      if (options.with_stats) queryParams.append('with_stats', 'true')
      
      // Paramètres de tri
      if (options.sort_by) queryParams.append('sort_by', options.sort_by)
      if (options.sort_order) queryParams.append('sort_order', options.sort_order)
      
      const url = `${API_ENDPOINTS.SERVICE_TYPES.LIST}?${queryParams.toString()}`
      console.log('🌐 Récupération types de services:', url)
      
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur récupération types services:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des types de services'
      }
    }
  },

  /**
   * Récupérer un type de service par ID
   * @param {string} id - ID du type de service
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Type de service
   */
  async getServiceTypeById(id, options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (options.with_services) queryParams.append('with_services', 'true')
      if (options.with_stats) queryParams.append('with_stats', 'true')
      
      const url = `${API_ENDPOINTS.SERVICE_TYPES.DETAIL(id)}?${queryParams.toString()}`
      
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur récupération type service:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du type de service'
      }
    }
  },

  /**
   * Créer un nouveau type de service
   * @param {Object} serviceTypeData - Données du type de service
   * @returns {Promise<Object>} Type de service créé
   */
  async createServiceType(serviceTypeData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SERVICE_TYPES.CREATE, serviceTypeData)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur création type service:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du type de service'
      }
    }
  },

  /**
   * Mettre à jour un type de service
   * @param {string} id - ID du type de service
   * @param {Object} serviceTypeData - Données à mettre à jour
   * @returns {Promise<Object>} Type de service mis à jour
   */
  async updateServiceType(id, serviceTypeData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.SERVICE_TYPES.UPDATE(id), serviceTypeData)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur mise à jour type service:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour du type de service'
      }
    }
  },

  /**
   * Supprimer un type de service
   * @param {string} id - ID du type de service
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async deleteServiceType(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.SERVICE_TYPES.DELETE(id))
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur suppression type service:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression du type de service'
      }
    }
  },

  /**
   * Activer/Désactiver un type de service
   * @param {string} id - ID du type de service
   * @param {boolean} isActive - Statut à appliquer
   * @returns {Promise<Object>} Type de service mis à jour
   */
  async toggleServiceTypeStatus(id, isActive) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.SERVICE_TYPES.TOGGLE_STATUS(id), {
        is_active: isActive
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur toggle status type service:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du changement de statut du type de service'
      }
    }
  },

  /**
   * Récupérer les statistiques des types de services
   * @returns {Promise<Object>} Statistiques
   */
  async getServiceTypesStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SERVICE_TYPES.STATS)
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur récupération stats types services:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des statistiques'
      }
    }
  }
}

export default serviceTypesService
