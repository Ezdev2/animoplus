import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { actifService } from '@/services/actifs/actifService.js'

/**
 * Store Pinia pour la gestion des actifs (produits d'inventaire)
 * Système de cache sécurisé avec actualisation automatique
 */
export const useActifsStore = defineStore('actifs', () => {
  // État principal
  const actifs = ref([])
  const currentActif = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)
  
  // Pagination
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  })
  
  
  // Filtres
  const filters = ref({
    search: '',
    type: '',
    active_only: true,
    with_stocks: false,
    with_deleted: false,
    min_price: '',
    max_price: '',
    min_seuil: '',
    max_seuil: '',
    sort_by: 'nom',
    sort_order: 'asc'
  })

  // Getters
  const getActifs = computed(() => actifs.value)
  const getCurrentActif = computed(() => currentActif.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)
  const getFilters = computed(() => filters.value)
  const getPagination = computed(() => pagination.value)
  
  // Getters filtrés
  const getActiveActifs = computed(() => {
    return actifs.value.filter(actif => actif.is_active === true)
  })
  
  const getInactiveActifs = computed(() => {
    return actifs.value.filter(actif => actif.is_active === false)
  })
  
  const getActifsByType = computed(() => (type) => {
    return actifs.value.filter(actif => actif.type === type)
  })
  
  const getActifById = computed(() => (id) => {
    return actifs.value.find(actif => actif.id === id)
  })
  
  // Getters pour le cache
  const isCacheValid = computed(() => {
    if (!lastFetch.value) return false
    const now = new Date()
    const cacheAge = now.getTime() - lastFetch.value.getTime()
    return cacheAge < 5 * 60 * 1000 // 5 minutes
  })

  // Mutations
  const setActifs = (newActifs) => {
    actifs.value = Array.isArray(newActifs) ? newActifs : []
    lastFetch.value = new Date()
    console.log('📦 Actifs mis à jour dans le store:', actifs.value.length)
  }

  const addActif = (actif) => {
    if (actif && actif.id) {
      actifs.value.unshift(actif)
      console.log('➕ Actif ajouté au store:', actif.nom)
    }
  }

  const updateActif = (updatedActif) => {
    if (!updatedActif || !updatedActif.id) return
    
    const index = actifs.value.findIndex(actif => actif.id === updatedActif.id)
    if (index !== -1) {
      actifs.value[index] = { ...actifs.value[index], ...updatedActif }
      console.log('📝 Actif mis à jour dans le store:', updatedActif.nom)
    }
  }

  const removeActif = (actifId) => {
    const index = actifs.value.findIndex(actif => actif.id === actifId)
    if (index !== -1) {
      const removedActif = actifs.value.splice(index, 1)[0]
      console.log('🗑️ Actif supprimé du store:', removedActif.nom)
    }
  }

  const setCurrentActif = (actif) => {
    currentActif.value = actif
  }

  const clearCurrentActif = () => {
    currentActif.value = null
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
      type: '',
      active_only: true,
      with_stocks: false,
      with_deleted: false,
      min_price: '',
      max_price: '',
      min_seuil: '',
      max_seuil: '',
      sort_by: 'nom',
      sort_order: 'asc'
    }
  }

  const setPagination = (newPagination) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  // Actions API
  const fetchActifs = async (options = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await actifService.getAllActifs({
        ...filters.value,
        ...options
      })
      
      if (response.success) {
        setActifs(response.data || [])
        if (response.pagination) {
          setPagination(response.pagination)
        }
        console.log('✅ Actifs chargés dans le store:', response.data?.length || 0)
      } else {
        setError(response.error)
        console.error('❌ Erreur API actifs:', response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchActifs store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchActifById = async (id) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await actifService.getActifById(id)
      
      if (response.success) {
        setCurrentActif(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchActifById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createActif = async (actifData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await actifService.createActif(actifData)
      
      if (response.success) {
        addActif(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur createActif store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateActifById = async (id, actifData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await actifService.updateActif(id, actifData)
      
      if (response.success) {
        updateActif(response.data)
        if (currentActif.value?.id === id) {
          setCurrentActif(response.data)
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur updateActifById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteActifById = async (id) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await actifService.deleteActif(id)
      
      if (response.success) {
        removeActif(id)
        if (currentActif.value?.id === id) {
          clearCurrentActif()
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur deleteActifById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }


  const searchActifs = async (searchTerm, options = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await actifService.searchActifs(searchTerm, options)
      
      if (response.success) {
        // Pour la recherche, on ne remplace pas la liste principale
        console.log('🔍 Recherche d\'actifs effectuée:', response.data?.length || 0)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur searchActifs store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Utilitaires
  const resetStore = () => {
    actifs.value = []
    currentActif.value = null
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
    resetFilters()
    console.log('🔄 Store actifs réinitialisé')
  }

  const clearActifs = () => {
    actifs.value = []
    lastFetch.value = null
  }

  return {
    // État
    actifs,
    currentActif,
    isLoading,
    error,
    filters,
    pagination,
    lastFetch,

    // Getters
    getActifs,
    getCurrentActif,
    getIsLoading,
    getError,
    getFilters,
    getPagination,
    getActiveActifs,
    getInactiveActifs,
    getActifsByType,
    getActifById,
    isCacheValid,

    // Actions
    setActifs,
    addActif,
    updateActif,
    removeActif,
    setCurrentActif,
    clearCurrentActif,
    setLoading,
    setError,
    clearError,
    setFilters,
    resetFilters,
    setPagination,

    // Actions API
    fetchActifs,
    fetchActifById,
    createActif,
    updateActifById,
    deleteActifById,
    searchActifs,

    // Utilitaires
    resetStore,
    clearActifs
  }
})

export default useActifsStore
