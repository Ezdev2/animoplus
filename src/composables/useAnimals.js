import { ref, computed, watch } from 'vue'
import { 
  useAnimals,
  useAnimal,
  useSearchAnimals,
  useAnimalsByOwner,
  useAnimalsBySpecies,
  useCreateAnimal,
  useUpdateAnimal,
  useDeleteAnimal,
  useUploadAnimalPhoto,
  useAnimalManagement
} from '@/services/animals/animalQueries.js'

/**
 * Composable principal pour la gestion des animaux
 * Fournit une interface réactive et des utilitaires pour les composants Vue
 */
export function useAnimalsComposable() {
  // États réactifs pour les filtres et la pagination
  const currentPage = ref(1)
  const perPage = ref(10)
  const searchTerm = ref('')
  const selectedSpecies = ref(null)
  const selectedOwner = ref(null)
  const includeRelations = ref({
    with_espece: true,
    with_race: true,
    with_proprietaire: true
  })

  // Paramètres de requête calculés
  const queryParams = computed(() => ({
    page: currentPage.value,
    per_page: perPage.value,
    search: searchTerm.value || undefined,
    espece_id: selectedSpecies.value || undefined,
    proprietaire_id: selectedOwner.value || undefined,
    ...includeRelations.value
  }))

  // Requête principale pour la liste des animaux
  const {
    data: animalsResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useAnimals(queryParams, {
    keepPreviousData: true
  })

  // Données calculées
  const animals = computed(() => animalsResponse.value?.data || [])
  const pagination = computed(() => animalsResponse.value?.pagination || {})
  const totalAnimals = computed(() => animalsResponse.value?.total || 0)
  const hasAnimals = computed(() => animals.value.length > 0)
  const isEmpty = computed(() => !isLoading.value && animals.value.length === 0)

  // Mutations pour les opérations CRUD
  const createMutation = useCreateAnimal({
    onSuccess: () => {
      // Réinitialiser à la première page après création
      currentPage.value = 1
    }
  })

  const updateMutation = useUpdateAnimal()
  const deleteMutation = useDeleteAnimal()
  const photoMutation = useUploadAnimalPhoto()

  // Méthodes de navigation et filtrage
  const goToPage = (page) => {
    currentPage.value = page
  }

  const nextPage = () => {
    if (currentPage.value < pagination.value.last_page) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const setPerPage = (count) => {
    perPage.value = count
    currentPage.value = 1 // Retour à la première page
  }

  const search = (term) => {
    searchTerm.value = term
    currentPage.value = 1 // Retour à la première page lors d'une recherche
  }

  const filterBySpecies = (speciesId) => {
    selectedSpecies.value = speciesId
    currentPage.value = 1
  }

  const filterByOwner = (ownerId) => {
    selectedOwner.value = ownerId
    currentPage.value = 1
  }

  const clearFilters = () => {
    searchTerm.value = ''
    selectedSpecies.value = null
    selectedOwner.value = null
    currentPage.value = 1
  }

  // Actions CRUD
  const createAnimal = async (animalData) => {
    try {
      const result = await createMutation.mutateAsync(animalData)
      return result
    } catch (error) {
      throw error
    }
  }

  const updateAnimal = async (id, animalData) => {
    try {
      const result = await updateMutation.mutateAsync({ id, data: animalData })
      return result
    } catch (error) {
      throw error
    }
  }

  const deleteAnimal = async (id) => {
    try {
      const result = await deleteMutation.mutateAsync(id)
      return result
    } catch (error) {
      throw error
    }
  }

  const uploadAnimalPhoto = async (id, file) => {
    try {
      const result = await photoMutation.mutateAsync({ id, file })
      return result
    } catch (error) {
      throw error
    }
  }

  // États des mutations
  const isCreating = computed(() => createMutation.isLoading)
  const isUpdating = computed(() => updateMutation.isLoading)
  const isDeleting = computed(() => deleteMutation.isLoading)
  const isUploadingPhoto = computed(() => photoMutation.isLoading)
  const isMutating = computed(() => 
    isCreating.value || isUpdating.value || isDeleting.value || isUploadingPhoto.value
  )

  return {
    // Données
    animals,
    pagination,
    totalAnimals,
    hasAnimals,
    isEmpty,
    
    // États de chargement
    isLoading,
    isError,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    isUploadingPhoto,
    isMutating,
    
    // Filtres et pagination
    currentPage,
    perPage,
    searchTerm,
    selectedSpecies,
    selectedOwner,
    
    // Actions de navigation
    goToPage,
    nextPage,
    previousPage,
    setPerPage,
    
    // Actions de filtrage
    search,
    filterBySpecies,
    filterByOwner,
    clearFilters,
    
    // Actions CRUD
    createAnimal,
    updateAnimal,
    deleteAnimal,
    uploadAnimalPhoto,
    
    // Utilitaires
    refetch,
    includeRelations
  }
}

/**
 * Composable pour la gestion d'un animal spécifique
 * @param {Ref<number>} animalId - ID réactif de l'animal
 */
export function useAnimalDetails(animalId) {
  const management = useAnimalManagement(animalId)
  
  // États locaux pour l'édition
  const isEditing = ref(false)
  const editForm = ref({})
  
  // Initialiser le formulaire d'édition quand l'animal est chargé
  watch(() => management.animal, (animal) => {
    if (animal && !isEditing.value) {
      editForm.value = { ...animal }
    }
  }, { immediate: true })
  
  const startEditing = () => {
    if (management.animal) {
      editForm.value = { ...management.animal }
      isEditing.value = true
    }
  }
  
  const cancelEditing = () => {
    isEditing.value = false
    editForm.value = {}
  }
  
  const saveChanges = async () => {
    try {
      await management.updateAnimal(editForm.value)
      isEditing.value = false
      return true
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      return false
    }
  }
  
  return {
    ...management,
    
    // États d'édition
    isEditing,
    editForm,
    
    // Actions d'édition
    startEditing,
    cancelEditing,
    saveChanges
  }
}

/**
 * Composable pour la recherche d'animaux avec debounce
 * @param {number} debounceMs - Délai de debounce en millisecondes
 */
export function useAnimalSearch(debounceMs = 300) {
  const searchTerm = ref('')
  const debouncedSearchTerm = ref('')
  const isSearching = ref(false)
  
  let debounceTimer = null
  
  // Debounce de la recherche
  watch(searchTerm, (newTerm) => {
    isSearching.value = true
    
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    
    debounceTimer = setTimeout(() => {
      debouncedSearchTerm.value = newTerm
      isSearching.value = false
    }, debounceMs)
  })
  
  // Requête de recherche
  const {
    data: searchResponse,
    isLoading: isLoadingSearch,
    isError: isSearchError,
    error: searchError
  } = useSearchAnimals(debouncedSearchTerm, {}, {
    enabled: computed(() => debouncedSearchTerm.value.length >= 2)
  })
  
  const searchResults = computed(() => searchResponse.value?.data || [])
  const hasResults = computed(() => searchResults.value.length > 0)
  const showNoResults = computed(() => 
    !isLoadingSearch.value && 
    !isSearching.value && 
    debouncedSearchTerm.value.length >= 2 && 
    searchResults.value.length === 0
  )
  
  const clearSearch = () => {
    searchTerm.value = ''
    debouncedSearchTerm.value = ''
  }
  
  return {
    // États
    searchTerm,
    debouncedSearchTerm,
    searchResults,
    hasResults,
    showNoResults,
    isSearching,
    isLoadingSearch,
    isSearchError,
    searchError,
    
    // Actions
    clearSearch
  }
}

/**
 * Composable pour les animaux d'un propriétaire spécifique
 * @param {Ref<number>} ownerId - ID réactif du propriétaire
 */
export function useOwnerAnimals(ownerId) {
  const {
    data: animalsResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useAnimalsByOwner(ownerId)
  
  const animals = computed(() => animalsResponse.value?.data || [])
  const animalCount = computed(() => animals.value.length)
  const hasAnimals = computed(() => animalCount.value > 0)
  
  // Statistiques des animaux
  const animalStats = computed(() => {
    const stats = {
      total: animalCount.value,
      bySpecies: {},
      byGender: { M: 0, F: 0 },
      sterilized: 0
    }
    
    animals.value.forEach(animal => {
      // Par espèce
      const species = animal.espece?.nom || 'Inconnu'
      stats.bySpecies[species] = (stats.bySpecies[species] || 0) + 1
      
      // Par sexe
      if (animal.sexe) {
        stats.byGender[animal.sexe]++
      }
      
      // Stérilisés
      if (animal.sterilise) {
        stats.sterilized++
      }
    })
    
    return stats
  })
  
  return {
    animals,
    animalCount,
    hasAnimals,
    animalStats,
    isLoading,
    isError,
    error,
    refetch
  }
}

/**
 * Utilitaires pour les animaux
 */
export const animalUtils = {
  /**
   * Calculer l'âge d'un animal
   * @param {string} birthDate - Date de naissance (YYYY-MM-DD)
   * @returns {Object} Âge en années, mois et jours
   */
  calculateAge(birthDate) {
    if (!birthDate) return null
    
    const birth = new Date(birthDate)
    const now = new Date()
    const diffTime = Math.abs(now - birth)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    const years = Math.floor(diffDays / 365)
    const months = Math.floor((diffDays % 365) / 30)
    const days = diffDays % 30
    
    return { years, months, days, totalDays: diffDays }
  },
  
  /**
   * Formater l'âge pour l'affichage
   * @param {string} birthDate - Date de naissance
   * @returns {string} Âge formaté
   */
  formatAge(birthDate) {
    const age = this.calculateAge(birthDate)
    if (!age) return 'Âge inconnu'
    
    if (age.years > 0) {
      return `${age.years} an${age.years > 1 ? 's' : ''}`
    } else if (age.months > 0) {
      return `${age.months} mois`
    } else {
      return `${age.days} jour${age.days > 1 ? 's' : ''}`
    }
  },
  
  /**
   * Obtenir la couleur de badge selon l'espèce
   * @param {string} species - Nom de l'espèce
   * @returns {string} Classe CSS pour la couleur
   */
  getSpeciesColor(species) {
    const colors = {
      'Chien': 'bg-blue-100 text-blue-800',
      'Chat': 'bg-orange-100 text-orange-800',
      'Oiseau': 'bg-green-100 text-green-800',
      'Lapin': 'bg-purple-100 text-purple-800',
      'Reptile': 'bg-yellow-100 text-yellow-800'
    }
    
    return colors[species] || 'bg-gray-100 text-gray-800'
  },
  
  /**
   * Valider les données d'un animal
   * @param {Object} animalData - Données de l'animal
   * @returns {Object} Résultat de validation
   */
  validateAnimalData(animalData) {
    const errors = {}
    
    if (!animalData.nom || animalData.nom.trim().length < 2) {
      errors.nom = 'Le nom doit contenir au moins 2 caractères'
    }
    
    if (!animalData.espece_id) {
      errors.espece_id = 'L\'espèce est requise'
    }
    
    if (!animalData.sexe || !['M', 'F'].includes(animalData.sexe)) {
      errors.sexe = 'Le sexe doit être M ou F'
    }
    
    if (!animalData.proprietaire_id) {
      errors.proprietaire_id = 'Le propriétaire est requis'
    }
    
    if (animalData.poids && (animalData.poids < 0 || animalData.poids > 1000)) {
      errors.poids = 'Le poids doit être entre 0 et 1000 kg'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}
