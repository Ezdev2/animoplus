import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userSpecialitiesService } from '@/services/userSpecialites/userSpecialitiesService.js'

/**
 * Store Pinia pour la gestion des spécialités utilisateur
 * Gère l'état global des spécialités du vétérinaire connecté
 */
export const useUserSpecialitiesStore = defineStore('userSpecialities', () => {
  
  // ===== ÉTAT RÉACTIF =====
  
  // Liste des spécialités utilisateur
  const userSpecialities = ref([])
  
  // Spécialité utilisateur actuellement sélectionnée
  const currentUserSpeciality = ref(null)
  
  // États de chargement
  const isLoading = ref(false)
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)
  
  // Gestion des erreurs
  const error = ref(null)
  const lastError = ref(null)
  
  // Filtres et pagination
  const filters = ref({
    search: '',
    certification_level: '',
    is_primary: null
  })
  
  const pagination = ref({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1
  })
  
  // Statistiques
  const stats = ref({
    total: 0,
    primary: 0,
    secondary: 0,
    byLevel: {
      junior: 0,
      senior: 0,
      expert: 0
    }
  })
  
  // ===== GETTERS CALCULÉS =====
  
  // Spécialité principale
  const primarySpeciality = computed(() => {
    return userSpecialities.value.find(spec => spec.is_primary) || null
  })
  
  // Spécialités secondaires
  const secondarySpecialities = computed(() => {
    return userSpecialities.value.filter(spec => !spec.is_primary)
  })
  
  // Spécialités par niveau de certification
  const specialitiesByLevel = computed(() => {
    const grouped = {
      junior: [],
      senior: [],
      expert: []
    }
    
    userSpecialities.value.forEach(spec => {
      if (spec.certification_level && grouped[spec.certification_level]) {
        grouped[spec.certification_level].push(spec)
      }
    })
    
    return grouped
  })
  
  // Spécialités filtrées
  const filteredSpecialities = computed(() => {
    let filtered = [...userSpecialities.value]
    
    // Filtrage par recherche
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      filtered = filtered.filter(spec => 
        spec.specialty?.name?.toLowerCase().includes(search) ||
        spec.specialty?.description?.toLowerCase().includes(search)
      )
    }
    
    // Filtrage par niveau de certification
    if (filters.value.certification_level) {
      filtered = filtered.filter(spec => spec.certification_level === filters.value.certification_level)
    }
    
    // Filtrage par statut principal
    if (filters.value.is_primary !== null) {
      filtered = filtered.filter(spec => spec.is_primary === filters.value.is_primary)
    }
    
    return filtered
  })
  
  // Nombre total de spécialités
  const totalSpecialities = computed(() => userSpecialities.value.length)
  
  // Vérifier si l'utilisateur a des spécialités
  const hasSpecialities = computed(() => userSpecialities.value.length > 0)
  
  // Vérifier si l'utilisateur a une spécialité principale
  const hasPrimarySpeciality = computed(() => !!primarySpeciality.value)
  
  // ===== ACTIONS =====
  
  /**
   * Charger les spécialités utilisateur
   */
  const loadUserSpecialities = async (options = {}) => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('🔄 Chargement des spécialités utilisateur...')
      
      const response = await userSpecialitiesService.getMySpecialities({
        ...options,
        with_specialty: true // Inclure les données de spécialité
      })
      
      if (response.success) {
        userSpecialities.value = response.data || []
        
        // Debug: Afficher la structure d'une spécialité
        if (userSpecialities.value.length > 0) {
          console.log('🔍 Structure première spécialité:', userSpecialities.value[0])
        }
        
        // Mettre à jour la pagination si disponible
        if (response.pagination) {
          pagination.value = { ...pagination.value, ...response.pagination }
        }
        
        // Calculer les statistiques
        calculateStats()
        
        console.log('✅ Spécialités utilisateur chargées:', userSpecialities.value.length)
      } else {
        throw new Error(response.error || 'Erreur lors du chargement des spécialités')
      }
    } catch (err) {
      console.error('❌ Erreur chargement spécialités utilisateur:', err)
      error.value = err.message
      lastError.value = err
    } finally {
      isLoading.value = false
    }
  }
  
  /**
   * Ajouter une spécialité utilisateur
   */
  const addUserSpeciality = async (specialityData) => {
    console.log("Mandalo ato aloha")
    isCreating.value = true
    error.value = null
    
    try {
      console.log('➕ Ajout spécialité utilisateur:', specialityData)
      
      const response = await userSpecialitiesService.addSpeciality(specialityData)
      
      if (response.success) {
        // Ajouter la nouvelle spécialité au store
        userSpecialities.value.push(response.data)
        
        // Recalculer les statistiques
        calculateStats()
        
        console.log('✅ Spécialité utilisateur ajoutée:', response.data)
        return response
      } else {
        throw new Error(response.error || 'Erreur lors de l\'ajout de la spécialité')
      }
    } catch (err) {
      console.error('❌ Erreur ajout spécialité utilisateur:', err)
      error.value = err.message
      lastError.value = err
      throw err
    } finally {
      isCreating.value = false
    }
  }
  
  /**
   * Modifier une spécialité utilisateur
   */
  const updateUserSpeciality = async (id, specialityData) => {
    isUpdating.value = true
    error.value = null
    
    try {
      console.log('✏️ Modification spécialité utilisateur:', id, specialityData)
      
      const response = await userSpecialitiesService.updateSpeciality(id, specialityData)
      
      if (response.success) {
        // Mettre à jour la spécialité dans le store
        const index = userSpecialities.value.findIndex(spec => spec.id === id)
        if (index !== -1) {
          userSpecialities.value[index] = { ...userSpecialities.value[index], ...response.data }
        }
        
        // Recalculer les statistiques
        calculateStats()
        
        console.log('✅ Spécialité utilisateur modifiée:', response.data)
        return response
      } else {
        throw new Error(response.error || 'Erreur lors de la modification de la spécialité')
      }
    } catch (err) {
      console.error('❌ Erreur modification spécialité utilisateur:', err)
      error.value = err.message
      lastError.value = err
      throw err
    } finally {
      isUpdating.value = false
    }
  }
  
  /**
   * Supprimer une spécialité utilisateur
   */
  const removeUserSpeciality = async (id) => {
    isDeleting.value = true
    error.value = null
    
    try {
      console.log('🗑️ Suppression spécialité utilisateur:', id)
      
      const response = await userSpecialitiesService.removeSpeciality(id)
      
      if (response.success) {
        // Supprimer la spécialité du store
        const index = userSpecialities.value.findIndex(spec => spec.id === id)
        if (index !== -1) {
          const removedSpeciality = userSpecialities.value.splice(index, 1)[0]
          console.log('🗑️ Spécialité supprimée du store:', removedSpeciality.specialty?.name)
        }
        
        // Recalculer les statistiques
        calculateStats()
        
        console.log('✅ Spécialité utilisateur supprimée')
        return response
      } else {
        throw new Error(response.error || 'Erreur lors de la suppression de la spécialité')
      }
    } catch (err) {
      console.error('❌ Erreur suppression spécialité utilisateur:', err)
      error.value = err.message
      lastError.value = err
      throw err
    } finally {
      isDeleting.value = false
    }
  }
  
  /**
   * Définir une spécialité comme principale
   */
  const setPrimarySpeciality = async (id) => {
    isUpdating.value = true
    error.value = null
    
    try {
      console.log('⭐ Définition spécialité principale:', id)
      
      const response = await userSpecialitiesService.setPrimarySpeciality(id)
      
      if (response.success) {
        // Mettre à jour toutes les spécialités (une seule peut être principale)
        userSpecialities.value.forEach(spec => {
          spec.is_primary = spec.id === id
        })
        
        // Recalculer les statistiques
        calculateStats()
        
        console.log('✅ Spécialité définie comme principale')
        return response
      } else {
        throw new Error(response.error || 'Erreur lors de la définition de la spécialité principale')
      }
    } catch (err) {
      console.error('❌ Erreur définition spécialité principale:', err)
      error.value = err.message
      lastError.value = err
      throw err
    } finally {
      isUpdating.value = false
    }
  }
  
  /**
   * Calculer les statistiques
   */
  const calculateStats = () => {
    const total = userSpecialities.value.length
    const primary = userSpecialities.value.filter(spec => spec.is_primary).length
    const secondary = total - primary
    
    const byLevel = {
      junior: 0,
      senior: 0,
      expert: 0
    }
    
    userSpecialities.value.forEach(spec => {
      if (spec.certification_level && byLevel.hasOwnProperty(spec.certification_level)) {
        byLevel[spec.certification_level]++
      }
    })
    
    stats.value = {
      total,
      primary,
      secondary,
      byLevel
    }
    
    console.log('📊 Statistiques spécialités utilisateur:', stats.value)
  }
  
  /**
   * Définir les filtres
   */
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    filters.value = {
      search: '',
      certification_level: '',
      is_primary: null
    }
  }
  
  /**
   * Définir la spécialité utilisateur actuelle
   */
  const setCurrentUserSpeciality = (speciality) => {
    currentUserSpeciality.value = speciality
  }
  
  /**
   * Réinitialiser l'état
   */
  const resetState = () => {
    userSpecialities.value = []
    currentUserSpeciality.value = null
    error.value = null
    lastError.value = null
    resetFilters()
    pagination.value = {
      current_page: 1,
      per_page: 15,
      total: 0,
      last_page: 1
    }
    stats.value = {
      total: 0,
      primary: 0,
      secondary: 0,
      byLevel: {
        junior: 0,
        senior: 0,
        expert: 0
      }
    }
  }
  
  /**
   * Vider les erreurs
   */
  const clearError = () => {
    error.value = null
    lastError.value = null
  }
  
  // ===== RETOUR DU STORE =====
  
  return {
    // État
    userSpecialities,
    currentUserSpeciality,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    lastError,
    filters,
    pagination,
    stats,
    
    // Getters
    primarySpeciality,
    secondarySpecialities,
    specialitiesByLevel,
    filteredSpecialities,
    totalSpecialities,
    hasSpecialities,
    hasPrimarySpeciality,
    
    // Actions
    loadUserSpecialities,
    addUserSpeciality,
    updateUserSpeciality,
    removeUserSpeciality,
    setPrimarySpeciality,
    calculateStats,
    setFilters,
    resetFilters,
    setCurrentUserSpeciality,
    resetState,
    clearError
  }
})
