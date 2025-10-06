import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { notificationsService } from './notificationsService.js'
import { useToast } from '@/composables/useToast.js'

// === QUERY KEYS ===
export const NOTIFICATIONS_QUERY_KEYS = {
  all: ['notifications'],
  lists: () => [...NOTIFICATIONS_QUERY_KEYS.all, 'list'],
  list: (filters) => [...NOTIFICATIONS_QUERY_KEYS.lists(), { filters }],
  stats: () => [...NOTIFICATIONS_QUERY_KEYS.all, 'stats']
}

// === QUERIES ===

/**
 * Hook pour récupérer les notifications
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useNotificationsQuery = (options = {}) => {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.list(options),
    queryFn: () => notificationsService.getNotifications(options),
    staleTime: 30 * 1000, // 30 secondes
    cacheTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Refresh toutes les minutes
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les statistiques des notifications
 * @returns {Object} Query result
 */
export const useNotificationsStatsQuery = () => {
  return useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEYS.stats(),
    queryFn: () => notificationsService.getStats(),
    staleTime: 30 * 1000, // 30 secondes
    cacheTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Refresh toutes les minutes
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

// === MUTATIONS ===

/**
 * Hook pour marquer une notification comme lue
 * @returns {Object} Mutation object
 */
export const useMarkAsReadMutation = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (notificationId) => notificationsService.markAsRead(notificationId),
    onSuccess: (data, notificationId) => {
      console.log('✅ Notification marquée comme lue:', data)
      
      // Invalider et refetch les queries liées
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all })
      
      // Afficher un toast de succès (optionnel)
      showToast({
        type: 'success',
        title: 'Notification lue',
        message: data.message || 'Notification marquée comme lue'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur marquage notification:', error)
      
      // Afficher un toast d'erreur
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.error || error.message || 'Erreur lors du marquage de la notification'
      })
    }
  })
}

/**
 * Hook pour marquer une notification comme non lue
 * @returns {Object} Mutation object
 */
export const useMarkAsUnreadMutation = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (notificationId) => notificationsService.markAsUnread(notificationId),
    onSuccess: (data, notificationId) => {
      console.log('✅ Notification marquée comme non lue:', data)
      
      // Invalider et refetch les queries liées
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all })
      
      // Afficher un toast de succès (optionnel)
      showToast({
        type: 'success',
        title: 'Notification non lue',
        message: data.message || 'Notification marquée comme non lue'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur marquage notification:', error)
      
      // Afficher un toast d'erreur
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.error || error.message || 'Erreur lors du marquage de la notification'
      })
    }
  })
}

/**
 * Hook pour marquer toutes les notifications comme lues
 * @returns {Object} Mutation object
 */
export const useMarkAllAsReadMutation = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: () => notificationsService.markAllAsRead(),
    onSuccess: (data) => {
      console.log('✅ Toutes notifications marquées comme lues:', data)
      
      // Invalider et refetch les queries liées
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all })
      
      // Afficher un toast de succès
      showToast({
        type: 'success',
        title: 'Notifications lues',
        message: data.message || 'Toutes les notifications ont été marquées comme lues'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur marquage toutes notifications:', error)
      
      // Afficher un toast d'erreur
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.error || error.message || 'Erreur lors du marquage des notifications'
      })
    }
  })
}

/**
 * Hook pour supprimer une notification
 * @returns {Object} Mutation object
 */
export const useDeleteNotificationMutation = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (notificationId) => notificationsService.deleteNotification(notificationId),
    onSuccess: (data, notificationId) => {
      console.log('✅ Notification supprimée:', data)
      
      // Invalider et refetch les queries liées
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEYS.all })
      
      // Afficher un toast de succès
      showToast({
        type: 'success',
        title: 'Notification supprimée',
        message: data.message || 'Notification supprimée avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur suppression notification:', error)
      
      // Afficher un toast d'erreur
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.error || error.message || 'Erreur lors de la suppression de la notification'
      })
    }
  })
}
