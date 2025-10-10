import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion des notifications généralisées
 */
export const notificationsService = {
  /**
   * Récupérer toutes les notifications de l'utilisateur
   */
  async getNotifications(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Filtres disponibles
      if (options.type) params.append('type', options.type)
      if (options.read_status) params.append('read_status', options.read_status)
      if (options.unread_only) params.append('unread_only', options.unread_only)
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.NOTIFICATIONS.LIST}?${queryString}` : API_ENDPOINTS.NOTIFICATIONS.LIST
      
      console.log('🔔 Récupération notifications:', url)
      const response = await apiClient.get(url)
      
      console.log('📦 Réponse notifications:', response.data)
      
      return {
        success: true,
        data: response.data.data?.data || response.data.data || [],
        stats: response.data.stats || {
          total: 0,
          unread: 0,
          by_type: {}
        },
        pagination: {
          current_page: response.data.data?.current_page || 1,
          last_page: response.data.data?.last_page || 1,
          per_page: response.data.data?.per_page || 15,
          total: response.data.data?.total || 0
        },
        message: response.data.message || 'Notifications récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération notifications:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des notifications'
      }
    }
  },

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId) {
    try {
      console.log('👁️ Marquage notification comme lue:', notificationId)
      const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(notificationId))
      
      console.log('✅ Notification marquée comme lue:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Notification marquée comme lue'
      }
    } catch (error) {
      console.error('❌ Erreur marquage notification:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du marquage de la notification'
      }
    }
  },

  /**
   * Marquer une notification comme non lue
   */
  async markAsUnread(notificationId) {
    try {
      console.log('👁️‍🗨️ Marquage notification comme non lue:', notificationId)
      const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_UNREAD(notificationId))
      
      console.log('✅ Notification marquée comme non lue:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Notification marquée comme non lue'
      }
    } catch (error) {
      console.error('❌ Erreur marquage notification:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du marquage de la notification'
      }
    }
  },

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead() {
    try {
      console.log('👁️ Marquage toutes notifications comme lues')
      const response = await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ)
      
      console.log('✅ Toutes notifications marquées comme lues:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Toutes les notifications ont été marquées comme lues'
      }
    } catch (error) {
      console.error('❌ Erreur marquage toutes notifications:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du marquage des notifications'
      }
    }
  },

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId) {
    try {
      console.log('🗑️ Suppression notification:', notificationId)
      const response = await apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(notificationId))
      
      console.log('✅ Notification supprimée:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Notification supprimée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur suppression notification:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression de la notification'
      }
    }
  },

  /**
   * Récupérer les statistiques des notifications
   */
  async getStats() {
    try {
      console.log('📊 Récupération statistiques notifications')
      const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.STATS)
      
      console.log('📈 Statistiques notifications:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message || 'Statistiques récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques'
      }
    }
  }
}

export default notificationsService
