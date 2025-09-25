import { ref, computed, onMounted } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { referenceCacheService } from '@/services/cache/referenceCache.js'
import { serviceTypesService } from '@/services/services/serviceTypesService.js'

/**
 * Hook pour la gestion optimisée du cache des types de services
 * Stratégie hybride : LocalStorage + TanStack Query + Background refresh
 */
export function useServiceTypesCache(options = {}) {
  const queryClient = useQueryClient()
  
  // Configuration par défaut
  const config = {
    withStats: false,
    enableBackgroundRefresh: true,
    activeOnly: false,
    ...options
  }

  // États locaux
  const isLoadingFromCache = ref(true)
  const cacheInfo = ref(null)
  const backgroundRefreshStatus = ref('idle') // idle, refreshing, success, error

  // Clé de cache
  const CACHE_KEY = referenceCacheService.config.STORAGE_KEYS.SERVICE_TYPES

  /**
   * Fonction pour récupérer les données depuis l'API
   */
  const fetchServiceTypesFromAPI = async () => {
    try {
      console.log('🌐 Récupération des types de services depuis l\'API...')
      const response = await serviceTypesService.getAllServiceTypes({ 
        with_stats: config.withStats,
        active_only: config.activeOnly,
        per_page: 100 // Récupérer tous les types
      })
      
      if (!response || !response.success) {
        throw new Error(response?.error || 'Erreur lors de la récupération des types de services')
      }
      
      // Extraire les données de la pagination (structure Laravel)
      let data = []
      
      if (response.data?.data && Array.isArray(response.data.data)) {
        // Structure paginée Laravel : response.data.data
        data = response.data.data
        console.log('📄 Données paginées récupérées:', response.data.total, 'types au total')
      } else if (Array.isArray(response.data)) {
        // Structure simple : response.data
        data = response.data
      } else {
        console.warn('⚠️ Structure de données inattendue:', response.data)
        return []
      }
      
      console.log('✅ Types de services récupérés:', data.length)
      return data
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des types de services:', error)
      throw error
    }
  }

  /**
   * TanStack Query avec configuration optimisée
   */
  const serviceTypesQuery = useQuery({
    queryKey: ['service-types', 'cached', config.withStats, config.activeOnly],
    queryFn: fetchServiceTypesFromAPI,
    
    // Configuration cache long terme
    staleTime: 24 * 60 * 60 * 1000,      // 24h - données considérées fraîches
    cacheTime: 7 * 24 * 60 * 60 * 1000,  // 7 jours - gardées en mémoire
    refetchOnWindowFocus: false,          // Pas de refetch au focus
    refetchOnMount: false,                // Pas de refetch au mount si en cache
    refetchOnReconnect: false,            // Pas de refetch à la reconnexion
    
    // Données initiales depuis le cache localStorage
    initialData: () => {
      try {
        const cachedData = referenceCacheService.getFromCache(CACHE_KEY)
        if (cachedData && Array.isArray(cachedData)) {
          console.log('⚡ Chargement des types de services depuis le cache localStorage:', cachedData.length)
          isLoadingFromCache.value = false
          return cachedData
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement du cache localStorage:', error)
      }
      return undefined
    },

    // Sauvegarder en cache après récupération
    onSuccess: (data) => {
      referenceCacheService.saveToCache(CACHE_KEY, data)
      isLoadingFromCache.value = false
      
      // Mettre à jour les infos du cache
      updateCacheInfo()
    },

    onError: (error) => {
      console.error('❌ Erreur récupération types de services:', error)
      isLoadingFromCache.value = false
    }
  })

  /**
   * Mise à jour en arrière-plan si nécessaire
   */
  const performBackgroundRefresh = async () => {
    if (!config.enableBackgroundRefresh) return
    if (!referenceCacheService.needsBackgroundUpdate()) return

    try {
      backgroundRefreshStatus.value = 'refreshing'
      console.log('🔄 Mise à jour des types de services en arrière-plan...')
      
      // Récupérer les nouvelles données sans affecter l'UI
      const freshData = await fetchServiceTypesFromAPI()
      
      // Mettre à jour le cache TanStack Query
      queryClient.setQueryData(['service-types', 'cached', config.withStats, config.activeOnly], freshData)
      
      // Sauvegarder en localStorage
      referenceCacheService.saveToCache(CACHE_KEY, freshData)
      
      backgroundRefreshStatus.value = 'success'
      console.log('✅ Mise à jour des types de services en arrière-plan terminée')
      
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        backgroundRefreshStatus.value = 'idle'
      }, 3000)
      
    } catch (error) {
      backgroundRefreshStatus.value = 'error'
      console.error('❌ Erreur mise à jour des types de services en arrière-plan:', error)
      
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => {
        backgroundRefreshStatus.value = 'idle'
      }, 5000)
    }
  }

  /**
   * Forcer la mise à jour (pour les admins)
   */
  const forceRefresh = async () => {
    try {
      console.log('🔄 Mise à jour forcée des types de services...')
      
      // Invalider le cache TanStack Query
      await queryClient.invalidateQueries({ queryKey: ['service-types'] })
      
      // Vider le cache localStorage
      referenceCacheService.clearCache(CACHE_KEY)
      
      // Refetch
      await serviceTypesQuery.refetch()
      
      console.log('✅ Mise à jour forcée des types de services terminée')
    } catch (error) {
      console.error('❌ Erreur mise à jour forcée des types de services:', error)
      throw error
    }
  }

  /**
   * Mettre à jour les informations du cache
   */
  const updateCacheInfo = () => {
    cacheInfo.value = referenceCacheService.getCacheInfo()
  }

  /**
   * Vider le cache des types de services
   */
  const clearServiceTypesCache = () => {
    referenceCacheService.clearCache(CACHE_KEY)
    queryClient.removeQueries({ queryKey: ['service-types'] })
    updateCacheInfo()
    console.log('🗑️ Cache des types de services vidé')
  }

  // Initialisation
  onMounted(() => {
    updateCacheInfo()
    
    // Lancer la mise à jour en arrière-plan après un délai
    setTimeout(() => {
      performBackgroundRefresh()
    }, 2000) // 2 secondes après le mount
  })

  // Données computées
  const serviceTypes = computed(() => serviceTypesQuery.data?.value || [])
  
  const isLoading = computed(() => {
    return serviceTypesQuery.isLoading.value && isLoadingFromCache.value
  })

  const isError = computed(() => serviceTypesQuery.isError.value)
  const error = computed(() => serviceTypesQuery.error.value)

  // Utilitaires pour les types de services
  const activeServiceTypes = computed(() => {
    return serviceTypes.value.filter(type => type.is_active !== false)
  })

  const serviceTypeById = computed(() => {
    const map = new Map()
    serviceTypes.value.forEach(type => {
      map.set(type.id, type)
    })
    return map
  })

  const getServiceTypeById = (id) => {
    return serviceTypeById.value.get(id) || null
  }

  const getServiceTypeByName = (name) => {
    return serviceTypes.value.find(type => 
      type.name?.toLowerCase() === name?.toLowerCase()
    ) || null
  }

  // Statistiques pour le debug
  const stats = computed(() => ({
    totalServiceTypes: serviceTypes.value.length,
    activeServiceTypes: activeServiceTypes.value.length,
    inactiveServiceTypes: serviceTypes.value.length - activeServiceTypes.value.length,
    cacheStatus: referenceCacheService.isCacheValid(CACHE_KEY) ? 'valid' : 'invalid',
    backgroundRefreshStatus: backgroundRefreshStatus.value,
    lastUpdate: cacheInfo.value?.service_types?.timestamp || 'Jamais'
  }))

  // Données de fallback basées sur la structure réelle de l'API
  const fallbackServiceTypes = [
    {
      id: "01993a68-f13a-731d-b2d3-d51e667198a3",
      name: "Consultation",
      description: "Examens et consultations médicales",
      icon: "stethoscope",
      color: "#3B82F6",
      is_active: true
    },
    {
      id: "01993a69-09e1-73c2-9f54-e3866eeae5f1",
      name: "Vaccination",
      description: "Vaccinations et prévention",
      icon: "syringe",
      color: "#10B981",
      is_active: true
    },
    {
      id: "01993a69-053a-70d7-b0bd-8e21db991da0",
      name: "Chirurgie",
      description: "Interventions chirurgicales",
      icon: "scissors",
      color: "#EF4444",
      is_active: true
    },
    {
      id: "01993a69-0e87-70e9-ad42-61046abcccbb",
      name: "Diagnostic",
      description: "Examens diagnostiques et analyses",
      icon: "search",
      color: "#8B5CF6",
      is_active: true
    },
    {
      id: "01993a69-1350-70e2-a490-135f3f1dcca6",
      name: "Urgence",
      description: "Soins d'urgence",
      icon: "alert",
      color: "#F59E0B",
      is_active: true
    },
    {
      id: "01993a69-17fb-71fa-89f6-c44ab122f484",
      name: "Dentaire",
      description: "Soins dentaires",
      icon: "tooth",
      color: "#06B6D4",
      is_active: true
    },
    {
      id: "01993a69-1ce0-7144-9b87-8cfb09e28fe0",
      name: "Spécialisé",
      description: "Consultations spécialisées",
      icon: "star",
      color: "#EC4899",
      is_active: true
    },
    {
      id: "01993a69-21f7-7040-8f06-9faccba2e4ce",
      name: "Hospitalisation",
      description: "Hospitalisation et surveillance",
      icon: "bed",
      color: "#6B7280",
      is_active: true
    }
  ]

  // Types de services finaux (API ou fallback)
  const finalServiceTypes = computed(() => {
    try {
      const types = serviceTypes.value
      if (isError.value || !types || !Array.isArray(types) || types.length === 0) {
        console.log('🔄 Utilisation des types de services de fallback')
        return fallbackServiceTypes
      }
      // Filtrer les types invalides
      return types.filter(type => type && typeof type === 'object' && type.id && type.name)
    } catch (error) {
      console.error('❌ Erreur dans finalServiceTypes:', error)
      return fallbackServiceTypes
    }
  })

  return {
    // Données principales
    serviceTypes: finalServiceTypes,
    activeServiceTypes: computed(() => finalServiceTypes.value.filter(type => type.is_active !== false)),
    isLoading,
    isError,
    error,
    
    // États du cache
    isLoadingFromCache,
    backgroundRefreshStatus,
    cacheInfo,
    stats,
    
    // Utilitaires
    getServiceTypeById,
    getServiceTypeByName,
    serviceTypeById,
    
    // Actions
    forceRefresh,
    clearServiceTypesCache,
    performBackgroundRefresh,
    
    // Utilitaires TanStack Query
    refetch: serviceTypesQuery.refetch
  }
}

export default useServiceTypesCache
