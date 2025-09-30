import { computed, ref } from 'vue'
import { useSpecialitesStore } from '@/stores/specialites.js'

/**
 * Composable pour la gestion des spécialités vétérinaires
 * Interface simplifiée basée sur le store Pinia (comme useStocks)
 */
export const useSpecialites = () => {
  const store = useSpecialitesStore()

  // État local pour les options de requête
  const queryOptions = ref({
    page: 1,
    per_page: 15,
    search: '',
    is_active: true,
    sort_by: 'name',
    sort_order: 'asc'
  })

  // Getters calculés depuis le store (comme useStocks)
  const specialites = computed(() => store.getSpecialites)
  const currentSpecialite = computed(() => store.getCurrentSpecialite)
  const isLoading = computed(() => store.getIsLoading)
  const error = computed(() => store.getError)
  const filters = computed(() => store.getFilters)
  const pagination = computed(() => store.getPagination)
  const stats = computed(() => store.getStats)

  // Getters filtrés
  const activeSpecialites = computed(() => store.activeSpecialites)
  const inactiveSpecialites = computed(() => store.inactiveSpecialites)

  // Actions du store (comme useStocks)
  const {
    fetchSpecialites,
    fetchSpecialiteById,
    createSpecialite: createSpecialiteStore,
    updateSpecialiteById,
    deleteSpecialiteById,
    toggleSpecialiteStatus,
    searchSpecialites,
    fetchSpecialiteVeterinarians,
    setFilters,
    resetFilters,
    resetStore,
    findSpecialiteById,
    refreshSpecialites
  } = store

  // Actions simplifiées (comme useStocks)
  const createSpecialite = async (specialiteData) => {
    return await createSpecialiteStore(specialiteData)
  }

  const updateSpecialite = async (specialiteId, updateData) => {
    return await updateSpecialiteById(specialiteId, updateData)
  }

  const deleteSpecialite = async (specialiteId) => {
    return await deleteSpecialiteById(specialiteId)
  }

  const toggleStatus = async (specialiteId) => {
    return await toggleSpecialiteStatus(specialiteId)
  }

  const searchSpecialitesWithOptions = async (searchTerm, options = {}) => {
    return await searchSpecialites(searchTerm, { ...queryOptions.value, ...options })
  }

  const getSpecialiteVeterinarians = async (specialiteId, options = {}) => {
    return await fetchSpecialiteVeterinarians(specialiteId, { ...queryOptions.value, ...options })
  }

  // Fonctions utilitaires pour le formatage et la validation
  const validateSpecialiteData = (data) => {
    const errors = {}
    
    if (!data.name || data.name.trim().length === 0) {
      errors.name = 'Le nom de la spécialité est requis'
    }
    
    if (data.name && data.name.trim().length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères'
    }
    
    if (data.name && data.name.trim().length > 100) {
      errors.name = 'Le nom ne peut pas dépasser 100 caractères'
    }
    
    if (data.description && data.description.length > 500) {
      errors.description = 'La description ne peut pas dépasser 500 caractères'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  const formatSpecialiteName = (name) => {
    if (!name) return ''
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
  }

  const getStatusLabel = (isActive) => {
    return isActive ? 'Actif' : 'Inactif'
  }

  const getStatusColor = (isActive) => {
    return isActive ? 'success' : 'warning'
  }

  const getStatusIcon = (isActive) => {
    return isActive ? '✅' : '⏸️'
  }

  // Fonction pour obtenir les spécialités actives uniquement (utile pour les selects)
  const getActiveSpecialitesForSelect = () => {
    return activeSpecialites.value.map(specialite => ({
      value: specialite.id,
      label: specialite.name,
      description: specialite.description
    }))
  }

  // Fonction pour obtenir une spécialité par ID avec gestion d'erreur
  const getSpecialiteById = (specialiteId) => {
    const specialite = findSpecialiteById(specialiteId)
    if (!specialite) {
      console.warn(`Spécialité avec l'ID ${specialiteId} non trouvée`)
      return null
    }
    return specialite
  }

  // Fonction pour rafraîchir avec les filtres actuels
  const refresh = async () => {
    return await refreshSpecialites()
  }

  // Fonction pour charger les spécialités avec options
  const loadSpecialites = async (options = {}) => {
    const mergedOptions = { ...queryOptions.value, ...options }
    return await fetchSpecialites(mergedOptions)
  }

  // Fonction pour charger seulement les spécialités actives (optimisation)
  const loadActiveSpecialites = async () => {
    return await fetchSpecialites({ 
      ...queryOptions.value, 
      is_active: true,
      per_page: 100 // Charger plus pour avoir toutes les spécialités actives
    })
  }

  return {
    // État et getters
    specialites,
    currentSpecialite,
    isLoading,
    error,
    filters,
    pagination,
    stats,
    activeSpecialites,
    inactiveSpecialites,

    // Actions principales
    createSpecialite,
    updateSpecialite,
    deleteSpecialite,
    toggleStatus,
    fetchSpecialites,
    fetchSpecialiteById,
    searchSpecialites: searchSpecialitesWithOptions,
    fetchSpecialiteVeterinarians,
    getSpecialiteVeterinarians,
    loadActiveSpecialites,
    
    // Fonctions utilitaires
    validateSpecialiteData,
    formatSpecialiteName,
    getStatusLabel,
    getStatusColor,
    getStatusIcon,
    getActiveSpecialitesForSelect,
    setFilters,
    resetFilters,
    resetStore,

    // Options de requête
    queryOptions
  }
}

export default useSpecialites
