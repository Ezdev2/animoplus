/**
 * Export principal pour les services de messagerie
 * Point d'entrée unique pour tous les services de messagerie
 */

// Services
export { messagingService } from './messagingService.js'

// Hooks TanStack Query
export {
  useUserSearchQuery,
  useConversationsQuery,
  useConversationQuery,
  useMessagesQuery,
  useStartOrFindConversation,
  useSendMessage,
  useMarkAsRead,
  useTypingIndicator,
  useDeleteConversation,
  useToggleArchiveConversation,
  useMessagingInvalidation,
  MESSAGING_QUERY_KEYS
} from './messagingQueries.js'

// Store
export { useMessagingStore } from '@/stores/messaging.js'

// Composable principal
export { useMessaging } from '@/composables/useMessaging.js'

/**
 * Configuration par défaut pour la messagerie
 */
export const MESSAGING_CONFIG = {
  // Requêtes
  staleTime: {
    conversations: 5 * 60 * 1000, // 5 minutes
    messages: 2 * 60 * 1000,     // 2 minutes
    userSearch: 30 * 1000        // 30 secondes
  },
  
  refetchInterval: {
    conversations: 30 * 1000,    // 30 secondes
    messages: 10 * 1000          // 10 secondes
  },
  
  // Pagination
  defaultPageSize: {
    conversations: 20,
    messages: 50,
    userSearch: 10
  },
  
  // Limites
  maxMessageLength: 2000,
  maxConversationTitle: 100,
  
  // Types de messages supportés
  messageTypes: [
    'text',
    'image',
    'file',
    'audio',
    'video',
    'location',
    'contact'
  ],
  
  // Types de conversations
  conversationTypes: [
    'direct',
    'group',
    'channel'
  ]
}

/**
 * Constantes pour les statuts
 */
export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
}

export const CONVERSATION_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
  MUTED: 'muted'
}

export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  AWAY: 'away',
  BUSY: 'busy'
}

/**
 * Utilitaires de validation
 */
export const validateMessage = (content, type = 'text') => {
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Le contenu du message est requis' }
  }
  
  if (content.trim().length === 0) {
    return { valid: false, error: 'Le message ne peut pas être vide' }
  }
  
  if (content.length > MESSAGING_CONFIG.maxMessageLength) {
    return { 
      valid: false, 
      error: `Le message ne peut pas dépasser ${MESSAGING_CONFIG.maxMessageLength} caractères` 
    }
  }
  
  if (!MESSAGING_CONFIG.messageTypes.includes(type)) {
    return { valid: false, error: 'Type de message non supporté' }
  }
  
  return { valid: true }
}

export const validateConversationTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { valid: false, error: 'Le titre de la conversation est requis' }
  }
  
  if (title.trim().length === 0) {
    return { valid: false, error: 'Le titre ne peut pas être vide' }
  }
  
  if (title.length > MESSAGING_CONFIG.maxConversationTitle) {
    return { 
      valid: false, 
      error: `Le titre ne peut pas dépasser ${MESSAGING_CONFIG.maxConversationTitle} caractères` 
    }
  }
  
  return { valid: true }
}
