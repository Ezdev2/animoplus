import { apiClient } from '@/services/api/config.js'
import { REVENUE_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion des revenus
 * Basé sur la collection Postman Revenues_Collection
 */
export const revenueService = {
  /**
   * Récupérer tous les revenus avec pagination et filtres
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAllRevenues(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres de base
      if (options.search) params.append('search', options.search)
      if (options.category) params.append('category', options.category) // consultation, service, product_sale, subscription, training, surgery, vaccination, diagnostic, other
      if (options.status) params.append('status', options.status) // draft, confirmed, cancelled
      if (options.payment_status) params.append('payment_status', options.payment_status) // pending, paid, partial, overdue, cancelled
      
      // Filtres de dates
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      if (options.created_after) params.append('created_after', options.created_after)
      if (options.created_before) params.append('created_before', options.created_before)
      
      // Filtres de montants
      if (options.min_amount) params.append('min_amount', options.min_amount)
      if (options.max_amount) params.append('max_amount', options.max_amount)
      if (options.currency) params.append('currency', options.currency)
      
      // Filtres utilisateur
      if (options.user_id) params.append('user_id', options.user_id)
      if (options.client_id) params.append('client_id', options.client_id)
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by) // amount, date, created_at, updated_at
      if (options.sort_order) params.append('sort_order', options.sort_order) // asc, desc
      
      // Inclusions
      if (options.with_user) params.append('with_user', 'true')
      if (options.with_client) params.append('with_client', 'true')
      if (options.with_taxes) params.append('with_taxes', 'true')
      
      const queryString = params.toString()
      const url = queryString ? `${REVENUE_ENDPOINTS.LIST}?${queryString}` : REVENUE_ENDPOINTS.LIST
      
      console.log('💰 Récupération des revenus:', url)
      const response = await apiClient.get(url)
      
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
        filters: options,
        message: apiResponse.message || 'Revenus récupérés avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération revenus:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des revenus'
      }
    }
  },

  /**
   * Récupérer un revenu par ID
   * @param {string} revenueId - ID du revenu
   * @param {Object} options - Options d'inclusion
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getRevenueById(revenueId, options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Inclusions
      if (options.with_user) params.append('with_user', 'true')
      if (options.with_client) params.append('with_client', 'true')
      if (options.with_taxes) params.append('with_taxes', 'true')
      if (options.with_payments) params.append('with_payments', 'true')
      
      const queryString = params.toString()
      const url = queryString ? `${REVENUE_ENDPOINTS.DETAIL(revenueId)}?${queryString}` : REVENUE_ENDPOINTS.DETAIL(revenueId)
      
      console.log('💰 Récupération revenu par ID:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Revenu récupéré:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Revenu récupéré avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération revenu:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération du revenu'
      }
    }
  },

  /**
   * Créer un nouveau revenu
   * @param {Object} revenueData - Données du revenu
   * @returns {Promise<Object>} Réponse de l'API
   */
  async createRevenue(revenueData) {
    try {
      console.log('💰 Création revenu:', revenueData)
      const response = await apiClient.post(REVENUE_ENDPOINTS.CREATE, revenueData)
      
      console.log('✅ Revenu créé:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Revenu créé avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur création revenu:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la création du revenu',
        errors: error.response?.data?.errors || null
      }
    }
  },

  /**
   * Mettre à jour un revenu
   * @param {string} revenueId - ID du revenu
   * @param {Object} revenueData - Données à mettre à jour
   * @returns {Promise<Object>} Réponse de l'API
   */
  async updateRevenue(revenueId, revenueData) {
    try {
      console.log('💰 Mise à jour revenu (PATCH):', revenueId, revenueData)
      const response = await apiClient.patch(REVENUE_ENDPOINTS.UPDATE(revenueId), revenueData)
      
      console.log('✅ Revenu mis à jour:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Revenu mis à jour avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour revenu:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du revenu',
        errors: error.response?.data?.errors || null
      }
    }
  },

  /**
   * Supprimer un revenu
   * @param {string} revenueId - ID du revenu
   * @returns {Promise<Object>} Réponse de l'API
   */
  async deleteRevenue(revenueId) {
    try {
      console.log('💰 Suppression revenu:', revenueId)
      const response = await apiClient.delete(REVENUE_ENDPOINTS.DELETE(revenueId))
      
      console.log('✅ Revenu supprimé:', response.data)
      
      return {
        success: true,
        data: response.data.data || null,
        message: response.data.message || 'Revenu supprimé avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur suppression revenu:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression du revenu'
      }
    }
  },

  /**
   * Rechercher des revenus
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} options - Options de recherche
   * @returns {Promise<Object>} Réponse de l'API
   */
  async searchRevenues(searchTerm, options = {}) {
    try {
      const params = new URLSearchParams()
      
      params.append('q', searchTerm)
      
      // Filtres de recherche
      if (options.category) params.append('category', options.category)
      if (options.status) params.append('status', options.status)
      if (options.payment_status) params.append('payment_status', options.payment_status)
      if (options.min_amount) params.append('min_amount', options.min_amount)
      if (options.max_amount) params.append('max_amount', options.max_amount)
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const queryString = params.toString()
      const url = `${REVENUE_ENDPOINTS.SEARCH}?${queryString}`
      
      console.log('🔍 Recherche revenus:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Recherche revenus terminée:', response.data)
      
      return {
        success: true,
        data: response.data.data?.data || response.data.data || [],
        pagination: response.data.data?.pagination || null,
        message: response.data.message || 'Recherche terminée'
      }
    } catch (error) {
      console.error('❌ Erreur recherche revenus:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la recherche'
      }
    }
  },

  /**
   * Récupérer les statistiques des revenus
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getRevenueStats(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Période d'analyse
      if (options.period) params.append('period', options.period) // week, month, quarter, year, custom
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      
      // Filtres
      if (options.category) params.append('category', options.category)
      if (options.user_id) params.append('user_id', options.user_id)
      if (options.client_id) params.append('client_id', options.client_id)
      
      // Groupement
      if (options.group_by) params.append('group_by', options.group_by) // category, user, client, date
      
      const queryString = params.toString()
      const url = queryString ? `${REVENUE_ENDPOINTS.STATS}?${queryString}` : REVENUE_ENDPOINTS.STATS
      
      console.log('📊 Récupération statistiques revenus:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Statistiques revenus récupérées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Statistiques récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques revenus:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques'
      }
    }
  },

  /**
   * Récupérer les catégories de revenus
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getRevenueCategories() {
    try {
      console.log('📋 Récupération catégories revenus')
      const response = await apiClient.get(REVENUE_ENDPOINTS.CATEGORIES)
      
      console.log('✅ Catégories revenus récupérées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Catégories récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération catégories revenus:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des catégories'
      }
    }
  },

  /**
   * Valider un revenu
   * @param {string} revenueId - ID du revenu
   * @returns {Promise<Object>} Réponse de l'API
   */
  async validateRevenue(revenueId) {
    try {
      console.log('✅ Validation revenu:', revenueId)
      const response = await apiClient.post(REVENUE_ENDPOINTS.VALIDATE(revenueId))
      
      console.log('✅ Revenu validé:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Revenu validé avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur validation revenu:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la validation du revenu'
      }
    }
  },

  /**
   * Approuver un revenu
   * @param {string} revenueId - ID du revenu
   * @returns {Promise<Object>} Réponse de l'API
   */
  async approveRevenue(revenueId) {
    try {
      console.log('✅ Approbation revenu:', revenueId)
      const response = await apiClient.post(REVENUE_ENDPOINTS.APPROVE(revenueId))
      
      console.log('✅ Revenu approuvé:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Revenu approuvé avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur approbation revenu:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'approbation du revenu'
      }
    }
  },

  /**
   * Rejeter un revenu
   * @param {string} revenueId - ID du revenu
   * @param {Object} data - Données de rejet (raison, commentaires)
   * @returns {Promise<Object>} Réponse de l'API
   */
  async rejectRevenue(revenueId, data = {}) {
    try {
      console.log('❌ Rejet revenu:', revenueId, data)
      const response = await apiClient.post(REVENUE_ENDPOINTS.REJECT(revenueId), data)
      
      console.log('✅ Revenu rejeté:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Revenu rejeté avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur rejet revenu:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du rejet du revenu'
      }
    }
  },

  /**
   * Exporter les revenus
   * @param {Object} options - Options d'export
   * @returns {Promise<Object>} Réponse de l'API
   */
  async exportRevenues(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Format d'export
      if (options.format) params.append('format', options.format) // csv, excel, pdf
      
      // Filtres d'export
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      if (options.category) params.append('category', options.category)
      if (options.status) params.append('status', options.status)
      
      // Colonnes à inclure
      if (options.columns) params.append('columns', options.columns)
      
      const queryString = params.toString()
      const url = queryString ? `${REVENUE_ENDPOINTS.EXPORT}?${queryString}` : REVENUE_ENDPOINTS.EXPORT
      
      console.log('📤 Export revenus:', url)
      const response = await apiClient.get(url, {
        responseType: options.format === 'pdf' ? 'blob' : 'json'
      })
      
      console.log('✅ Export revenus terminé:', response.data)
      
      return {
        success: true,
        data: response.data,
        message: 'Export terminé avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur export revenus:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'export'
      }
    }
  }
}

export default revenueService
