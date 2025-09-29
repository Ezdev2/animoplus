import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion des stocks
 * Basé sur la collection Postman Stocks_Collection
 */
export const stockService = {
  /**
   * Récupérer tous les stocks avec pagination et filtres
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAllStocks(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres
      if (options.search) params.append('search', options.search)
      if (options.actif_id) params.append('actif_id', options.actif_id)
      if (options.user_id) params.append('user_id', options.user_id)
      if (options.active_only !== undefined) params.append('active_only', options.active_only)
      if (options.low_stock !== undefined) params.append('low_stock', options.low_stock)
      if (options.expiring_soon !== undefined) params.append('expiring_soon', options.expiring_soon)
      if (options.expired !== undefined) params.append('expired', options.expired)
      if (options.min_quantity) params.append('min_quantity', options.min_quantity)
      if (options.max_quantity) params.append('max_quantity', options.max_quantity)
      if (options.min_price) params.append('min_price', options.min_price)
      if (options.max_price) params.append('max_price', options.max_price)
      if (options.lot_numero) params.append('lot_numero', options.lot_numero)
      if (options.date_expiration_before) params.append('date_expiration_before', options.date_expiration_before)
      if (options.date_expiration_after) params.append('date_expiration_after', options.date_expiration_after)
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      // Inclusions
      if (options.with_actif) params.append('with_actif', 'true')
      if (options.with_user) params.append('with_user', 'true')
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.STOCKS.LIST}?${queryString}` : API_ENDPOINTS.STOCKS.LIST
      
      console.log('🔍 Récupération des stocks:', url)
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
        message: apiResponse.message || 'Stocks récupérés'
      }
    } catch (error) {
      console.error('❌ Erreur récupération stocks:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des stocks'
      }
    }
  },

  /**
   * Récupérer les stocks de l'utilisateur connecté avec pagination et filtres
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getMyStocks(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres
      if (options.search) params.append('search', options.search)
      if (options.actif_id) params.append('actif_id', options.actif_id)
      if (options.active_only !== undefined) params.append('active_only', options.active_only)
      if (options.low_stock !== undefined) params.append('low_stock', options.low_stock)
      if (options.expiring_soon !== undefined) params.append('expiring_soon', options.expiring_soon)
      if (options.expired !== undefined) params.append('expired', options.expired)
      if (options.min_quantity) params.append('min_quantity', options.min_quantity)
      if (options.max_quantity) params.append('max_quantity', options.max_quantity)
      if (options.min_price) params.append('min_price', options.min_price)
      if (options.max_price) params.append('max_price', options.max_price)
      if (options.lot_numero) params.append('lot_numero', options.lot_numero)
      if (options.date_expiration_before) params.append('date_expiration_before', options.date_expiration_before)
      if (options.date_expiration_after) params.append('date_expiration_after', options.date_expiration_after)
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      // Inclusions
      if (options.with_actif) params.append('with_actif', 'true')
      if (options.with_user) params.append('with_user', 'true')
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.STOCKS.MY_STOCKS}?${queryString}` : API_ENDPOINTS.STOCKS.MY_STOCKS
      
      console.log('🔍 Récupération de mes stocks:', url)
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
        message: apiResponse.message || 'Vos stocks récupérés avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération de mes stocks:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération de vos stocks'
      }
    }
  },

  /**
   * Récupérer un stock par son ID
   * @param {string} id - ID du stock
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getStockById(id) {
    try {
      console.log('🔍 Récupération du stock:', id)
      const response = await apiClient.get(API_ENDPOINTS.STOCKS.DETAIL(id))
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Stock récupéré'
      }
    } catch (error) {
      console.error('❌ Erreur récupération stock:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération du stock'
      }
    }
  },

  /**
   * Créer un nouveau stock
   * @param {Object} stockData - Données du stock
   * @returns {Promise<Object>} Réponse de l'API
   */
  async createStock(stockData) {
    try {
      // Validation des champs requis
      const requiredFields = ['actif_id', 'quantite', 'prix_unitaire']
      for (const field of requiredFields) {
        if (!stockData[field]) {
          throw new Error(`Le champ ${field} est requis`)
        }
      }

      // Préparer les données pour l'API
      const data = {
        actif_id: stockData.actif_id,
        quantite: Number(stockData.quantite),
        prix_unitaire: Number(stockData.prix_unitaire),
        lot_numero: stockData.lot_numero || null,
        date_expiration: stockData.date_expiration || null,
        date_fabrication: stockData.date_fabrication || null,
        fournisseur: stockData.fournisseur || null,
        notes: stockData.notes || null,
        seuil_alerte: stockData.seuil_alerte ? Number(stockData.seuil_alerte) : null,
        is_active: stockData.is_active !== undefined ? stockData.is_active : true
      }

      console.log('📝 Création du stock:', data)
      const response = await apiClient.post(API_ENDPOINTS.STOCKS.CREATE, data)
      
      console.log('✅ Réponse API création:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Stock créé avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur création stock:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la création du stock'
      }
    }
  },

  /**
   * Mettre à jour un stock
   * @param {string} id - ID du stock
   * @param {Object} stockData - Nouvelles données du stock
   * @returns {Promise<Object>} Réponse de l'API
   */
  async updateStock(id, stockData) {
    try {
      // Préparer les données pour l'API (seulement les champs modifiables)
      const data = {}
      
      if (stockData.actif_id !== undefined) data.actif_id = stockData.actif_id
      if (stockData.quantite !== undefined) data.quantite = Number(stockData.quantite)
      if (stockData.prix_unitaire !== undefined) data.prix_unitaire = Number(stockData.prix_unitaire)
      if (stockData.lot_numero !== undefined) data.lot_numero = stockData.lot_numero
      if (stockData.date_expiration !== undefined) data.date_expiration = stockData.date_expiration
      if (stockData.date_fabrication !== undefined) data.date_fabrication = stockData.date_fabrication
      if (stockData.fournisseur !== undefined) data.fournisseur = stockData.fournisseur
      if (stockData.notes !== undefined) data.notes = stockData.notes
      if (stockData.seuil_alerte !== undefined) data.seuil_alerte = stockData.seuil_alerte ? Number(stockData.seuil_alerte) : null
      if (stockData.is_active !== undefined) data.is_active = stockData.is_active

      console.log('✏️ Mise à jour du stock:', id, data)
      const response = await apiClient.put(API_ENDPOINTS.STOCKS.UPDATE(id), data)
      
      return {
        success: true,
        message: response.data.message || 'Stock mis à jour avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour stock:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du stock'
      }
    }
  },

  /**
   * Supprimer un stock
   * @param {string} id - ID du stock
   * @returns {Promise<Object>} Réponse de l'API
   */
  async deleteStock(id) {
    try {
      console.log('🗑️ Suppression du stock:', id)
      const response = await apiClient.delete(API_ENDPOINTS.STOCKS.DELETE(id))
      
      console.log('✅ Réponse API suppression:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Stock supprimé avec succès',
        data: response.data.data || { id }
      }
    } catch (error) {
      console.error('❌ Erreur suppression stock:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression du stock'
      }
    }
  },

  /**
   * Rechercher des stocks
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} options - Options de recherche
   * @returns {Promise<Object>} Réponse de l'API
   */
  async searchStocks(searchTerm, options = {}) {
    try {
      const params = new URLSearchParams()
      params.append('q', searchTerm)
      
      if (options.actif_id) params.append('actif_id', options.actif_id)
      if (options.active_only !== undefined) params.append('active_only', options.active_only)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const url = `${API_ENDPOINTS.STOCKS.SEARCH}?${params.toString()}`
      
      console.log('🔍 Recherche de stocks:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Recherche effectuée'
      }
    } catch (error) {
      console.error('❌ Erreur recherche stocks:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la recherche'
      }
    }
  },

  /**
   * Récupérer les stocks avec stock faible
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getLowStocks(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.threshold) params.append('threshold', options.threshold)
      if (options.per_page) params.append('per_page', options.per_page)
      if (options.with_actif) params.append('with_actif', 'true')
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.STOCKS.LOW_STOCK}?${queryString}` : API_ENDPOINTS.STOCKS.LOW_STOCK
      
      console.log('🔍 Récupération des stocks faibles:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null,
        message: response.data.message || 'Stocks faibles récupérés'
      }
    } catch (error) {
      console.error('❌ Erreur récupération stocks faibles:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des stocks faibles'
      }
    }
  },

  /**
   * Récupérer les stocks expirant bientôt
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getExpiringSoonStocks(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.days) params.append('days', options.days)
      if (options.per_page) params.append('per_page', options.per_page)
      if (options.with_actif) params.append('with_actif', 'true')
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.STOCKS.EXPIRING_SOON}?${queryString}` : API_ENDPOINTS.STOCKS.EXPIRING_SOON
      
      console.log('🔍 Récupération des stocks expirant bientôt:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null,
        message: response.data.message || 'Stocks expirant bientôt récupérés'
      }
    } catch (error) {
      console.error('❌ Erreur récupération stocks expirant bientôt:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des stocks expirant bientôt'
      }
    }
  },

  /**
   * Récupérer les stocks expirés
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getExpiredStocks(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.per_page) params.append('per_page', options.per_page)
      if (options.with_actif) params.append('with_actif', 'true')
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.STOCKS.EXPIRED}?${queryString}` : API_ENDPOINTS.STOCKS.EXPIRED
      
      console.log('🔍 Récupération des stocks expirés:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null,
        message: response.data.message || 'Stocks expirés récupérés'
      }
    } catch (error) {
      console.error('❌ Erreur récupération stocks expirés:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des stocks expirés'
      }
    }
  },

  /**
   * Récupérer les stocks par actif
   * @param {string} actifId - ID de l'actif
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getStocksByActif(actifId, options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.per_page) params.append('per_page', options.per_page)
      if (options.active_only !== undefined) params.append('active_only', options.active_only)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.STOCKS.BY_ACTIF(actifId)}?${queryString}` : API_ENDPOINTS.STOCKS.BY_ACTIF(actifId)
      
      console.log('🔍 Récupération des stocks par actif:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null,
        message: response.data.message || 'Stocks par actif récupérés'
      }
    } catch (error) {
      console.error('❌ Erreur récupération stocks par actif:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des stocks par actif'
      }
    }
  },

  /**
   * Récupérer les statistiques des stocks
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getStockStats(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.period) params.append('period', options.period) // day, week, month, year
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      if (options.actif_id) params.append('actif_id', options.actif_id)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.STOCKS.STATS}?${queryString}` : API_ENDPOINTS.STOCKS.STATS
      
      console.log('📊 Récupération des statistiques des stocks:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Statistiques récupérées'
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques stocks:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques'
      }
    }
  },

  /**
   * Récupérer le résumé des stocks
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getStockSummary() {
    try {
      console.log('📋 Récupération du résumé des stocks')
      const response = await apiClient.get(API_ENDPOINTS.STOCKS.SUMMARY)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Résumé récupéré'
      }
    } catch (error) {
      console.error('❌ Erreur récupération résumé stocks:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération du résumé'
      }
    }
  },

  /**
   * Mise à jour en lot de stocks
   * @param {Array} stocksData - Tableau des données de stocks à mettre à jour
   * @returns {Promise<Object>} Réponse de l'API
   */
  async bulkUpdateStocks(stocksData) {
    try {
      console.log('📝 Mise à jour en lot des stocks:', stocksData.length, 'stocks')
      const response = await apiClient.put(API_ENDPOINTS.STOCKS.BULK_UPDATE, {
        stocks: stocksData
      })
      
      return {
        success: true,
        message: response.data.message || 'Stocks mis à jour en lot avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour en lot stocks:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la mise à jour en lot'
      }
    }
  },

  /**
   * Suppression en lot de stocks
   * @param {Array} stockIds - Tableau des IDs de stocks à supprimer
   * @returns {Promise<Object>} Réponse de l'API
   */
  async bulkDeleteStocks(stockIds) {
    try {
      console.log('🗑️ Suppression en lot des stocks:', stockIds.length, 'stocks')
      const response = await apiClient.delete(API_ENDPOINTS.STOCKS.BULK_DELETE, {
        data: { ids: stockIds }
      })
      
      return {
        success: true,
        message: response.data.message || 'Stocks supprimés en lot avec succès',
        data: response.data.data || { deleted_ids: stockIds }
      }
    } catch (error) {
      console.error('❌ Erreur suppression en lot stocks:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression en lot'
      }
    }
  },

  /**
   * Récupérer l'historique d'un stock
   * @param {string} id - ID du stock
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getStockHistory(id, options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.per_page) params.append('per_page', options.per_page)
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.STOCKS.HISTORY(id)}?${queryString}` : API_ENDPOINTS.STOCKS.HISTORY(id)
      
      console.log('📋 Récupération de l\'historique du stock:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null,
        message: response.data.message || 'Historique récupéré'
      }
    } catch (error) {
      console.error('❌ Erreur récupération historique stock:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération de l\'historique'
      }
    }
  },

  /**
   * Récupérer les mouvements de stocks
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getStockMovements(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.per_page) params.append('per_page', options.per_page)
      if (options.stock_id) params.append('stock_id', options.stock_id)
      if (options.actif_id) params.append('actif_id', options.actif_id)
      if (options.type) params.append('type', options.type) // in, out, adjustment
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.STOCKS.MOVEMENTS}?${queryString}` : API_ENDPOINTS.STOCKS.MOVEMENTS
      
      console.log('📋 Récupération des mouvements de stocks:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null,
        message: response.data.message || 'Mouvements récupérés'
      }
    } catch (error) {
      console.error('❌ Erreur récupération mouvements stocks:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des mouvements'
      }
    }
  },

  /**
   * Récupérer les alertes de stocks
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getStockAlerts(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.per_page) params.append('per_page', options.per_page)
      if (options.type) params.append('type', options.type) // low_stock, expiring, expired
      if (options.active_only !== undefined) params.append('active_only', options.active_only)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.STOCKS.ALERTS}?${queryString}` : API_ENDPOINTS.STOCKS.ALERTS
      
      console.log('🚨 Récupération des alertes de stocks:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null,
        message: response.data.message || 'Alertes récupérées'
      }
    } catch (error) {
      console.error('❌ Erreur récupération alertes stocks:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des alertes'
      }
    }
  }
}

export default stockService
