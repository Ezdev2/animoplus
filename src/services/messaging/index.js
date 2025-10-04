/**
 * Export principal pour les services de messagerie
 * Point d'entrée unique pour tous les services de messagerie
 */

// Services
export { messagingService } from './messagingService.js'

// Hooks TanStack Query
export {
  useConversations,
  useStartOrFindConversation,
  useMessagesQuery,
  useSendMessage,
  MESSAGING_QUERY_KEYS
} from './messagingQueries.js'

/**
 * Configuration par défaut pour la messagerie
 */
export const MESSAGING_CONFIG = {
  // Requêtes
  staleTime: {
    conversations: 5 * 60 * 1000, // 5 minutes
    messages: 2 * 60 * 1000,     // 2 minutes
  },
  
  refetchInterval: {
    conversations: 30 * 1000,    // 30 secondes
    messages: 10 * 1000          // 10 secondes
  },
  
  // Pagination
  defaultPageSize: {
    conversations: 20,
    messages: 50
  }
}
