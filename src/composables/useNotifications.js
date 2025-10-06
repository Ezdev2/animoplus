import { ref, computed } from 'vue'
import { 
  useNotificationsQuery, 
  useNotificationsStatsQuery,
  useMarkAsReadMutation,
  useMarkAsUnreadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation
} from '@/services/notifications/notificationsQueries.js'

/**
 * Composable pour la gestion des notifications
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
  const loadNotifications = async (options = {}) => {
    queryOptions.value = { ...queryOptions.value, ...options }
    await notificationsQuery.refetch()
    await statsQuery.refetch()
  }

  const markAsRead = async (notificationId) => {
    return await markAsReadMutation.mutateAsync(notificationId)
  }

  const markAsUnread = async (notificationId) => {
    return await markAsUnreadMutation.mutateAsync(notificationId)
  }

  const markAllAsRead = async () => {
    return await markAllAsReadMutation.mutateAsync()
  }

  const deleteNotification = async (notificationId) => {
    return await deleteNotificationMutation.mutateAsync(notificationId)
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

  return {
    // Data
    notifications,
    unreadNotifications,
    notificationsByType,
    stats,
    pagination,
    isLoading,
    error,
    queryOptions,

    // Actions
    loadNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,

    // Utilities
    getNotificationIcon,
    getNotificationColor,
    getNotificationTitle,
    getNotificationMessage,
    formatNotificationDate,

    // Mutations states
    isMarkingAsRead: markAsReadMutation.isLoading,
    isMarkingAsUnread: markAsUnreadMutation.isLoading,
    isMarkingAllAsRead: markAllAsReadMutation.isLoading,
    isDeleting: deleteNotificationMutation.isLoading
  }
}

export default useNotifications
