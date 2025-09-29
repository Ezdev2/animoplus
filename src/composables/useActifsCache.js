import { ref, computed, onMounted } from 'vue'
import { useActifsStore } from '@/stores/actifs.js'

/**
 * Composable pour la gestion du cache des actifs
 * Système sécurisé avec actualisation automatique et fallback
 * Similaire à useServiceTypesCache mais pour les actifs
 */
export const useActifsCache = () => {
  const store = useActifsStore()
  
  // État local pour le cache
  const isInitialized = ref(false)
  const isRefreshing = ref(false)
  const lastRefresh = ref(null)
  const refreshError = ref(null)

  // Configuration du cache
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  const TYPES_CACHE_DURATION = 30 * 60 * 1000 // 30 minutes pour les types
  const AUTO_REFRESH_INTERVAL = 10 * 60 * 1000 // Auto-refresh toutes les 10 minutes

  // Getters depuis le store
  const actifs = computed(() => store.getActifs)
  const activeActifs = computed(() => store.getActiveActifs)
  const isLoading = computed(() => store.getIsLoading)
  const error = computed(() => store.getError || refreshError.value)

  // Vérification de la validité du cache
  const isCacheValid = computed(() => {
    if (!lastRefresh.value || actifs.value.length === 0) return false
    const now = new Date()
    const cacheAge = now.getTime() - lastRefresh.value.getTime()
    return cacheAge < CACHE_DURATION
  })


  // Données avec fallback
  const actifsWithFallback = computed(() => {
    if (actifs.value.length > 0) {
      return actifs.value
    }
    
    // Fallback data si pas de données en cache
    return [
      {
        id: 'fallback-1',
        nom: 'Amoxicilline 250mg',
        description: 'Antibiotique à large spectre',
        type: 'medicament',
        unite_mesure: 'boite',
        prix_unitaire_defaut: 15.50,
        seuil_alerte: 10,
        is_active: true,
        _isFallback: true
      },
      {
        id: 'fallback-2',
        nom: 'Paracétamol 500mg',
        description: 'Antalgique et antipyrétique',
        type: 'medicament',
        unite_mesure: 'boite',
        prix_unitaire_defaut: 8.90,
        seuil_alerte: 15,
        is_active: true,
        _isFallback: true
      },
      {
        id: 'fallback-3',
        nom: 'Seringue 5ml',
        description: 'Seringue stérile usage unique',
        type: 'materiel',
        unite_mesure: 'piece',
        prix_unitaire_defaut: 0.50,
        seuil_alerte: 50,
        is_active: true,
        _isFallback: true
      }
    ]
  })

  const activeActifsWithFallback = computed(() => {
    return actifsWithFallback.value.filter(actif => actif.is_active)
  })


  // Fonctions de gestion du cache
  const initializeCache = async () => {
    if (isInitialized.value) return

    try {
      console.log('🚀 Initialisation du cache des actifs...')
      
      // Charger les actifs si le cache n'est pas valide
      if (!isCacheValid.value) {
        await refreshActifs()
      }
      
      isInitialized.value = true
      console.log('✅ Cache des actifs initialisé')
      
    } catch (error) {
      console.error('❌ Erreur initialisation cache actifs:', error)
      refreshError.value = error.message
      isInitialized.value = true // Marquer comme initialisé même en cas d'erreur
    }
  }

  const refreshActifs = async (forceRefresh = false) => {
    if (isRefreshing.value && !forceRefresh) return

    try {
      isRefreshing.value = true
      refreshError.value = null
      
      console.log('🔄 Actualisation des actifs...')
      
      const response = await store.fetchActifs({
        active_only: false, // Récupérer tous les actifs pour le cache
        per_page: 100 // Limite raisonnable pour le cache
      })
      
      if (response.success) {
        lastRefresh.value = new Date()
        console.log('✅ Actifs actualisés:', response.data?.length || 0)
      } else {
        throw new Error(response.error || 'Erreur lors de l\'actualisation')
      }
      
      return response
      
    } catch (error) {
      console.error('❌ Erreur actualisation actifs:', error)
      refreshError.value = error.message
      throw error
    } finally {
      isRefreshing.value = false
    }
  }


  // Fonctions utilitaires
  const getActifById = (id) => {
    return actifsWithFallback.value.find(actif => actif.id === id)
  }

  const getActifsByType = (type) => {
    return actifsWithFallback.value.filter(actif => actif.type === type)
  }

  const searchActifs = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      return actifsWithFallback.value
    }
    
    const term = searchTerm.toLowerCase()
    return actifsWithFallback.value.filter(actif => 
      actif.nom?.toLowerCase().includes(term) ||
      actif.description?.toLowerCase().includes(term) ||
      actif.type?.toLowerCase().includes(term)
    )
  }

  const isUsingFallback = computed(() => {
    return actifsWithFallback.value.some(actif => actif._isFallback)
  })


  // Auto-refresh périodique
  let refreshInterval = null

  const startAutoRefresh = () => {
    if (refreshInterval) return
    
    refreshInterval = setInterval(async () => {
      if (!isCacheValid.value && !isRefreshing.value) {
        console.log('🔄 Auto-refresh des actifs...')
        try {
          await refreshActifs()
        } catch (error) {
          console.error('❌ Erreur auto-refresh:', error)
        }
      }
    }, AUTO_REFRESH_INTERVAL)
    
    console.log('⏰ Auto-refresh des actifs activé')
  }

  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
      console.log('⏹️ Auto-refresh des actifs désactivé')
    }
  }

  // Nettoyage
  const cleanup = () => {
    stopAutoRefresh()
  }

  // Initialisation automatique
  onMounted(() => {
    initializeCache()
    startAutoRefresh()
  })

  return {
    // État
    isInitialized,
    isRefreshing,
    lastRefresh,
    isLoading,
    error: refreshError,

    // Données avec fallback
    actifs: actifsWithFallback,
    activeActifs: activeActifsWithFallback,

    // État du cache
    isCacheValid,
    isUsingFallback,

    // Actions
    initializeCache,
    refreshActifs,

    // Utilitaires
    getActifById,
    getActifsByType,
    searchActifs,

    // Gestion du cycle de vie
    startAutoRefresh,
    stopAutoRefresh,
    cleanup
  }
}

export default useActifsCache
