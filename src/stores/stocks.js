import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { stockService } from '@/services/stocks/stockService.js'

/**
 * Store Pinia pour la gestion des stocks
 */
export const useStocksStore = defineStore('stocks', () => {
  // État
  const stocks = ref([])
  const currentStock = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const filters = ref({
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

  // Stats et résumé
  const stats = ref({
    total: 0,
    active: 0,
    inactive: 0,
    low_stock: 0,
    expiring_soon: 0,
    expired: 0,
    total_value: 0
  })
  const summary = ref(null)
  const alerts = ref([])
  const lastFetch = ref(null)

  // Getters
  const getStocks = computed(() => stocks.value)
  const getCurrentStock = computed(() => currentStock.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)
  const getFilters = computed(() => filters.value)
  const getPagination = computed(() => pagination.value)
  const getStats = computed(() => stats.value)
  const getSummary = computed(() => summary.value)
  const getAlerts = computed(() => alerts.value)

  // Getters calculés
  const getActiveStocks = computed(() => {
    return stocks.value.filter(stock => stock.is_active)
  })

  const getInactiveStocks = computed(() => {
    return stocks.value.filter(stock => !stock.is_active)
  })

  const getLowStocks = computed(() => {
    return stocks.value.filter(stock => stock.quantite_actuelle <= stock.quantite_minimale)
  })

  const getExpiringSoonStocks = computed(() => {
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
    
    return stocks.value.filter(stock => {
      if (!stock.date_expiration) return false
      const expirationDate = new Date(stock.date_expiration)
      return expirationDate <= thirtyDaysFromNow && expirationDate > today
    })
  })

  const getExpiredStocks = computed(() => {
    const today = new Date()
    
    return stocks.value.filter(stock => {
      if (!stock.date_expiration) return false
      const expirationDate = new Date(stock.date_expiration)
      return expirationDate <= today
    })
  })

  const getTotalValue = computed(() => {
    return stocks.value.reduce((total, stock) => {
      return total + (stock.quantite_actuelle * stock.prix_unitaire)
    }, 0)
  })

  const getStockById = computed(() => {
    return (id) => stocks.value.find(stock => stock.id === id)
  })

  // Actions
  const setStocks = (newStocks) => {
    stocks.value = Array.isArray(newStocks) ? newStocks : []
    lastFetch.value = new Date().toISOString()
    updateStats()
    console.log('📝 Stocks mis à jour dans le store:', stocks.value.length)
  }

  const addStock = (stock) => {
    if (stock && stock.id) {
      // Vérifier si le stock existe déjà
      const existingIndex = stocks.value.findIndex(s => s.id === stock.id)
      if (existingIndex === -1) {
        stocks.value.unshift(stock) // Ajouter au début
        updateStats()
        console.log('➕ Stock ajouté au store:', stock.lot_numero || stock.id)
      } else {
        console.log('⚠️ Stock déjà existant dans le store:', stock.id)
      }
    }
  }

  const updateStock = (updatedStock) => {
    if (updatedStock && updatedStock.id) {
      const index = stocks.value.findIndex(s => s.id === updatedStock.id)
      if (index !== -1) {
        stocks.value[index] = { ...stocks.value[index], ...updatedStock }
        updateStats()
        console.log('✏️ Stock mis à jour dans le store:', updatedStock.lot_numero || updatedStock.id)
      } else {
        console.log('⚠️ Stock non trouvé pour mise à jour:', updatedStock.id)
      }
    }
  }

  const removeStock = (stockId) => {
    const index = stocks.value.findIndex(s => s.id === stockId)
    if (index !== -1) {
      const removedStock = stocks.value.splice(index, 1)[0]
      updateStats()
      console.log('🗑️ Stock supprimé du store:', removedStock.lot_numero || removedStock.id)
    } else {
      console.log('⚠️ Stock non trouvé pour suppression:', stockId)
    }
  }

  const setCurrentStock = (stock) => {
    currentStock.value = stock
  }

  const clearCurrentStock = () => {
    currentStock.value = null
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (newError) => {
    error.value = newError
  }

  const clearError = () => {
    error.value = null
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
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
      sort_order: 'desc'
    }
  }

  const setPagination = (newPagination) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  const setStats = (newStats) => {
    stats.value = { ...stats.value, ...newStats }
  }

  const setSummary = (newSummary) => {
    summary.value = newSummary
  }

  const setAlerts = (newAlerts) => {
    alerts.value = Array.isArray(newAlerts) ? newAlerts : []
  }

  // Calculer les stats à partir des stocks actuels
  const updateStats = () => {
    const total = stocks.value.length
    const active = getActiveStocks.value.length
    const inactive = getInactiveStocks.value.length
    const low_stock = getLowStocks.value.length
    const expiring_soon = getExpiringSoonStocks.value.length
    const expired = getExpiredStocks.value.length
    const total_value = getTotalValue.value

    setStats({
      total,
      active,
      inactive,
      low_stock,
      expiring_soon,
      expired,
      total_value
    })
  }

  // Actions API
  const fetchStocks = async (options = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await stockService.getAllStocks({
        ...filters.value,
        ...options
      })
      
      if (response.success) {
        setStocks(response.data || [])
        if (response.pagination) {
          setPagination(response.pagination)
        }
        console.log('✅ Stocks chargés dans le store:', response.data?.length || 0)
      } else {
        setError(response.error)
        console.error('❌ Erreur API stocks:', response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchStocks store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchMyStocks = async (options = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await stockService.getMyStocks({
        ...filters.value,
        ...options
      })
      
      if (response.success) {
        setStocks(response.data || [])
        if (response.pagination) {
          setPagination(response.pagination)
        }
        console.log('✅ Mes stocks chargés dans le store:', response.data?.length || 0)
      } else {
        setError(response.error)
        console.error('❌ Erreur API mes stocks:', response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchMyStocks store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchStockById = async (id) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await stockService.getStockById(id)
      
      if (response.success) {
        setCurrentStock(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchStockById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createStock = async (stockData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await stockService.createStock(stockData)
      
      if (response.success) {
        addStock(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur createStock store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateStockById = async (id, stockData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await stockService.updateStock(id, stockData)
      
      if (response.success) {
        updateStock(response.data)
        if (currentStock.value?.id === id) {
          setCurrentStock(response.data)
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur updateStockById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteStockById = async (id) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await stockService.deleteStock(id)
      
      if (response.success) {
        removeStock(id)
        if (currentStock.value?.id === id) {
          clearCurrentStock()
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur deleteStockById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchLowStocks = async (options = {}) => {
    try {
      const response = await stockService.getLowStocks(options)
      
      if (response.success) {
        // Mettre à jour les alertes avec les stocks faibles
        setAlerts(response.data || [])
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchLowStocks store:', error)
      setError(error.message)
      throw error
    }
  }

  const fetchExpiringSoonStocks = async (options = {}) => {
    try {
      const response = await stockService.getExpiringSoonStocks(options)
      
      if (response.success) {
        // Ajouter aux alertes les stocks expirant bientôt
        const currentAlerts = alerts.value || []
        const expiringAlerts = (response.data || []).map(stock => ({
          ...stock,
          alert_type: 'expiring_soon'
        }))
        setAlerts([...currentAlerts, ...expiringAlerts])
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchExpiringSoonStocks store:', error)
      setError(error.message)
      throw error
    }
  }

  const fetchStockStats = async (options = {}) => {
    try {
      const response = await stockService.getStockStats(options)
      
      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchStockStats store:', error)
      setError(error.message)
      throw error
    }
  }

  const fetchStockSummary = async () => {
    try {
      const response = await stockService.getStockSummary()
      
      if (response.success) {
        setSummary(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchStockSummary store:', error)
      setError(error.message)
      throw error
    }
  }

  const fetchStockAlerts = async (options = {}) => {
    try {
      const response = await stockService.getStockAlerts(options)
      
      if (response.success) {
        setAlerts(response.data || [])
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchStockAlerts store:', error)
      setError(error.message)
      throw error
    }
  }

  // Utilitaires
  const searchStocks = (searchTerm) => {
    setFilters({ search: searchTerm })
    return fetchStocks()
  }

  const filterByActif = (actifId) => {
    setFilters({ actif_id: actifId })
    return fetchStocks()
  }

  const filterByStatus = (isActive) => {
    setFilters({ active_only: isActive })
    return fetchStocks()
  }

  const filterByLowStock = (lowStock) => {
    setFilters({ low_stock: lowStock })
    return fetchStocks()
  }

  const filterByExpiring = (expiringSoon) => {
    setFilters({ expiring_soon: expiringSoon })
    return fetchStocks()
  }

  const sortStocks = (sortBy, sortOrder = 'desc') => {
    setFilters({ sort_by: sortBy, sort_order: sortOrder })
    return fetchStocks()
  }

  const getStocksByUserId = (userId) => {
    return stocks.value.filter(stock => stock.user_id === userId)
  }

  const getStocksByActifId = (actifId) => {
    return stocks.value.filter(stock => stock.actif_id === actifId)
  }

  const searchStocksLocal = (query) => {
    if (!query) return stocks.value
    const lowerQuery = query.toLowerCase()
    return stocks.value.filter(stock => 
      stock.lot_numero?.toLowerCase().includes(lowerQuery) ||
      stock.fournisseur?.toLowerCase().includes(lowerQuery) ||
      stock.notes?.toLowerCase().includes(lowerQuery) ||
      stock.actif?.name?.toLowerCase().includes(lowerQuery)
    )
  }

  const resetStore = () => {
    stocks.value = []
    currentStock.value = null
    isLoading.value = false
    error.value = null
    resetFilters()
    setPagination({
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    })
    setStats({
      total: 0,
      active: 0,
      inactive: 0,
      low_stock: 0,
      expiring_soon: 0,
      expired: 0,
      total_value: 0
    })
    summary.value = null
    alerts.value = []
    lastFetch.value = null
  }

  const clearStocks = () => {
    stocks.value = []
    error.value = null
    lastFetch.value = null
    console.log('🗑️ Store stocks vidé')
  }

  return {
    // État
    stocks,
    currentStock,
    isLoading,
    error,
    filters,
    pagination,
    stats,
    summary,
    alerts,
    lastFetch,

    // Getters
    getStocks,
    getCurrentStock,
    getIsLoading,
    getError,
    getFilters,
    getPagination,
    getStats,
    getSummary,
    getAlerts,
    getActiveStocks,
    getInactiveStocks,
    getLowStocks,
    getExpiringSoonStocks,
    getExpiredStocks,
    getStocksByActifId,
    getTotalValue,
    getStockById,

    // Actions
    setStocks,
    addStock,
    updateStock,
    removeStock,
    setCurrentStock,
    clearCurrentStock,
    setLoading,
    setError,
    clearError,
    setFilters,
    resetFilters,
    setPagination,
    setStats,
    setSummary,
    setAlerts,
    updateStats,

    // Actions API
    fetchStocks,
    fetchMyStocks,
    fetchStockById,
    createStock,
    updateStockById,
    deleteStockById,
    fetchLowStocks,
    fetchExpiringSoonStocks,
    fetchStockStats,
    fetchStockSummary,
    fetchStockAlerts,

    // Utilitaires
    searchStocks,
    filterByActif,
    filterByStatus,
    filterByLowStock,
    filterByExpiring,
    sortStocks,
    getStocksByUserId,
    getStocksByActifId,
    searchStocksLocal,
    resetStore,
    clearStocks
  }
})
