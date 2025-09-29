import { computed, ref } from 'vue'
import { useExpensesStore } from '@/stores/expenses.js'
// Plus besoin des hooks TanStack Query - on utilise directement le store comme useStocks

/**
 * Composable pour la gestion des dépenses
 * Combine le store Pinia et les hooks TanStack Query
 */
export const useExpenses = () => {
  const store = useExpensesStore()

  // État local pour les options de requête
  const queryOptions = ref({
    page: 1,
    per_page: 15,
    category: '',
    status: '',
    tax_deductible: null,
    start_date: '',
    end_date: '',
    min_amount: '',
    max_amount: '',
    search: '',
    sort_by: 'date',
    sort_order: 'desc',
    with_user: true,
    with_receipts: false
  })

  // Getters calculés depuis le store (comme useStocks)
  const expenses = computed(() => store.getExpenses)
  const currentExpense = computed(() => store.getCurrentExpense)
  const isLoading = computed(() => store.getIsLoading)
  const error = computed(() => store.getError)
  const filters = computed(() => store.getFilters)
  const pagination = computed(() => store.getPagination)
  const stats = computed(() => store.getStats)

  // Getters filtrés
  const activeExpenses = computed(() => store.getActiveExpenses)
  const approvedExpenses = computed(() => store.getApprovedExpenses)
  const pendingExpenses = computed(() => store.getPendingExpenses)
  const rejectedExpenses = computed(() => store.getRejectedExpenses)
  const taxDeductibleExpenses = computed(() => store.getTaxDeductibleExpenses)
  const expensesByCategory = computed(() => store.getExpensesByCategory)
  const totalAmount = computed(() => store.getTotalAmount)

  // Actions du store (comme useStocks)
  const {
    fetchMyExpenses,
    fetchExpenseById,
    createExpense: createExpenseStore,
    updateExpenseById,
    deleteExpenseById,
    updateExpenseStatus,
    setFilters,
    resetFilters,
    resetStore
  } = store

  // Actions simplifiées (comme useStocks)
  const createExpense = async (expenseData) => {
    return await createExpenseStore(expenseData)
  }

  const updateExpense = async (expenseId, updateData) => {
    return await updateExpenseById(expenseId, updateData)
  }

  const deleteExpense = async (expenseId) => {
    return await deleteExpenseById(expenseId)
  }

  const refreshMyExpenses = async (options = {}) => {
    return await fetchMyExpenses(options)
  }

  // Fonctions utilitaires
  const getExpenseById = (id) => {
    return expenses.value.find(expense => expense.id === id)
  }

  const validateExpenseData = (expenseData) => {
    const errors = {}

    if (!expenseData.amount || expenseData.amount <= 0) {
      errors.amount = 'Le montant est requis et doit être supérieur à 0'
    }

    if (!expenseData.category) {
      errors.category = 'La catégorie est requise'
    }

    if (!expenseData.description || expenseData.description.trim().length < 3) {
      errors.description = 'La description est requise (minimum 3 caractères)'
    }

    if (!expenseData.date) {
      errors.date = 'La date est requise'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Fonctions de formatage
  const formatAmount = (amount) => {
    if (!amount) return '0,00 €'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
  }

  const formatCategory = (category) => {
    if (!category) return 'Non catégorisé'
    return category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')
  }

  const getCategoryLabel = (category) => {
    const categoryLabels = {
      medical: 'Médical',
      equipment: 'Équipement',
      supplies: 'Fournitures',
      transport: 'Transport',
      office: 'Bureau',
      marketing: 'Marketing',
      training: 'Formation',
      other: 'Autre'
    }
    return categoryLabels[category] || category
  }

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: 'En attente',
      approved: 'Approuvée',
      rejected: 'Rejetée',
      draft: 'Brouillon'
    }
    return statusLabels[status] || status
  }

  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red',
      draft: 'gray'
    }
    return statusColors[status] || 'gray'
  }

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      medical: '🏥',
      equipment: '🔧',
      supplies: '📦',
      transport: '🚗',
      office: '🏢',
      marketing: '📢',
      training: '📚',
      other: '📄'
    }
    return categoryIcons[category] || '📄'
  }

  // Hook spécialisé pour une dépense spécifique
  const useExpense = (expenseId) => {
    return useExpenseQuery(expenseId)
  }

  // Hook spécialisé pour la recherche
  const useSearchExpenses = (searchTerm, options = {}) => {
    return useSearchExpensesQuery(searchTerm, options)
  }

  // Hook pour mes dépenses
  const useMyExpenses = () => {
    return myExpensesQuery
  }

  return {
    // État essentiel
    expenses,
    currentExpense,
    isLoading,
    error,
    filters,
    pagination,

    // Getters calculés
    activeExpenses,
    approvedExpenses,
    pendingExpenses,
    rejectedExpenses,
    taxDeductibleExpenses,
    expensesByCategory,
    totalAmount,

    // Actions principales
    createExpense,
    updateExpense,
    deleteExpense,
    updateExpenseStatus,
    fetchMyExpenses,
    fetchExpenseById,
    refreshMyExpenses,

    // Utilitaires
    getExpenseById,
    validateExpenseData,
    formatAmount,
    formatDate,
    formatCategory,
    getCategoryLabel,
    getStatusLabel,
    getStatusColor,
    getCategoryIcon,
    setFilters,
    resetFilters,
    resetStore
  }
}

export default useExpenses
