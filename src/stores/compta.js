import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { comptaService } from '@/services/compta/comptaService.js'

/**
 * Store Pinia pour la gestion de la comptabilité
 */
export const useComptaStore = defineStore('compta', () => {
  // === ÉTAT RÉACTIF ===
  
  // Statistiques financières
  const stats = ref({})
  const trends = ref([])
  const comparisons = ref({})
  const reports = ref([])
  const analysis = ref({})
  const forecasts = ref({})
  
  // Période active
  const currentPeriod = ref('month')
  const customDateRange = ref({
    start_date: null,
    end_date: null
  })
  
  // États de chargement
  const isLoadingStats = ref(false)
  const isLoadingTrends = ref(false)
  const isLoadingComparisons = ref(false)
  const isLoadingReports = ref(false)
  const isLoadingAnalysis = ref(false)
  const isLoadingForecasts = ref(false)
  
  // Gestion d'erreurs
  const error = ref(null)
  const lastUpdated = ref(null)
  
  // === GETTERS CALCULÉS ===
  
  const hasStats = computed(() => stats.value && Object.keys(stats.value).length > 0)
  const hasTrends = computed(() => trends.value && trends.value.length > 0)
  const hasComparisons = computed(() => comparisons.value && Object.keys(comparisons.value).length > 0)
  const hasReports = computed(() => reports.value && reports.value.length > 0)
  const hasAnalysis = computed(() => analysis.value && Object.keys(analysis.value).length > 0)
  const hasForecasts = computed(() => forecasts.value && Object.keys(forecasts.value).length > 0)
  
  // Indicateurs financiers calculés
  const totalRevenues = computed(() => stats.value.revenues?.total_brut || 0)
  const totalExpenses = computed(() => stats.value.expenses?.total_brut || 0)
  const netProfit = computed(() => stats.value.profit?.benefice_net || 0)
  const profitMargin = computed(() => stats.value.profit?.marge_nette_percentage || 0)
  const isProfitable = computed(() => stats.value.profit?.is_profitable || false)
  
  // Ratios financiers
  const financialRatios = computed(() => stats.value.ratios || {})
  
  // État global de chargement
  const isLoading = computed(() => 
    isLoadingStats.value || 
    isLoadingTrends.value || 
    isLoadingComparisons.value || 
    isLoadingReports.value || 
    isLoadingAnalysis.value || 
    isLoadingForecasts.value
  )
  
  // === ACTIONS ===
  
  /**
   * Définir une erreur
   */
  const setError = (errorMessage) => {
    error.value = errorMessage
    console.error('💰 Erreur comptabilité:', errorMessage)
  }
  
  /**
   * Vider les erreurs
   */
  const clearError = () => {
    error.value = null
  }
  
  /**
   * Mettre à jour la timestamp de dernière mise à jour
   */
  const updateLastUpdated = () => {
    lastUpdated.value = new Date().toISOString()
  }
  
  /**
   * Récupérer les statistiques financières
   */
  const fetchStats = async (options = {}) => {
    isLoadingStats.value = true
    clearError()
    
    try {
      console.log('📊 Récupération statistiques comptables')
      const response = await comptaService.getStats({
        period: currentPeriod.value,
        ...customDateRange.value,
        ...options
      })
      
      if (response.success) {
        stats.value = response.data
        updateLastUpdated()
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des statistiques'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoadingStats.value = false
    }
  }
  
  /**
   * Récupérer les tendances financières
   */
  const fetchTrends = async (options = {}) => {
    isLoadingTrends.value = true
    clearError()
    
    try {
      console.log('📈 Récupération tendances comptables')
      const response = await comptaService.getTrends({
        period: currentPeriod.value,
        ...customDateRange.value,
        ...options
      })
      
      if (response.success) {
        trends.value = response.data
        updateLastUpdated()
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des tendances'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoadingTrends.value = false
    }
  }
  
  /**
   * Récupérer les comparaisons périodiques
   */
  const fetchComparisons = async (options = {}) => {
    isLoadingComparisons.value = true
    clearError()
    
    try {
      console.log('🔄 Récupération comparaisons comptables')
      const response = await comptaService.getComparison({
        current_period: currentPeriod.value,
        ...options
      })
      
      if (response.success) {
        comparisons.value = response.data
        updateLastUpdated()
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des comparaisons'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoadingComparisons.value = false
    }
  }
  
  /**
   * Générer des rapports financiers
   */
  const fetchReports = async (options = {}) => {
    isLoadingReports.value = true
    clearError()
    
    try {
      console.log('📋 Génération rapports comptables')
      const response = await comptaService.getReports({
        period: currentPeriod.value,
        ...customDateRange.value,
        ...options
      })
      
      if (response.success) {
        reports.value = Array.isArray(response.data) ? response.data : [response.data]
        updateLastUpdated()
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la génération des rapports'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoadingReports.value = false
    }
  }
  
  /**
   * Récupérer les analyses détaillées
   */
  const fetchAnalysis = async (options = {}) => {
    isLoadingAnalysis.value = true
    clearError()
    
    try {
      console.log('🔍 Récupération analyses comptables')
      const response = await comptaService.getAnalysis({
        period: currentPeriod.value,
        ...customDateRange.value,
        ...options
      })
      
      if (response.success) {
        analysis.value = response.data
        updateLastUpdated()
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des analyses'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoadingAnalysis.value = false
    }
  }
  
  /**
   * Récupérer les prévisions financières
   */
  const fetchForecasts = async (options = {}) => {
    isLoadingForecasts.value = true
    clearError()
    
    try {
      console.log('🔮 Récupération prévisions comptables')
      const response = await comptaService.getForecasts(options)
      
      if (response.success) {
        forecasts.value = response.data
        updateLastUpdated()
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des prévisions'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoadingForecasts.value = false
    }
  }
  
  /**
   * Changer la période active
   */
  const setPeriod = (period) => {
    currentPeriod.value = period
    // Vider les données pour forcer un rechargement
    stats.value = {}
    trends.value = []
    comparisons.value = {}
    reports.value = []
    analysis.value = {}
  }
  
  /**
   * Définir une plage de dates personnalisée
   */
  const setCustomDateRange = (startDate, endDate) => {
    customDateRange.value = {
      start_date: startDate,
      end_date: endDate
    }
    currentPeriod.value = 'custom'
  }
  
  /**
   * Charger toutes les données comptables
   */
  const loadAllData = async (options = {}) => {
    const results = await Promise.allSettled([
      fetchStats(options),
      fetchTrends(options),
      fetchComparisons(options)
    ])
    
    const errors = results
      .filter(result => result.status === 'rejected' || !result.value?.success)
      .map(result => result.reason?.message || result.value?.error || 'Erreur inconnue')
    
    if (errors.length > 0) {
      setError(`Erreurs lors du chargement: ${errors.join(', ')}`)
      return { success: false, errors }
    }
    
    return { success: true }
  }
  
  /**
   * Réinitialiser le store
   */
  const resetState = () => {
    stats.value = {}
    trends.value = []
    comparisons.value = {}
    reports.value = []
    analysis.value = {}
    forecasts.value = {}
    currentPeriod.value = 'month'
    customDateRange.value = { start_date: null, end_date: null }
    error.value = null
    lastUpdated.value = null
  }
  
  // === RETOUR DU STORE ===
  
  return {
    // État
    stats,
    trends,
    comparisons,
    reports,
    analysis,
    forecasts,
    currentPeriod,
    customDateRange,
    error,
    lastUpdated,
    
    // États de chargement
    isLoadingStats,
    isLoadingTrends,
    isLoadingComparisons,
    isLoadingReports,
    isLoadingAnalysis,
    isLoadingForecasts,
    isLoading,
    
    // Getters
    hasStats,
    hasTrends,
    hasComparisons,
    hasReports,
    hasAnalysis,
    hasForecasts,
    totalRevenues,
    totalExpenses,
    netProfit,
    profitMargin,
    isProfitable,
    financialRatios,
    
    // Actions
    fetchStats,
    fetchTrends,
    fetchComparisons,
    fetchReports,
    fetchAnalysis,
    fetchForecasts,
    setPeriod,
    setCustomDateRange,
    loadAllData,
    resetState,
    clearError
  }
})

export default useComptaStore
