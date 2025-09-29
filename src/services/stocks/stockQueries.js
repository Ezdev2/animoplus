import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { stockService } from './stockService.js'
import { useStocksStore } from '@/stores/stocks.js'
import { useToast } from '@/composables/useToast.js'

// Clés de requête pour les stocks
export const STOCK_QUERY_KEYS = {
  all: ['stocks'],
  lists: () => [...STOCK_QUERY_KEYS.all, 'list'],
  list: (filters) => [...STOCK_QUERY_KEYS.lists(), { filters }],
  myStocks: (filters) => [...STOCK_QUERY_KEYS.all, 'my-stocks', { filters }],
  details: () => [...STOCK_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...STOCK_QUERY_KEYS.details(), id],
  search: (searchTerm, options) => [...STOCK_QUERY_KEYS.all, 'search', searchTerm, options],
  lowStock: () => [...STOCK_QUERY_KEYS.all, 'low-stock'],
  expiringSoon: () => [...STOCK_QUERY_KEYS.all, 'expiring-soon'],
  expired: () => [...STOCK_QUERY_KEYS.all, 'expired'],
  byActif: (actifId) => [...STOCK_QUERY_KEYS.all, 'by-actif', actifId],
  stats: () => [...STOCK_QUERY_KEYS.all, 'stats'],
  summary: () => [...STOCK_QUERY_KEYS.all, 'summary'],
  history: (id) => [...STOCK_QUERY_KEYS.all, 'history', id],
  movements: () => [...STOCK_QUERY_KEYS.all, 'movements'],
  alerts: () => [...STOCK_QUERY_KEYS.all, 'alerts']
}

/**
 * Hook pour récupérer la liste des stocks
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useStocksQuery = (options = {}) => {
  return useQuery({
    queryKey: STOCK_QUERY_KEYS.list(options),
    queryFn: () => stockService.getAllStocks(options),
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
 * Hook pour récupérer les stocks de l'utilisateur connecté
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useMyStocksQuery = (options = {}) => {
  return useQuery({
    queryKey: STOCK_QUERY_KEYS.myStocks(options),
    queryFn: () => stockService.getMyStocks(options),
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
 * Hook pour récupérer un stock par ID
 * @param {string} stockId - ID du stock
 * @returns {Object} Query result
 */
export const useStockQuery = (stockId) => {
  return useQuery({
    queryKey: STOCK_QUERY_KEYS.detail(stockId),
    queryFn: () => stockService.getStockById(stockId),
    enabled: !!stockId,
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
 * Hook pour rechercher des stocks
 * @param {string} searchTerm - Terme de recherche
 * @param {Object} options - Options de recherche
 * @returns {Object} Query result
 */
export const useSearchStocksQuery = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: STOCK_QUERY_KEYS.search(searchTerm, options),
    queryFn: () => stockService.searchStocks(searchTerm, options),
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
 * Hook pour créer un stock
 * @returns {Object} Mutation result
 */
export const useCreateStock = () => {
  const queryClient = useQueryClient()
  const stocksStore = useStocksStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (stockData) => stockService.createStock(stockData),
    onSuccess: (data) => {
      console.log('✅ Stock créé avec succès:', data)
      
      // Mettre à jour le store Pinia avec le nouveau stock
      if (data.success && data.data) {
        console.log('📝 Ajout du nouveau stock au store Pinia:', data.data)
        stocksStore.addStock(data.data)
      }
      
      // Invalider tous les caches de stocks pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ['stocks', 'my-stocks'] })
      
      console.log('🔄 Caches invalidés pour forcer le rechargement des stocks')
      
      // Toast de succès
      showToast({
        type: 'success',
        message: data.message || 'Stock créé avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur création stock:', error)
      stocksStore.setError(error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la création du stock'
      })
    }
  })
}

/**
 * Hook pour mettre à jour un stock
 * @returns {Object} Mutation result
 */
export const useUpdateStock = () => {
  const queryClient = useQueryClient()
  const stocksStore = useStocksStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ id, stockData }) => stockService.updateStock(id, stockData),
    onSuccess: (data, { id }) => {
      console.log('✅ Stock modifié avec succès:', data)
      
      // Mettre à jour le store Pinia avec le stock modifié
      if (data.success && data.data) {
        console.log('📝 Mise à jour du stock dans le store Pinia:', data.data)
        stocksStore.updateStock(data.data)
      }
      
      // Invalider tous les caches de stocks pour forcer le rechargement
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: ['stocks', 'my-stocks'] })
      
      // Invalider spécifiquement le cache du stock modifié
      queryClient.invalidateQueries({ 
        queryKey: STOCK_QUERY_KEYS.detail(id)
      })
      
      console.log('🔄 Caches invalidés pour forcer le rechargement des stocks')
      
      showToast({
        type: 'success',
        message: data.message || 'Stock modifié avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur modification stock:', error)
      stocksStore.setError(error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la modification'
      })
    }
  })
}

/**
 * Hook pour supprimer un stock
 * @returns {Object} Mutation result
 */
export const useDeleteStock = () => {
  const queryClient = useQueryClient()
  const stocksStore = useStocksStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (stockId) => stockService.deleteStock(stockId),
    onSuccess: (data, stockId) => {
      console.log('✅ Stock supprimé avec succès:', data)
      
      // Mettre à jour le store Pinia en supprimant le stock
      if (data.success) {
        console.log('🗑️ Suppression du stock du store Pinia:', stockId)
        stocksStore.removeStock(stockId)
      }
      
      // Mettre à jour le cache TanStack Query
      queryClient.setQueryData(STOCK_QUERY_KEYS.lists(), (oldData) => {
        if (!oldData || !oldData.data) return oldData
        
        const filteredStocks = oldData.data.filter(stock => stock.id !== stockId)
        
        return { ...oldData, data: filteredStocks }
      })
      
      // Invalider les autres caches
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ['stocks', 'my-stocks'] })
      
      showToast({
        type: 'success',
        message: data.message || 'Stock supprimé avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur suppression stock:', error)
      stocksStore.setError(error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la suppression'
      })
    }
  })
}

/**
 * Hook pour mise à jour en lot de stocks
 * @returns {Object} Mutation result
 */
export const useBulkUpdateStocks = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (stocksData) => stockService.bulkUpdateStocks(stocksData),
    onSuccess: (data) => {
      console.log('✅ Stocks mis à jour en lot avec succès:', data)
      
      // Invalider tous les caches
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.all })
      
      showToast({
        type: 'success',
        message: data.message || 'Stocks mis à jour en lot avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur mise à jour en lot stocks:', error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la mise à jour en lot'
      })
    }
  })
}

/**
 * Hook pour suppression en lot de stocks
 * @returns {Object} Mutation result
 */
export const useBulkDeleteStocks = () => {
  const queryClient = useQueryClient()
  const stocksStore = useStocksStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (stockIds) => stockService.bulkDeleteStocks(stockIds),
    onSuccess: (data, stockIds) => {
      console.log('✅ Stocks supprimés en lot avec succès:', data)
      
      // Mettre à jour le store Pinia en supprimant les stocks
      if (data.success) {
        stockIds.forEach(stockId => {
          stocksStore.removeStock(stockId)
        })
      }
      
      // Invalider tous les caches
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.all })
      
      showToast({
        type: 'success',
        message: data.message || 'Stocks supprimés en lot avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur suppression en lot stocks:', error)
      stocksStore.setError(error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la suppression en lot'
      })
    }
  })
}
