import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'
import { referenceCacheService } from '@/services/cache/referenceCache.js'

/**
 * Service pour la gestion des types de services
 */
export const serviceTypesService = {
  /**
   * Récupérer tous les types de services
   * @param {Object} options - Options de requête
   * @returns {Promise<Array>} Liste des types de services
   */
  async getServiceTypes(options = {}) {
    try {
      const cacheKey = referenceCacheService.config.STORAGE_KEYS.SERVICE_TYPES
      
      // Vérifier le cache si pas de force refresh
      if (!options.force_refresh && referenceCacheService.isCacheValid(cacheKey)) {
        const cachedData = referenceCacheService.getFromCache(cacheKey)
        if (cachedData) {
          console.log('📦 Types de services depuis le cache:', cachedData.length)
          return cachedData
        }
      }
      
      console.log('🌐 Récupération types de services depuis l\'API...')
      
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
        `${API_ENDPOINTS.SERVICE_TYPES.LIST}?${queryString}` : 
        API_ENDPOINTS.SERVICE_TYPES.LIST
      
      console.log('🔍 URL types de services:', url)
      
      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API types de services:', response.data)
      
      // Extraire les données selon le format de réponse
      let serviceTypesData = []
      
      if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        // Format paginé: { success: true, data: { data: [...], current_page: 1, ... } }
        serviceTypesData = response.data.data.data
      } else if (response.data && Array.isArray(response.data.data)) {
        // Format standard: { success: true, data: [...] }
        serviceTypesData = response.data.data
      } else if (response.data && Array.isArray(response.data.service_types)) {
        // Format spécialisé: { success: true, service_types: [...] }
        serviceTypesData = response.data.service_types
      } else if (Array.isArray(response.data)) {
        // Format direct: [...]
        serviceTypesData = response.data
      }
      
      console.log('📋 Types de services extraits:', serviceTypesData.length)
      
      // Sauvegarder en cache si données valides
      if (serviceTypesData.length > 0) {
        referenceCacheService.saveToCache(cacheKey, serviceTypesData)
      }
      
      return serviceTypesData
      
    } catch (error) {
      console.error('❌ Erreur récupération types de services:', error)
      
      // En cas d'erreur, essayer de retourner les données du cache
      const cacheKey = referenceCacheService.config.STORAGE_KEYS.SERVICE_TYPES
      const cachedData = referenceCacheService.getFromCache(cacheKey)
      
      if (cachedData) {
        console.log('⚠️ Utilisation cache en cas d\'erreur:', cachedData.length)
        return cachedData
      }
      
      throw error
    }
  },

  /**
   * Récupérer un type de service par ID
   * @param {string} serviceTypeId - ID du type de service
   * @returns {Promise<Object>} Type de service
   */
  async getServiceTypeById(serviceTypeId) {
    try {
      console.log('🔍 Récupération type de service:', serviceTypeId)
      
      const response = await apiClient.get(API_ENDPOINTS.SERVICE_TYPES.DETAIL(serviceTypeId))
      
      console.log('✅ Type de service récupéré:', response.data)
      
      return response.data.data || response.data
      
    } catch (error) {
      console.error('❌ Erreur récupération type de service:', error)
      throw error
    }
  },

  /**
   * Récupérer les types de services actifs uniquement
   * @param {Object} options - Options de requête
   * @returns {Promise<Array>} Liste des types de services actifs
   */
  async getActiveServiceTypes(options = {}) {
    return await this.getServiceTypes({
      ...options,
      is_active: true
    })
  },

  /**
   * Forcer la mise à jour du cache des types de services
   * @returns {Promise<Array>} Nouvelles données
   */
  async forceRefreshCache() {
    const cacheKey = referenceCacheService.config.STORAGE_KEYS.SERVICE_TYPES
    
    return await referenceCacheService.forceRefresh(cacheKey, async () => {
      // Récupérer les données depuis l'API sans cache
      const response = await apiClient.get(API_ENDPOINTS.SERVICE_TYPES.LIST)
      
      console.log('🔄 Force refresh - Réponse API:', response.data)
      
      let serviceTypesData = []
      
      if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        // Format paginé: { success: true, data: { data: [...], current_page: 1, ... } }
        serviceTypesData = response.data.data.data
        console.log('📦 Format paginé détecté, données extraites:', serviceTypesData.length)
      } else if (response.data && Array.isArray(response.data.data)) {
        serviceTypesData = response.data.data
        console.log('📦 Format standard détecté, données extraites:', serviceTypesData.length)
      } else if (response.data && Array.isArray(response.data.service_types)) {
        serviceTypesData = response.data.service_types
        console.log('📦 Format spécialisé détecté, données extraites:', serviceTypesData.length)
      } else if (Array.isArray(response.data)) {
        serviceTypesData = response.data
        console.log('📦 Format direct détecté, données extraites:', serviceTypesData.length)
      }
      
      console.log('✅ Types de services pour cache:', serviceTypesData)
      
      return serviceTypesData
    })
  },

  /**
   * Invalider le cache des types de services
   */
  invalidateCache() {
    const cacheKey = referenceCacheService.config.STORAGE_KEYS.SERVICE_TYPES
    referenceCacheService.invalidateCache(cacheKey)
  },

  /**
   * Vider le cache des types de services
   */
  clearCache() {
    const cacheKey = referenceCacheService.config.STORAGE_KEYS.SERVICE_TYPES
    referenceCacheService.clearCache(cacheKey)
  },

  /**
   * Obtenir les statistiques du cache des types de services
   */
  getCacheStats() {
    const cacheKey = referenceCacheService.config.STORAGE_KEYS.SERVICE_TYPES
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

export default serviceTypesService
