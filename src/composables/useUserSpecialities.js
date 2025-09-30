import { computed } from 'vue'
import { useUserSpecialitiesStore } from '@/stores/userSpecialities.js'
import { userSpecialitiesService } from '@/services/userSpecialites/userSpecialitiesService.js'

/**
 * Composable pour la gestion des spécialités utilisateur
 * Interface unifiée combinant le store Pinia et les services API
 */
export function useUserSpecialities() {
  
  // ===== STORE PINIA =====
  const store = useUserSpecialitiesStore()
  
  // ===== GETTERS RÉACTIFS =====
  
  // Spécialités utilisateur
  const userSpecialities = computed(() => store.userSpecialities)
  const filteredSpecialities = computed(() => store.filteredSpecialities)
  const primarySpeciality = computed(() => store.primarySpeciality)
  const secondarySpecialities = computed(() => store.secondarySpecialities)
  const specialitiesByLevel = computed(() => store.specialitiesByLevel)
  
  // États
  const isLoading = computed(() => store.isLoading)
  const isCreating = computed(() => store.isCreating)
  const isUpdating = computed(() => store.isUpdating)
  const isDeleting = computed(() => store.isDeleting)
  const error = computed(() => store.error)
  
  // Statistiques
  const stats = computed(() => store.stats)
  const totalSpecialities = computed(() => store.totalSpecialities)
  const hasSpecialities = computed(() => store.hasSpecialities)
  const hasPrimarySpeciality = computed(() => store.hasPrimarySpeciality)
  
  // Filtres et pagination
  const filters = computed(() => store.filters)
  const pagination = computed(() => store.pagination)
  
  // ===== ACTIONS SIMPLIFIÉES =====
  
  /**
   * Charger les spécialités utilisateur
   */
  const loadUserSpecialities = async (options = {}) => {
    return await store.loadUserSpecialities(options)
  }
  
  /**
   * Ajouter une spécialité utilisateur
   */
  const addUserSpeciality = async (specialityData) => {
    console.log('Ajout d\'une spécialité utilisateur COTE STORE:', specialityData)
    // Validation côté client
    const validation = userSpecialitiesService.validateSpecialityData(specialityData)
    console.log('Validation des données de la spécialité: COTE SOTE', validation)
    if (!validation.isValid) {
      console.log('Données invalides: COTE SOTE', validation.errors)
      throw new Error(`Données invalides: ${Object.values(validation.errors).join(', ')}`)
    }
    
    return await store.addUserSpeciality(specialityData)
  }
  
  /**
   * Modifier une spécialité utilisateur
   */
  const updateUserSpeciality = async (id, specialityData) => {
    // Validation côté client
    const validation = userSpecialitiesService.validateSpecialityData(specialityData)
    if (!validation.isValid) {
      throw new Error(`Données invalides: ${Object.values(validation.errors).join(', ')}`)
    }
    
    return await store.updateUserSpeciality(id, specialityData)
  }
  
  /**
   * Supprimer une spécialité utilisateur
   */
  const removeUserSpeciality = async (id) => {
    return await store.removeUserSpeciality(id)
  }
  
  /**
   * Définir une spécialité comme principale
   */
  const setPrimarySpeciality = async (id) => {
    return await store.setPrimarySpeciality(id)
  }
  
  /**
   * Rechercher des spécialités utilisateur
   */
  const searchUserSpecialities = (query) => {
    store.setFilters({ search: query })
  }
  
  /**
   * Filtrer par niveau de certification
   */
  const filterByCertificationLevel = (level) => {
    store.setFilters({ certification_level: level })
  }
  
  /**
   * Filtrer par statut principal
   */
  const filterByPrimaryStatus = (isPrimary) => {
    store.setFilters({ is_primary: isPrimary })
  }
  
  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    store.resetFilters()
  }
  
  /**
   * Vider les erreurs
   */
  const clearError = () => {
    store.clearError()
  }
  
  // ===== FONCTIONS UTILITAIRES =====
  
  /**
   * Formater une spécialité pour l'affichage
   */
  const formatSpecialityForDisplay = (speciality) => {
    return userSpecialitiesService.formatSpecialityForDisplay(speciality)
  }
  
  /**
   * Obtenir le label du niveau de certification
   */
  const getCertificationLevelLabel = (level) => {
    return userSpecialitiesService.getCertificationLevelLabel(level)
  }
  
  /**
   * Obtenir la couleur du niveau de certification
   */
  const getCertificationLevelColor = (level) => {
    return userSpecialitiesService.getCertificationLevelColor(level)
  }
  
  /**
   * Obtenir l'icône du niveau de certification
   */
  const getCertificationLevelIcon = (level) => {
    return userSpecialitiesService.getCertificationLevelIcon(level)
  }
  
  /**
   * Vérifier si une spécialité est déjà ajoutée
   */
  const hasSpeciality = (specialityId) => {
    return userSpecialities.value.some(spec => spec.specialty?.id === specialityId)
  }
  
  /**
   * Obtenir une spécialité utilisateur par ID
   */
  const getUserSpecialityById = (id) => {
    return userSpecialities.value.find(spec => spec.id === id)
  }
  
  /**
   * Obtenir les spécialités pour un select
   */
  const getSpecialitiesForSelect = computed(() => {
    return userSpecialities.value.map(spec => ({
      value: spec.id,
      label: spec.specialty?.name || 'Spécialité inconnue',
      description: spec.specialty?.description,
      certificationLevel: spec.certification_level,
      isPrimary: spec.is_primary
    }))
  })
  
  /**
   * Obtenir les niveaux de certification disponibles
   */
  const getCertificationLevels = () => {
    return [
      { value: 'junior', label: 'Junior', icon: '🌱', color: '#10B981' },
      { value: 'senior', label: 'Senior', icon: '🎯', color: '#3B82F6' },
      { value: 'expert', label: 'Expert', icon: '⭐', color: '#F59E0B' }
    ]
  }
  
  /**
   * Valider les données d'une spécialité
   */
  const validateSpecialityData = (data) => {
    return userSpecialitiesService.validateSpecialityData(data)
  }
  
  /**
   * Obtenir le résumé des spécialités
   */
  const getSpecialitiesSummary = computed(() => {
    const summary = {
      total: stats.value.total,
      primary: primarySpeciality.value ? {
        name: primarySpeciality.value.specialty?.name,
        level: primarySpeciality.value.certification_level,
        levelLabel: getCertificationLevelLabel(primarySpeciality.value.certification_level)
      } : null,
      secondary: stats.value.secondary,
      levels: Object.entries(stats.value.byLevel)
        .filter(([_, count]) => count > 0)
        .map(([level, count]) => ({
          level,
          label: getCertificationLevelLabel(level),
          count,
          icon: getCertificationLevelIcon(level),
          color: getCertificationLevelColor(level)
        }))
    }
    
    return summary
  })
  
  /**
   * Vérifier si l'utilisateur peut ajouter une spécialité
   */
  const canAddSpeciality = computed(() => {
    // Logique métier : par exemple, limite de spécialités
    return userSpecialities.value.length < 10 // Limite arbitraire
  })
  
  /**
   * Vérifier si l'utilisateur peut définir une spécialité comme principale
   */
  const canSetPrimary = (specialityId) => {
    const speciality = getUserSpecialityById(specialityId)
    return speciality && !speciality.is_primary
  }
  
  /**
   * Obtenir les suggestions de spécialités manquantes
   */
  const getMissingSpecialitiesSuggestions = () => {
    // Cette fonction pourrait suggérer des spécialités complémentaires
    // basées sur les spécialités actuelles de l'utilisateur
    const currentSpecialityNames = userSpecialities.value.map(spec => spec.specialty?.name).filter(Boolean)
    
    // Suggestions basiques (à adapter selon la logique métier)
    const suggestions = []
    
    if (currentSpecialityNames.includes('Cardiologie') && !currentSpecialityNames.includes('Médecine interne')) {
      suggestions.push({
        name: 'Médecine interne',
        reason: 'Complémentaire à la cardiologie'
      })
    }
    
    if (currentSpecialityNames.includes('Chirurgie') && !currentSpecialityNames.includes('Anesthésiologie')) {
      suggestions.push({
        name: 'Anesthésiologie',
        reason: 'Essentielle pour la chirurgie'
      })
    }
    
    return suggestions
  }
  
  // ===== RETOUR DU COMPOSABLE =====
  
  return {
    // Données réactives
    userSpecialities,
    filteredSpecialities,
    primarySpeciality,
    secondarySpecialities,
    specialitiesByLevel,
    
    // États
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    
    // Statistiques
    stats,
    totalSpecialities,
    hasSpecialities,
    hasPrimarySpeciality,
    
    // Filtres et pagination
    filters,
    pagination,
    
    // Actions principales
    loadUserSpecialities,
    addUserSpeciality,
    updateUserSpeciality,
    removeUserSpeciality,
    setPrimarySpeciality,
    
    // Actions de filtrage
    searchUserSpecialities,
    filterByCertificationLevel,
    filterByPrimaryStatus,
    resetFilters,
    clearError,
    
    // Fonctions utilitaires
    formatSpecialityForDisplay,
    getCertificationLevelLabel,
    getCertificationLevelColor,
    getCertificationLevelIcon,
    hasSpeciality,
    getUserSpecialityById,
    getSpecialitiesForSelect,
    getCertificationLevels,
    validateSpecialityData,
    
    // Getters calculés
    getSpecialitiesSummary,
    canAddSpeciality,
    canSetPrimary,
    getMissingSpecialitiesSuggestions
  }
}
