import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { specialiteService } from '@/services/specialites/specialiteService.js'

/**
 * Store Pinia pour la gestion des spécialités vétérinaires
 */
export const useSpecialitesStore = defineStore('specialites', () => {
  // État
  const specialites = ref([])
  const currentSpecialite = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    is_active: true,
    sort_by: 'name',
    sort_order: 'asc'
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
    inactive: 0
  })

  // Getters calculés
  const getSpecialites = computed(() => specialites.value)
  const getCurrentSpecialite = computed(() => currentSpecialite.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)
  const getFilters = computed(() => filters.value)
  const getPagination = computed(() => pagination.value)
  const getStats = computed(() => stats.value)

  // Getters filtrés
  const activeSpecialites = computed(() => 
    specialites.value.filter(specialite => specialite.is_active === true)
  )
  
  const inactiveSpecialites = computed(() => 
    specialites.value.filter(specialite => specialite.is_active === false)
  )

  // Actions pour l'état
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const setSpecialites = (specialitesData) => {
    specialites.value = specialitesData
    updateStats()
  }

  const addSpecialite = (specialite) => {
    specialites.value.unshift(specialite)
    updateStats()
  }

  const updateSpecialite = (updatedSpecialite) => {
    const index = specialites.value.findIndex(s => s.id === updatedSpecialite.id)
    if (index !== -1) {
      specialites.value[index] = { ...specialites.value[index], ...updatedSpecialite }
      
      // Mettre à jour currentSpecialite si c'est la même
      if (currentSpecialite.value?.id === updatedSpecialite.id) {
        currentSpecialite.value = { ...currentSpecialite.value, ...updatedSpecialite }
      }
      
      updateStats()
    }
  }

  const removeSpecialite = (specialiteId) => {
    specialites.value = specialites.value.filter(s => s.id !== specialiteId)
    
    // Nettoyer currentSpecialite si c'est celle supprimée
    if (currentSpecialite.value?.id === specialiteId) {
      currentSpecialite.value = null
    }
    
    updateStats()
  }

  const setCurrentSpecialite = (specialite) => {
    currentSpecialite.value = specialite
  }

  const clearCurrentSpecialite = () => {
    currentSpecialite.value = null
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      is_active: true,
      sort_by: 'name',
      sort_order: 'asc'
    }
  }

  const setPagination = (paginationData) => {
    pagination.value = {
      current_page: paginationData.current_page || 1,
      last_page: paginationData.last_page || 1,
      per_page: paginationData.per_page || 15,
      total: paginationData.total || 0,
      from: paginationData.from || 0,
      to: paginationData.to || 0
    }
  }

  const setStats = (statsData) => {
    stats.value = { ...stats.value, ...statsData }
  }

  const updateStats = () => {
    const total = specialites.value.length
    const active = specialites.value.filter(s => s.is_active === true).length
    const inactive = specialites.value.filter(s => s.is_active === false).length

    stats.value = {
      total,
      active,
      inactive
    }
  }

  const resetStore = () => {
    specialites.value = []
    currentSpecialite.value = null
    isLoading.value = false
    error.value = null
    resetFilters()
    pagination.value = {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 0,
      to: 0
    }
    stats.value = {
      total: 0,
      active: 0,
      inactive: 0
    }
  }

  // Actions API
  const fetchSpecialites = async (options = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await specialiteService.getAllSpecialites(options)
      
      if (response.success) {
        setSpecialites(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchSpecialites store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchSpecialiteById = async (specialiteId) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await specialiteService.getSpecialiteById(specialiteId)
      
      if (response.success) {
        setCurrentSpecialite(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchSpecialiteById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createSpecialite = async (specialiteData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await specialiteService.createSpecialite(specialiteData)
      
      if (response.success) {
        addSpecialite(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur createSpecialite store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateSpecialiteById = async (specialiteId, updateData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await specialiteService.updateSpecialite(specialiteId, updateData)
      
      if (response.success) {
        updateSpecialite(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur updateSpecialiteById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteSpecialiteById = async (specialiteId) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await specialiteService.deleteSpecialite(specialiteId)
      
      if (response.success) {
        removeSpecialite(specialiteId)
        if (currentSpecialite.value?.id === specialiteId) {
          clearCurrentSpecialite()
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur deleteSpecialiteById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const toggleSpecialiteStatus = async (specialiteId) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await specialiteService.toggleSpecialiteStatus(specialiteId)
      
      if (response.success) {
        updateSpecialite(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur toggleSpecialiteStatus store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const searchSpecialites = async (searchTerm, options = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await specialiteService.searchSpecialites(searchTerm, options)
      
      if (response.success) {
        setSpecialites(response.data)
        if (response.pagination) {
          setPagination(response.pagination)
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur searchSpecialites store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Fonction utilitaire pour trouver une spécialité par ID
  const findSpecialiteById = (specialiteId) => {
    return specialites.value.find(s => s.id === specialiteId) || null
  }

  // Fonction pour rafraîchir les données
  const refreshSpecialites = async (options = {}) => {
    return await fetchSpecialites({ ...filters.value, ...options })
  }

  // Récupérer les vétérinaires d'une spécialité
  const fetchSpecialiteVeterinarians = async (specialiteId, options = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Récupération vétérinaires spécialité store:', specialiteId, options)
      
      const response = await specialiteService.getSpecialiteVeterinarians(specialiteId, options)
      
      if (response.success) {
        console.log('✅ Vétérinaires spécialité récupérés store:', response.data.length)
        return response
      } else {
        setError(response.error)
        return response
      }
      
    } catch (error) {
      console.error('❌ Erreur fetchSpecialiteVeterinarians store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    // État
    specialites,
    currentSpecialite,
    isLoading,
    error,
    filters,
    pagination,
    stats,

    // Getters
    getSpecialites,
    getCurrentSpecialite,
    getIsLoading,
    getError,
    getFilters,
    getPagination,
    getStats,
    activeSpecialites,
    inactiveSpecialites,

    // Actions état
    setLoading,
    setError,
    clearError,
    setSpecialites,
    addSpecialite,
    updateSpecialite,
    removeSpecialite,
    setCurrentSpecialite,
    clearCurrentSpecialite,
    setFilters,
    resetFilters,
    setPagination,
    setStats,
    resetStore,

    // Actions API
    fetchSpecialites,
    fetchSpecialiteById,
    createSpecialite,
    updateSpecialiteById,
    deleteSpecialiteById,
    toggleSpecialiteStatus,
    searchSpecialites,
    fetchSpecialiteVeterinarians,

    // Utilitaires
    findSpecialiteById,
    refreshSpecialites
  }
})

export default useSpecialitesStore
