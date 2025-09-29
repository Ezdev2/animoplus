import { computed, ref } from 'vue'
import { useStocksStore } from '@/stores/stocks.js'
import { 
  useStocksQuery,
  useMyStocksQuery,
  useStockQuery,
  useCreateStock,
  useUpdateStock,
  useDeleteStock,
  useSearchStocksQuery
} from '@/services/stocks/stockQueries.js'

/**
 * Composable pour la gestion des stocks
 * Combine le store Pinia et les hooks TanStack Query
 */
export const useStocks = () => {
  const store = useStocksStore()

  // État local pour les options de requête
  const queryOptions = ref({
    page: 1,
    per_page: 15,
    search: '',
    actif_id: '',
    user_id: '',
    active_only: true,
    low_stock: null,
    expiring_soon: null,
    expired: null,
    min_quantity: '',
    max_quantity: '',
    min_price: '',
    max_price: '',
    lot_numero: '',
    date_expiration_before: '',
    date_expiration_after: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    with_actif: true,
    with_user: true
  })

  // Getters calculés depuis le store
  const stocks = computed(() => store.getStocks)
  const currentStock = computed(() => store.getCurrentStock)
  const isLoading = computed(() => store.getIsLoading)
  const error = computed(() => store.getError)
  const filters = computed(() => store.getFilters)
  const pagination = computed(() => store.getPagination)

  // Getters filtrés
  const activeStocks = computed(() => store.getActiveStocks)
  const inactiveStocks = computed(() => store.getInactiveStocks)

  // Hooks TanStack Query - seulement les essentiels
  const stocksQuery = useStocksQuery(queryOptions)
  const myStocksQuery = useMyStocksQuery(queryOptions)
  // Mutations essentielles
  const createStockMutation = useCreateStock()
  const updateStockMutation = useUpdateStock()
  const deleteStockMutation = useDeleteStock()

  // Actions du store - seulement les essentielles
  const {
    fetchStocks,
    fetchMyStocks,
    fetchStockById,
    setFilters,
    resetFilters,
    resetStore
  } = store

  // Fonctions utilitaires
  const getStockById = (id) => {
    return store.getStockById(id)
  }

  const refreshStocks = () => {
    return stocksQuery.refetch()
  }

  const refreshMyStocks = () => {
    return myStocksQuery.refetch()
  }

  // Actions combinées (store + mutations)
  const createStock = async (stockData) => {
    try {
      const result = await createStockMutation.mutateAsync(stockData)
      
      // Mettre à jour le store Pinia avec le nouveau stock
      if (result.success && result.data) {
        console.log('📝 Ajout du nouveau stock au store Pinia:', result.data)
        store.addStock(result.data)
      }
      
      return result
    } catch (error) {
      console.error('❌ Erreur création stock:', error)
      throw error
    }
  }

  const updateStock = async (id, stockData) => {
    try {
      const result = await updateStockMutation.mutateAsync({ id, stockData })
      
      // Mettre à jour le store Pinia avec le stock modifié
      if (result.success && result.data) {
        console.log('📝 Mise à jour du stock dans le store Pinia:', result.data)
        store.updateStock(result.data)
      }
      
      return result
    } catch (error) {
      console.error('❌ Erreur mise à jour stock:', error)
      throw error
    }
  }

  const deleteStock = async (id) => {
    try {
      const result = await deleteStockMutation.mutateAsync(id)
      
      // Supprimer le stock du store Pinia
      if (result.success) {
        console.log('🗑️ Suppression du stock du store Pinia:', id)
        store.removeStock(id)
      }
      
      return result
    } catch (error) {
      console.error('❌ Erreur suppression stock:', error)
      throw error
    }
  }

  const bulkUpdateStocks = async (stocksData) => {
    try {
      const result = await bulkUpdateMutation.mutateAsync(stocksData)
      
      // Recharger les stocks après mise à jour en lot
      if (result.success) {
        await refreshStocks()
      }
      
      return result
    } catch (error) {
      console.error('❌ Erreur mise à jour en lot stocks:', error)
      throw error
    }
  }

  const bulkDeleteStocks = async (stockIds) => {
    try {
      const result = await bulkDeleteMutation.mutateAsync(stockIds)
      
      // Supprimer les stocks du store Pinia
      if (result.success) {
        stockIds.forEach(stockId => {
          store.removeStock(stockId)
        })
      }
      
      return result
    } catch (error) {
      console.error('❌ Erreur suppression en lot stocks:', error)
      throw error
    }
  }

  // Fonctions de filtrage et tri
  const updateQueryOptions = (newOptions) => {
    queryOptions.value = { ...queryOptions.value, ...newOptions }
  }

  const search = (searchTerm) => {
    updateQueryOptions({ search: searchTerm })
    setFilters({ search: searchTerm })
  }

  const filterByActif = (actifId) => {
    updateQueryOptions({ actif_id: actifId })
    setFilters({ actif_id: actifId })
  }

  const filterByStatus = (isActive) => {
    updateQueryOptions({ active_only: isActive })
    setFilters({ active_only: isActive })
  }

  const filterByLowStock = (lowStock) => {
    updateQueryOptions({ low_stock: lowStock })
    setFilters({ low_stock: lowStock })
  }

  const filterByExpiring = (expiringSoon) => {
    updateQueryOptions({ expiring_soon: expiringSoon })
    setFilters({ expiring_soon: expiringSoon })
  }

  const filterByQuantity = (minQuantity, maxQuantity) => {
    updateQueryOptions({ 
      min_quantity: minQuantity, 
      max_quantity: maxQuantity 
    })
    setFilters({ 
      min_quantity: minQuantity, 
      max_quantity: maxQuantity 
    })
  }

  const filterByPrice = (minPrice, maxPrice) => {
    updateQueryOptions({ 
      min_price: minPrice, 
      max_price: maxPrice 
    })
    setFilters({ 
      min_price: minPrice, 
      max_price: maxPrice 
    })
  }

  const filterByExpirationDate = (dateBefore, dateAfter) => {
    updateQueryOptions({ 
      date_expiration_before: dateBefore,
      date_expiration_after: dateAfter
    })
    setFilters({ 
      date_expiration_before: dateBefore,
      date_expiration_after: dateAfter
    })
  }

  const sort = (sortBy, sortOrder = 'desc') => {
    updateQueryOptions({ sort_by: sortBy, sort_order: sortOrder })
    setFilters({ sort_by: sortBy, sort_order: sortOrder })
  }

  const changePage = (page) => {
    updateQueryOptions({ page })
  }

  const changePerPage = (perPage) => {
    updateQueryOptions({ per_page: perPage, page: 1 })
  }

  // Utilitaires de validation
  const validateStockData = (stockData) => {
    const errors = []
    
    if (!stockData.actif_id) {
      errors.push('L\'actif est requis')
    }
    
    if (!stockData.quantite || stockData.quantite <= 0) {
      errors.push('La quantité doit être supérieure à 0')
    }
    
    if (!stockData.prix_unitaire || stockData.prix_unitaire <= 0) {
      errors.push('Le prix unitaire doit être supérieur à 0')
    }
    
    if (stockData.date_expiration && new Date(stockData.date_expiration) <= new Date()) {
      errors.push('La date d\'expiration ne peut pas être dans le passé')
    }
    
    if (stockData.seuil_alerte && stockData.seuil_alerte < 0) {
      errors.push('Le seuil d\'alerte ne peut pas être négatif')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Utilitaires de formatage
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }

  const formatQuantity = (quantity, unit = 'unité(s)') => {
    return `${quantity} ${unit}`
  }

  const formatExpirationDate = (expirationDate) => {
    if (!expirationDate) return 'Aucune date d\'expiration'
    
    const date = new Date(expirationDate)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `Expiré depuis ${Math.abs(diffDays)} jour(s)`
    } else if (diffDays === 0) {
      return 'Expire aujourd\'hui'
    } else if (diffDays === 1) {
      return 'Expire demain'
    } else if (diffDays <= 30) {
      return `Expire dans ${diffDays} jour(s)`
    } else {
      return date.toLocaleDateString('fr-FR')
    }
  }

  const getStockStatus = (stock) => {
    if (!stock.is_active) return 'inactive'
    if (stock.date_expiration && new Date(stock.date_expiration) <= new Date()) return 'expired'
    if (stock.seuil_alerte && stock.quantite <= stock.seuil_alerte) return 'low_stock'
    if (stock.date_expiration) {
      const daysUntilExpiration = Math.ceil((new Date(stock.date_expiration) - new Date()) / (1000 * 60 * 60 * 24))
      if (daysUntilExpiration <= 30) return 'expiring_soon'
    }
    return 'active'
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-600 bg-green-100',
      inactive: 'text-gray-600 bg-gray-100',
      low_stock: 'text-orange-600 bg-orange-100',
      expiring_soon: 'text-yellow-600 bg-yellow-100',
      expired: 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      low_stock: 'Stock faible',
      expiring_soon: 'Expire bientôt',
      expired: 'Expiré'
    }
    return labels[status] || 'Inconnu'
  }

  // Statistiques calculées
  const getCompletionRate = computed(() => {
    if (stats.value.total === 0) return 0
    return Math.round((stats.value.active / stats.value.total) * 100)
  })

  const getAlertRate = computed(() => {
    if (stats.value.total === 0) return 0
    const alertCount = stats.value.low_stock + stats.value.expiring_soon + stats.value.expired
    return Math.round((alertCount / stats.value.total) * 100)
  })

  // Hook pour un stock spécifique
  const useStock = (stockId) => {
    const stockQuery = useStockQuery(stockId)
    
    return {
      stock: computed(() => stockQuery.data?.value?.data),
      isLoading: computed(() => stockQuery.isLoading?.value),
      error: computed(() => stockQuery.error?.value),
      refetch: stockQuery.refetch
    }
  }

  // Hook pour recherche de stocks
  const useSearchStocks = (searchTerm) => {
    const searchQuery = useSearchStocksQuery(searchTerm)
    
    return {
      results: computed(() => searchQuery.data?.value?.data || []),
      isLoading: computed(() => searchQuery.isLoading?.value),
      error: computed(() => searchQuery.error?.value),
      refetch: searchQuery.refetch
    }
  }

  // Hook pour stocks par actif
  const useStocksByActif = (actifId) => {
    const stocksByActifQuery = useStocksByActifQuery(actifId)
    
    return {
      stocks: computed(() => stocksByActifQuery.data?.value?.data || []),
      isLoading: computed(() => stocksByActifQuery.isLoading?.value),
      error: computed(() => stocksByActifQuery.error?.value),
      refetch: stocksByActifQuery.refetch
    }
  }

  // Hook pour historique d'un stock
  const useStockHistory = (stockId) => {
    const historyQuery = useStockHistoryQuery(stockId)
    
    return {
      history: computed(() => historyQuery.data?.value?.data || []),
      isLoading: computed(() => historyQuery.isLoading?.value),
      error: computed(() => historyQuery.error?.value),
      refetch: historyQuery.refetch
    }
  }

  // Hook pour mouvements de stocks
  const useStockMovements = () => {
    const movementsQuery = useStockMovementsQuery()
    
    return {
      movements: computed(() => movementsQuery.data?.value?.data || []),
      isLoading: computed(() => movementsQuery.isLoading?.value),
      error: computed(() => movementsQuery.error?.value),
      refetch: movementsQuery.refetch
    }
  }

  // Hook pour mes stocks (utilisateur connecté)
  const useMyStocks = (options = {}) => {
    const myStocksQueryLocal = useMyStocksQuery(options)
    
    return {
      stocks: computed(() => myStocksQueryLocal.data?.value?.data || []),
      pagination: computed(() => myStocksQueryLocal.data?.value?.pagination),
      isLoading: computed(() => myStocksQueryLocal.isLoading?.value),
      error: computed(() => myStocksQueryLocal.error?.value),
      refetch: myStocksQueryLocal.refetch
    }
  }

  return {
    // État essentiel
    stocks,
    currentStock,
    isLoading,
    error,
    filters,
    pagination,

    // Getters calculés
    activeStocks,
    inactiveStocks,

    // Queries principales
    stocksQuery,
    myStocksQuery,

    // Mutations essentielles
    createStockMutation,
    updateStockMutation,
    deleteStockMutation,

    // Actions principales
    createStock,
    updateStock,
    deleteStock,
    fetchStocks,
    fetchMyStocks,
    fetchStockById,
    refreshStocks,
    refreshMyStocks,

    // Utilitaires
    getStockById,
    setFilters,
    resetFilters,
    resetStore,

    // Hooks spécialisés
    useMyStocks
  }
}

export default useStocks
