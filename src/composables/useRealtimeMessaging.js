import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { webSocketService } from '@/services/realtime/websocketService.js'
import { 
  useRealtimeConversations,
  useRealtimeConversationMessages,
  useRealtimeStartOrFindConversation,
  useRealtimeSendMessage,
  useRealtimeMarkAsRead,
  useRealtimeTypingIndicator,
  useRealtimeUserSearch,
  useRealtimeMessagingInvalidation
} from '@/services/realtime/realtimeMessagingQueries.js'
import { useSimpleAuth } from '@/services/auth/useSimpleAuth.js'

/**
 * Composable principal pour la messagerie temps réel
 * Combine WebSocket, API REST et gestion d'état
 */
export function useRealtimeMessaging() {
  // États réactifs
  const isWebSocketConnected = ref(false)
  const currentConversationId = ref(null)
  const typingUsers = ref(new Map())
  const onlineUsers = ref(new Set())
  const unreadCounts = ref(new Map())

  // Auth
  const { user, token } = useSimpleAuth()

  // Hooks de requêtes
  const conversationsQuery = useRealtimeConversations()
  const startOrFindConversationMutation = useRealtimeStartOrFindConversation()
  const sendMessageMutation = useRealtimeSendMessage()
  const markAsReadMutation = useRealtimeMarkAsRead()
  const typingIndicatorMutation = useRealtimeTypingIndicator()
  const { invalidateAll, invalidateConversations, invalidateMessages } = useRealtimeMessagingInvalidation()

  /**
   * Initialiser la connexion WebSocket
   */
  const initializeWebSocket = async () => {
    try {
      console.log('🚀 Initialisation messagerie temps réel...')
      
      if (!token.value) {
        console.warn('⚠️ Pas de token, impossible d\'initialiser WebSocket')
        return false
      }

      const success = await webSocketService.initialize(token.value)
      isWebSocketConnected.value = success

      if (success && user.value?.id) {
        // S'abonner aux notifications globales de l'utilisateur
        subscribeToUserNotifications(user.value.id)
      }

      return success
    } catch (error) {
      console.error('❌ Erreur initialisation WebSocket temps réel:', error)
      return false
    }
  }

  /**
   * S'abonner aux notifications globales de l'utilisateur
   */
  const subscribeToUserNotifications = (userId) => {
    webSocketService.subscribeToUserNotifications(userId, {
      onNewConversation: (event) => {
        console.log('💬 Nouvelle conversation reçue:', event)
        // Invalider les conversations pour refetch
        invalidateConversations()
      },
      onConversationUpdated: (event) => {
        console.log('🔄 Conversation mise à jour:', event)
        // Invalider les conversations pour refetch
        invalidateConversations()
      }
    })
  }

  /**
   * S'abonner aux événements d'une conversation
   */
  const subscribeToConversation = (conversationId) => {
    if (!isWebSocketConnected.value) {
      console.warn('⚠️ WebSocket non connecté, impossible de s\'abonner à la conversation')
      return
    }

    console.log('📡 Abonnement conversation temps réel:', conversationId)
    currentConversationId.value = conversationId

    webSocketService.subscribeToConversation(conversationId, {
      onNewMessage: (event) => {
        console.log('📨 Nouveau message reçu:', event)
        
        // Invalider les messages de cette conversation
        invalidateMessages(conversationId)
        
        // Invalider les conversations pour mettre à jour le dernier message
        invalidateConversations()
        
        // Mettre à jour le compteur non lu si ce n'est pas la conversation active
        if (currentConversationId.value !== conversationId) {
          const currentCount = unreadCounts.value.get(conversationId) || 0
          unreadCounts.value.set(conversationId, currentCount + 1)
        }
      },
      
      onTyping: (event) => {
        console.log('⌨️ Indicateur frappe reçu:', event)
        
        if (event.user_id !== user.value?.id) {
          // Ajouter l'utilisateur à la liste des utilisateurs en train de taper
          typingUsers.value.set(event.user_id, {
            name: event.user_name || 'Utilisateur',
            timestamp: Date.now()
          })
          
          // Supprimer après 3 secondes d'inactivité
          setTimeout(() => {
            if (typingUsers.value.has(event.user_id)) {
              const userTyping = typingUsers.value.get(event.user_id)
              if (Date.now() - userTyping.timestamp >= 3000) {
                typingUsers.value.delete(event.user_id)
              }
            }
          }, 3000)
        }
      },
      
      onMessageRead: (event) => {
        console.log('👁️ Message lu reçu:', event)
        
        // Invalider les messages pour mettre à jour les statuts de lecture
        invalidateMessages(conversationId)
      },
      
      onUserPresence: (event) => {
        console.log('👥 Présence utilisateur:', event)
        
        switch (event.type) {
          case 'here':
            // Utilisateurs déjà présents
            event.users.forEach(user => onlineUsers.value.add(user.id))
            break
          case 'joining':
            // Utilisateur qui rejoint
            onlineUsers.value.add(event.user.id)
            break
          case 'leaving':
            // Utilisateur qui quitte
            onlineUsers.value.delete(event.user.id)
            break
        }
      }
    })
  }

  /**
   * Se désabonner d'une conversation
   */
  const unsubscribeFromConversation = (conversationId) => {
    console.log('📡 Désabonnement conversation temps réel:', conversationId)
    
    webSocketService.unsubscribeFromConversation(conversationId)
    
    // Nettoyer les états locaux
    if (currentConversationId.value === conversationId) {
      currentConversationId.value = null
    }
    typingUsers.value.clear()
  }

  /**
   * Rechercher des utilisateurs pour démarrer une conversation
   */
  const searchUsers = (query, filters = {}) => {
    return useRealtimeUserSearch(query, filters)
  }

  /**
   * Démarrer ou trouver une conversation
   */
  const startOrFindConversation = async (userData) => {
    try {
      const response = await startOrFindConversationMutation.mutateAsync(userData)
      
      if (response.success && response.data.conversation) {
        const conversationId = response.data.conversation.id
        
        // S'abonner automatiquement à la nouvelle conversation
        subscribeToConversation(conversationId)
        
        return response
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur démarrage conversation temps réel:', error)
      throw error
    }
  }

  /**
   * Récupérer les messages d'une conversation
   */
  const getConversationMessages = (conversationId, options = {}) => {
    return useRealtimeConversationMessages(conversationId, options)
  }

  /**
   * Envoyer un message
   */
  const sendMessage = async (conversationId, messageData) => {
    try {
      const response = await sendMessageMutation.mutateAsync({
        conversationId,
        messageData
      })
      
      // Réinitialiser le compteur non lu pour cette conversation
      unreadCounts.value.set(conversationId, 0)
      
      return response
    } catch (error) {
      console.error('❌ Erreur envoi message temps réel:', error)
      throw error
    }
  }

  /**
   * Marquer les messages comme lus
   */
  const markAsRead = async (conversationId) => {
    try {
      const response = await markAsReadMutation.mutateAsync(conversationId)
      
      // Réinitialiser le compteur non lu
      unreadCounts.value.set(conversationId, 0)
      
      return response
    } catch (error) {
      console.error('❌ Erreur marquage lecture temps réel:', error)
      throw error
    }
  }

  /**
   * Envoyer un indicateur de frappe
   */
  const sendTypingIndicator = async (conversationId, isTyping = true) => {
    try {
      return await typingIndicatorMutation.mutateAsync({
        conversationId,
        isTyping
      })
    } catch (error) {
      console.error('❌ Erreur indicateur frappe temps réel:', error)
      throw error
    }
  }

  /**
   * Déconnecter WebSocket
   */
  const disconnectWebSocket = () => {
    console.log('🔌 Déconnexion WebSocket temps réel...')
    
    webSocketService.disconnect()
    isWebSocketConnected.value = false
    currentConversationId.value = null
    typingUsers.value.clear()
    onlineUsers.value.clear()
    unreadCounts.value.clear()
  }

  // Computed properties
  const conversations = computed(() => {
    return conversationsQuery.data.value?.conversations || []
  })

  const isLoadingConversations = computed(() => {
    return conversationsQuery.isPending.value
  })

  const conversationsError = computed(() => {
    return conversationsQuery.error.value
  })

  const connectionStats = computed(() => {
    return webSocketService.getConnectionStats()
  })

  const typingUsersArray = computed(() => {
    return Array.from(typingUsers.value.values())
  })

  const onlineUsersArray = computed(() => {
    return Array.from(onlineUsers.value)
  })

  const totalUnreadCount = computed(() => {
    return Array.from(unreadCounts.value.values()).reduce((total, count) => total + count, 0)
  })

  // Watchers
  watch(token, (newToken) => {
    if (newToken && !isWebSocketConnected.value) {
      initializeWebSocket()
    } else if (!newToken && isWebSocketConnected.value) {
      disconnectWebSocket()
    }
  })

  // Lifecycle
  onMounted(() => {
    if (token.value) {
      initializeWebSocket()
    }
  })

  onUnmounted(() => {
    disconnectWebSocket()
  })

  // API publique
  return {
    // États
    isWebSocketConnected,
    currentConversationId,
    conversations,
    isLoadingConversations,
    conversationsError,
    typingUsersArray,
    onlineUsersArray,
    totalUnreadCount,
    connectionStats,

    // Méthodes WebSocket
    initializeWebSocket,
    disconnectWebSocket,
    subscribeToConversation,
    unsubscribeFromConversation,

    // Méthodes API
    searchUsers,
    startOrFindConversation,
    getConversationMessages,
    sendMessage,
    markAsRead,
    sendTypingIndicator,

    // Mutations
    startOrFindConversationMutation,
    sendMessageMutation,
    markAsReadMutation,
    typingIndicatorMutation,

    // Utilitaires
    invalidateAll,
    invalidateConversations,
    invalidateMessages
  }
}
