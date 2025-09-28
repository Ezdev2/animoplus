// Service de cache pour les données de référence (espèces, races)
export const referenceCacheService = {
  // Configuration du cache
  config: {
    CACHE_VERSION: '1.0',
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 heures
    STORAGE_KEYS: {
      SPECIES: 'animoplus_species_cache',
      SERVICE_TYPES: 'animoplus_service_types_cache',
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
      const updateThreshold = 6 * 60 * 60 * 1000 // 6 heures

      return timeSinceUpdate > updateThreshold
    } catch (error) {
      console.error('❌ Erreur vérification mise à jour:', error)
      return true
    }
  },

  /**
   * Initialiser le cache avec les données réelles de l'API
   */
  initializeServiceTypesCache() {
    const realServiceTypes = [
      {
        "id": "019990f6-4a93-7265-8eb3-e0e0d77111f5",
        "name": "Chirurgie",
        "description": "Interventions chirurgicales",
        "icon": "scissors",
        "color": "#EF4444",
        "is_active": true,
        "created_at": "2025-09-28T15:34:44.000000Z",
        "updated_at": "2025-09-28T15:34:44.000000Z",
        "deleted_at": null
      },
      {
        "id": "019990f6-4a08-727a-9ba4-2e4fabef9aa6",
        "name": "Consultation",
        "description": "Examens et consultations médicales",
        "icon": "stethoscope",
        "color": "#3B82F6",
        "is_active": true,
        "created_at": "2025-09-28T15:34:43.000000Z",
        "updated_at": "2025-09-28T15:34:43.000000Z",
        "deleted_at": null
      },
      {
        "id": "019990f6-4b78-717a-b381-3a48a58066d0",
        "name": "Dentaire",
        "description": "Soins dentaires",
        "icon": "tooth",
        "color": "#06B6D4",
        "is_active": true,
        "created_at": "2025-09-28T15:34:44.000000Z",
        "updated_at": "2025-09-28T15:34:44.000000Z",
        "deleted_at": null
      },
      {
        "id": "019990f6-4b17-7095-8c57-af40b0a7566c",
        "name": "Diagnostic",
        "description": "Examens diagnostiques et analyses",
        "icon": "search",
        "color": "#8B5CF6",
        "is_active": true,
        "created_at": "2025-09-28T15:34:44.000000Z",
        "updated_at": "2025-09-28T15:34:44.000000Z",
        "deleted_at": null
      },
      {
        "id": "019990f6-4bbb-7375-8f41-c81920d65f02",
        "name": "Hospitalisation",
        "description": "Hospitalisation et surveillance",
        "icon": "bed",
        "color": "#6B7280",
        "is_active": true,
        "created_at": "2025-09-28T15:34:44.000000Z",
        "updated_at": "2025-09-28T15:34:44.000000Z",
        "deleted_at": null
      },
      {
        "id": "019990f6-4b9b-734b-b22b-1b38e1879091",
        "name": "Spécialisé",
        "description": "Consultations spécialisées",
        "icon": "star",
        "color": "#EC4899",
        "is_active": true,
        "created_at": "2025-09-28T15:34:44.000000Z",
        "updated_at": "2025-09-28T15:34:44.000000Z",
        "deleted_at": null
      },
      {
        "id": "019990f6-4b5e-712a-a429-2054103ad888",
        "name": "Urgence",
        "description": "Soins d'urgence",
        "icon": "alert",
        "color": "#F59E0B",
        "is_active": true,
        "created_at": "2025-09-28T15:34:44.000000Z",
        "updated_at": "2025-09-28T15:34:44.000000Z",
        "deleted_at": null
      },
      {
        "id": "019990f6-4ac7-71ee-ab31-373a0324051c",
        "name": "Vaccination",
        "description": "Vaccinations et prévention",
        "icon": "syringe",
        "color": "#10B981",
        "is_active": true,
        "created_at": "2025-09-28T15:34:44.000000Z",
        "updated_at": "2025-09-28T15:34:44.000000Z",
        "deleted_at": null
      }
    ]

    // Sauvegarder les données réelles en cache
    this.saveToCache(this.config.STORAGE_KEYS.SERVICE_TYPES, realServiceTypes)
    console.log('✅ Cache des types de services initialisé avec les données réelles de l\'API:', realServiceTypes.length, 'types')
    
    return realServiceTypes
  }
}
