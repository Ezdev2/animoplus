import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  useAnimals,
  useCreateAnimal,
  useUpdateAnimal,
  useDeleteAnimal
} from '@/services/animals/animalQueries.js'

export const useAnimalsStore = defineStore('animals', () => {
  // État local du store
  const selectedAnimal = ref(null)
  const currentFilters = ref({
    search: '',
    species: null,
    owner: null
  })
  const currentPage = ref(1)
  const perPage = ref(10)

  // Paramètres de requête calculés
  const queryParams = computed(() => ({
    page: currentPage.value,
    per_page: perPage.value,
    search: currentFilters.value.search || undefined,
    espece_id: currentFilters.value.species || undefined,
    proprietaire_id: currentFilters.value.owner || undefined,
    with_espece: true,
    with_race: true,
    with_proprietaire: true
  }))

  // Requête principale pour tous les animaux
  const animalsQuery = useAnimals(queryParams, {
    keepPreviousData: true
  })

  // Données calculées (comme les getters Redux)
  const animals = computed(() => animalsQuery.data?.value?.data || [])
  const pagination = computed(() => animalsQuery.data?.value?.pagination || {})
  const totalAnimals = computed(() => animalsQuery.data?.value?.total || 0)
  const isLoading = computed(() => animalsQuery.isLoading?.value || false)
  const isError = computed(() => animalsQuery.isError?.value || false)
  const error = computed(() => animalsQuery.error?.value || null)

  // Mutations pour CRUD
  const createMutation = useCreateAnimal({
    onSuccess: () => {
      animalsQuery.refetch?.()
      currentPage.value = 1
    }
  })

  const updateMutation = useUpdateAnimal({
    onSuccess: () => {
      animalsQuery.refetch?.()
    }
  })

  const deleteMutation = useDeleteAnimal({
    onSuccess: () => {
      animalsQuery.refetch?.()
      if (selectedAnimal.value) {
        selectedAnimal.value = null
      }
    }
  })

  // Actions CRUD
  const addAnimal = async (animalData) => {
    return await createMutation.mutateAsync(animalData)
  }

  const updateAnimal = async (id, animalData) => {
    return await updateMutation.mutateAsync({ id, data: animalData })
  }

  const removeAnimal = async (id) => {
    return await deleteMutation.mutateAsync(id)
  }

  // États des mutations
  const isCreating = computed(() => createMutation.isLoading?.value || false)
  const isUpdating = computed(() => updateMutation.isLoading?.value || false)
  const isDeleting = computed(() => deleteMutation.isLoading?.value || false)
  const isMutating = computed(() => isCreating.value || isUpdating.value || isDeleting.value)

  // Actions de navigation
  const setFilters = (filters) => {
    currentFilters.value = { ...currentFilters.value, ...filters }
    currentPage.value = 1
  }

  const setPage = (page) => {
    currentPage.value = page
  }

  const selectAnimal = (animal) => {
    selectedAnimal.value = animal
  }

  const clearSelection = () => {
    selectedAnimal.value = null
  }

  // Getters
  const getAnimalById = (id) => {
    return animals.value.find(animal => animal.id === id)
  }

  const getAnimalsByOwner = (ownerId) => {
    return animals.value.filter(animal => animal.proprietaire_id === ownerId)
  }

  return {
    // État
    selectedAnimal,
    currentFilters,
    currentPage,
    perPage,
    
    // Données
    animals,
    pagination,
    totalAnimals,
    isLoading,
    isError,
    error,
    
    // États mutations
    isCreating,
    isUpdating,
    isDeleting,
    isMutating,
    
    // Actions CRUD
    addAnimal,
    updateAnimal,
    removeAnimal,
    
    // Actions navigation
    setFilters,
    setPage,
    selectAnimal,
    clearSelection,
    
    // Getters
    getAnimalById,
    getAnimalsByOwner,
    
    // Query
    animalsQuery
  }
})
