import { apiClient } from '../api/config.js'
import { API_ENDPOINTS } from '../api/endpoints.js'

/**
 * Service pour la gestion des espèces et races d'animaux
 */
export const speciesService = {
  
  /**
   * Récupérer toutes les espèces
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Liste des espèces
   */
  async getAllSpecies(options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (options.with_races) queryParams.append('with_races', 'true')
      if (options.active_only) queryParams.append('active_only', 'true')
      
      const url = `${API_ENDPOINTS.ANIMALS.SPECIES.LIST}?${queryParams.toString()}`
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data || []
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des espèces:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des espèces',
        data: []
      }
    }
  },

  /**
   * Récupérer une espèce par son ID
   * @param {number} id - ID de l'espèce
   * @param {Object} options - Options d'inclusion
   * @returns {Promise<Object>} Données de l'espèce
   */
  async getSpeciesById(id, options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (options.with_races) queryParams.append('with_races', 'true')
      
      const url = `${API_ENDPOINTS.ANIMALS.SPECIES.GET_BY_ID(id)}?${queryParams.toString()}`
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'espèce:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de l\'espèce',
        data: null
      }
    }
  },

  /**
   * Récupérer les races d'une espèce
   * @param {string} especeId - ID de l'espèce (UUID)
   * @returns {Promise<Object>} Liste des races
   */
  async getRacesBySpecies(especeId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANIMALS.SPECIES.RACES(especeId))
      
      console.log('Réponse API races:', response.data)
      
      // Adapter à la nouvelle structure de réponse
      let races = []
      if (response.data.data && response.data.data.races) {
        // Structure: { data: { espece: {...}, races: [...] } }
        races = response.data.data.races
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Structure: { data: [...] }
        races = response.data.data
      } else if (Array.isArray(response.data)) {
        // Structure directe: [...]
        races = response.data
      }
      
      console.log('Races extraites:', races)
      
      return {
        success: true,
        data: races
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des races:', error)
      
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des races',
        data: []
      }
    }
  },

  /**
   * Récupérer toutes les races
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Liste des races
   */
  async getAllRaces(options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (options.espece_id) queryParams.append('espece_id', options.espece_id)
      if (options.with_espece) queryParams.append('with_espece', 'true')
      if (options.active_only) queryParams.append('active_only', 'true')
      
      const url = `${API_ENDPOINTS.ANIMALS.RACES.LIST}?${queryParams.toString()}`
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data || []
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des races:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des races',
        data: []
      }
    }
  },

  /**
   * Récupérer une race par son ID
   * @param {number} id - ID de la race
   * @param {Object} options - Options d'inclusion
   * @returns {Promise<Object>} Données de la race
   */
  async getRaceById(id, options = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (options.with_espece) queryParams.append('with_espece', 'true')
      
      const url = `${API_ENDPOINTS.ANIMALS.RACES.GET_BY_ID(id)}?${queryParams.toString()}`
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la race:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de la race',
        data: null
      }
    }
  }
}

export default speciesService
