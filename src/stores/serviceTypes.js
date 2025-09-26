import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useServiceTypesCache } from '@/composables/useServiceTypesCache.js'

/**
 * Store Pinia pour la gestion des types de services
 * Utilise le composable useServiceTypesCache pour la logique de cache
 */
export const useServiceTypesStore = defineStore('serviceTypes', () => {
  // État local du store
  const selectedServiceType = ref(null)
  const searchTerm = ref('')
  const filterActive = ref(true)

  // Utiliser le composable de cache
  const {
    serviceTypes,
    activeServiceTypes,
    isLoading,
    isError,
    error,
    stats,
    getServiceTypeById,
    getServiceTypeByName,
    forceRefresh,
    clearServiceTypesCache
  } = useServiceTypesCache({
    activeOnly: false, // Récupérer tous les types
    withStats: true,
    enableBackgroundRefresh: true
  })

  // Getters computés
  const filteredServiceTypes = computed(() => {
    let types = filterActive.value ? activeServiceTypes.value : serviceTypes.value
    
    if (searchTerm.value) {
      const search = searchTerm.value.toLowerCase()
      types = types.filter(type => 
        type.name?.toLowerCase().includes(search) ||
        type.description?.toLowerCase().includes(search)
      )
    }
    
    return types
  })

  const serviceTypesForSelect = computed(() => {
    return activeServiceTypes.value.map(type => ({
      value: type.id,
      label: type.name,
      description: type.description
    }))
  })

  const serviceTypesByCategory = computed(() => {
    const categories = {}
    activeServiceTypes.value.forEach(type => {
      const category = type.category || 'Général'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(type)
    })
    return categories
  })

  // Actions
  function setSelectedServiceType(serviceType) {
    selectedServiceType.value = serviceType
  }

  function clearSelectedServiceType() {
    selectedServiceType.value = null
  }

  function setSearchTerm(term) {
    searchTerm.value = term
  }

  function setFilterActive(active) {
    filterActive.value = active
  }

  function findServiceTypeById(id) {
    return getServiceTypeById(id)
  }

  function findServiceTypeByName(name) {
    return getServiceTypeByName(name)
  }

  async function refreshServiceTypes() {
    try {
      await forceRefresh()
      return { success: true }
    } catch (error) {
      console.error('Erreur lors du refresh des types de services:', error)
      return { success: false, error }
    }
  }

  function clearCache() {
    clearServiceTypesCache()
    clearSelectedServiceType()
    setSearchTerm('')
  }

  // Utilitaires pour les formulaires
  function getServiceTypeOptions(includeInactive = false) {
    const types = includeInactive ? serviceTypes.value : activeServiceTypes.value
    return types.map(type => ({
      id: type.id,
      name: type.name,
      description: type.description,
      isActive: type.is_active
    }))
  }

  function validateServiceTypeId(id) {
    return !!findServiceTypeById(id)
  }

  // Statistiques étendues
  const extendedStats = computed(() => ({
    ...stats.value,
    filtered: filteredServiceTypes.value.length,
    searchActive: !!searchTerm.value,
    filterActiveOnly: filterActive.value,
    categories: Object.keys(serviceTypesByCategory.value).length
  }))

  return {
    // État
    selectedServiceType,
    searchTerm,
    filterActive,
    
    // Données
    serviceTypes,
    activeServiceTypes,
    filteredServiceTypes,
    serviceTypesForSelect,
    serviceTypesByCategory,
    
    // État de chargement
    isLoading,
    isError,
    error,
    stats: extendedStats,
    
    // Actions de sélection
    setSelectedServiceType,
    clearSelectedServiceType,
    
    // Actions de filtrage
    setSearchTerm,
    setFilterActive,
    
    // Actions de recherche
    findServiceTypeById,
    findServiceTypeByName,
    
    // Actions de gestion
    refreshServiceTypes,
    clearCache,
    
    // Utilitaires
    getServiceTypeOptions,
    validateServiceTypeId
  }
})

export default useServiceTypesStore
