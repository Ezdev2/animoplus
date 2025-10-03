import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { lostAnimalsService } from '@/services/lostAnimals/lostAnimalsService.js'

/**
 * Store Pinia pour la gestion des animaux perdus/trouvés (Coopération)
 */
export const useLostAnimalsStore = defineStore('lostAnimals', () => {
  // === ÉTAT RÉACTIF ===
  
  // Liste des annonces
  const animals = ref([])
  const currentAnimal = ref(null)
  
  // Pagination
  const pagination = ref({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  })
  
  // Filtres actifs
  const filters = ref({
    type: 'all', // 'all', 'lost', 'found'
    animal_type: '', // 'chien', 'chat', 'oiseau', 'lapin', 'autre'
    search: '',
    latitude: null,
    longitude: null,
    radius: 5, // km
    status: 'approved' // 'pending', 'approved', 'rejected', 'resolved'
  })
  
  // États de chargement
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  
  // Gestion d'erreurs
  const error = ref(null)
  
  // Cache pour éviter les requêtes répétées
  const lastFetchTime = ref(null)
  const cacheTimeout = 5 * 60 * 1000 // 5 minutes
  
  // === GETTERS CALCULÉS ===
  
  // Annonces filtrées par type
  const lostAnimals = computed(() => 
    animals.value.filter(animal => animal.type === 'lost')
  )
  
  const foundAnimals = computed(() => 
    animals.value.filter(animal => animal.type === 'found')
  )
  
  // Annonces par statut
  const pendingAnimals = computed(() => 
    animals.value.filter(animal => animal.status === 'pending')
  )
  
  const approvedAnimals = computed(() => 
    animals.value.filter(animal => animal.status === 'approved')
  )
  
  const resolvedAnimals = computed(() => 
    animals.value.filter(animal => animal.status === 'resolved')
  )
  
  // Statistiques
  const stats = computed(() => ({
    total: animals.value.length,
    lost: lostAnimals.value.length,
    found: foundAnimals.value.length,
    pending: pendingAnimals.value.length,
    approved: approvedAnimals.value.length,
    resolved: resolvedAnimals.value.length
  }))
  
  // Vérifier si le cache est valide
  const isCacheValid = computed(() => {
    if (!lastFetchTime.value) return false
    return (Date.now() - lastFetchTime.value) < cacheTimeout
  })
  
  // === ACTIONS ===
  
  // Réinitialiser l'état
  const resetState = () => {
    animals.value = []
    currentAnimal.value = null
    pagination.value = {
      current_page: 1,
      per_page: 10,
      total: 0,
      last_page: 1
    }
    error.value = null
    lastFetchTime.value = null
  }
  
  // Gérer les erreurs
  const setError = (errorMessage) => {
    error.value = errorMessage
    console.error('❌ LostAnimals Store Error:', errorMessage)
  }
  
  const clearError = () => {
    error.value = null
  }
  
  // Mettre à jour les filtres
  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    console.log('🔍 Filtres mis à jour:', filters.value)
  }
  
  // Réinitialiser les filtres
  const resetFilters = () => {
    filters.value = {
      type: 'all',
      animal_type: '',
      search: '',
      latitude: null,
      longitude: null,
      radius: 5,
      status: 'approved'
    }
    console.log('🔄 Filtres réinitialisés')
  }
  
  // === ACTIONS CRUD ===
  
  /**
   * Récupérer la liste des annonces
   */
  const fetchAnimals = async (options = {}, forceRefresh = false) => {
    // Utiliser le cache si valide et pas de force refresh
    if (!forceRefresh && isCacheValid.value && animals.value.length > 0) {
      console.log('📦 Utilisation du cache pour les annonces')
      return { success: true, data: animals.value }
    }
    
    setLoading(true)
    clearError()
    
    try {
      const searchOptions = { ...filters.value, ...options }
      console.log('🔍 Récupération des annonces avec options:', searchOptions)
      
      const response = await lostAnimalsService.getLostAnimals(searchOptions)
      
      if (response.success) {
        // Mettre à jour les données
        if (response.data.data) {
          // Format paginé
          animals.value = response.data.data
          pagination.value = {
            current_page: response.data.current_page || 1,
            per_page: response.data.per_page || 10,
            total: response.data.total || 0,
            last_page: response.data.last_page || 1
          }
        } else {
          // Format simple
          animals.value = Array.isArray(response.data) ? response.data : []
        }
        
        lastFetchTime.value = Date.now()
        console.log('✅ Annonces récupérées:', animals.value.length)
        
        return { success: true, data: animals.value }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des annonces'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Récupérer une annonce par ID
   */
  const fetchAnimalById = async (id) => {
    setLoading(true)
    clearError()
    
    try {
      console.log('🔍 Récupération annonce:', id)
      const response = await lostAnimalsService.getLostAnimalById(id)
      
      if (response.success) {
        currentAnimal.value = response.data
        
        // Mettre à jour dans la liste si elle existe
        const index = animals.value.findIndex(animal => animal.id === id)
        if (index !== -1) {
          animals.value[index] = response.data
        }
        
        console.log('✅ Annonce récupérée:', response.data.name)
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération de l\'annonce'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Créer une nouvelle annonce
   */
  const createAnimal = async (animalData) => {
    setCreating(true)
    clearError()
    
    try {
      console.log('📝 Création annonce:', animalData.name)
      const response = await lostAnimalsService.createLostAnimal(animalData)
      
      if (response.success) {
        // Ajouter à la liste locale (en début pour les nouvelles annonces)
        animals.value.unshift(response.data)
        currentAnimal.value = response.data
        
        // Mettre à jour les stats
        if (pagination.value.total !== undefined) {
          pagination.value.total += 1
        }
        
        console.log('✅ Annonce créée:', response.data.id)
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la création de l\'annonce'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setCreating(false)
    }
  }
  
  /**
   * Modifier une annonce
   */
  const updateAnimal = async (id, updateData) => {
    setUpdating(true)
    clearError()
    
    try {
      console.log('✏️ Modification annonce:', id)
      const response = await lostAnimalsService.updateLostAnimal(id, updateData)
      
      if (response.success) {
        // Mettre à jour dans la liste
        const index = animals.value.findIndex(animal => animal.id === id)
        if (index !== -1) {
          animals.value[index] = response.data
        }
        
        // Mettre à jour l'annonce courante si c'est la même
        if (currentAnimal.value?.id === id) {
          currentAnimal.value = response.data
        }
        
        console.log('✅ Annonce modifiée:', response.data.id)
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la modification de l\'annonce'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setUpdating(false)
    }
  }
  
  /**
   * Supprimer une annonce
   */
  const deleteAnimal = async (id) => {
    setDeleting(true)
    clearError()
    
    try {
      console.log('🗑️ Suppression annonce:', id)
      const response = await lostAnimalsService.deleteLostAnimal(id)
      
      if (response.success) {
        // Supprimer de la liste locale
        removeAnimal(id)
        
        // Réinitialiser l'annonce courante si c'est la même
        if (currentAnimal.value?.id === id) {
          currentAnimal.value = null
        }
        
        console.log('✅ Annonce supprimée:', id)
        return { success: true }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression de l\'annonce'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setDeleting(false)
    }
  }
  
  /**
   * Marquer une annonce comme résolue
   */
  const resolveAnimal = async (id, resolutionData = {}) => {
    setUpdating(true)
    clearError()
    
    try {
      console.log('🎉 Résolution annonce:', id)
      const response = await lostAnimalsService.resolveLostAnimal(id, resolutionData)
      
      if (response.success) {
        // Mettre à jour le statut dans la liste
        const index = animals.value.findIndex(animal => animal.id === id)
        if (index !== -1) {
          animals.value[index] = { ...animals.value[index], ...response.data, status: 'resolved' }
        }
        
        // Mettre à jour l'annonce courante
        if (currentAnimal.value?.id === id) {
          currentAnimal.value = { ...currentAnimal.value, ...response.data, status: 'resolved' }
        }
        
        console.log('✅ Annonce résolue:', id)
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la résolution de l\'annonce'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setUpdating(false)
    }
  }
  
  // === ACTIONS UTILITAIRES ===
  
  /**
   * Supprimer une annonce de la liste locale
   */
  const removeAnimal = (id) => {
    const index = animals.value.findIndex(animal => animal.id === id)
    if (index !== -1) {
      animals.value.splice(index, 1)
      
      // Mettre à jour le total
      if (pagination.value.total > 0) {
        pagination.value.total -= 1
      }
      
      console.log('🗑️ Annonce supprimée du store:', id)
    }
  }
  
  /**
   * Définir l'annonce courante
   */
  const setCurrentAnimal = (animal) => {
    currentAnimal.value = animal
    console.log('📌 Annonce courante définie:', animal?.name || animal?.id)
  }
  
  /**
   * Vider l'annonce courante
   */
  const clearCurrentAnimal = () => {
    currentAnimal.value = null
    console.log('🧹 Annonce courante vidée')
  }
  
  /**
   * Recherche géographique
   */
  const searchByLocation = async (latitude, longitude, radius = 5, additionalOptions = {}) => {
    const locationOptions = {
      latitude,
      longitude,
      radius,
      ...additionalOptions
    }
    
    console.log('🌍 Recherche géographique:', locationOptions)
    return await fetchAnimals(locationOptions, true) // Force refresh pour recherche
  }
  
  /**
   * Recherche textuelle
   */
  const searchByText = async (searchTerm, additionalOptions = {}) => {
    const searchOptions = {
      search: searchTerm,
      ...additionalOptions
    }
    
    console.log('🔍 Recherche textuelle:', searchOptions)
    return await fetchAnimals(searchOptions, true) // Force refresh pour recherche
  }
  
  // === ACTIONS DE MODÉRATION ===
  
  /**
   * Récupérer les annonces en attente de modération
   */
  const fetchPendingAnimals = async (options = {}) => {
    setLoading(true)
    clearError()
    
    try {
      console.log('⏳ Récupération annonces en attente')
      const response = await lostAnimalsService.getPendingAnimals(options)
      
      if (response.success) {
        animals.value = response.data
        pagination.value = response.pagination
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des annonces en attente'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Récupérer les annonces approuvées
   */
  const fetchApprovedAnimals = async (options = {}) => {
    setLoading(true)
    clearError()
    
    try {
      console.log('✅ Récupération annonces approuvées')
      const response = await lostAnimalsService.getApprovedAnimals(options)
      
      if (response.success) {
        animals.value = response.data
        pagination.value = response.pagination
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des annonces approuvées'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Récupérer MES annonces (toutes, peu importe le statut)
   */
  const fetchMyAnimals = async (options = {}) => {
    setLoading(true)
    clearError()
    
    try {
      console.log('🔍 Récupération de mes annonces')
      const response = await lostAnimalsService.getMyAnimals(options)
      
      if (response.success) {
        // Ne pas remplacer animals.value pour ne pas affecter la liste publique
        // Retourner directement les données pour le composant
        return { 
          success: true, 
          data: response.data,
          pagination: response.pagination,
          filters: response.filters
        }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération de vos annonces'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Récupérer les annonces rejetées
   */
  const fetchRejectedAnimals = async (options = {}) => {
    setLoading(true)
    clearError()
    
    try {
      console.log('❌ Récupération annonces rejetées')
      const response = await lostAnimalsService.getRejectedAnimals(options)
      
      if (response.success) {
        animals.value = response.data
        pagination.value = response.pagination
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des annonces rejetées'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Récupérer les annonces résolues
   */
  const fetchResolvedAnimals = async (options = {}) => {
    setLoading(true)
    clearError()
    
    try {
      console.log('🎉 Récupération annonces résolues')
      const response = await lostAnimalsService.getResolvedAnimals(options)
      
      if (response.success) {
        animals.value = response.data
        pagination.value = response.pagination
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Erreur lors de la récupération des annonces résolues'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }
  
  /**
   * Approuver une annonce (vétérinaires)
   */
  const approveAnimal = async (id, approvalData = {}) => {
    setUpdating(true)
    clearError()
    
    try {
      console.log('✅ Approbation annonce:', id)
      const response = await lostAnimalsService.approveLostAnimal(id, approvalData)
      
      if (response.success) {
        // Mettre à jour le statut
        const index = animals.value.findIndex(animal => animal.id === id)
        if (index !== -1) {
          animals.value[index] = { ...animals.value[index], ...response.data, status: 'approved' }
        }
        
        console.log('✅ Annonce approuvée:', id)
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'approbation'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setUpdating(false)
    }
  }
  
  /**
   * Rejeter une annonce (vétérinaires)
   */
  const rejectAnimal = async (id, rejectionData = {}) => {
    setUpdating(true)
    clearError()
    
    try {
      console.log('❌ Rejet annonce:', id)
      const response = await lostAnimalsService.rejectLostAnimal(id, rejectionData)
      
      if (response.success) {
        // Mettre à jour le statut
        const index = animals.value.findIndex(animal => animal.id === id)
        if (index !== -1) {
          animals.value[index] = { ...animals.value[index], ...response.data, status: 'rejected' }
        }
        
        console.log('✅ Annonce rejetée:', id)
        return { success: true, data: response.data }
      } else {
        setError(response.error)
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors du rejet'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setUpdating(false)
    }
  }
  
  // === HELPERS POUR LES ÉTATS ===
  
  const setLoading = (loading) => {
    isLoading.value = loading
  }
  
  const setCreating = (creating) => {
    isCreating.value = creating
  }
  
  const setUpdating = (updating) => {
    isUpdating.value = updating
  }
  
  const setDeleting = (deleting) => {
    isDeleting.value = deleting
  }
  
  // === RETOUR DU STORE ===
  
  return {
    // État
    animals,
    currentAnimal,
    pagination,
    filters,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    
    // Getters
    lostAnimals,
    foundAnimals,
    pendingAnimals,
    approvedAnimals,
    resolvedAnimals,
    stats,
    isCacheValid,
    
    // Actions principales
    fetchAnimals,
    fetchAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    resolveAnimal,
    
    // Actions utilitaires
    removeAnimal,
    setCurrentAnimal,
    clearCurrentAnimal,
    updateFilters,
    resetFilters,
    resetState,
    clearError,
    
    // Recherche
    searchByLocation,
    searchByText,
    
    // Modération
    fetchPendingAnimals,
    fetchApprovedAnimals,
    fetchMyAnimals, // Récupérer MES annonces
    fetchRejectedAnimals,
    fetchResolvedAnimals,
    approveAnimal,
    rejectAnimal
  }
})
