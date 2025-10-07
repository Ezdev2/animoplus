import { ref, computed, watch } from 'vue'

/**
 * Composable pour gérer les états de chargement de manière centralisée
 */
export function useLoadingStates() {
  // États de chargement individuels
  const loadingStates = ref(new Map())
  
  // Ajouter ou mettre à jour un état de chargement
  const setLoading = (key, isLoading, metadata = {}) => {
    loadingStates.value.set(key, {
      isLoading,
      timestamp: Date.now(),
      ...metadata
    })
  }
  
  // Récupérer un état de chargement
  const getLoading = (key) => {
    return loadingStates.value.get(key)?.isLoading || false
  }
  
  // Supprimer un état de chargement
  const removeLoading = (key) => {
    loadingStates.value.delete(key)
  }
  
  // Vérifier si au moins un élément est en chargement
  const isAnyLoading = computed(() => {
    for (const [key, state] of loadingStates.value) {
      if (state.isLoading) return true
    }
    return false
  })
  
  // Obtenir tous les éléments en chargement
  const loadingItems = computed(() => {
    const items = []
    for (const [key, state] of loadingStates.value) {
      if (state.isLoading) {
        items.push({ key, ...state })
      }
    }
    return items
  })
  
  // Obtenir le nombre d'éléments en chargement
  const loadingCount = computed(() => loadingItems.value.length)
  
  // Nettoyer les anciens états (plus de 5 minutes)
  const cleanupOldStates = () => {
    const now = Date.now()
    const maxAge = 5 * 60 * 1000 // 5 minutes
    
    for (const [key, state] of loadingStates.value) {
      if (now - state.timestamp > maxAge) {
        loadingStates.value.delete(key)
      }
    }
  }
  
  // Nettoyage automatique toutes les minutes
  setInterval(cleanupOldStates, 60000)
  
  return {
    // Actions
    setLoading,
    getLoading,
    removeLoading,
    cleanupOldStates,
    
    // États computed
    isAnyLoading,
    loadingItems,
    loadingCount,
    
    // État brut (pour debug)
    loadingStates: computed(() => Object.fromEntries(loadingStates.value))
  }
}

/**
 * Composable spécialisé pour les composants Dashboard
 */
export function useDashboardLoading() {
  const { setLoading, getLoading, isAnyLoading } = useLoadingStates()
  
  // États spécifiques au dashboard
  const setMessagesLoading = (isLoading) => {
    setLoading('dashboard-messages', isLoading, {
      component: 'Messages',
      type: 'conversations'
    })
  }
  
  const setAppointmentsLoading = (isLoading) => {
    setLoading('dashboard-appointments', isLoading, {
      component: 'Appointments',
      type: 'appointments'
    })
  }
  
  const setStatsLoading = (isLoading) => {
    setLoading('dashboard-stats', isLoading, {
      component: 'Stats',
      type: 'statistics'
    })
  }
  
  // Getters spécifiques
  const isMessagesLoading = computed(() => getLoading('dashboard-messages'))
  const isAppointmentsLoading = computed(() => getLoading('dashboard-appointments'))
  const isStatsLoading = computed(() => getLoading('dashboard-stats'))
  
  // État global du dashboard
  const isDashboardLoading = computed(() => {
    return isMessagesLoading.value || 
           isAppointmentsLoading.value || 
           isStatsLoading.value
  })
  
  return {
    // Setters
    setMessagesLoading,
    setAppointmentsLoading,
    setStatsLoading,
    
    // Getters
    isMessagesLoading,
    isAppointmentsLoading,
    isStatsLoading,
    isDashboardLoading,
    
    // Global
    isAnyLoading
  }
}

/**
 * Hook pour surveiller automatiquement les queries TanStack
 */
export function useQueryLoadingWatcher(queries, loadingKey) {
  const { setLoading } = useLoadingStates()
  
  // Surveiller les changements d'état de chargement
  const watchQueries = () => {
    if (!Array.isArray(queries)) {
      queries = [queries]
    }
    
    queries.forEach((query, index) => {
      if (query && query.isLoading) {
        watch(
          () => query.isLoading.value,
          (isLoading) => {
            const key = `${loadingKey}-${index}`
            setLoading(key, isLoading, {
              queryIndex: index,
              type: 'tanstack-query'
            })
          },
          { immediate: true }
        )
      }
    })
  }
  
  return {
    watchQueries
  }
}

/**
 * Composable pour les messages de chargement contextuels
 */
export function useLoadingMessages() {
  const messages = {
    // Messages génériques
    default: {
      title: 'Chargement...',
      subtitle: 'Veuillez patienter'
    },
    
    // Messages spécifiques
    conversations: {
      title: 'Chargement des conversations...',
      subtitle: 'Récupération de vos messages récents'
    },
    
    appointments: {
      title: 'Chargement des rendez-vous...',
      subtitle: 'Recherche de votre prochain rendez-vous'
    },
    
    profile: {
      title: 'Chargement du profil...',
      subtitle: 'Récupération de vos informations'
    },
    
    animals: {
      title: 'Chargement des animaux...',
      subtitle: 'Récupération de vos compagnons'
    },
    
    services: {
      title: 'Chargement des services...',
      subtitle: 'Récupération des services disponibles'
    },
    
    // Messages d'erreur
    error: {
      title: 'Erreur de chargement',
      subtitle: 'Une erreur est survenue'
    },
    
    timeout: {
      title: 'Délai dépassé',
      subtitle: 'Le chargement prend plus de temps que prévu'
    },
    
    offline: {
      title: 'Hors ligne',
      subtitle: 'Vérifiez votre connexion internet'
    }
  }
  
  const getMessage = (type = 'default') => {
    return messages[type] || messages.default
  }
  
  const getRandomLoadingMessage = () => {
    const loadingMessages = [
      'Préparation de vos données...',
      'Synchronisation en cours...',
      'Récupération des informations...',
      'Mise à jour des données...',
      'Chargement en cours...'
    ]
    
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
  }
  
  return {
    getMessage,
    getRandomLoadingMessage,
    messages
  }
}
