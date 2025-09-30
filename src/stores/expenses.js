import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import expenseService from '@/services/expenses/expenseService.js'

/**
 * Store Pinia pour la gestion des dépenses (expenses)
 * Fournit l'état global et les actions CRUD pour les dépenses
 */
export const useExpensesStore = defineStore('expenses', () => {
  
  // État réactif
  const expenses = ref([])
  const currentExpense = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)

  // Filtres et pagination
  const filters = ref({
    category: '',
    status: '',
    tax_deductible: null,
    start_date: '',
    end_date: '',
    min_amount: '',
    max_amount: '',
    search: '',
    sort_by: 'date',
    sort_order: 'desc'
  })

  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  })

  // Statistiques
  const stats = ref({
    total_expenses: 0,
    total_amount: 0,
    approved_amount: 0,
    pending_amount: 0,
    rejected_amount: 0,
    tax_deductible_amount: 0,
    by_category: {},
    by_status: {}
  })

  // Getters
  const getExpenses = computed(() => expenses.value)
  const getCurrentExpense = computed(() => currentExpense.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)
  const getFilters = computed(() => filters.value)
  const getPagination = computed(() => pagination.value)
  const getStats = computed(() => stats.value)

  // Getters calculés
  const getActiveExpenses = computed(() => {
    return expenses.value.filter(expense => expense.status !== 'deleted')
  })

  const getApprovedExpenses = computed(() => {
    return expenses.value.filter(expense => expense.status === 'approved')
  })

  const getPendingExpenses = computed(() => {
    return expenses.value.filter(expense => expense.status === 'pending')
  })

  const getRejectedExpenses = computed(() => {
    return expenses.value.filter(expense => expense.status === 'rejected')
  })

  const getTaxDeductibleExpenses = computed(() => {
    return expenses.value.filter(expense => expense.tax_deductible === true)
  })

  const getExpensesByCategory = computed(() => {
    const grouped = {}
    expenses.value.forEach(expense => {
      const category = expense.category || 'uncategorized'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(expense)
    })
    return grouped
  })

  const getTotalAmount = computed(() => {
    return expenses.value.reduce((total, expense) => {
      return total + (parseFloat(expense.amount) || 0)
    }, 0)
  })

  const getExpenseById = computed(() => {
    return (id) => expenses.value.find(expense => expense.id === id)
  })

  // Validation du cache
  const isCacheValid = computed(() => {
    if (!lastFetch.value || expenses.value.length === 0) return false
    const now = new Date()
    const cacheAge = now.getTime() - new Date(lastFetch.value).getTime()
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
    return cacheAge < CACHE_DURATION
  })

  // Actions - Mutations d'état
  const setExpenses = (newExpenses) => {
    expenses.value = Array.isArray(newExpenses) ? newExpenses : []
    lastFetch.value = new Date().toISOString()
    updateStats()
    console.log('📝 Dépenses mises à jour dans le store:', expenses.value.length)
  }

  const addExpense = (expense) => {
    if (expense && expense.id) {
      // Vérifier si la dépense existe déjà
      const existingIndex = expenses.value.findIndex(e => e.id === expense.id)
      if (existingIndex === -1) {
        expenses.value.unshift(expense) // Ajouter au début
        updateStats()
        console.log('➕ Dépense ajoutée au store:', expense.description || expense.id)
      } else {
        console.log('⚠️ Dépense déjà existante dans le store:', expense.id)
      }
    }
  }

  const updateExpense = (updatedExpense) => {
    if (updatedExpense && updatedExpense.id) {
      const index = expenses.value.findIndex(e => e.id === updatedExpense.id)
      if (index !== -1) {
        expenses.value[index] = { ...expenses.value[index], ...updatedExpense }
        updateStats()
        console.log('✏️ Dépense mise à jour dans le store:', updatedExpense.description || updatedExpense.id)
      } else {
        console.log('⚠️ Dépense non trouvée pour mise à jour:', updatedExpense.id)
      }
    }
  }

  const removeExpense = (expenseId) => {
    const index = expenses.value.findIndex(e => e.id === expenseId)
    if (index !== -1) {
      const removedExpense = expenses.value.splice(index, 1)[0]
      updateStats()
      console.log('🗑️ Dépense supprimée du store:', removedExpense.description || expenseId)
      return removedExpense
    } else {
      console.log('⚠️ Dépense non trouvée pour suppression:', expenseId)
      return null
    }
  }

  const setCurrentExpense = (expense) => {
    currentExpense.value = expense
    console.log('📌 Dépense courante définie:', expense?.id || 'null')
  }

  const clearCurrentExpense = () => {
    currentExpense.value = null
    console.log('🧹 Dépense courante effacée')
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
    console.log('❌ Erreur définie dans le store:', errorMessage)
  }

  const clearError = () => {
    error.value = null
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    console.log('🔍 Filtres mis à jour:', newFilters)
  }

  const resetFilters = () => {
    filters.value = {
      category: '',
      status: '',
      tax_deductible: null,
      start_date: '',
      end_date: '',
      min_amount: '',
      max_amount: '',
      search: '',
      sort_by: 'date',
      sort_order: 'desc'
    }
    console.log('🔄 Filtres réinitialisés')
  }

  const setPagination = (paginationData) => {
    pagination.value = { ...pagination.value, ...paginationData }
  }

  const setStats = (statsData) => {
    stats.value = { ...stats.value, ...statsData }
  }

  // Fonction pour mettre à jour les statistiques automatiquement
  const updateStats = () => {
    const totalExpenses = expenses.value.length
    const totalAmount = expenses.value.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
    const approvedAmount = expenses.value
      .filter(e => e.status === 'approved')
      .reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
    const pendingAmount = expenses.value
      .filter(e => e.status === 'pending')
      .reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
    const rejectedAmount = expenses.value
      .filter(e => e.status === 'rejected')
      .reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)
    const taxDeductibleAmount = expenses.value
      .filter(e => e.tax_deductible === true)
      .reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0)

    // Groupement par catégorie
    const byCategory = {}
    expenses.value.forEach(expense => {
      const category = expense.category || 'uncategorized'
      byCategory[category] = (byCategory[category] || 0) + (parseFloat(expense.amount) || 0)
    })

    // Groupement par statut
    const byStatus = {}
    expenses.value.forEach(expense => {
      const status = expense.status || 'unknown'
      byStatus[status] = (byStatus[status] || 0) + 1
    })

    stats.value = {
      total_expenses: totalExpenses,
      total_amount: totalAmount,
      approved_amount: approvedAmount,
      pending_amount: pendingAmount,
      rejected_amount: rejectedAmount,
      tax_deductible_amount: taxDeductibleAmount,
      by_category: byCategory,
      by_status: byStatus
    }
  }

  // Actions API
  const fetchExpenses = async (options = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await expenseService.getExpenses(options)
      
      if (response.success) {
        setExpenses(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchExpenses store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchMyExpenses = async (options = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await expenseService.getMyExpenses(options)
      
      if (response.success) {
        setExpenses(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchMyExpenses store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchExpenseById = async (expenseId) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await expenseService.getExpenseById(expenseId)
      
      if (response.success) {
        setCurrentExpense(response.data)
        // Mettre à jour dans la liste si elle existe
        updateExpense(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchExpenseById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createExpense = async (expenseData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await expenseService.createExpense(expenseData)
      
      if (response.success) {
        addExpense(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur createExpense store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateExpenseById = async (expenseId, updateData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await expenseService.updateExpense(expenseId, updateData)
      
      if (response.success) {
        updateExpense(response.data)
        if (currentExpense.value?.id === expenseId) {
          setCurrentExpense(response.data)
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur updateExpenseById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteExpenseById = async (expenseId) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await expenseService.deleteExpense(expenseId)
      
      if (response.success) {
        removeExpense(expenseId)
        if (currentExpense.value?.id === expenseId) {
          clearCurrentExpense()
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur deleteExpenseById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateExpenseStatus = async (expenseId, status, reason = null) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await expenseService.updateExpenseStatus(expenseId, status, reason)
      
      if (response.success) {
        updateExpense(response.data)
        if (currentExpense.value?.id === expenseId) {
          setCurrentExpense(response.data)
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur updateExpenseStatus store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const restoreExpense = async (expenseId) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await expenseService.restoreExpense(expenseId)
      
      if (response.success) {
        updateExpense(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur restoreExpense store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const searchExpenses = async (searchTerm, options = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await expenseService.searchExpenses(searchTerm, options)
      
      if (response.success) {
        // Pour la recherche, on ne remplace pas la liste principale
        // On retourne juste les résultats
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur searchExpenses store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }


  // Utilitaires
  const resetStore = () => {
    expenses.value = []
    currentExpense.value = null
    error.value = null
    lastFetch.value = null
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    }
    stats.value = {
      total_expenses: 0,
      total_amount: 0,
      approved_amount: 0,
      pending_amount: 0,
      rejected_amount: 0,
      tax_deductible_amount: 0,
      by_category: {},
      by_status: {}
    }
    resetFilters()
    console.log('🔄 Store expenses réinitialisé')
  }

  const clearExpenses = () => {
    expenses.value = []
    lastFetch.value = null
  }

  return {
    // État
    expenses,
    currentExpense,
    isLoading,
    error,
    filters,
    pagination,
    stats,
    lastFetch,

    // Getters
    getExpenses,
    getCurrentExpense,
    getIsLoading,
    getError,
    getFilters,
    getPagination,
    getStats,
    getActiveExpenses,
    getApprovedExpenses,
    getPendingExpenses,
    getRejectedExpenses,
    getTaxDeductibleExpenses,
    getExpensesByCategory,
    getTotalAmount,
    getExpenseById,
    isCacheValid,

    // Actions
    setExpenses,
    addExpense,
    updateExpense,
    removeExpense,
    setCurrentExpense,
    clearCurrentExpense,
    setLoading,
    setError,
    clearError,
    setFilters,
    resetFilters,
    setPagination,
    setStats,

    // Actions API
    fetchMyExpenses,
    fetchExpenseById,
    createExpense,
    updateExpenseById,
    deleteExpenseById,
    updateExpenseStatus,
    restoreExpense,
    searchExpenses,

    // Utilitaires
    resetStore,
    clearExpenses
  }
})

export default useExpensesStore
