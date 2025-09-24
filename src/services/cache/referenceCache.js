// Service de cache pour les données de référence (espèces, races)
export const referenceCacheService = {
  // Configuration du cache
  config: {
    CACHE_VERSION: '1.0',
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 heures
    STORAGE_KEYS: {
      SPECIES: 'animoplus_species_cache',
      LAST_UPDATE: 'animoplus_species_last_update'
    }
  },

  /**
   * Vérifier si le cache est valide
   */
  isCacheValid(cacheKey) {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (!cached) return false

      const data = JSON.parse(cached)
      
      // Vérifier la version
      if (data.version !== this.config.CACHE_VERSION) {
        console.log('🔄 Cache version obsolète, invalidation')
        this.clearCache(cacheKey)
        return false
      }

      // Vérifier l'expiration
      const now = Date.now()
      const isExpired = (now - data.timestamp) > this.config.CACHE_DURATION
      
      if (isExpired) {
        console.log('⏰ Cache expiré, invalidation')
        this.clearCache(cacheKey)
        return false
      }

      console.log('✅ Cache valide, utilisation des données locales')
      return true
    } catch (error) {
      console.error('❌ Erreur lecture cache:', error)
      this.clearCache(cacheKey)
      return false
    }
  },

  /**
   * Récupérer les données du cache
   */
  getFromCache(cacheKey) {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (!cached) return null

      const data = JSON.parse(cached)
      return data.data
    } catch (error) {
      console.error('❌ Erreur récupération cache:', error)
      return null
    }
  },

  /**
   * Sauvegarder les données en cache
   */
  saveToCache(cacheKey, data) {
    try {
      const cacheData = {
        version: this.config.CACHE_VERSION,
        timestamp: Date.now(),
        data: data
      }

      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
      localStorage.setItem(this.config.STORAGE_KEYS.LAST_UPDATE, Date.now().toString())
      
      console.log('💾 Données sauvegardées en cache:', {
        key: cacheKey,
        itemCount: Array.isArray(data) ? data.length : 'N/A',
        timestamp: new Date().toLocaleString()
      })
    } catch (error) {
      console.error('❌ Erreur sauvegarde cache:', error)
      
      // Si erreur de quota, nettoyer les anciens caches
      if (error.name === 'QuotaExceededError') {
        this.clearOldCaches()
        // Réessayer une fois
        try {
          localStorage.setItem(cacheKey, JSON.stringify(cacheData))
        } catch (retryError) {
          console.error('❌ Impossible de sauvegarder même après nettoyage:', retryError)
        }
      }
    }
  },

  /**
   * Vider un cache spécifique
   */
  clearCache(cacheKey) {
    try {
      localStorage.removeItem(cacheKey)
      console.log('🗑️ Cache vidé:', cacheKey)
    } catch (error) {
      console.error('❌ Erreur vidage cache:', error)
    }
  },

  /**
   * Vider tous les caches de référence
   */
  clearAllCaches() {
    Object.values(this.config.STORAGE_KEYS).forEach(key => {
      this.clearCache(key)
    })
    console.log('🗑️ Tous les caches de référence vidés')
  },

  /**
   * Nettoyer les anciens caches (pour libérer de l'espace)
   */
  clearOldCaches() {
    try {
      const keysToRemove = []
      
      // Parcourir localStorage pour trouver les anciens caches
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('animoplus_') && !Object.values(this.config.STORAGE_KEYS).includes(key)) {
          keysToRemove.push(key)
        }
      }
      
      // Supprimer les anciens caches
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      if (keysToRemove.length > 0) {
        console.log('🧹 Anciens caches nettoyés:', keysToRemove)
      }
    } catch (error) {
      console.error('❌ Erreur nettoyage anciens caches:', error)
    }
  },

  /**
   * Obtenir les informations du cache
   */
  getCacheInfo() {
    const info = {
      species: {
        exists: false,
        valid: false,
        timestamp: null,
        itemCount: 0
      }
    }

    try {
      const speciesCache = localStorage.getItem(this.config.STORAGE_KEYS.SPECIES)
      if (speciesCache) {
        const data = JSON.parse(speciesCache)
        info.species = {
          exists: true,
          valid: this.isCacheValid(this.config.STORAGE_KEYS.SPECIES),
          timestamp: new Date(data.timestamp).toLocaleString(),
          itemCount: Array.isArray(data.data) ? data.data.length : 0
        }
      }
    } catch (error) {
      console.error('❌ Erreur lecture info cache:', error)
    }

    return info
  },

  /**
   * Forcer la mise à jour du cache (pour les admins)
   */
  async forceRefresh(fetchFunction) {
    try {
      console.log('🔄 Mise à jour forcée du cache...')
      
      // Vider le cache actuel
      this.clearAllCaches()
      
      // Récupérer les nouvelles données
      const freshData = await fetchFunction()
      
      // Sauvegarder en cache
      this.saveToCache(this.config.STORAGE_KEYS.SPECIES, freshData)
      
      console.log('✅ Cache mis à jour avec succès')
      return freshData
    } catch (error) {
      console.error('❌ Erreur mise à jour forcée:', error)
      throw error
    }
  },

  /**
   * Vérifier si une mise à jour en arrière-plan est nécessaire
   */
  needsBackgroundUpdate() {
    try {
      const lastUpdate = localStorage.getItem(this.config.STORAGE_KEYS.LAST_UPDATE)
      if (!lastUpdate) return true

      const timeSinceUpdate = Date.now() - parseInt(lastUpdate)
      const backgroundUpdateThreshold = 12 * 60 * 60 * 1000 // 12 heures

      return timeSinceUpdate > backgroundUpdateThreshold
    } catch (error) {
      console.error('❌ Erreur vérification mise à jour:', error)
      return true
    }
  }
}

export default referenceCacheService
