import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion de la messagerie
 * Basé sur la collection Postman Messaging_System_Collection
 */
export const messagingService = {
  /**
   * Rechercher des utilisateurs pour démarrer une conversation
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async searchUsers(searchTerm, options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Terme de recherche obligatoire
      params.append('search', searchTerm)
      
      // Pagination
      if (options.per_page) params.append('per_page', options.per_page)
      if (options.page) params.append('page', options.page)
      
      // Filtres
      if (options.user_type) params.append('user_type', options.user_type)
      if (options.is_active !== undefined) params.append('is_active', options.is_active)
      if (options.is_verified !== undefined) params.append('is_verified', options.is_verified)
      
      // Inclusions
      if (options.with_profile) params.append('with_profile', 'true')
      if (options.with_specialties) params.append('with_specialties', 'true')
      
      const queryString = params.toString()
      const url = `${API_ENDPOINTS.USERS.SEARCH}?${queryString}`
      
      console.log('🔍 Recherche utilisateurs:', url)
      const response = await apiClient.get(url)
      
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data?.data || apiResponse.data || [],
        pagination: {
          current_page: apiResponse.data?.current_page || 1,
          last_page: apiResponse.data?.last_page || 1,
          per_page: apiResponse.data?.per_page || 10,
          total: apiResponse.data?.total || 0,
          from: apiResponse.data?.from || 0,
          to: apiResponse.data?.to || 0
        },
        message: apiResponse.message || 'Utilisateurs trouvés'
      }
    } catch (error) {
      console.error('❌ Erreur recherche utilisateurs:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la recherche d\'utilisateurs'
      }
    }
  },

  /**
   * Démarrer ou trouver une conversation existante
   * @param {Object} data - Données de la conversation
   * @returns {Promise<Object>} Réponse de l'API
   */
  async startOrFindConversation(data) {
    try {
      console.log('💬 Démarrage/recherche conversation:', data)
      
      const response = await apiClient.post(API_ENDPOINTS.MESSAGING.CONVERSATIONS.START_OR_FIND, data)
      const apiResponse = response.data
      
      console.log('✅ Réponse API conversation:', apiResponse)
      
      return {
        success: true,
        data: {
          conversation: apiResponse.data?.conversation || apiResponse.conversation,
          is_new: apiResponse.data?.is_new || apiResponse.is_new || false,
          message: apiResponse.data?.message || apiResponse.message
        },
        message: apiResponse.message || 'Conversation trouvée/créée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur démarrage/recherche conversation:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du démarrage/recherche de la conversation'
      }
    }
  },

  /**
   * Récupérer toutes les conversations de l'utilisateur
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getConversations(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres
      if (options.type) params.append('type', options.type)
      if (options.is_active !== undefined) params.append('is_active', options.is_active)
      if (options.is_archived !== undefined) params.append('is_archived', options.is_archived)
      if (options.has_unread !== undefined) params.append('has_unread', options.has_unread)
      if (options.search) params.append('search', options.search)
      
      // Inclusions
      if (options.with_participants) params.append('with_participants', 'true')
      if (options.with_last_message) params.append('with_last_message', 'true')
      if (options.with_unread_count) params.append('with_unread_count', 'true')
      if (options.with_other_participant) params.append('with_other_participant', 'true')
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.MESSAGING.CONVERSATIONS.LIST}?${queryString}` : API_ENDPOINTS.MESSAGING.CONVERSATIONS.LIST
      
      console.log('📋 Récupération conversations:', url)
      const response = await apiClient.get(url)
      
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data?.data || apiResponse.data || [],
        pagination: {
          current_page: apiResponse.data?.current_page || 1,
          last_page: apiResponse.data?.last_page || 1,
          per_page: apiResponse.data?.per_page || 20,
          total: apiResponse.data?.total || 0,
          from: apiResponse.data?.from || 0,
          to: apiResponse.data?.to || 0
        },
        message: apiResponse.message || 'Conversations récupérées'
      }
    } catch (error) {
      console.error('❌ Erreur récupération conversations:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des conversations'
      }
    }
  },

  /**
   * Récupérer une conversation par ID
   * @param {string} conversationId - ID de la conversation
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getConversationById(conversationId, options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Inclusions
      if (options.with_participants) params.append('with_participants', 'true')
      if (options.with_messages) params.append('with_messages', 'true')
      if (options.with_unread_count) params.append('with_unread_count', 'true')
      
      const queryString = params.toString()
      const url = queryString ? 
        `${API_ENDPOINTS.MESSAGING.CONVERSATIONS.DETAIL(conversationId)}?${queryString}` : 
        API_ENDPOINTS.MESSAGING.CONVERSATIONS.DETAIL(conversationId)
      
      console.log('📋 Récupération conversation:', url)
      const response = await apiClient.get(url)
      
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data || apiResponse,
        message: apiResponse.message || 'Conversation récupérée'
      }
    } catch (error) {
      console.error('❌ Erreur récupération conversation:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération de la conversation'
      }
    }
  },

  /**
   * Récupérer les messages d'une conversation
   * @param {string} conversationId - ID de la conversation
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getConversationMessages(conversationId, options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres
      if (options.before_message_id) params.append('before_message_id', options.before_message_id)
      if (options.after_message_id) params.append('after_message_id', options.after_message_id)
      if (options.message_type) params.append('message_type', options.message_type)
      
      // Inclusions
      if (options.with_sender) params.append('with_sender', 'true')
      if (options.with_read_status) params.append('with_read_status', 'true')
      if (options.with_attachments) params.append('with_attachments', 'true')
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      // Ajouter l'ID de conversation comme paramètre
      params.append('conversation_id', conversationId)
      
      const queryString = params.toString()
      const url = `${API_ENDPOINTS.MESSAGES.BY_CONVERSATION}?${queryString}`
      
    
      const response = await apiClient.get(url)
      
      const apiResponse = response.data
      
      // Les messages sont directement dans la réponse
      console.log('📨 Récupération messages:', apiResponse)
      const messages = apiResponse.data?.data || apiResponse.data || []
      
      return {
        success: true,
        data: messages,
        pagination: {
          current_page: apiResponse.data?.current_page || 1,
          last_page: apiResponse.data?.last_page || 1,
          per_page: apiResponse.data?.per_page || 50,
          total: apiResponse.data?.total || 0,
          from: apiResponse.data?.from || 0,
          to: apiResponse.data?.to || 0
        },
        message: apiResponse.message || 'Messages récupérés'
      }
    } catch (error) {
      console.error('❌ Erreur récupération messages:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des messages'
      }
    }
  },

  /**
   * Envoyer un message dans une conversation
   * @param {string} conversationId - ID de la conversation
   * @param {Object} messageData - Données du message
   * @returns {Promise<Object>} Réponse de l'API
   */
  async sendMessage(conversationId, messageData) {
    try {
      console.log('📤 Envoi message:', conversationId, messageData)
      
      // Préparer les données avec conversation_id
      const payload = {
        conversation_id: conversationId,
        ...messageData
      }
      
      const response = await apiClient.post(
        API_ENDPOINTS.MESSAGES.BASE,
        payload
      )
      
      const apiResponse = response.data
      
      console.log('✅ Message envoyé:', apiResponse)
      
      return {
        success: true,
        data: apiResponse.data || apiResponse,
        message: apiResponse.message || 'Message envoyé avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur envoi message:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'envoi du message'
      }
    }
  },

  /**
   * Marquer les messages d'une conversation comme lus
   * @param {string} conversationId - ID de la conversation
   * @param {Object} options - Options
   * @returns {Promise<Object>} Réponse de l'API
   */
  async markAsRead(conversationId, options = {}) {
    try {
      console.log('👁️ Marquage comme lu:', conversationId)
      
      const response = await apiClient.post(
        API_ENDPOINTS.MESSAGING.CONVERSATIONS.MARK_READ(conversationId),
        options
      )
      
      const apiResponse = response.data
      
      console.log('✅ Messages marqués comme lus:', apiResponse)
      
      return {
        success: true,
        data: apiResponse.data || apiResponse,
        message: apiResponse.message || 'Messages marqués comme lus'
      }
    } catch (error) {
      console.error('❌ Erreur marquage lecture:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du marquage comme lu'
      }
    }
  },

  /**
   * Envoyer un indicateur de frappe
   * @param {string} conversationId - ID de la conversation
   * @param {boolean} isTyping - État de frappe
   * @returns {Promise<Object>} Réponse de l'API
   */
  async sendTypingIndicator(conversationId, isTyping = true) {
    try {
      console.log('⌨️ Indicateur de frappe:', conversationId, isTyping)
      
      const response = await apiClient.post(
        API_ENDPOINTS.MESSAGING.CONVERSATIONS.TYPING(conversationId),
        { is_typing: isTyping }
      )
      
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data || apiResponse,
        message: apiResponse.message || 'Indicateur de frappe envoyé'
      }
    } catch (error) {
      console.error('❌ Erreur indicateur frappe:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'envoi de l\'indicateur de frappe'
      }
    }
  },

  /**
   * Supprimer une conversation
   * @param {string} conversationId - ID de la conversation
   * @returns {Promise<Object>} Réponse de l'API
   */
  async deleteConversation(conversationId) {
    try {
      console.log('🗑️ Suppression conversation:', conversationId)
      
      const response = await apiClient.delete(API_ENDPOINTS.MESSAGING.CONVERSATIONS.DELETE(conversationId))
      const apiResponse = response.data
      
      console.log('✅ Conversation supprimée:', apiResponse)
      
      return {
        success: true,
        data: apiResponse.data || apiResponse,
        message: apiResponse.message || 'Conversation supprimée avec succès'
      }
    } catch (error) {
      console.error('❌ Erreur suppression conversation:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression de la conversation'
      }
    }
  },

  /**
   * Archiver/désarchiver une conversation
   * @param {string} conversationId - ID de la conversation
   * @param {boolean} isArchived - État d'archivage
   * @returns {Promise<Object>} Réponse de l'API
   */
  async toggleArchiveConversation(conversationId, isArchived = true) {
    try {
      console.log('📦 Archivage conversation:', conversationId, isArchived)
      
      const response = await apiClient.patch(
        API_ENDPOINTS.MESSAGING.CONVERSATIONS.UPDATE(conversationId),
        { is_archived: isArchived }
      )
      
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data || apiResponse,
        message: apiResponse.message || `Conversation ${isArchived ? 'archivée' : 'désarchivée'} avec succès`
      }
    } catch (error) {
      console.error('❌ Erreur archivage conversation:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'archivage de la conversation'
      }
    }
  }
}
