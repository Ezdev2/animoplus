import { apiClient } from '@/services/api/config.js'
import { COMPTA_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion de la comptabilité
 * Basé sur la collection Postman Compta_Collection
 */
export const comptaService = {
  /**
   * Récupérer les statistiques financières
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getStats(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Période (week, month, quarter, year, last_7_days, last_30_days, last_90_days, last_6_months, custom)
      if (options.period) params.append('period', options.period)
      
      // Dates personnalisées pour period=custom
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      
      // Filtres supplémentaires
      if (options.category) params.append('category', options.category)
      if (options.user_id) params.append('user_id', options.user_id)
      if (options.include_taxes !== undefined) params.append('include_taxes', options.include_taxes)
      
      const queryString = params.toString()
      const url = queryString ? `${COMPTA_ENDPOINTS.STATS}?${queryString}` : COMPTA_ENDPOINTS.STATS
      
      console.log('📊 Récupération statistiques comptables:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Statistiques comptables récupérées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Statistiques récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques comptables:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques'
      }
    }
  },

  /**
   * Récupérer les tendances financières
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getTrends(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Période d'analyse
      if (options.period) params.append('period', options.period)
      if (options.interval) params.append('interval', options.interval) // daily, weekly, monthly
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      
      // Types de tendances
      if (options.metrics) params.append('metrics', options.metrics) // revenues, expenses, profit, margin
      if (options.category) params.append('category', options.category)
      
      const queryString = params.toString()
      const url = queryString ? `${COMPTA_ENDPOINTS.TRENDS}?${queryString}` : COMPTA_ENDPOINTS.TRENDS
      
      console.log('📈 Récupération tendances comptables:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Tendances comptables récupérées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Tendances récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération tendances comptables:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des tendances'
      }
    }
  },

  /**
   * Récupérer les comparaisons périodiques
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getComparison(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Périodes à comparer
      if (options.current_period) params.append('current_period', options.current_period)
      if (options.previous_period) params.append('previous_period', options.previous_period)
      if (options.comparison_type) params.append('comparison_type', options.comparison_type) // period_over_period, year_over_year
      
      // Dates personnalisées
      if (options.current_start) params.append('current_start', options.current_start)
      if (options.current_end) params.append('current_end', options.current_end)
      if (options.previous_start) params.append('previous_start', options.previous_start)
      if (options.previous_end) params.append('previous_end', options.previous_end)
      
      // Métriques à comparer
      if (options.metrics) params.append('metrics', options.metrics)
      
      const queryString = params.toString()
      const url = queryString ? `${COMPTA_ENDPOINTS.COMPARISON}?${queryString}` : COMPTA_ENDPOINTS.COMPARISON
      
      console.log('🔄 Récupération comparaisons comptables:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Comparaisons comptables récupérées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Comparaisons récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération comparaisons comptables:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des comparaisons'
      }
    }
  },

  /**
   * Générer des rapports financiers
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getReports(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Type de rapport
      if (options.report_type) params.append('report_type', options.report_type) // profit_loss, balance_sheet, cash_flow, summary
      
      // Période du rapport
      if (options.period) params.append('period', options.period)
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      
      // Format de sortie
      if (options.format) params.append('format', options.format) // json, pdf, excel
      if (options.detailed !== undefined) params.append('detailed', options.detailed)
      
      // Filtres
      if (options.category) params.append('category', options.category)
      if (options.user_id) params.append('user_id', options.user_id)
      
      const queryString = params.toString()
      const url = queryString ? `${COMPTA_ENDPOINTS.REPORTS}?${queryString}` : COMPTA_ENDPOINTS.REPORTS
      
      console.log('📋 Génération rapport comptable:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Rapport comptable généré:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Rapport généré avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur génération rapport comptable:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la génération du rapport'
      }
    }
  },

  /**
   * Récupérer les analyses détaillées
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAnalysis(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Type d'analyse
      if (options.analysis_type) params.append('analysis_type', options.analysis_type) // profitability, growth, efficiency, risk
      
      // Période d'analyse
      if (options.period) params.append('period', options.period)
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      
      // Paramètres d'analyse
      if (options.depth) params.append('depth', options.depth) // basic, detailed, comprehensive
      if (options.include_recommendations !== undefined) params.append('include_recommendations', options.include_recommendations)
      
      const queryString = params.toString()
      const url = queryString ? `${COMPTA_ENDPOINTS.ANALYSIS}?${queryString}` : COMPTA_ENDPOINTS.ANALYSIS
      
      console.log('🔍 Récupération analyses comptables:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Analyses comptables récupérées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Analyses récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération analyses comptables:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des analyses'
      }
    }
  },

  /**
   * Récupérer les statistiques multiples (année, mois, semaine)
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getMultiStats(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Filtres optionnels
      if (options.user_id) params.append('user_id', options.user_id)
      if (options.category) params.append('category', options.category)
      if (options.include_taxes !== undefined) params.append('include_taxes', options.include_taxes)
      
      const queryString = params.toString()
      const url = queryString ? `${COMPTA_ENDPOINTS.MULTI_STATS}?${queryString}` : COMPTA_ENDPOINTS.MULTI_STATS
      
      console.log('📊 Récupération statistiques multiples:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Statistiques multiples récupérées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Statistiques multiples récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques multiples:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques multiples'
      }
    }
  },

  /**
   * Récupérer les prévisions financières
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getForecasts(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Période de prévision
      if (options.forecast_period) params.append('forecast_period', options.forecast_period) // next_month, next_quarter, next_year
      if (options.horizon_months) params.append('horizon_months', options.horizon_months)
      
      // Modèle de prévision
      if (options.model) params.append('model', options.model) // linear, seasonal, trend
      if (options.confidence_level) params.append('confidence_level', options.confidence_level)
      
      // Données historiques
      if (options.historical_period) params.append('historical_period', options.historical_period)
      if (options.include_scenarios !== undefined) params.append('include_scenarios', options.include_scenarios)
      
      const queryString = params.toString()
      const url = queryString ? `${COMPTA_ENDPOINTS.FORECASTS}?${queryString}` : COMPTA_ENDPOINTS.FORECASTS
      
      console.log('🔮 Récupération prévisions comptables:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Prévisions comptables récupérées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Prévisions récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération prévisions comptables:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des prévisions'
      }
    }
  }
}

export default comptaService
