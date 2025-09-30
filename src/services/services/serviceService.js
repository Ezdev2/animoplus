import { apiClient } from '../api/config.js'
import { API_ENDPOINTS } from '../api/endpoints.js'

/**
 * Service pour la gestion des services vétérinaires
 */
export const serviceService = {
  
  /**
   * Récupérer tous les services avec filtres
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Liste des services
   */
  async getAllServices(options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Paramètres de pagination
      if (options.per_page) queryParams.append('per_page', options.per_page)
      if (options.page) queryParams.append('page', options.page)
      
      // Paramètres de recherche et filtrage
      if (options.search) queryParams.append('search', options.search)
      if (options.services_types_id) queryParams.append('services_types_id', options.services_types_id)
      if (options.specialite_id) queryParams.append('specialite_id', options.specialite_id)
      if (options.min_price) queryParams.append('min_price', options.min_price)
      if (options.max_price) queryParams.append('max_price', options.max_price)
      if (options.enabled_only) queryParams.append('enabled_only', 'true')
      
      // Paramètres d'inclusion
      if (options.with_user) queryParams.append('with_user', 'true')
      if (options.with_service_type) queryParams.append('with_service_type', 'true')
      if (options.with_specialite) queryParams.append('with_specialite', 'true')
      
      // Paramètres de tri
      if (options.sort_by) queryParams.append('sort_by', options.sort_by)
      if (options.sort_order) queryParams.append('sort_order', options.sort_order)
      
      const url = `${API_ENDPOINTS.SERVICES.LIST}?${queryParams.toString()}`
      console.log('🌐 API Call URL:', url)
      const response = await apiClient.get(url)
      
      console.log('📡 API Response:', response.data)
      return {
        success: true,
        data: response.data.data || response.data || [],
        pagination: response.data.pagination || null
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des services:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des services',
        data: []
      }
    }
  },

  /**
   * Récupérer mes services (utilisateur connecté)
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Mes services
   */
  async getMyServices(options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Paramètres de pagination
      if (options.per_page) queryParams.append('per_page', options.per_page)
      if (options.page) queryParams.append('page', options.page)
      
      // Paramètres de recherche et filtrage
      if (options.search) queryParams.append('search', options.search)
      if (options.service_type) queryParams.append('service_type', options.service_type)
      if (options.specialite_id) queryParams.append('specialite_id', options.specialite_id)
      if (options.min_price) queryParams.append('min_price', options.min_price)
      if (options.max_price) queryParams.append('max_price', options.max_price)
      if (options.is_enabled !== undefined) queryParams.append('is_enabled', options.is_enabled)
      
      // Paramètres de tri
      if (options.sort_by) queryParams.append('sort_by', options.sort_by)
      if (options.sort_order) queryParams.append('sort_order', options.sort_order)
      
      const url = queryParams.toString() ? 
        `${API_ENDPOINTS.SERVICES.MY_SERVICES}?${queryParams.toString()}` : 
        API_ENDPOINTS.SERVICES.MY_SERVICES
      
      console.log('🔍 Récupération de mes services:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API mes services:', response.data)
      
      // Gérer la structure de réponse API
      let servicesData = []
      let paginationData = {}
      
      if (response.data && response.data.services && Array.isArray(response.data.services)) {
        // Structure: { success: true, services: [...], pagination: {...} }
        servicesData = response.data.services
        paginationData = response.data.pagination || {}
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Structure: { success: true, data: [...] }
        servicesData = response.data.data
      } else if (response.data && Array.isArray(response.data)) {
        // Structure directe: [...]
        servicesData = response.data
      }
      
      console.log('✅ Services extraits:', servicesData.length)
      
      return {
        success: true,
        data: servicesData,
        pagination: {
          current_page: paginationData.current_page || 1,
          last_page: paginationData.last_page || 1,
          per_page: paginationData.per_page || 15,
          total: paginationData.total || servicesData.length,
          from: paginationData.from || 1,
          to: paginationData.to || servicesData.length
        },
        message: response.data.message || 'Services récupérés avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de mes services:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des services'
      }
    }
  },

  /**
   * Récupérer les services d'un utilisateur spécifique
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Services de l'utilisateur
   */
  async getUserServices(userId, options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Ajouter l'ID utilisateur comme filtre
      queryParams.append('user_id', userId)
      
      // Paramètres par défaut pour les services utilisateur
      queryParams.append('with_user', 'true')
      queryParams.append('with_service_type', 'true')
      queryParams.append('with_specialite', 'true')
      queryParams.append('sort_by', 'name')
      queryParams.append('sort_order', 'asc')
      
      // Options supplémentaires
      if (options.enabled_only !== false) queryParams.append('enabled_only', 'true')
      if (options.per_page) queryParams.append('per_page', options.per_page)
      
      const url = `${API_ENDPOINTS.SERVICES.LIST}?${queryParams.toString()}`
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data || [],
        pagination: response.data.pagination || null
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des services utilisateur:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des services',
        data: []
      }
    }
  },

  /**
   * Récupérer un service par son ID
   * @param {string} id - ID du service
   * @param {Object} options - Options d'inclusion
   * @returns {Promise<Object>} Données du service
   */
  async getServiceById(id, options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (options.with_excluded_species) queryParams.append('with_excluded_species', 'true')
      if (options.with_user) queryParams.append('with_user', 'true')
      if (options.with_service_type) queryParams.append('with_service_type', 'true')
      if (options.with_specialite) queryParams.append('with_specialite', 'true')
      
      const url = `${API_ENDPOINTS.SERVICES.DETAIL(id)}?${queryParams.toString()}`
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du service:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération du service',
        data: null
      }
    }
  },

  /**
   * Créer un nouveau service
   * @param {Object} serviceData - Données du service
   * @returns {Promise<Object>} Service créé
   */
  async createService(serviceData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SERVICES.CREATE, serviceData)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Service créé avec succès'
      }
    } catch (error) {
      console.error('Erreur lors de la création du service:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création du service',
        data: null
      }
    }
  },

  /**
   * Mettre à jour un service
   * @param {string} id - ID du service
   * @param {Object} serviceData - Données à mettre à jour
   * @returns {Promise<Object>} Service mis à jour
   */
  async updateService(id, serviceData) {
    try {
      console.log('✏️ Mise à jour partielle du service (PATCH):', id, serviceData)
      
      // Utilisation de PATCH pour mise à jour partielle (plus approprié que PUT)
      const response = await apiClient.patch(API_ENDPOINTS.SERVICES.UPDATE(id), serviceData)
      
      console.log('✅ Réponse API modification PATCH:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Service mis à jour avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur modification service PATCH:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du service'
      }
    }
  },

  /**
   * Supprimer un service
   * @param {string} id - ID du service
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async deleteService(id) {
    try {
      console.log('🗑️ Suppression du service:', id)
      
      const response = await apiClient.delete(API_ENDPOINTS.SERVICES.DELETE(id))
      
      console.log('✅ Réponse API suppression:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Service supprimé avec succès',
        data: response.data.data || { id }
      }
    } catch (error) {
      console.error('❌ Erreur suppression service:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression du service'
      }
    }
  },

  /**
   * Activer/Désactiver un service
   * @param {string} id - ID du service
   * @param {boolean} enabled - Statut à appliquer
   * @returns {Promise<Object>} Service mis à jour
   */
  async toggleServiceStatus(id, enabled) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.SERVICES.TOGGLE_STATUS(id), {
        is_enabled: enabled
      })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Erreur toggle status service:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du changement de statut du service'
      }
    }
  },

  /**
   * Récupérer tous les types de services
   * @returns {Promise<Object>} Liste des types de services
   */
  async getServiceTypes() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.SERVICES.TYPES)
      
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
  }
}

export default serviceService
