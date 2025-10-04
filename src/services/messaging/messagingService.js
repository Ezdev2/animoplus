import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la messagerie API REST
 */
class MessagingService {
  
  /**
   * Récupérer les conversations de l'utilisateur
   * @param {Object} options - Options de récupération
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getConversations(options = {}) {
    try {
      console.log('📋 Récupération conversations API:', options)
      
      const params = {
        with_participants: true,
        with_last_message: true,
        with_unread_count: true,
        per_page: 20,
        ...options
      }
      
      const response = await apiClient.get(API_ENDPOINTS.MESSAGING.CONVERSATIONS.LIST, { params })
      
      console.log('✅ Conversations récupérées:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || response.data,
        message: 'Conversations récupérées avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur récupération conversations:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des conversations',
        data: []
      }
    }
  }

  /**
   * Démarrer ou trouver une conversation existante
   * @param {Object} data - Données de la conversation
   * @returns {Promise<Object>} Réponse de l'API
   */
  async startOrFindConversation(data) {
    try {
      console.log('🔍 Démarrage/recherche conversation:', data)
      
      const response = await apiClient.post(API_ENDPOINTS.MESSAGING.CONVERSATIONS.START_OR_FIND, data)
      const apiResponse = response.data
      
      console.log('✅ Conversation trouvée/créée:', apiResponse)
      
      return {
        success: true,
        data: apiResponse.data || apiResponse,
        message: apiResponse.message || 'Conversation trouvée/créée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur démarrage/recherche conversation:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du démarrage/recherche de la conversation'
      }
    }
  }

  /**
   * Récupérer les messages d'une conversation
   * @param {string} conversationId - ID de la conversation
   * @param {Object} options - Options de récupération
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getConversationMessages(conversationId, options = {}) {
    try {
      console.log('📨 Chargement messages conversation:', conversationId, options)
      
      const params = {
        per_page: 50,
        sort_by: 'sent_at',
        sort_order: 'asc',
        ...options
      }
      
      const response = await apiClient.get(
        API_ENDPOINTS.MESSAGING.CONVERSATIONS.MESSAGES(conversationId), 
        { params }
      )
      
      console.log('✅ Messages chargés:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || {},
        message: 'Messages chargés avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur chargement messages:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du chargement des messages',
        data: []
      }
    }
  }

  /**
   * Envoyer un message dans une conversation
   * @param {string} conversationId - ID de la conversation
   * @param {Object} messageData - Données du message
   * @returns {Promise<Object>} Réponse de l'API
   */
  async sendMessage(conversationId, messageData) {
    try {
      console.log('📤 Envoi message:', conversationId, messageData)
      
      const response = await apiClient.post(
        API_ENDPOINTS.MESSAGING.CONVERSATIONS.SEND_MESSAGE(conversationId),
        messageData
      )
      
      console.log('✅ Message envoyé:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Message envoyé avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur envoi message:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'envoi du message'
      }
    }
  }

  /**
   * Marquer les messages comme lus
   * @param {string} conversationId - ID de la conversation
   * @returns {Promise<Object>} Réponse de l'API
   */
  async markAsRead(conversationId) {
    try {
      console.log('👁️ Marquage comme lu:', conversationId)
      
      const response = await apiClient.post(
        API_ENDPOINTS.MESSAGING.CONVERSATIONS.MARK_READ(conversationId)
      )
      
      console.log('✅ Messages marqués comme lus:', response.data)
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Messages marqués comme lus'
      }
    } catch (error) {
      console.error('❌ Erreur marquage lecture:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du marquage comme lu'
      }
    }
  }
}

// Export singleton
export const messagingService = new MessagingService()
export default messagingService
