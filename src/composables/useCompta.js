import { computed } from 'vue'
import { useComptaStore } from '@/stores/compta.js'
import { 
  useComptaStatsQuery,
  useComptaTrendsQuery,
  useComptaComparisonsQuery,
  useComptaReportsQuery,
  useComptaAnalysisQuery,
  useComptaForecastsQuery,
  useRefreshComptaData,
  useGenerateComptaReport,
  useExportComptaData,
  useComptaDashboard
} from '@/services/compta/comptaQueries.js'

/**
 * Composable pour la gestion de la comptabilité
 * Interface unifiée entre les composants et les services/stores
 */
export const useCompta = () => {
  const store = useComptaStore()
  
  // === ÉTAT RÉACTIF ===
  
  const stats = computed(() => store.stats)
  const trends = computed(() => store.trends)
  const comparisons = computed(() => store.comparisons)
  const reports = computed(() => store.reports)
  const analysis = computed(() => store.analysis)
  const forecasts = computed(() => store.forecasts)
  const currentPeriod = computed(() => store.currentPeriod)
  const customDateRange = computed(() => store.customDateRange)
  
  // États de chargement
  const isLoading = computed(() => store.isLoading)
  const isLoadingStats = computed(() => store.isLoadingStats)
  const isLoadingTrends = computed(() => store.isLoadingTrends)
  const isLoadingComparisons = computed(() => store.isLoadingComparisons)
  const isLoadingReports = computed(() => store.isLoadingReports)
  const isLoadingAnalysis = computed(() => store.isLoadingAnalysis)
  const isLoadingForecasts = computed(() => store.isLoadingForecasts)
  
  // Gestion d'erreurs
  const error = computed(() => store.error)
  const hasError = computed(() => !!store.error)
  
  // === GETTERS CALCULÉS ===
  
  const hasStats = computed(() => store.hasStats)
  const hasTrends = computed(() => store.hasTrends)
  const hasComparisons = computed(() => store.hasComparisons)
  const hasReports = computed(() => store.hasReports)
  const hasAnalysis = computed(() => store.hasAnalysis)
  const hasForecasts = computed(() => store.hasForecasts)
  
  // Indicateurs financiers
  const totalRevenues = computed(() => store.totalRevenues)
  const totalExpenses = computed(() => store.totalExpenses)
  const netProfit = computed(() => store.netProfit)
  const profitMargin = computed(() => store.profitMargin)
  const isProfitable = computed(() => store.isProfitable)
  const financialRatios = computed(() => store.financialRatios)
  
  // === HOOKS TANSTACK QUERY ===
  
  /**
   * Hook pour les statistiques comptables
   */
  const useStats = (options = {}) => {
    return useComptaStatsQuery(options)
  }
  
  /**
   * Hook pour les tendances comptables
   */
  const useTrends = (options = {}) => {
    return useComptaTrendsQuery(options)
  }
  
  /**
   * Hook pour les comparaisons comptables
   */
  const useComparisons = (options = {}) => {
    return useComptaComparisonsQuery(options)
  }
  
  /**
   * Hook pour les rapports comptables
   */
  const useReports = (options = {}) => {
    return useComptaReportsQuery(options)
  }
  
  /**
   * Hook pour les analyses comptables
   */
  const useAnalysis = (options = {}) => {
    return useComptaAnalysisQuery(options)
  }
  
  /**
   * Hook pour les prévisions comptables
   */
  const useForecasts = (options = {}) => {
    return useComptaForecastsQuery(options)
  }
  
  /**
   * Hook pour le dashboard complet
   */
  const useDashboard = (options = {}) => {
    return useComptaDashboard(options)
  }
  
  // === MUTATIONS ===
  
  const refreshDataMutation = useRefreshComptaData()
  const generateReportMutation = useGenerateComptaReport()
  const exportDataMutation = useExportComptaData()
  
  // === ACTIONS SIMPLIFIÉES ===
  
  /**
   * Charger les statistiques comptables
   */
  const loadStats = async (options = {}) => {
    try {
      return await store.fetchStats(options)
    } catch (error) {
      console.error('❌ Erreur chargement statistiques:', error)
      throw error
    }
  }
  
  /**
   * Charger les tendances comptables
   */
  const loadTrends = async (options = {}) => {
    try {
      return await store.fetchTrends(options)
    } catch (error) {
      console.error('❌ Erreur chargement tendances:', error)
      throw error
    }
  }
  
  /**
   * Charger les comparaisons comptables
   */
  const loadComparisons = async (options = {}) => {
    try {
      return await store.fetchComparisons(options)
    } catch (error) {
      console.error('❌ Erreur chargement comparaisons:', error)
      throw error
    }
  }
  
  /**
   * Générer des rapports comptables
   */
  const generateReports = async (options = {}) => {
    try {
      return await store.fetchReports(options)
    } catch (error) {
      console.error('❌ Erreur génération rapports:', error)
      throw error
    }
  }
  
  /**
   * Charger les analyses comptables
   */
  const loadAnalysis = async (options = {}) => {
    try {
      return await store.fetchAnalysis(options)
    } catch (error) {
      console.error('❌ Erreur chargement analyses:', error)
      throw error
    }
  }
  
  /**
   * Charger les prévisions comptables
   */
  const loadForecasts = async (options = {}) => {
    try {
      return await store.fetchForecasts(options)
    } catch (error) {
      console.error('❌ Erreur chargement prévisions:', error)
      throw error
    }
  }
  
  /**
   * Charger toutes les données comptables
   */
  const loadAllData = async (options = {}) => {
    try {
      return await store.loadAllData(options)
    } catch (error) {
      console.error('❌ Erreur chargement données comptables:', error)
      throw error
    }
  }
  
  /**
   * Rafraîchir toutes les données
   */
  const refreshData = async (options = {}) => {
    try {
      return await refreshDataMutation.mutateAsync(options)
    } catch (error) {
      console.error('❌ Erreur rafraîchissement données:', error)
      throw error
    }
  }
  
  /**
   * Générer un rapport personnalisé
   */
  const generateReport = async (reportOptions) => {
    try {
      return await generateReportMutation.mutateAsync(reportOptions)
    } catch (error) {
      console.error('❌ Erreur génération rapport:', error)
      throw error
    }
  }
  
  /**
   * Exporter des données comptables
   */
  const exportData = async (exportOptions) => {
    try {
      return await exportDataMutation.mutateAsync(exportOptions)
    } catch (error) {
      console.error('❌ Erreur export données:', error)
      throw error
    }
  }
  
  /**
   * Changer la période active
   */
  const setPeriod = (period) => {
    store.setPeriod(period)
  }
  
  /**
   * Définir une plage de dates personnalisée
   */
  const setCustomDateRange = (startDate, endDate) => {
    store.setCustomDateRange(startDate, endDate)
  }
  
  /**
   * Vider les erreurs
   */
  const clearError = () => {
    store.clearError()
  }
  
  /**
   * Réinitialiser le store
   */
  const resetStore = () => {
    store.resetState()
  }
  
  // === FONCTIONS UTILITAIRES ===
  
  /**
   * Formater un montant en euros
   */
  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }
  
  /**
   * Formater un pourcentage
   */
  const formatPercentage = (value) => {
    if (value === null || value === undefined) return '0%'
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2
    }).format(value / 100)
  }
  
  /**
   * Formater une date
   */
  const formatDate = (date) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }
  
  /**
   * Obtenir le label d'une période
   */
  const getPeriodLabel = (period) => {
    const labels = {
      week: 'Cette semaine',
      month: 'Ce mois',
      quarter: 'Ce trimestre',
      year: 'Cette année',
      last_7_days: '7 derniers jours',
      last_30_days: '30 derniers jours',
      last_90_days: '90 derniers jours',
      last_6_months: '6 derniers mois',
      custom: 'Période personnalisée'
    }
    return labels[period] || period
  }
  
  /**
   * Obtenir la couleur d'un indicateur
   */
  const getIndicatorColor = (value, isPositive = true) => {
    if (value === null || value === undefined) return 'text-gray-500'
    
    if (isPositive) {
      return value >= 0 ? 'text-green-600' : 'text-red-600'
    } else {
      return value >= 0 ? 'text-red-600' : 'text-green-600'
    }
  }
  
  /**
   * Obtenir l'icône d'un indicateur
   */
  const getIndicatorIcon = (value, isPositive = true) => {
    if (value === null || value === undefined) return '➖'
    
    if (isPositive) {
      return value >= 0 ? '📈' : '📉'
    } else {
      return value >= 0 ? '📉' : '📈'
    }
  }
  
  /**
   * Valider les options de période
   */
  const validatePeriodOptions = (options) => {
    const validPeriods = ['week', 'month', 'quarter', 'year', 'last_7_days', 'last_30_days', 'last_90_days', 'last_6_months', 'custom']
    
    if (options.period && !validPeriods.includes(options.period)) {
      console.warn('Période invalide:', options.period)
      return false
    }
    
    if (options.period === 'custom' && (!options.start_date || !options.end_date)) {
      console.warn('Dates requises pour période personnalisée')
      return false
    }
    
    return true
  }
  
  // === RETOUR DU COMPOSABLE ===
  
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
    
    // États de chargement
    isLoading,
    isLoadingStats,
    isLoadingTrends,
    isLoadingComparisons,
    isLoadingReports,
    isLoadingAnalysis,
    isLoadingForecasts,
    hasError,
    
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
    
    // Hooks TanStack Query
    useStats,
    useTrends,
    useComparisons,
    useReports,
    useAnalysis,
    useForecasts,
    useDashboard,
    
    // Actions
    loadStats,
    loadTrends,
    loadComparisons,
    generateReports,
    loadAnalysis,
    loadForecasts,
    loadAllData,
    refreshData,
    generateReport,
    exportData,
    setPeriod,
    setCustomDateRange,
    clearError,
    resetStore,
    
    // Utilitaires
    formatAmount,
    formatPercentage,
    formatDate,
    getPeriodLabel,
    getIndicatorColor,
    getIndicatorIcon,
    validatePeriodOptions
  }
}

export default useCompta
