import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion des dépenses (expenses)
 * Basé sur la collection Postman Expenses API
 */
export const expenseService = {

  /**
   * Récupérer toutes les dépenses avec pagination et filtres
   * @param {Object} options - Options de requête (pagination, filtres)
   * @returns {Promise<Object>} Réponse API avec liste des dépenses
   */
  async getExpenses(options = {}) {
    try {
      console.log('📋 Récupération des dépenses avec options:', options)
      
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres
      if (options.category) params.append('category', options.category)
      if (options.status) params.append('status', options.status)
      if (options.tax_deductible !== undefined) params.append('tax_deductible', options.tax_deductible)
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      if (options.min_amount) params.append('min_amount', options.min_amount)
      if (options.max_amount) params.append('max_amount', options.max_amount)
      if (options.search) params.append('search', options.search)
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      // Relations
      if (options.with_user) params.append('with_user', options.with_user)
      if (options.with_receipts) params.append('with_receipts', options.with_receipts)

      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.EXPENSES.LIST}?${queryString}` : API_ENDPOINTS.EXPENSES.LIST

      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API expenses:', response)
      
      // Gérer la nouvelle structure avec expenses
      let expensesData = []
      let paginationData = {}
      
      if (response.data && response.data.expenses && Array.isArray(response.data.expenses)) {
        // Nouvelle structure: { data: { success: true, expenses: [...], pagination: {...} } }
        expensesData = response.data.expenses
        paginationData = response.data.pagination || {}
      } else {
        // Fallback vers ancienne structure
        expensesData = response.data?.data || response.data || []
        paginationData = response.data || {}
      }
      
      console.log('✅ Dépenses récupérées:', expensesData.length)
      return {
        success: true,
        data: expensesData,
        pagination: {
          current_page: paginationData.current_page || 1,
          last_page: paginationData.last_page || 1,
          per_page: paginationData.per_page || 15,
          total: paginationData.total || 0,
          from: paginationData.from || 0,
          to: paginationData.to || 0
        },
        message: response.message || 'Dépenses récupérées avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des dépenses:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des dépenses'
      }
    }
  },

  /**
   * Récupérer les dépenses de l'utilisateur connecté
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse API avec dépenses utilisateur
   */
  async getMyExpenses(options = {}) {
    try {
      console.log('👤 Récupération de mes dépenses avec options:', options)
      
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres spécifiques
      if (options.category) params.append('category', options.category)
      if (options.status) params.append('status', options.status)
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)

      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.EXPENSES.MY_EXPENSES}?${queryString}` : API_ENDPOINTS.EXPENSES.MY_EXPENSES

      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API my-expenses complète:', response)
      console.log('✅ response.data:', response.data)
      console.log('✅ response.data.expenses:', response.data?.expenses)
      console.log('✅ response.data.pagination:', response.data?.pagination)
      
      // Gérer la nouvelle structure avec expenses
      let expensesData = []
      let paginationData = {}
      
      if (response.data && response.data.expenses && Array.isArray(response.data.expenses)) {
        // Nouvelle structure: { data: { success: true, expenses: [...], pagination: {...} } }
        expensesData = response.data.expenses
        paginationData = response.data.pagination || {}
      } else if (response.data && response.data.data && response.data.data.data && Array.isArray(response.data.data.data)) {
        // Ancienne structure: { data: { success: true, data: { data: [...], current_page: 1 } } }
        expensesData = response.data.data.data
        paginationData = response.data.data
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Structure: { data: { data: [...], current_page: 1, ... } }
        expensesData = response.data.data
        paginationData = response.data
      } else if (response.data && Array.isArray(response.data)) {
        // Structure: { data: [...] }
        expensesData = response.data
        paginationData = response
      } else if (Array.isArray(response)) {
        // Structure directe: [...]
        expensesData = response
        paginationData = {}
      } else {
        // Fallback
        expensesData = []
        paginationData = {}
      }
      
      console.log('✅ expensesData après extraction:', expensesData)
      console.log('✅ Type de expensesData:', typeof expensesData)
      console.log('✅ Est-ce un array?', Array.isArray(expensesData))
      console.log('✅ Mes dépenses récupérées:', Array.isArray(expensesData) ? expensesData.length : 'Pas un array')
      return {
        success: true,
        data: expensesData,
        pagination: {
          current_page: paginationData.current_page || 1,
          last_page: paginationData.last_page || 1,
          per_page: paginationData.per_page || 15,
          total: paginationData.total || 0,
          from: paginationData.from || 0,
          to: paginationData.to || 0
        },
        message: response.message || 'Mes dépenses récupérées avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de mes dépenses:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération de mes dépenses'
      }
    }
  },

  /**
   * Récupérer une dépense par son ID
   * @param {string} expenseId - ID de la dépense
   * @returns {Promise<Object>} Réponse API avec détails de la dépense
   */
  async getExpenseById(expenseId) {
    try {
      console.log('🔍 Récupération de la dépense:', expenseId)
      
      const response = await apiClient.get(API_ENDPOINTS.EXPENSES.DETAIL(expenseId))
      
      console.log('✅ Dépense récupérée:', response.id)
      return {
        success: true,
        data: response,
        message: 'Dépense récupérée avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la dépense:', error)
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message || 'Dépense non trouvée'
      }
    }
  },

  /**
   * Créer une nouvelle dépense
   * @param {Object} expenseData - Données de la dépense
   * @returns {Promise<Object>} Réponse API avec dépense créée
   */
  async createExpense(expenseData) {
    try {
      // Validation des champs requis (comme createStock)
      const requiredFields = ['title', 'amount', 'category', 'expense_date']
      for (const field of requiredFields) {
        if (!expenseData[field]) {
          throw new Error(`Le champ ${field} est requis`)
        }
      }

      // Préparer les données pour l'API (structure exacte du body)
      const data = {
        title: expenseData.title,
        description: expenseData.description || '',
        amount: Number(expenseData.amount),
        category: expenseData.category,
        expense_date: expenseData.expense_date,
        supplier: expenseData.supplier || null,
        invoice_number: expenseData.invoice_number || null,
        tax_amount: expenseData.tax_amount ? Number(expenseData.tax_amount) : null,
        tax_deductible: expenseData.tax_deductible || false,
        payment_method: expenseData.payment_method || 'card',
        status: expenseData.status || 'pending',
        notes: expenseData.notes || null
      }

      console.log('📝 Création de la dépense:', data)
      const response = await apiClient.post(API_ENDPOINTS.EXPENSES.CREATE, data)
      
      console.log('✅ Réponse API création:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Dépense créée avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur création dépense:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la création de la dépense'
      }
    }
  },

  /**
   * Mettre à jour une dépense
   * @param {string} expenseId - ID de la dépense
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} Réponse API avec dépense mise à jour
   */
  async updateExpense(expenseId, updateData) {
    try {
      console.log('✏️ Mise à jour partielle de la dépense (PATCH):', expenseId, updateData)
      
      // Utilisation de PATCH pour mise à jour partielle (plus approprié que PUT)
      const response = await apiClient.patch(API_ENDPOINTS.EXPENSES.UPDATE(expenseId), updateData)
      
      console.log('✅ Réponse API modification PATCH:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Dépense mise à jour avec succès',
        data: response.data.data || response.data
      }
      
    } catch (error) {
      console.error('❌ Erreur modification dépense PATCH:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la mise à jour de la dépense'
      }
    }
  },

  /**
   * Supprimer une dépense
   * @param {string} expenseId - ID de la dépense
   * @returns {Promise<Object>} Réponse API de suppression
   */
  async deleteExpense(expenseId) {
    try {
      console.log('🗑️ Suppression de la dépense:', expenseId)
      
      const response = await apiClient.delete(API_ENDPOINTS.EXPENSES.DELETE(expenseId))
      
      console.log('✅ Réponse API suppression:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Dépense supprimée avec succès',
        data: response.data.data || { id: expenseId }
      }
      
    } catch (error) {
      console.error('❌ Erreur suppression dépense:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression de la dépense'
      }
    }
  },

  /**
   * Rechercher des dépenses
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} options - Options de recherche
   * @returns {Promise<Object>} Réponse API avec résultats de recherche
   */
  async searchExpenses(searchTerm, options = {}) {
    try {
      console.log('🔍 Recherche de dépenses:', searchTerm, options)
      
      const params = new URLSearchParams()
      params.append('search', searchTerm)
      
      // Options de recherche
      if (options.category) params.append('category', options.category)
      if (options.status) params.append('status', options.status)
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)

      const url = `${API_ENDPOINTS.EXPENSES.SEARCH}?${params.toString()}`
      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API search:', response)
      
      // Gérer la nouvelle structure avec expenses
      let expensesData = []
      let paginationData = {}
      
      if (response.data && response.data.expenses && Array.isArray(response.data.expenses)) {
        // Nouvelle structure: { data: { success: true, expenses: [...], pagination: {...} } }
        expensesData = response.data.expenses
        paginationData = response.data.pagination || {}
      } else {
        // Fallback vers ancienne structure
        expensesData = response.data?.data || response.data || []
        paginationData = response.data || {}
      }
      
      console.log('✅ Recherche terminée:', expensesData.length, 'résultats')
      return {
        success: true,
        data: expensesData,
        pagination: {
          current_page: paginationData.current_page || 1,
          last_page: paginationData.last_page || 1,
          per_page: paginationData.per_page || 15,
          total: paginationData.total || 0,
          from: paginationData.from || 0,
          to: paginationData.to || 0
        },
        message: response.message || 'Recherche terminée avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la recherche:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || error.message || 'Erreur lors de la recherche'
      }
    }
  },

  /**
   * Changer le statut d'une dépense (approuver/rejeter)
   * @param {string} expenseId - ID de la dépense
   * @param {string} status - Nouveau statut (approved, rejected, pending)
   * @param {string} reason - Raison du changement (optionnel)
   * @returns {Promise<Object>} Réponse API
   */
  async updateExpenseStatus(expenseId, status, reason = null) {
    try {
      console.log('📝 Changement de statut de la dépense:', expenseId, 'vers', status)
      
      const data = { status }
      if (reason) data.reason = reason

      const response = await apiClient.patch(API_ENDPOINTS.EXPENSES.UPDATE_STATUS(expenseId), data)
      
      console.log('✅ Statut mis à jour avec succès:', status)
      return {
        success: true,
        data: response,
        message: response.message || 'Statut mis à jour avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du changement de statut:', error)
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message || 'Erreur lors du changement de statut'
      }
    }
  },

  /**
   * Restaurer une dépense supprimée
   * @param {string} expenseId - ID de la dépense
   * @returns {Promise<Object>} Réponse API
   */
  async restoreExpense(expenseId) {
    try {
      console.log('♻️ Restauration de la dépense:', expenseId)
      
      const response = await apiClient.patch(API_ENDPOINTS.EXPENSES.RESTORE(expenseId))
      
      console.log('✅ Dépense restaurée avec succès:', expenseId)
      return {
        success: true,
        data: response,
        message: response.message || 'Dépense restaurée avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la restauration:', error)
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message || 'Erreur lors de la restauration'
      }
    }
  },

}

export default expenseService
