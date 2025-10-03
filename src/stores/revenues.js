import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { revenueService } from '@/services/revenues/revenueService.js'

/**
 * Store Pinia pour la gestion des revenus
 */
export const useRevenuesStore = defineStore('revenues', () => {
  // === ÉTAT RÉACTIF ===
  
  // Liste des revenus
  const revenues = ref([])
  const currentRevenue = ref(null)
  
  // Pagination
  const pagination = ref({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  })
  
  // Filtres actifs
  const filters = ref({
    search: '',
    category: '', // consultation, service, product_sale, subscription, training, surgery, vaccination, diagnostic, other
    status: '', // draft, confirmed, cancelled
    payment_status: '', // pending, paid, partial, overdue, cancelled
    start_date: null,
    end_date: null,
    min_amount: null,
    max_amount: null,
    user_id: null,
    client_id: null
  })
  
  // Statistiques et données agrégées
  const stats = ref({})
  const categories = ref([])
  
  // États de chargement
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  const isLoadingStats = ref(false)
  const isLoadingCategories = ref(false)
  
  // Gestion d'erreurs
  const error = ref(null)
  const validationErrors = ref({})
  
  // === GETTERS CALCULÉS ===
  
  const hasRevenues = computed(() => revenues.value.length > 0)
  const hasStats = computed(() => stats.value && Object.keys(stats.value).length > 0)
  const hasCategories = computed(() => categories.value.length > 0)
  
  // Revenus par statut
  const draftRevenues = computed(() => revenues.value.filter(r => r.status === 'draft'))
  const confirmedRevenues = computed(() => revenues.value.filter(r => r.status === 'confirmed'))
  const cancelledRevenues = computed(() => revenues.value.filter(r => r.status === 'cancelled'))
  
  // Revenus par statut de paiement
  const paidRevenues = computed(() => revenues.value.filter(r => r.payment_status === 'paid'))
  const pendingRevenues = computed(() => revenues.value.filter(r => r.payment_status === 'pending'))
  const overdueRevenues = computed(() => revenues.value.filter(r => r.payment_status === 'overdue'))
  
  // Revenus par catégorie
  const revenuesByCategory = computed(() => {
    const grouped = {}
    revenues.value.forEach(revenue => {
      const category = revenue.category || 'other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(revenue)
    })
    return grouped
  })
  
  // Totaux calculés
  const totalAmount = computed(() => 
    revenues.value.reduce((sum, revenue) => sum + (parseFloat(revenue.amount) || 0), 0)
  )
  
  const totalPaidAmount = computed(() => 
    paidRevenues.value.reduce((sum, revenue) => sum + (parseFloat(revenue.amount) || 0), 0)
  )
  
  const totalPendingAmount = computed(() => 
    pendingRevenues.value.reduce((sum, revenue) => sum + (parseFloat(revenue.amount) || 0), 0)
  )
  
  // Filtres actifs (pour l'affichage)
  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.value.search) count++
    if (filters.value.category) count++
    if (filters.value.status) count++
    if (filters.value.payment_status) count++
    if (filters.value.start_date) count++
    if (filters.value.end_date) count++
    if (filters.value.min_amount) count++
    if (filters.value.max_amount) count++
    return count
  })
  
  // === ACTIONS ===
  
  /**
   * Définir une erreur
   */
  const setError = (errorMessage) => {
    error.value = errorMessage
    console.error('💰 Erreur revenus:', errorMessage)
  }
  
  /**
   * Vider les erreurs
   */
  const clearError = () => {
    error.value = null
    validationErrors.value = {}
  }
  
  /**
   * Définir les erreurs de validation
   */
  const setValidationErrors = (errors) => {
    validationErrors.value = errors || {}
  }
  
  /**
   * Récupérer tous les revenus avec filtres
   */
  const fetchRevenues = async (options = {}) => {
    isLoading.value = true
    clearError()
    
    try {
      console.log('💰 Récupération des revenus')
      const response = await revenueService.getAllRevenues({
        ...filters.value,
        ...options
      })
      
      if (response.success) {
        revenues.value = response.data
        pagination.value = response.pagination
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des revenus'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Récupérer un revenu par ID
   */
  const fetchRevenueById = async (revenueId, options = {}) => {
    isLoading.value = true
    clearError()
    
    try {
      console.log('💰 Récupération revenu par ID:', revenueId)
      const response = await revenueService.getRevenueById(revenueId, options)
      
      if (response.success) {
        currentRevenue.value = response.data
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération du revenu'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Créer un nouveau revenu
   */
  const createRevenue = async (revenueData) => {
    isCreating.value = true
    clearError()
    setValidationErrors({})
    
    try {
      console.log('💰 Création revenu')
      const response = await revenueService.createRevenue(revenueData)
      
      if (response.success) {
        // Ajouter le nouveau revenu à la liste
        revenues.value.unshift(response.data)
        // Mettre à jour la pagination
        pagination.value.total += 1
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        setValidationErrors(response.errors)
        return { success: false, error: response.error, errors: response.errors }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la création du revenu'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isCreating.value = false
    }
  }
  
  /**
   * Mettre à jour un revenu
   */
  const updateRevenue = async (revenueId, revenueData) => {
    isUpdating.value = true
    clearError()
    setValidationErrors({})
    
    try {
      console.log('💰 Mise à jour revenu:', revenueId)
      const response = await revenueService.updateRevenue(revenueId, revenueData)
      
      if (response.success) {
        // Mettre à jour le revenu dans la liste
        const index = revenues.value.findIndex(r => r.id === revenueId)
        if (index !== -1) {
          revenues.value[index] = response.data
        }
        // Mettre à jour le revenu courant si c'est le même
        if (currentRevenue.value?.id === revenueId) {
          currentRevenue.value = response.data
        }
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        setValidationErrors(response.errors)
        return { success: false, error: response.error, errors: response.errors }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la mise à jour du revenu'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isUpdating.value = false
    }
  }
  
  /**
   * Supprimer un revenu
   */
  const deleteRevenue = async (revenueId) => {
    isDeleting.value = true
    clearError()
    
    try {
      console.log('💰 Suppression revenu:', revenueId)
      const response = await revenueService.deleteRevenue(revenueId)
      
      if (response.success) {
        // Retirer le revenu de la liste
        revenues.value = revenues.value.filter(r => r.id !== revenueId)
        // Vider le revenu courant si c'est le même
        if (currentRevenue.value?.id === revenueId) {
          currentRevenue.value = null
        }
        // Mettre à jour la pagination
        pagination.value.total -= 1
        return { success: true }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la suppression du revenu'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isDeleting.value = false
    }
  }
  
  /**
   * Rechercher des revenus
   */
  const searchRevenues = async (searchTerm, options = {}) => {
    isLoading.value = true
    clearError()
    
    try {
      console.log('🔍 Recherche revenus:', searchTerm)
      const response = await revenueService.searchRevenues(searchTerm, options)
      
      if (response.success) {
        revenues.value = response.data
        pagination.value = response.pagination || pagination.value
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la recherche'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Récupérer les statistiques des revenus
   */
  const fetchStats = async (options = {}) => {
    isLoadingStats.value = true
    clearError()
    
    try {
      console.log('📊 Récupération statistiques revenus')
      const response = await revenueService.getRevenueStats(options)
      
      if (response.success) {
        stats.value = response.data
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
   * Récupérer les catégories de revenus
   */
  const fetchCategories = async () => {
    isLoadingCategories.value = true
    clearError()
    
    try {
      console.log('📋 Récupération catégories revenus')
      const response = await revenueService.getRevenueCategories()
      
      if (response.success) {
        categories.value = response.data
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des catégories'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoadingCategories.value = false
    }
  }
  
  /**
   * Valider un revenu
   */
  const validateRevenue = async (revenueId) => {
    isUpdating.value = true
    clearError()
    
    try {
      console.log('✅ Validation revenu:', revenueId)
      const response = await revenueService.validateRevenue(revenueId)
      
      if (response.success) {
        // Mettre à jour le revenu dans la liste
        const index = revenues.value.findIndex(r => r.id === revenueId)
        if (index !== -1) {
          revenues.value[index] = response.data
        }
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la validation du revenu'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isUpdating.value = false
    }
  }
  
  /**
   * Approuver un revenu
   */
  const approveRevenue = async (revenueId) => {
    isUpdating.value = true
    clearError()
    
    try {
      console.log('✅ Approbation revenu:', revenueId)
      const response = await revenueService.approveRevenue(revenueId)
      
      if (response.success) {
        // Mettre à jour le revenu dans la liste
        const index = revenues.value.findIndex(r => r.id === revenueId)
        if (index !== -1) {
          revenues.value[index] = response.data
        }
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de l\'approbation du revenu'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isUpdating.value = false
    }
  }
  
  /**
   * Rejeter un revenu
   */
  const rejectRevenue = async (revenueId, data = {}) => {
    isUpdating.value = true
    clearError()
    
    try {
      console.log('❌ Rejet revenu:', revenueId)
      const response = await revenueService.rejectRevenue(revenueId, data)
      
      if (response.success) {
        // Mettre à jour le revenu dans la liste
        const index = revenues.value.findIndex(r => r.id === revenueId)
        if (index !== -1) {
          revenues.value[index] = response.data
        }
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors du rejet du revenu'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isUpdating.value = false
    }
  }
  
  /**
   * Mettre à jour les filtres
   */
  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    filters.value = {
      search: '',
      category: '',
      status: '',
      payment_status: '',
      start_date: null,
      end_date: null,
      min_amount: null,
      max_amount: null,
      user_id: null,
      client_id: null
    }
  }
  
  /**
   * Définir le revenu courant
   */
  const setCurrentRevenue = (revenue) => {
    currentRevenue.value = revenue
  }
  
  /**
   * Vider le revenu courant
   */
  const clearCurrentRevenue = () => {
    currentRevenue.value = null
  }
  
  /**
   * Réinitialiser le store
   */
  const resetState = () => {
    revenues.value = []
    currentRevenue.value = null
    pagination.value = {
      current_page: 1,
      per_page: 15,
      total: 0,
      last_page: 1
    }
    stats.value = {}
    categories.value = []
    error.value = null
    validationErrors.value = {}
    resetFilters()
  }
  
  // === RETOUR DU STORE ===
  
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
    
    // Actions
    fetchRevenues,
    fetchRevenueById,
    createRevenue,
    updateRevenue,
    deleteRevenue,
    searchRevenues,
    fetchStats,
    fetchCategories,
    validateRevenue,
    approveRevenue,
    rejectRevenue,
    updateFilters,
    resetFilters,
    setCurrentRevenue,
    clearCurrentRevenue,
    resetState,
    clearError
  }
})

export default useRevenuesStore
