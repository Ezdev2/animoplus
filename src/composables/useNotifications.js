import { ref, computed } from 'vue'
import { 
  useNotificationsQuery, 
  useNotificationsStatsQuery,
  useMarkAsReadMutation,
  useMarkAsUnreadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation
} from '@/services/notifications/notificationsQueries.js'

// Cache global des notifications avec TTL
const notificationsCache = {
  data: null,
  timestamp: null,
  TTL: 5 * 60 * 1000, // 5 minutes en millisecondes
  
  isValid() {
    if (!this.data || !this.timestamp) return false
    return (Date.now() - this.timestamp) < this.TTL
  },
  
  set(data) {
    this.data = data
    this.timestamp = Date.now()
    console.log('📦 Cache notifications mis à jour:', { 
      unread: data?.stats?.unread || 0,
      total: data?.data?.length || 0,
      timestamp: new Date(this.timestamp).toLocaleTimeString()
    })
  },
  
  get() {
    if (this.isValid()) {
      console.log('⚡ Utilisation du cache notifications (TTL valide)')
      return this.data
    }
    console.log('🔄 Cache notifications expiré, fetch nécessaire')
    return null
  },
  
  clear() {
    this.data = null
    this.timestamp = null
    console.log('🧹 Cache notifications vidé')
  }
}

/**
 * Composable pour la gestion des notifications avec cache intelligent
 */
export const useNotifications = () => {
  // Options de requête réactives
  const queryOptions = ref({
    page: 1,
    per_page: 20,
    sort_by: 'sent_at',
    sort_order: 'desc'
  })

  // Queries
  const notificationsQuery = useNotificationsQuery(queryOptions)
  const statsQuery = useNotificationsStatsQuery()

  // Mutations
  const markAsReadMutation = useMarkAsReadMutation()
  const markAsUnreadMutation = useMarkAsUnreadMutation()
  const markAllAsReadMutation = useMarkAllAsReadMutation()
  const deleteNotificationMutation = useDeleteNotificationMutation()

  // Computed properties
  const notifications = computed(() => notificationsQuery.data.value?.data || [])
  const stats = computed(() => notificationsQuery.data.value?.stats || statsQuery.data.value?.data || {
    total: 0,
    unread: 0,
    by_type: {}
  })
  const pagination = computed(() => notificationsQuery.data.value?.pagination || {
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0
  })
  const isLoading = computed(() => notificationsQuery.isLoading.value || statsQuery.isLoading.value)
  const error = computed(() => notificationsQuery.error.value || statsQuery.error.value)

  // Computed pour les notifications non lues
  const unreadNotifications = computed(() => {
    return notifications.value.filter(notification => !notification.read_at)
  })

  // Computed pour les notifications par type
  const notificationsByType = computed(() => {
    const grouped = {}
    notifications.value.forEach(notification => {
      const type = notification.type || 'other'
      if (!grouped[type]) {
        grouped[type] = []
      }
      grouped[type].push(notification)
    })
    return grouped
  })

  // Actions
  const loadNotifications = async (options = {}, forceRefresh = false) => {
    // Vérifier le cache d'abord (sauf si forceRefresh)
    if (!forceRefresh) {
      const cachedData = notificationsCache.get()
      if (cachedData) {
        // Utiliser les données du cache
        return cachedData
      }
    }
    
    console.log('🔄 Chargement des notifications depuis l\'API...')
    queryOptions.value = { ...queryOptions.value, ...options }
    
    try {
      await notificationsQuery.refetch()
      await statsQuery.refetch()
      
      // Mettre à jour le cache avec les nouvelles données
      const freshData = {
        data: notificationsQuery.data.value?.data || [],
        stats: notificationsQuery.data.value?.stats || statsQuery.data.value?.data || {},
        pagination: notificationsQuery.data.value?.pagination || {}
      }
      
      notificationsCache.set(freshData)
      return freshData
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des notifications:', error)
      throw error
    }
  }

  const markAsRead = async (notificationId) => {
    const result = await markAsReadMutation.mutateAsync(notificationId)
    // Vider le cache car les stats ont changé
    notificationsCache.clear()
    return result
  }

  const markAsUnread = async (notificationId) => {
    const result = await markAsUnreadMutation.mutateAsync(notificationId)
    // Vider le cache car les stats ont changé
    notificationsCache.clear()
    return result
  }

  const markAllAsRead = async () => {
    const result = await markAllAsReadMutation.mutateAsync()
    // Vider le cache car toutes les stats ont changé
    notificationsCache.clear()
    return result
  }

  const deleteNotification = async (notificationId) => {
    const result = await deleteNotificationMutation.mutateAsync(notificationId)
    // Vider le cache car une notification a été supprimée
    notificationsCache.clear()
    return result
  }

  // Fonctions utilitaires
  const getNotificationIcon = (type) => {
    const icons = {
      'lost_animal_found': '🎉',
      'appointment_reminder': '📅',
      'stock_low': '📦',
      'message_received': '💬',
      'task_assigned': '📋',
      'clinic_join_request': '🏥',
      'system': '⚙️',
      'default': '🔔'
    }
    return icons[type] || icons.default
  }

  const getNotificationColor = (type) => {
    const colors = {
      'lost_animal_found': 'text-green-600 bg-green-100',
      'appointment_reminder': 'text-blue-600 bg-blue-100',
      'stock_low': 'text-orange-600 bg-orange-100',
      'message_received': 'text-purple-600 bg-purple-100',
      'task_assigned': 'text-indigo-600 bg-indigo-100',
      'clinic_join_request': 'text-teal-600 bg-teal-100',
      'system': 'text-gray-600 bg-gray-100',
      'default': 'text-blue-600 bg-blue-100'
    }
    return colors[type] || colors.default
  }

  const getNotificationTitle = (notification) => {
    const titles = {
      'lost_animal_found': 'Animal trouvé !',
      'appointment_reminder': 'Rappel de rendez-vous',
      'stock_low': 'Stock bas',
      'message_received': 'Nouveau message',
      'task_assigned': 'Tâche assignée',
      'clinic_join_request': 'Demande de rejoindre la clinique',
      'system': 'Notification système'
    }
    return titles[notification.type] || notification.data?.title || 'Notification'
  }

  const getNotificationMessage = (notification) => {
    return notification.data?.message || notification.data?.body || 'Nouvelle notification'
  }

  const formatNotificationDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // Fonction pour forcer le refresh (ignorer le cache)
  const forceRefresh = async () => {
    console.log('🔄 Force refresh des notifications (cache ignoré)')
    return await loadNotifications({}, true)
  }

  // Fonction pour vider manuellement le cache
  const clearCache = () => {
    notificationsCache.clear()
  }

  return {
    // Data
    notifications,
    stats,
    pagination,
    isLoading,
    error,
    unreadNotifications,
    notificationsByType,
    
    // Reactive options
    queryOptions,

    // Actions
    loadNotifications,
    forceRefresh,
    clearCache,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    
    // Utils
    getNotificationIcon,
    getNotificationColor,
    getNotificationTitle,
    getNotificationMessage,
    formatNotificationDate,
    
    // Mutations (pour usage avancé)
    markAsReadMutation,
    markAsUnreadMutation,
    markAllAsReadMutation,
    deleteNotificationMutation
  }
}

export default useNotifications
