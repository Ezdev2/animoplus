import { computed } from 'vue'
import { useLostAnimalsStore } from '@/stores/lostAnimals.js'

/**
 * Composable pour la gestion des animaux perdus/trouvés
 * Interface unifiée entre les composants et le store Pinia
 */
export const useLostAnimals = () => {
  const store = useLostAnimalsStore()
  
  // === ÉTAT RÉACTIF ===
  
  const animals = computed(() => store.animals)
  const currentAnimal = computed(() => store.currentAnimal)
  const pagination = computed(() => store.pagination)
  const filters = computed(() => store.filters)
  
  // États de chargement
  const isLoading = computed(() => store.isLoading)
  const isCreating = computed(() => store.isCreating)
  const isUpdating = computed(() => store.isUpdating)
  const isDeleting = computed(() => store.isDeleting)
  
  // Gestion d'erreurs
  const error = computed(() => store.error)
  const hasError = computed(() => !!store.error)
  
  // === GETTERS CALCULÉS ===
  
  const lostAnimals = computed(() => store.lostAnimals)
  const foundAnimals = computed(() => store.foundAnimals)
  const pendingAnimals = computed(() => store.pendingAnimals)
  const approvedAnimals = computed(() => store.approvedAnimals)
  const resolvedAnimals = computed(() => store.resolvedAnimals)
  const stats = computed(() => store.stats)
  
  // === ACTIONS CRUD ===
  
  /**
   * Charger la liste des annonces
   */
  const loadAnimals = async (options = {}, forceRefresh = false) => {
    try {
      const result = await store.fetchAnimals(options, forceRefresh)
      return result
    } catch (error) {
      console.error('❌ Erreur chargement annonces:', error)
      return { success: false, error: error.message }
    }
  }

  
  /**
   * Charger une annonce par ID
   */
  const loadAnimalById = async (id) => {
    try {
      const result = await store.fetchAnimalById(id)
      return result
    } catch (error) {
      console.error('❌ Erreur chargement annonce:', error)
      return { success: false, error: error.message }
    }
  }
  
  /**
   * Créer une nouvelle annonce
   */
  const createAnimal = async (animalData) => {
    try {
      // Validation des données de base
      const validationError = validateAnimalData(animalData)
      if (validationError) {
        return { success: false, error: validationError }
      }
      
      const result = await store.createAnimal(animalData)
      return result
    } catch (error) {
      console.error('❌ Erreur création annonce:', error)
      return { success: false, error: error.message }
    }
  }
  
  /**
   * Modifier une annonce
   */
  const updateAnimal = async (id, updateData) => {
    try {
      const result = await store.updateAnimal(id, updateData)
      return result
    } catch (error) {
      console.error('❌ Erreur modification annonce:', error)
      return { success: false, error: error.message }
    }
  }
  
  /**
   * Supprimer une annonce
   */
  const deleteAnimal = async (id) => {
    try {
      const result = await store.deleteAnimal(id)
      return result
    } catch (error) {
      console.error('❌ Erreur suppression annonce:', error)
      return { success: false, error: error.message }
    }
  }
  
  /**
   * Marquer comme résolu
   */
  const resolveAnimal = async (id, resolutionData = {}) => {
    try {
      const result = await store.resolveAnimal(id, resolutionData)
      return result
    } catch (error) {
      console.error('❌ Erreur résolution annonce:', error)
      return { success: false, error: error.message }
    }
  }
  
  // === RECHERCHE ET FILTRES ===
  
  /**
   * Recherche géographique
   */
  const searchByLocation = async (latitude, longitude, radius = 5, options = {}) => {
    try {
      const result = await store.searchByLocation(latitude, longitude, radius, options)
      return result
    } catch (error) {
      console.error('❌ Erreur recherche géographique:', error)
      return { success: false, error: error.message }
    }
  }
  
  /**
   * Recherche textuelle
   */
  const searchByText = async (searchTerm, options = {}) => {
    try {
      const result = await store.searchByText(searchTerm, options)
      return result
    } catch (error) {
      console.error('❌ Erreur recherche textuelle:', error)
      return { success: false, error: error.message }
    }
  }
  
  /**
   * Mettre à jour les filtres
   */
  const updateFilters = (newFilters) => {
    store.updateFilters(newFilters)
  }
  
  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    store.resetFilters()
  }
  
  /**
   * Appliquer les filtres actuels
   */
  const applyFilters = async () => {
    return await loadAnimals({}, true) // Force refresh avec filtres actuels
  }
  
  // === MODÉRATION ===
  
  /**
   * Charger les annonces en attente
   */
  const loadPendingAnimals = async (options = {}) => {
    try {
      const result = await store.fetchPendingAnimals(options)
      return result
    } catch (error) {
      console.error('❌ Erreur chargement annonces en attente:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Charger les annonces approuvées
   */
  const loadApprovedAnimals = async (options = {}) => {
    try {
      const result = await store.fetchApprovedAnimals(options)
      return result
    } catch (error) {
      console.error('❌ Erreur chargement annonces approuvées:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Charger MES annonces (toutes, peu importe le statut)
   */
  const loadMyAnimals = async (options = {}) => {
    try {
      // Debug: vérifier si la fonction existe
      console.log('🔍 Debug store.fetchMyAnimals:', typeof store.fetchMyAnimals)
      
      if (typeof store.fetchMyAnimals !== 'function') {
        console.warn('⚠️ Fonction fetchMyAnimals non trouvée, appel direct du service')
        // Fallback: appel direct du service
        const { lostAnimalsService } = await import('@/services/lostAnimals/lostAnimalsService.js')
        return await lostAnimalsService.getMyAnimals(options)
      }
      
      const result = await store.fetchMyAnimals(options)
      return result
    } catch (error) {
      console.error('❌ Erreur chargement mes annonces:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Charger les annonces rejetées
   */
  const loadRejectedAnimals = async (options = {}) => {
    try {
      const result = await store.fetchRejectedAnimals(options)
      return result
    } catch (error) {
      console.error('❌ Erreur chargement annonces rejetées:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Charger les annonces résolues
   */
  const loadResolvedAnimals = async (options = {}) => {
    try {
      const result = await store.fetchResolvedAnimals(options)
      return result
    } catch (error) {
      console.error('❌ Erreur chargement annonces résolues:', error)
      return { success: false, error: error.message }
    }
  }
  
  /**
   * Approuver une annonce
   */
  const approveAnimal = async (id, approvalData = {}) => {
    try {
      const result = await store.approveAnimal(id, approvalData)
      return result
    } catch (error) {
      console.error('❌ Erreur approbation:', error)
      return { success: false, error: error.message }
    }
  }
  
  /**
   * Rejeter une annonce
   */
  const rejectAnimal = async (id, rejectionData = {}) => {
    try {
      const result = await store.rejectAnimal(id, rejectionData)
      return result
    } catch (error) {
      console.error('❌ Erreur rejet:', error)
      return { success: false, error: error.message }
    }
  }
  
  // === UTILITAIRES ===
  
  /**
   * Définir l'annonce courante
   */
  const setCurrentAnimal = (animal) => {
    store.setCurrentAnimal(animal)
  }
  
  /**
   * Vider l'annonce courante
   */
  const clearCurrentAnimal = () => {
    store.clearCurrentAnimal()
  }
  
  /**
   * Vider les erreurs
   */
  const clearError = () => {
    store.clearError()
  }
  
  /**
   * Réinitialiser le store
   */
  const resetStore = () => {
    store.resetState()
  }
  
  // === FONCTIONS DE VALIDATION ===
  
  /**
   * Valider les données d'une annonce
   */
  const validateAnimalData = (data) => {
    const errors = []
    
    // Champs obligatoires
    if (!data.type || !['lost', 'found'].includes(data.type)) {
      errors.push('Le type d\'annonce est requis (lost ou found)')
    }
    
    if (!data.animal_type || !['chien', 'chat', 'oiseau', 'lapin', 'autre'].includes(data.animal_type)) {
      errors.push('Le type d\'animal est requis')
    }
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Le nom/description doit contenir au moins 2 caractères')
    }
    
    if (!data.description || data.description.trim().length < 10) {
      errors.push('La description doit contenir au moins 10 caractères')
    }
    
    if (!data.location || data.location.trim().length < 5) {
      errors.push('La localisation doit contenir au moins 5 caractères')
    }
    
    if (!data.contact_name || data.contact_name.trim().length < 2) {
      errors.push('Le nom de contact est requis')
    }
    
    if (!data.contact_phone || !isValidPhone(data.contact_phone)) {
      errors.push('Un numéro de téléphone valide est requis')
    }
    
    if (!data.contact_email || !isValidEmail(data.contact_email)) {
      errors.push('Une adresse email valide est requise')
    }
    
    return errors.length > 0 ? errors.join(', ') : null
  }
  
  /**
   * Valider un numéro de téléphone
   */
  const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,15}$/
    return phoneRegex.test(phone.trim())
  }
  
  /**
   * Valider une adresse email
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.trim())
  }
  
  // === FONCTIONS UTILITAIRES ===
  
  /**
   * Formater la date d'une annonce
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'
    
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Date invalide'
    }
  }
  
  /**
   * Formater la distance
   */
  const formatDistance = (distance) => {
    if (!distance) return ''
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`
    } else {
      return `${distance.toFixed(1)} km`
    }
  }
  
  /**
   * Obtenir l'icône d'un type d'animal
   */
  const getAnimalIcon = (animalType) => {
    const icons = {
      chien: '🐕',
      chat: '🐱',
      oiseau: '🐦',
      lapin: '🐰',
      autre: '🐾'
    }
    return icons[animalType] || '🐾'
  }
  
  /**
   * Obtenir le label d'un type d'annonce
   */
  const getTypeLabel = (type) => {
    const labels = {
      lost: 'Perdu',
      found: 'Trouvé'
    }
    return labels[type] || type
  }
  
  /**
   * Obtenir la couleur d'un statut
   */
  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      approved: 'green',
      rejected: 'red',
      resolved: 'blue'
    }
    return colors[status] || 'gray'
  }
  
  /**
   * Obtenir le label d'un statut
   */
  const getStatusLabel = (status) => {
    const labels = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      resolved: 'Résolu'
    }
    return labels[status] || status
  }
  
  /**
   * Calculer la distance entre deux points (approximative)
   */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null
    
    const R = 6371 // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }
  
  /**
   * Générer un message de partage
   */
  const generateShareMessage = (animal) => {
    if (!animal) return ''
    
    const typeText = animal.type === 'lost' ? 'a disparu' : 'a été trouvé'
    const locationText = animal.location ? ` près de ${animal.location}` : ''
    const dateText = animal.created_at ? ` le ${formatDate(animal.created_at)}` : ''
    
    return `🐾 ${animal.name || 'Un animal'} (${animal.animal_type}) ${typeText}${locationText}${dateText}. 
    
${animal.description}

Contact: ${animal.contact_name} - ${animal.contact_phone}

Chaque partage compte ! 
#AnimoPlus #AnimalPerdu #Solidarité`
  }
  
  // === RETOUR DU COMPOSABLE ===
  
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
    hasError,
    
    // Getters
    lostAnimals,
    foundAnimals,
    pendingAnimals,
    approvedAnimals,
    resolvedAnimals,
    stats,
    
    // Actions CRUD
    loadAnimals,
    loadAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    resolveAnimal,
    
    // Recherche et filtres
    searchByLocation,
    searchByText,
    updateFilters,
    resetFilters,
    applyFilters,
    
    // Modération
    loadPendingAnimals,
    loadApprovedAnimals,
    loadMyAnimals,
    loadRejectedAnimals,
    loadResolvedAnimals,
    approveAnimal,
    rejectAnimal,
    
    // Utilitaires
    setCurrentAnimal,
    clearCurrentAnimal,
    clearError,
    resetStore,
    
    // Validation
    validateAnimalData,
    isValidPhone,
    isValidEmail,
    
    // Formatage et helpers
    formatDate,
    formatDistance,
    getAnimalIcon,
    getTypeLabel,
    getStatusColor,
    getStatusLabel,
    calculateDistance,
    generateShareMessage
  }
}

export default useLostAnimals
