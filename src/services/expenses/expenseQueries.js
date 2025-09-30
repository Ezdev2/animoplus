import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import expenseService from './expenseService.js'
import { useExpensesStore } from '@/stores/expenses.js'
import { useToast } from '@/composables/useToast.js'

/**
 * Clés de requête pour TanStack Query
 * Organisation hiérarchique pour une invalidation précise
 */
export const EXPENSE_QUERY_KEYS = {
  all: ['expenses'],
  lists: () => [...EXPENSE_QUERY_KEYS.all, 'list'],
  list: (filters) => [...EXPENSE_QUERY_KEYS.lists(), { filters }],
  details: () => [...EXPENSE_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...EXPENSE_QUERY_KEYS.details(), id],
  myExpenses: (options) => [...EXPENSE_QUERY_KEYS.all, 'my-expenses', { options }],
  search: (term, options) => [...EXPENSE_QUERY_KEYS.all, 'search', { term, options }],
  stats: () => [...EXPENSE_QUERY_KEYS.all, 'stats']
}

/**
 * Hook pour récupérer toutes les dépenses avec pagination et filtres
 * @param {Object} options - Options de requête (pagination, filtres)
 * @returns {Object} Query result
 */
export const useExpensesQuery = (options = {}) => {
  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.list(options),
    queryFn: () => expenseService.getExpenses(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les dépenses de l'utilisateur connecté
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useMyExpensesQuery = (options = {}) => {
  console.log('🔍 useMyExpensesQuery - options reçues:', options)
  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.myExpenses(options),
    queryFn: () => {
      console.log('🔍 useMyExpensesQuery - queryFn appelée avec options:', options)
      return expenseService.getMyExpenses(options)
    },
    enabled: true, // Forcer l'exécution
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer une dépense par ID
 * @param {string} expenseId - ID de la dépense
 * @returns {Object} Query result
 */
export const useExpenseQuery = (expenseId) => {
  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.detail(expenseId),
    queryFn: () => expenseService.getExpenseById(expenseId),
    enabled: !!expenseId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour rechercher des dépenses
 * @param {string} searchTerm - Terme de recherche
 * @param {Object} options - Options de recherche
 * @returns {Object} Query result
 */
export const useSearchExpensesQuery = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: EXPENSE_QUERY_KEYS.search(searchTerm, options),
    queryFn: () => expenseService.searchExpenses(searchTerm, options),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}


/**
 * Hook pour créer une dépense
 * @returns {Object} Mutation result
 */
export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  const expensesStore = useExpensesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (expenseData) => expenseService.createExpense(expenseData),
    onSuccess: (data) => {
      console.log('✅ Dépense créée avec succès:', data)
      
      // Mettre à jour le store Pinia avec la nouvelle dépense
      if (data.success && data.data) {
        console.log('📝 Ajout de la nouvelle dépense au store Pinia:', data.data)
        expensesStore.addExpense(data.data)
      }
      
      // Invalider tous les caches de dépenses pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.myExpenses() })
      
      console.log('🔄 Caches invalidés pour forcer le rechargement des dépenses')
      
      // Toast de succès
      showToast({
        type: 'success',
        message: data.message || 'Dépense créée avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur création dépense:', error)
      expensesStore.setError(error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la création de la dépense'
      })
    }
  })
}

/**
 * Hook pour mettre à jour une dépense
 * @returns {Object} Mutation result
 */
export const useUpdateExpense = () => {
  const queryClient = useQueryClient()
  const expensesStore = useExpensesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }) => expenseService.updateExpense(id, data),
    onSuccess: (data, { id }) => {
      console.log('✅ Dépense mise à jour avec succès:', data)
      
      // Mettre à jour le store Pinia avec la dépense modifiée
      if (data.success && data.data) {
        console.log('📝 Mise à jour de la dépense dans le store Pinia:', data.data)
        expensesStore.updateExpense(data.data)
      }
      
      // Invalider tous les caches de dépenses pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.myExpenses() })
      
      // Invalider spécifiquement le cache de la dépense modifiée
      queryClient.invalidateQueries({ 
        queryKey: EXPENSE_QUERY_KEYS.detail(id)
      })
      
      console.log('🔄 Caches invalidés pour forcer le rechargement des dépenses')
      
      showToast({
        type: 'success',
        message: data.message || 'Dépense modifiée avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur modification dépense:', error)
      expensesStore.setError(error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la modification'
      })
    }
  })
}

/**
 * Hook pour supprimer une dépense
 * @returns {Object} Mutation result
 */
export const useDeleteExpense = () => {
  const queryClient = useQueryClient()
  const expensesStore = useExpensesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (expenseId) => expenseService.deleteExpense(expenseId),
    onSuccess: (data, expenseId) => {
      console.log('✅ Dépense supprimée avec succès:', data)
      
      // Mettre à jour le store Pinia en supprimant la dépense
      if (data.success) {
        console.log('🗑️ Suppression de la dépense du store Pinia:', expenseId)
        expensesStore.removeExpense(expenseId)
      }
      
      // Mettre à jour le cache TanStack Query
      queryClient.setQueryData(EXPENSE_QUERY_KEYS.lists(), (oldData) => {
        if (!oldData || !oldData.data) return oldData
        
        const filteredExpenses = oldData.data.filter(expense => expense.id !== expenseId)
        
        return { ...oldData, data: filteredExpenses }
      })
      
      // Invalider les autres caches
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.myExpenses() })
      
      showToast({
        type: 'success',
        message: data.message || 'Dépense supprimée avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur suppression dépense:', error)
      expensesStore.setError(error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la suppression'
      })
    }
  })
}

/**
 * Hook pour changer le statut d'une dépense
 * @returns {Object} Mutation result
 */
export const useUpdateExpenseStatus = () => {
  const queryClient = useQueryClient()
  const expensesStore = useExpensesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ expenseId, status, reason }) => 
      expenseService.updateExpenseStatus(expenseId, status, reason),
    onSuccess: (data, { expenseId }) => {
      console.log('✅ Statut de dépense mis à jour avec succès:', data)
      
      // Mettre à jour le store Pinia avec la dépense modifiée
      if (data.success && data.data) {
        console.log('📝 Mise à jour du statut dans le store Pinia:', data.data)
        expensesStore.updateExpense(data.data)
      }
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.detail(expenseId) })
      
      showToast({
        type: 'success',
        message: data.message || 'Statut mis à jour avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur mise à jour statut:', error)
      expensesStore.setError(error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la mise à jour du statut'
      })
    }
  })
}

/**
 * Hook pour restaurer une dépense supprimée
 * @returns {Object} Mutation result
 */
export const useRestoreExpense = () => {
  const queryClient = useQueryClient()
  const expensesStore = useExpensesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (expenseId) => expenseService.restoreExpense(expenseId),
    onSuccess: (data, expenseId) => {
      console.log('✅ Dépense restaurée avec succès:', data)
      
      // Mettre à jour le store Pinia avec la dépense restaurée
      if (data.success && data.data) {
        console.log('♻️ Restauration de la dépense dans le store Pinia:', data.data)
        expensesStore.updateExpense(data.data)
      }
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: EXPENSE_QUERY_KEYS.detail(expenseId) })
      
      showToast({
        type: 'success',
        message: data.message || 'Dépense restaurée avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur restauration dépense:', error)
      expensesStore.setError(error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la restauration'
      })
    }
  })
}

export default {
  // Query hooks
  useExpensesQuery,
  useMyExpensesQuery,
  useExpenseQuery,
  useSearchExpensesQuery,
  
  // Mutation hooks
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
  useUpdateExpenseStatus,
  useRestoreExpense,
  
  // Query keys
  EXPENSE_QUERY_KEYS
}
