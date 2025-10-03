import { computed } from 'vue'
import { useRevenuesStore } from '@/stores/revenues.js'
import { 
  useRevenuesQuery,
  useRevenueQuery,
  useSearchRevenuesQuery,
  useRevenueStatsQuery,
  useRevenueCategoriesQuery,
  useCreateRevenue,
  useUpdateRevenue,
  useDeleteRevenue,
  useValidateRevenue,
  useApproveRevenue,
  useRejectRevenue,
  useExportRevenues
} from '@/services/revenues/revenueQueries.js'

/**
 * Composable pour la gestion des revenus
 * Interface unifiée entre les composants et les services/stores
 */
export const useRevenues = () => {
  const store = useRevenuesStore()
  
  // === ÉTAT RÉACTIF ===
  
  const revenues = computed(() => store.revenues)
  const currentRevenue = computed(() => store.currentRevenue)
  const pagination = computed(() => store.pagination)
  const filters = computed(() => store.filters)
  const stats = computed(() => store.stats)
  const categories = computed(() => store.categories)
  
  // États de chargement
  const isLoading = computed(() => store.isLoading)
  const isCreating = computed(() => store.isCreating)
  const isUpdating = computed(() => store.isUpdating)
  const isDeleting = computed(() => store.isDeleting)
  const isLoadingStats = computed(() => store.isLoadingStats)
  const isLoadingCategories = computed(() => store.isLoadingCategories)
  
  // Gestion d'erreurs
  const error = computed(() => store.error)
  const validationErrors = computed(() => store.validationErrors)
  const hasError = computed(() => !!store.error)
  
  // === GETTERS CALCULÉS ===
  
  const hasRevenues = computed(() => store.hasRevenues)
  const hasStats = computed(() => store.hasStats)
  const hasCategories = computed(() => store.hasCategories)
  
  // Revenus par statut
  const draftRevenues = computed(() => store.draftRevenues)
  const confirmedRevenues = computed(() => store.confirmedRevenues)
  const cancelledRevenues = computed(() => store.cancelledRevenues)
  
  // Revenus par statut de paiement
  const paidRevenues = computed(() => store.paidRevenues)
  const pendingRevenues = computed(() => store.pendingRevenues)
  const overdueRevenues = computed(() => store.overdueRevenues)
  
  // Revenus par catégorie
  const revenuesByCategory = computed(() => store.revenuesByCategory)
  
  // Totaux calculés
  const totalAmount = computed(() => store.totalAmount)
  const totalPaidAmount = computed(() => store.totalPaidAmount)
  const totalPendingAmount = computed(() => store.totalPendingAmount)
  
  // Filtres actifs
  const activeFiltersCount = computed(() => store.activeFiltersCount)
  
  // === HOOKS TANSTACK QUERY ===
  
  /**
   * Hook pour la liste des revenus
   */
  const useRevenuesList = (options = {}) => {
    return useRevenuesQuery(options)
  }
  
  /**
   * Hook pour un revenu spécifique
   */
  const useRevenue = (revenueId, options = {}) => {
    return useRevenueQuery(revenueId, options)
  }
  
  /**
   * Hook pour la recherche de revenus
   */
  const useSearchRevenues = (searchTerm, options = {}) => {
    return useSearchRevenuesQuery(searchTerm, options)
  }
  
  /**
   * Hook pour les statistiques des revenus
   */
  const useRevenueStats = (options = {}) => {
    return useRevenueStatsQuery(options)
  }
  
  /**
   * Hook pour les catégories de revenus
   */
  const useRevenueCategories = () => {
    return useRevenueCategoriesQuery()
  }
  
  // === MUTATIONS ===
  
  const createRevenueMutation = useCreateRevenue()
  const updateRevenueMutation = useUpdateRevenue()
  const deleteRevenueMutation = useDeleteRevenue()
  const validateRevenueMutation = useValidateRevenue()
  const approveRevenueMutation = useApproveRevenue()
  const rejectRevenueMutation = useRejectRevenue()
  const exportRevenuesMutation = useExportRevenues()
  
  // === ACTIONS SIMPLIFIÉES ===
  
  /**
   * Charger les revenus
   */
  const loadRevenues = async (options = {}) => {
    try {
      return await store.fetchRevenues(options)
    } catch (error) {
      console.error('❌ Erreur chargement revenus:', error)
      throw error
    }
  }
  
  /**
   * Charger un revenu par ID
   */
  const loadRevenue = async (revenueId, options = {}) => {
    try {
      return await store.fetchRevenueById(revenueId, options)
    } catch (error) {
      console.error('❌ Erreur chargement revenu:', error)
      throw error
    }
  }
  
  /**
   * Créer un nouveau revenu
   */
  const createRevenue = async (revenueData) => {
    try {
      return await createRevenueMutation.mutateAsync(revenueData)
    } catch (error) {
      console.error('❌ Erreur création revenu:', error)
      throw error
    }
  }
  
  /**
   * Mettre à jour un revenu
   */
  const updateRevenue = async (revenueId, revenueData) => {
    try {
      return await updateRevenueMutation.mutateAsync({ revenueId, revenueData })
    } catch (error) {
      console.error('❌ Erreur mise à jour revenu:', error)
      throw error
    }
  }
  
  /**
   * Supprimer un revenu
   */
  const deleteRevenue = async (revenueId) => {
    try {
      return await deleteRevenueMutation.mutateAsync(revenueId)
    } catch (error) {
      console.error('❌ Erreur suppression revenu:', error)
      throw error
    }
  }
  
  /**
   * Rechercher des revenus
   */
  const searchRevenues = async (searchTerm, options = {}) => {
    try {
      return await store.searchRevenues(searchTerm, options)
    } catch (error) {
      console.error('❌ Erreur recherche revenus:', error)
      throw error
    }
  }
  
  /**
   * Charger les statistiques
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
   * Charger les catégories
   */
  const loadCategories = async () => {
    try {
      return await store.fetchCategories()
    } catch (error) {
      console.error('❌ Erreur chargement catégories:', error)
      throw error
    }
  }
  
  /**
   * Valider un revenu
   */
  const validateRevenue = async (revenueId) => {
    try {
      return await validateRevenueMutation.mutateAsync(revenueId)
    } catch (error) {
      console.error('❌ Erreur validation revenu:', error)
      throw error
    }
  }
  
  /**
   * Approuver un revenu
   */
  const approveRevenue = async (revenueId) => {
    try {
      return await approveRevenueMutation.mutateAsync(revenueId)
    } catch (error) {
      console.error('❌ Erreur approbation revenu:', error)
      throw error
    }
  }
  
  /**
   * Rejeter un revenu
   */
  const rejectRevenue = async (revenueId, data = {}) => {
    try {
      return await rejectRevenueMutation.mutateAsync({ revenueId, data })
    } catch (error) {
      console.error('❌ Erreur rejet revenu:', error)
      throw error
    }
  }
  
  /**
   * Exporter des revenus
   */
  const exportRevenues = async (exportOptions) => {
    try {
      return await exportRevenuesMutation.mutateAsync(exportOptions)
    } catch (error) {
      console.error('❌ Erreur export revenus:', error)
      throw error
    }
  }
  
  /**
   * Mettre à jour les filtres
   */
  const updateFilters = (newFilters) => {
    store.updateFilters(newFilters)
  }
  
  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    store.resetFilters()
  }
  
  /**
   * Définir le revenu courant
   */
  const setCurrentRevenue = (revenue) => {
    store.setCurrentRevenue(revenue)
  }
  
  /**
   * Vider le revenu courant
   */
  const clearCurrentRevenue = () => {
    store.clearCurrentRevenue()
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
   * Formater une date courte
   */
  const formatShortDate = (date) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date))
  }
  
  /**
   * Obtenir le label d'un statut
   */
  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Brouillon',
      confirmed: 'Confirmé',
      cancelled: 'Annulé'
    }
    return labels[status] || status
  }
  
  /**
   * Obtenir la couleur d'un statut
   */
  const getStatusColor = (status) => {
    const colors = {
      draft: 'text-gray-600 bg-gray-100',
      confirmed: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }
  
  /**
   * Obtenir le label d'un statut de paiement
   */
  const getPaymentStatusLabel = (paymentStatus) => {
    const labels = {
      pending: 'En attente',
      paid: 'Payé',
      partial: 'Partiel',
      overdue: 'En retard',
      cancelled: 'Annulé'
    }
    return labels[paymentStatus] || paymentStatus
  }
  
  /**
   * Obtenir la couleur d'un statut de paiement
   */
  const getPaymentStatusColor = (paymentStatus) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      paid: 'text-green-600 bg-green-100',
      partial: 'text-blue-600 bg-blue-100',
      overdue: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100'
    }
    return colors[paymentStatus] || 'text-gray-600 bg-gray-100'
  }
  
  /**
   * Obtenir le label d'une catégorie
   */
  const getCategoryLabel = (category) => {
    const labels = {
      consultation: 'Consultation',
      service: 'Service',
      product_sale: 'Vente produit',
      subscription: 'Abonnement',
      training: 'Formation',
      surgery: 'Chirurgie',
      vaccination: 'Vaccination',
      diagnostic: 'Diagnostic',
      other: 'Autre'
    }
    return labels[category] || category
  }
  
  /**
   * Obtenir l'icône d'une catégorie
   */
  const getCategoryIcon = (category) => {
    const icons = {
      consultation: '🩺',
      service: '⚙️',
      product_sale: '🛒',
      subscription: '📅',
      training: '🎓',
      surgery: '🔪',
      vaccination: '💉',
      diagnostic: '🔍',
      other: '📋'
    }
    return icons[category] || '📋'
  }
  
  /**
   * Valider les données d'un revenu
   */
  const validateRevenueData = (data) => {
    const errors = {}
    
    if (!data.amount || data.amount <= 0) {
      errors.amount = 'Le montant est requis et doit être positif'
    }
    
    if (!data.category) {
      errors.category = 'La catégorie est requise'
    }
    
    if (!data.date) {
      errors.date = 'La date est requise'
    }
    
    if (!data.description || data.description.trim().length === 0) {
      errors.description = 'La description est requise'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
  
  /**
   * Calculer le montant TTC
   */
  const calculateTotalAmount = (amount, taxRate = 0.20) => {
    if (!amount) return 0
    return amount * (1 + taxRate)
  }
  
  /**
   * Calculer le montant de la taxe
   */
  const calculateTaxAmount = (amount, taxRate = 0.20) => {
    if (!amount) return 0
    return amount * taxRate
  }
  
  // === RETOUR DU COMPOSABLE ===
  
  return {
    // État
    revenues,
    currentRevenue,
    pagination,
    filters,
    stats,
    categories,
    error,
    validationErrors,
    
    // États de chargement
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    isLoadingStats,
    isLoadingCategories,
    hasError,
    
    // Getters
    hasRevenues,
    hasStats,
    hasCategories,
    draftRevenues,
    confirmedRevenues,
    cancelledRevenues,
    paidRevenues,
    pendingRevenues,
    overdueRevenues,
    revenuesByCategory,
    totalAmount,
    totalPaidAmount,
    totalPendingAmount,
    activeFiltersCount,
    
    // Hooks TanStack Query
    useRevenuesList,
    useRevenue,
    useSearchRevenues,
    useRevenueStats,
    useRevenueCategories,
    
    // Actions
    loadRevenues,
    loadRevenue,
    createRevenue,
    updateRevenue,
    deleteRevenue,
    searchRevenues,
    loadStats,
    loadCategories,
    validateRevenue,
    approveRevenue,
    rejectRevenue,
    exportRevenues,
    updateFilters,
    resetFilters,
    setCurrentRevenue,
    clearCurrentRevenue,
    clearError,
    resetStore,
    
    // Utilitaires
    formatAmount,
    formatDate,
    formatShortDate,
    getStatusLabel,
    getStatusColor,
    getPaymentStatusLabel,
    getPaymentStatusColor,
    getCategoryLabel,
    getCategoryIcon,
    validateRevenueData,
    calculateTotalAmount,
    calculateTaxAmount
  }
}

export default useRevenues
