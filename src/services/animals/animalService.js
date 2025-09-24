import { apiClient } from '../api/config.js'

// Endpoints API pour les animaux
const API_ENDPOINTS = {
  ANIMALS: {
    LIST: '/animaux',
    CREATE: '/animaux',
    GET_BY_ID: (id) => `/animaux/${id}`,
    UPDATE: (id) => `/animaux/${id}`,
    DELETE: (id) => `/animaux/${id}`,
    UPLOAD_PHOTO: (id) => `/animaux/${id}/photo`
  }
}

/**
 * Service pour la gestion des animaux
 */
export const animalService = {
  
  /**
   * Récupérer la liste des animaux avec pagination et filtres
   * @param {Object} params - Paramètres de requête
   * @param {number} params.page - Numéro de page (défaut: 1)
   * @param {number} params.per_page - Nombre d'éléments par page (défaut: 10)
   * @param {string} params.search - Terme de recherche
   * @param {number} params.espece_id - ID de l'espèce pour filtrer
   * @param {number} params.race_id - ID de la race pour filtrer
   * @param {number} params.proprietaire_id - ID du propriétaire pour filtrer
   * @param {boolean} params.with_espece - Inclure les données d'espèce
   * @param {boolean} params.with_race - Inclure les données de race
   * @param {boolean} params.with_proprietaire - Inclure les données du propriétaire
   * @returns {Promise<Object>} Réponse avec données et pagination
   */
  async getAnimals(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Paramètres de pagination
      if (params.page) queryParams.append('page', params.page)
      if (params.per_page) queryParams.append('per_page', params.per_page)
      
      // Paramètres de recherche et filtres
      if (params.search) queryParams.append('search', params.search)
      if (params.espece_id) queryParams.append('espece_id', params.espece_id)
      if (params.race_id) queryParams.append('race_id', params.race_id)
      if (params.proprietaire_id) queryParams.append('proprietaire_id', params.proprietaire_id)
      
      // Paramètres d'inclusion des relations
      if (params.with_espece) queryParams.append('with_espece', 'true')
      if (params.with_race) queryParams.append('with_race', 'true')
      if (params.with_proprietaire) queryParams.append('with_proprietaire', 'true')
      
      const url = `${API_ENDPOINTS.ANIMALS.LIST}?${queryParams.toString()}`
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || [],
        pagination: response.data.pagination || {},
        total: response.data.pagination?.total || 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des animaux:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des animaux',
        data: [],
        pagination: {},
        total: 0
      }
    }
  },

  /**
   * Récupérer un animal par son ID
   * @param {number} id - ID de l'animal
   * @param {Object} options - Options d'inclusion
   * @param {boolean} options.with_espece - Inclure les données d'espèce
   * @param {boolean} options.with_race - Inclure les données de race
   * @param {boolean} options.with_proprietaire - Inclure les données du propriétaire
   * @returns {Promise<Object>} Données de l'animal
   */
  async getAnimalById(id, options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (options.with_espece) queryParams.append('with_espece', 'true')
      if (options.with_race) queryParams.append('with_race', 'true')
      if (options.with_proprietaire) queryParams.append('with_proprietaire', 'true')
      
      const url = `${API_ENDPOINTS.ANIMALS.GET_BY_ID(id)}?${queryParams.toString()}`
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'animal:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de l\'animal',
        data: null
      }
    }
  },

  /**
   * Créer un nouvel animal
   * @param {Object} animalData - Données de l'animal
   * @param {string} animalData.nom - Nom de l'animal
   * @param {number} animalData.espece_id - ID de l'espèce
   * @param {number} animalData.race_id - ID de la race (optionnel)
   * @param {string} animalData.sexe - Sexe de l'animal (M/F)
   * @param {string} animalData.date_naissance - Date de naissance (YYYY-MM-DD)
   * @param {string} animalData.couleur - Couleur de l'animal
   * @param {number} animalData.poids - Poids en kg
   * @param {string} animalData.numero_puce - Numéro de puce électronique
   * @param {string} animalData.numero_tatouage - Numéro de tatouage
   * @param {boolean} animalData.sterilise - Animal stérilisé
   * @param {string} animalData.observations - Observations
   * @param {number} animalData.proprietaire_id - ID du propriétaire
   * @returns {Promise<Object>} Animal créé
   */
  async createAnimal(animalData) {
    try {
      // Validation des champs requis
      const requiredFields = ['nom', 'espece_id', 'sexe', 'proprietaire_id']
      for (const field of requiredFields) {
        if (!animalData[field]) {
          throw new Error(`Le champ ${field} est requis`)
        }
      }

      const response = await apiClient.post(API_ENDPOINTS.ANIMALS.CREATE, animalData)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Animal créé avec succès'
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'animal:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la création de l\'animal',
        data: null
      }
    }
  },

  /**
   * Mettre à jour un animal
   * @param {number} id - ID de l'animal
   * @param {Object} animalData - Données à mettre à jour
   * @returns {Promise<Object>} Animal mis à jour
   */
  async updateAnimal(id, animalData) {
    try {
      const response = await apiClient.put(API_ENDPOINTS.ANIMALS.UPDATE(id), animalData)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Animal mis à jour avec succès'
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'animal:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de l\'animal',
        data: null
      }
    }
  },

  /**
   * Supprimer un animal
   * @param {number} id - ID de l'animal
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async deleteAnimal(id) {
    try {
      await apiClient.delete(API_ENDPOINTS.ANIMALS.DELETE(id))
      
      return {
        success: true,
        message: 'Animal supprimé avec succès'
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'animal:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression de l\'animal'
      }
    }
  },

  /**
   * Uploader une photo pour un animal
   * @param {number} id - ID de l'animal
   * @param {File} file - Fichier image
   * @returns {Promise<Object>} URL de la photo uploadée
   */
  async uploadAnimalPhoto(id, file) {
    try {
      // Validation du fichier
      if (!file) {
        throw new Error('Aucun fichier sélectionné')
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Format de fichier non supporté. Utilisez JPG, PNG ou WebP.')
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('Le fichier est trop volumineux. Taille maximum : 5MB')
      }

      const formData = new FormData()
      formData.append('photo', file)

      const response = await apiClient.post(API_ENDPOINTS.ANIMALS.UPLOAD_PHOTO(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Photo uploadée avec succès'
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'upload de la photo'
      }
    }
  },

  /**
   * Rechercher des animaux par nom
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} options - Options de recherche
   * @returns {Promise<Object>} Résultats de recherche
   */
  async searchAnimals(searchTerm, options = {}) {
    return this.getAnimals({
      search: searchTerm,
      per_page: options.limit || 20,
      with_espece: true,
      with_race: true,
      with_proprietaire: true,
      ...options
    })
  },

  /**
   * Récupérer les animaux d'un propriétaire spécifique
   * @param {number} proprietaireId - ID du propriétaire
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Animaux du propriétaire
   */
  async getAnimalsByOwner(proprietaireId, options = {}) {
    return this.getAnimals({
      proprietaire_id: proprietaireId,
      with_espece: true,
      with_race: true,
      per_page: options.limit || 50,
      ...options
    })
  },

  /**
   * Récupérer les animaux par espèce
   * @param {number} especeId - ID de l'espèce
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Animaux de l'espèce
   */
  async getAnimalsBySpecies(especeId, options = {}) {
    return this.getAnimals({
      espece_id: especeId,
      with_race: true,
      with_proprietaire: true,
      per_page: options.limit || 50,
      ...options
    })
  }
}

export default animalService
