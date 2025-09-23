import { ref, computed, onMounted } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { referenceCacheService } from '@/services/cache/referenceCache.js'
import { speciesService } from '@/services/animals/speciesService.js'

/**
 * Hook pour la gestion optimisée du cache des espèces et races
 * Stratégie hybride : LocalStorage + TanStack Query + Background refresh
 */
export function useSpeciesCache(options = {}) {
  const queryClient = useQueryClient()
  
  // Configuration par défaut
  const config = {
    withRaces: true,
    enableBackgroundRefresh: true,
    ...options
  }

  // États locaux
  const isLoadingFromCache = ref(true)
  const cacheInfo = ref(null)
  const backgroundRefreshStatus = ref('idle') // idle, refreshing, success, error

  // Clé de cache
  const CACHE_KEY = referenceCacheService.config.STORAGE_KEYS.SPECIES

  /**
   * Fonction pour récupérer les données depuis l'API
   */
  const fetchSpeciesFromAPI = async () => {
    console.log('🌐 Récupération des espèces depuis l\'API...')
    const response = await speciesService.getAllSpecies({ with_races: config.withRaces })
    
    if (!response.success) {
      throw new Error(response.error || 'Erreur lors de la récupération des espèces')
    }
    
    return response.data
  }

  /**
   * TanStack Query avec configuration optimisée
   */
  const speciesQuery = useQuery({
    queryKey: ['species', 'cached', config.withRaces],
    queryFn: fetchSpeciesFromAPI,
    
    // Configuration cache long terme
    staleTime: 24 * 60 * 60 * 1000,      // 24h - données considérées fraîches
    cacheTime: 7 * 24 * 60 * 60 * 1000,  // 7 jours - gardées en mémoire
    refetchOnWindowFocus: false,          // Pas de refetch au focus
    refetchOnMount: false,                // Pas de refetch au mount si en cache
    refetchOnReconnect: false,            // Pas de refetch à la reconnexion
    
    // Données initiales depuis le cache localStorage
    initialData: () => {
      const cachedData = referenceCacheService.getFromCache(CACHE_KEY)
      if (cachedData) {
        console.log('⚡ Chargement depuis le cache localStorage')
        isLoadingFromCache.value = false
        return cachedData
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
      console.error('❌ Erreur récupération espèces:', error)
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
      console.log('🔄 Mise à jour en arrière-plan...')
      
      // Récupérer les nouvelles données sans affecter l'UI
      const freshData = await fetchSpeciesFromAPI()
      
      // Mettre à jour le cache TanStack Query
      queryClient.setQueryData(['species', 'cached', config.withRaces], freshData)
      
      // Sauvegarder en localStorage
      referenceCacheService.saveToCache(CACHE_KEY, freshData)
      
      backgroundRefreshStatus.value = 'success'
      console.log('✅ Mise à jour en arrière-plan terminée')
      
      // Réinitialiser le statut après 3 secondes
      setTimeout(() => {
        backgroundRefreshStatus.value = 'idle'
      }, 3000)
      
    } catch (error) {
      backgroundRefreshStatus.value = 'error'
      console.error('❌ Erreur mise à jour en arrière-plan:', error)
      
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
      console.log('🔄 Mise à jour forcée...')
      
      // Invalider le cache TanStack Query
      await queryClient.invalidateQueries({ queryKey: ['species'] })
      
      // Vider le cache localStorage
      referenceCacheService.clearCache(CACHE_KEY)
      
      // Refetch
      await speciesQuery.refetch()
      
      console.log('✅ Mise à jour forcée terminée')
    } catch (error) {
      console.error('❌ Erreur mise à jour forcée:', error)
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
   * Vider tous les caches
   */
  const clearAllCaches = () => {
    referenceCacheService.clearAllCaches()
    queryClient.removeQueries({ queryKey: ['species'] })
    updateCacheInfo()
    console.log('🗑️ Tous les caches vidés')
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
  const species = computed(() => speciesQuery.data?.value || [])
  
  const isLoading = computed(() => {
    return speciesQuery.isLoading.value && isLoadingFromCache.value
  })

  const isError = computed(() => speciesQuery.isError.value)
  const error = computed(() => speciesQuery.error.value)

  // Statistiques pour le debug
  const stats = computed(() => ({
    totalSpecies: species.value.length,
    totalRaces: species.value.reduce((total, s) => total + (s.races?.length || 0), 0),
    cacheStatus: referenceCacheService.isCacheValid(CACHE_KEY) ? 'valid' : 'invalid',
    backgroundRefreshStatus: backgroundRefreshStatus.value,
    lastUpdate: cacheInfo.value?.species?.timestamp || 'Jamais'
  }))

  return {
    // Données principales
    species,
    isLoading,
    isError,
    error,
    
    // États du cache
    isLoadingFromCache,
    backgroundRefreshStatus,
    cacheInfo,
    stats,
    
    // Actions
    forceRefresh,
    clearAllCaches,
    performBackgroundRefresh,
    
    // Utilitaires
    refetch: speciesQuery.refetch
  }
}

export default useSpeciesCache
