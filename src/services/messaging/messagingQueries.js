import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { messagingService } from './messagingService.js'
import { useMessagingStore } from '@/stores/messaging.js'
import { useToast } from '@/composables/useToast.js'

// Clés de requête pour la messagerie
export const MESSAGING_QUERY_KEYS = {
  all: ['messaging'],
  conversations: () => [...MESSAGING_QUERY_KEYS.all, 'conversations'],
  conversation: (id) => [...MESSAGING_QUERY_KEYS.conversations(), id],
  messages: (conversationId) => [...MESSAGING_QUERY_KEYS.conversation(conversationId), 'messages'],
  userSearch: (searchTerm, options) => [...MESSAGING_QUERY_KEYS.all, 'user-search', searchTerm, options],
  conversationsList: (filters) => [...MESSAGING_QUERY_KEYS.conversations(), 'list', { filters }],
  messagesList: (conversationId, filters) => [...MESSAGING_QUERY_KEYS.messages(conversationId), 'list', { filters }],
  unreadCount: () => [...MESSAGING_QUERY_KEYS.all, 'unread-count'],
  typing: (conversationId) => [...MESSAGING_QUERY_KEYS.conversation(conversationId), 'typing']
}

/**
 * Hook pour rechercher des utilisateurs
 * @param {string|Ref<string>} searchTerm - Terme de recherche
 * @param {Object} options - Options de recherche
 * @returns {Object} Query result
 */
export const useUserSearchQuery = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: () => MESSAGING_QUERY_KEYS.userSearch(searchTerm, options),
    queryFn: () => {
      const term = typeof searchTerm === 'object' && searchTerm.value !== undefined 
        ? searchTerm.value 
        : searchTerm
      return messagingService.searchUsers(term, options)
    },
    enabled: () => {
      const term = typeof searchTerm === 'object' && searchTerm.value !== undefined 
        ? searchTerm.value 
        : searchTerm
      return !!term && term.length >= 2
    },
    staleTime: 30 * 1000, // 30 secondes
    cacheTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
    retry: 1,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les conversations
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useConversationsQuery = (options = {}) => {
  return useQuery({
    queryKey: MESSAGING_QUERY_KEYS.conversationsList(options),
    queryFn: () => messagingService.getConversations(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 30 * 1000, // Refetch toutes les 30 secondes
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
 * Hook pour récupérer une conversation par ID
 * @param {string|Ref<string>} conversationId - ID de la conversation
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useConversationQuery = (conversationId, options = {}) => {
  return useQuery({
    queryKey: () => {
      const id = typeof conversationId === 'object' && conversationId.value !== undefined 
        ? conversationId.value 
        : conversationId
      return MESSAGING_QUERY_KEYS.conversation(id)
    },
    queryFn: () => {
      const id = typeof conversationId === 'object' && conversationId.value !== undefined 
        ? conversationId.value 
        : conversationId
      return messagingService.getConversationById(id, options)
    },
    enabled: () => {
      const id = typeof conversationId === 'object' && conversationId.value !== undefined 
        ? conversationId.value 
        : conversationId
      return !!id
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
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
 * Hook pour récupérer les messages d'une conversation
 * @param {string|Ref<string>} conversationId - ID de la conversation
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useMessagesQuery = (conversationId, options = {}) => {
  return useQuery({
    queryKey: () => {
      const id = typeof conversationId === 'object' && conversationId.value !== undefined 
        ? conversationId.value 
        : conversationId
      return MESSAGING_QUERY_KEYS.messagesList(id, options)
    },
    queryFn: () => {
      const id = typeof conversationId === 'object' && conversationId.value !== undefined 
        ? conversationId.value 
        : conversationId
      return messagingService.getConversationMessages(id, options)
    },
    enabled: () => {
      const id = typeof conversationId === 'object' && conversationId.value !== undefined 
        ? conversationId.value 
        : conversationId
      return !!id
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchInterval: 10 * 1000, // Refetch toutes les 10 secondes
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
 * Hook pour démarrer ou trouver une conversation
 * @returns {Object} Mutation result
 */
export const useStartOrFindConversation = () => {
  const queryClient = useQueryClient()
  const messagingStore = useMessagingStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (data) => messagingService.startOrFindConversation(data),
    onSuccess: (data) => {
      console.log('✅ Conversation trouvée/créée avec succès:', data)
      
      // Invalider les conversations pour refetch
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.conversations()
      })
      
      // Mettre en cache la conversation
      if (data.data.conversation) {
        queryClient.setQueryData(
          MESSAGING_QUERY_KEYS.conversation(data.data.conversation.id),
          { success: true, data: data.data.conversation }
        )
      }
      
      // Mettre à jour le store
      if (messagingStore.addConversation) {
        messagingStore.addConversation(data.data.conversation)
      }
      
      showToast(
        data.data.is_new ? 'Nouvelle conversation créée' : 'Conversation trouvée',
        'success',
        3000
      )
    },
    onError: (error) => {
      console.error('❌ Erreur lors du démarrage/recherche de conversation:', error)
      showToast(
        error.message || 'Erreur lors de la création de la conversation',
        'error',
        5000
      )
    }
  })
}

/**
 * Hook pour envoyer un message
 * @returns {Object} Mutation result
 */
export const useSendMessage = () => {
  const queryClient = useQueryClient()
  const messagingStore = useMessagingStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ conversationId, messageData }) => 
      messagingService.sendMessage(conversationId, messageData),
    onMutate: async ({ conversationId, messageData }) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: MESSAGING_QUERY_KEYS.messages(conversationId)
      })

      const previousMessages = queryClient.getQueryData(
        MESSAGING_QUERY_KEYS.messagesList(conversationId, {})
      )

      // Ajouter le message optimiste
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content: messageData.content,
        message_type: messageData.message_type || 'text',
        sent_at: new Date().toISOString(),
        is_sent: false, // Marquer comme en cours d'envoi
        sender: { 
          id: 'current-user',
          name: 'Moi'
        },
        read_status: []
      }

      queryClient.setQueryData(
        MESSAGING_QUERY_KEYS.messagesList(conversationId, {}),
        (old) => {
          if (!old) return { 
            success: true, 
            data: [optimisticMessage], 
            pagination: {} 
          }
          return {
            ...old,
            data: [...(old.data || []), optimisticMessage]
          }
        }
      )

      return { previousMessages }
    },
    onSuccess: (data, { conversationId }) => {
      console.log('✅ Message envoyé avec succès:', data)
      
      // Invalider les messages pour refetch les données réelles
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.messages(conversationId)
      })
      
      // Invalider les conversations pour mettre à jour le dernier message
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.conversations()
      })
      
      // Mettre à jour le store
      if (messagingStore.addMessage) {
        messagingStore.addMessage(conversationId, data.data)
      }
    },
    onError: (error, { conversationId }, context) => {
      console.error('❌ Erreur lors de l\'envoi du message:', error)
      
      // Rollback optimistic update
      if (context?.previousMessages) {
        queryClient.setQueryData(
          MESSAGING_QUERY_KEYS.messagesList(conversationId, {}),
          context.previousMessages
        )
      }
      
      showToast(
        error.message || 'Erreur lors de l\'envoi du message',
        'error',
        5000
      )
    }
  })
}

/**
 * Hook pour marquer les messages comme lus
 * @returns {Object} Mutation result
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient()
  const messagingStore = useMessagingStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ conversationId, options }) => 
      messagingService.markAsRead(conversationId, options),
    onSuccess: (data, { conversationId }) => {
      console.log('✅ Messages marqués comme lus:', data)
      
      // Invalider les conversations pour mettre à jour les compteurs non lus
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.conversations()
      })
      
      // Invalider les messages de la conversation
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.messages(conversationId)
      })
      
      // Mettre à jour le store
      if (messagingStore.markConversationAsRead) {
        messagingStore.markConversationAsRead(conversationId)
      }
    },
    onError: (error) => {
      console.error('❌ Erreur lors du marquage comme lu:', error)
      showToast(
        error.message || 'Erreur lors du marquage comme lu',
        'error',
        5000
      )
    }
  })
}

/**
 * Hook pour envoyer un indicateur de frappe
 * @returns {Object} Mutation result
 */
export const useTypingIndicator = () => {
  return useMutation({
    mutationFn: ({ conversationId, isTyping }) => 
      messagingService.sendTypingIndicator(conversationId, isTyping),
    onSuccess: (data) => {
      console.log('✅ Indicateur de frappe envoyé:', data)
    },
    onError: (error) => {
      console.error('❌ Erreur indicateur de frappe:', error)
      // Ne pas afficher de toast pour les erreurs de frappe
    }
  })
}

/**
 * Hook pour supprimer une conversation
 * @returns {Object} Mutation result
 */
export const useDeleteConversation = () => {
  const queryClient = useQueryClient()
  const messagingStore = useMessagingStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (conversationId) => messagingService.deleteConversation(conversationId),
    onSuccess: (data, conversationId) => {
      console.log('✅ Conversation supprimée avec succès:', data)
      
      // Invalider les conversations
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.conversations()
      })
      
      // Supprimer du cache
      queryClient.removeQueries({
        queryKey: MESSAGING_QUERY_KEYS.conversation(conversationId)
      })
      
      queryClient.removeQueries({
        queryKey: MESSAGING_QUERY_KEYS.messages(conversationId)
      })
      
      // Mettre à jour le store
      if (messagingStore.removeConversation) {
        messagingStore.removeConversation(conversationId)
      }
      
      showToast(
        'Conversation supprimée avec succès',
        'success',
        3000
      )
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la suppression de la conversation:', error)
      showToast(
        error.message || 'Erreur lors de la suppression de la conversation',
        'error',
        5000
      )
    }
  })
}

/**
 * Hook pour archiver/désarchiver une conversation
 * @returns {Object} Mutation result
 */
export const useToggleArchiveConversation = () => {
  const queryClient = useQueryClient()
  const messagingStore = useMessagingStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ conversationId, isArchived }) => 
      messagingService.toggleArchiveConversation(conversationId, isArchived),
    onSuccess: (data, { conversationId, isArchived }) => {
      console.log('✅ Conversation archivée/désarchivée:', data)
      
      // Invalider les conversations
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.conversations()
      })
      
      // Mettre à jour le cache de la conversation
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.conversation(conversationId)
      })
      
      // Mettre à jour le store
      if (messagingStore.updateConversation) {
        messagingStore.updateConversation(conversationId, { is_archived: isArchived })
      }
      
      showToast(
        isArchived ? 'Conversation archivée' : 'Conversation désarchivée',
        'success',
        3000
      )
    },
    onError: (error) => {
      console.error('❌ Erreur lors de l\'archivage de la conversation:', error)
      showToast(
        error.message || 'Erreur lors de l\'archivage de la conversation',
        'error',
        5000
      )
    }
  })
}

/**
 * Hook pour invalider toutes les requêtes de messagerie
 * @returns {Function} Fonction d'invalidation
 */
export const useMessagingInvalidation = () => {
  const queryClient = useQueryClient()

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.all
      })
    },
    invalidateConversations: () => {
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.conversations()
      })
    },
    invalidateMessages: (conversationId) => {
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.messages(conversationId)
      })
    },
    invalidateUserSearch: () => {
      queryClient.invalidateQueries({
        queryKey: [...MESSAGING_QUERY_KEYS.all, 'user-search']
      })
    },
    clearCache: () => {
      queryClient.removeQueries({
        queryKey: MESSAGING_QUERY_KEYS.all
      })
    }
  }
}
