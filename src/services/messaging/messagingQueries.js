import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { messagingService } from './messagingService.js'

/**
 * Hooks TanStack Query pour la messagerie classique (API REST)
 * Version simplifiée sans WebSocket
 */

/**
 * Clés de requête pour la messagerie
 */
export const MESSAGING_QUERY_KEYS = {
  all: ['messaging'],
  conversations: () => ['messaging', 'conversations'],
  conversation: (id) => ['messaging', 'conversations', id],
  messages: (conversationId) => ['messaging', 'conversations', conversationId, 'messages'],
}

/**
 * Hook pour récupérer les conversations
 * @param {Object} options - Options de récupération
 * @returns {Object} Résultat de la requête
 */
export function useConversations(options = {}) {
  return useQuery({
    queryKey: MESSAGING_QUERY_KEYS.conversations(),
    queryFn: () => {
      console.log('📋 Récupération conversations:', options)
      return messagingService.getConversations(options)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch toutes les 30 secondes
    select: (data) => {
      console.log('📋 Réponse conversations:', data)
      if (!data.success) {
        throw new Error(data.error)
      }
      return {
        conversations: data.data.data || data.data,
        pagination: data.pagination
      }
    }
  })
}

/**
 * Hook pour démarrer ou trouver une conversation
 * @returns {Object} Mutation pour démarrer/trouver une conversation
 */
export function useStartOrFindConversation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => {
      console.log('💬 Démarrage/recherche conversation API:', data)
      return messagingService.startOrFindConversation(data)
    },
    onSuccess: (response) => {
      console.log('✅ Conversation trouvée/créée (API):', response.data)
      
      const conversationData = response.data.conversation
      
      if (conversationData) {
        // Invalider et refetch les conversations
        queryClient.invalidateQueries({
          queryKey: MESSAGING_QUERY_KEYS.conversations()
        })
        
        // Mettre en cache les données de la conversation
        queryClient.setQueryData(
          MESSAGING_QUERY_KEYS.conversation(conversationData.id),
          conversationData
        )
      }
    },
    onError: (error) => {
      console.error('❌ Erreur démarrage/recherche conversation API:', error)
    }
  })
}

/**
 * Hook pour récupérer les messages d'une conversation
 * @param {Ref|string} conversationId - ID de la conversation
 * @param {Object} options - Options de récupération
 * @returns {Object} Résultat de la requête
 */
export function useMessagesQuery(conversationId, options = {}) {
  return useQuery({
    queryKey: computed(() => {
      const actualId = typeof conversationId === 'object' && conversationId.value !== undefined 
        ? conversationId.value 
        : conversationId
      return MESSAGING_QUERY_KEYS.messages(actualId)
    }),
    queryFn: () => {
      const actualId = typeof conversationId === 'object' && conversationId.value !== undefined 
        ? conversationId.value 
        : conversationId
      
      console.log('📨 Chargement messages API:', actualId, options)
      return messagingService.getConversationMessages(actualId, options)
    },
    enabled: computed(() => {
      const actualId = typeof conversationId === 'object' && conversationId.value !== undefined 
        ? conversationId.value 
        : conversationId
      return !!actualId
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => {
      console.log('📨 Réponse messages API:', data)
      if (!data.success) {
        throw new Error(data.error)
      }
      return {
        messages: data.data,
        pagination: data.pagination
      }
    }
  })
}

/**
 * Hook pour envoyer un message
 * @returns {Object} Mutation pour envoyer un message
 */
export function useSendMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ conversationId, messageData }) => {
      console.log('📤 Envoi message API:', conversationId, messageData)
      return messagingService.sendMessage(conversationId, messageData)
    },
    onMutate: async ({ conversationId, messageData }) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: MESSAGING_QUERY_KEYS.messages(conversationId)
      })

      const previousMessages = queryClient.getQueryData(
        MESSAGING_QUERY_KEYS.messages(conversationId)
      )

      // Ajouter le message optimiste
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content: messageData.content,
        sent_at: new Date().toISOString(),
        is_sent: false, // Marquer comme en cours d'envoi
        sender: { 
          id: 'current-user',
          name: 'Moi'
        }
      }

      queryClient.setQueryData(
        MESSAGING_QUERY_KEYS.messages(conversationId),
        (old) => {
          if (!old) return { messages: [optimisticMessage], pagination: {} }
          return {
            ...old,
            messages: [...(old.messages || []), optimisticMessage]
          }
        }
      )

      return { previousMessages }
    },
    onSuccess: (response, { conversationId }) => {
      console.log('✅ Message envoyé (API):', response.data)
      
      // Invalider les messages pour refetch les données réelles
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.messages(conversationId)
      })
      
      // Invalider les conversations pour mettre à jour le dernier message
      queryClient.invalidateQueries({
        queryKey: MESSAGING_QUERY_KEYS.conversations()
      })
    },
    onError: (error, { conversationId }, context) => {
      console.error('❌ Erreur envoi message API:', error)
      
      // Rollback optimistic update
      if (context?.previousMessages) {
        queryClient.setQueryData(
          MESSAGING_QUERY_KEYS.messages(conversationId),
          context.previousMessages
        )
      }
    }
  })
}
