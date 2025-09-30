import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'
import { referenceCacheService } from '@/services/cache/referenceCache.js'

/**
 * Service pour la gestion des espèces
 */
export const speciesService = {
  /**
   * Récupérer toutes les espèces
   * @param {Object} options - Options de requête
   * @returns {Promise<Array>} Liste des espèces
   */
  async getSpecies(options = {}) {
    try {
      const cacheKey = referenceCacheService.config.STORAGE_KEYS.SPECIES
      
      // Vérifier le cache si pas de force refresh
      if (!options.force_refresh && referenceCacheService.isCacheValid(cacheKey)) {
        const cachedData = referenceCacheService.getFromCache(cacheKey)
        if (cachedData) {
          console.log('📦 Espèces depuis le cache:', cachedData.length)
          return cachedData
        }
      }
      
      console.log('🌐 Récupération espèces depuis l\'API...')
      
      // Construire les paramètres de requête
      const params = new URLSearchParams()
      
      if (options.is_active !== undefined) {
        params.append('is_active', options.is_active)
      }
      
      if (options.per_page) {
        params.append('per_page', options.per_page)
      }
      
      if (options.search) {
        params.append('search', options.search)
      }
      
      // Construire l'URL
      const queryString = params.toString()
      const url = queryString ? 
        `${API_ENDPOINTS.SPECIES.LIST}?${queryString}` : 
        API_ENDPOINTS.SPECIES.LIST
      
      console.log('🔍 URL espèces:', url)
      
      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API espèces:', response.data)
      
      // Extraire les données selon le format de réponse
      let speciesData = []
      
      if (response.data && Array.isArray(response.data.data)) {
        // Format standard: { success: true, data: [...] }
        speciesData = response.data.data
      } else if (response.data && Array.isArray(response.data.species)) {
        // Format spécialisé: { success: true, species: [...] }
        speciesData = response.data.species
      } else if (Array.isArray(response.data)) {
        // Format direct: [...]
        speciesData = response.data
      }
      
      console.log('🐾 Espèces extraites:', speciesData.length)
      
      // Sauvegarder en cache si données valides
      if (speciesData.length > 0) {
        referenceCacheService.saveToCache(cacheKey, speciesData)
      }
      
      return speciesData
      
    } catch (error) {
      console.error('❌ Erreur récupération espèces:', error)
      
      // En cas d'erreur, essayer de retourner les données du cache
      const cacheKey = referenceCacheService.config.STORAGE_KEYS.SPECIES
      const cachedData = referenceCacheService.getFromCache(cacheKey)
      
      if (cachedData) {
        console.log('⚠️ Utilisation cache en cas d\'erreur:', cachedData.length)
        return cachedData
      }
      
      throw error
    }
  },

  /**
   * Récupérer une espèce par ID
   * @param {string} speciesId - ID de l'espèce
   * @returns {Promise<Object>} Espèce
   */
  async getSpeciesById(speciesId) {
    try {
      console.log('🔍 Récupération espèce:', speciesId)
      
      const response = await apiClient.get(API_ENDPOINTS.SPECIES.DETAIL(speciesId))
      
      console.log('✅ Espèce récupérée:', response.data)
      
      return response.data.data || response.data
      
    } catch (error) {
      console.error('❌ Erreur récupération espèce:', error)
      throw error
    }
  },

  /**
   * Récupérer les espèces actives uniquement
   * @param {Object} options - Options de requête
   * @returns {Promise<Array>} Liste des espèces actives
   */
  async getActiveSpecies(options = {}) {
    return await this.getSpecies({
      ...options,
      is_active: true
    })
  },

  /**
   * Forcer la mise à jour du cache des espèces
   * @returns {Promise<Array>} Nouvelles données
   */
  async forceRefreshCache() {
    const cacheKey = referenceCacheService.config.STORAGE_KEYS.SPECIES
    
    return await referenceCacheService.forceRefresh(cacheKey, async () => {
      // Récupérer les données depuis l'API sans cache
      const response = await apiClient.get(API_ENDPOINTS.SPECIES.LIST)
      
      let speciesData = []
      
      if (response.data && Array.isArray(response.data.data)) {
        speciesData = response.data.data
      } else if (response.data && Array.isArray(response.data.species)) {
        speciesData = response.data.species
      } else if (Array.isArray(response.data)) {
        speciesData = response.data
      }
      
      return speciesData
    })
  },

  /**
   * Invalider le cache des espèces
   */
  invalidateCache() {
    const cacheKey = referenceCacheService.config.STORAGE_KEYS.SPECIES
    referenceCacheService.invalidateCache(cacheKey)
  },

  /**
   * Vider le cache des espèces
   */
  clearCache() {
    const cacheKey = referenceCacheService.config.STORAGE_KEYS.SPECIES
    referenceCacheService.clearCache(cacheKey)
  },

  /**
   * Obtenir les statistiques du cache des espèces
   */
  getCacheStats() {
    const cacheKey = referenceCacheService.config.STORAGE_KEYS.SPECIES
    const cached = localStorage.getItem(cacheKey)
    
    if (!cached) {
      return {
        exists: false,
        valid: false
      }
    }
    
    try {
      const data = JSON.parse(cached)
      const isValid = referenceCacheService.isCacheValid(cacheKey)
      
      return {
        exists: true,
        valid: isValid,
        count: Array.isArray(data.data) ? data.data.length : 0,
        lastUpdate: new Date(data.timestamp).toLocaleString('fr-FR'),
        expiresAt: new Date(data.timestamp + referenceCacheService.config.CACHE_DURATION).toLocaleString('fr-FR'),
        size: new Blob([cached]).size
      }
    } catch (error) {
      return {
        exists: true,
        valid: false,
        error: 'Données corrompues'
      }
    }
  }
}

export default speciesService
