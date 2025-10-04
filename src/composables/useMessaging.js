import { computed, ref } from 'vue'
import { useMessagingStore } from '@/stores/messaging.js'
import { 
  useConversationsQuery,
  useMessagesQuery,
  useStartOrFindConversation,
  useSendMessage,
  useMarkAsRead,
  useTypingIndicator,
  useDeleteConversation,
  useToggleArchiveConversation,
  useUserSearchQuery
} from '@/services/messaging/messagingQueries.js'

/**
 * Composable principal pour la messagerie
 * Interface unifiée combinant store, queries et utilitaires
 */
export function useMessaging() {
  // Store
  const messagingStore = useMessagingStore()

  // États réactifs locaux
  const searchQuery = ref('')
  const selectedConversationId = ref(null)
  const newMessageContent = ref('')
  const isTyping = ref(false)

  // Queries
  const conversationsQuery = useConversationsQuery({
    with_participants: true,
    with_last_message: true,
    with_unread_count: true,
    with_other_participant: true,
    per_page: 50
  })

  const messagesQuery = useMessagesQuery(selectedConversationId, {
    with_sender: true,
    with_read_status: true,
    per_page: 100,
    sort_by: 'sent_at',
    sort_order: 'asc'
  })

  const userSearchQuery = useUserSearchQuery(searchQuery, {
    per_page: 10,
    with_profile: true,
    is_active: true
  })

  // Mutations
  const startOrFindConversationMutation = useStartOrFindConversation()
  const sendMessageMutation = useSendMessage()
  const markAsReadMutation = useMarkAsRead()
  const typingIndicatorMutation = useTypingIndicator()
  const deleteConversationMutation = useDeleteConversation()
  const toggleArchiveMutation = useToggleArchiveConversation()

  // Computed properties
  const conversations = computed(() => {
    return conversationsQuery.data.value?.data || messagingStore.sortedConversations
  })

  const currentConversation = computed(() => {
    if (!selectedConversationId.value) return null
    return conversations.value.find(conv => conv.id === selectedConversationId.value) || 
           messagingStore.getConversationById(selectedConversationId.value)
  })

  const currentMessages = computed(() => {
    if (!selectedConversationId.value) return []
    return messagesQuery.data.value?.data || 
           messagingStore.getMessagesForConversation(selectedConversationId.value)
  })

  const searchResults = computed(() => {
    return userSearchQuery.data.value?.data || []
  })

  const isLoadingConversations = computed(() => {
    return conversationsQuery.isPending.value || messagingStore.isLoading
  })

  const isLoadingMessages = computed(() => {
    return messagesQuery.isPending.value
  })

  const isSearching = computed(() => {
    return userSearchQuery.isPending.value
  })

  const totalUnreadCount = computed(() => {
    return messagingStore.totalUnreadCount
  })

  const conversationStats = computed(() => {
    return messagingStore.getConversationStats()
  })

  // Actions
  const selectConversation = async (conversation) => {
    console.log('💬 Sélection conversation:', conversation)
    
    selectedConversationId.value = conversation.id
    messagingStore.setCurrentConversation(conversation)
    
    // Marquer comme lu automatiquement
    if (messagingStore.getUnreadCount(conversation.id) > 0) {
      await markAsRead(conversation.id)
    }
  }

  const startConversation = async (userId, initialMessage = null) => {
    try {
      const data = { user_id: userId }
      if (initialMessage) {
        data.message = initialMessage
      }
      
      const response = await startOrFindConversationMutation.mutateAsync(data)
      
      if (response.success && response.data.conversation) {
        await selectConversation(response.data.conversation)
        return response.data.conversation
      }
      
      return null
    } catch (error) {
      console.error('❌ Erreur démarrage conversation:', error)
      throw error
    }
  }

  const sendMessage = async (content, messageType = 'text') => {
    if (!selectedConversationId.value || !content.trim()) {
      console.warn('⚠️ Conversation non sélectionnée ou contenu vide')
      return
    }

    try {
      const messageData = {
        content: content.trim(),
        message_type: messageType
      }

      const response = await sendMessageMutation.mutateAsync({
        conversationId: selectedConversationId.value,
        messageData
      })

      // Réinitialiser le contenu du message
      newMessageContent.value = ''
      
      return response.data
    } catch (error) {
      console.error('❌ Erreur envoi message:', error)
      throw error
    }
  }

  const markAsRead = async (conversationId) => {
    try {
      await markAsReadMutation.mutateAsync({ 
        conversationId: conversationId || selectedConversationId.value 
      })
    } catch (error) {
      console.error('❌ Erreur marquage lecture:', error)
    }
  }

  const sendTypingIndicator = async (isCurrentlyTyping = true) => {
    if (!selectedConversationId.value) return

    try {
      await typingIndicatorMutation.mutateAsync({
        conversationId: selectedConversationId.value,
        isTyping: isCurrentlyTyping
      })
      
      isTyping.value = isCurrentlyTyping
    } catch (error) {
      console.error('❌ Erreur indicateur frappe:', error)
    }
  }

  const deleteConversation = async (conversationId) => {
    try {
      await deleteConversationMutation.mutateAsync(
        conversationId || selectedConversationId.value
      )
      
      // Si c'était la conversation sélectionnée, la désélectionner
      if (conversationId === selectedConversationId.value) {
        selectedConversationId.value = null
        messagingStore.clearCurrentConversation()
      }
    } catch (error) {
      console.error('❌ Erreur suppression conversation:', error)
      throw error
    }
  }

  const archiveConversation = async (conversationId, archive = true) => {
    try {
      await toggleArchiveMutation.mutateAsync({
        conversationId: conversationId || selectedConversationId.value,
        isArchived: archive
      })
    } catch (error) {
      console.error('❌ Erreur archivage conversation:', error)
      throw error
    }
  }

  const searchUsers = (query) => {
    searchQuery.value = query
  }

  const refreshConversations = async () => {
    try {
      await conversationsQuery.refetch()
    } catch (error) {
      console.error('❌ Erreur rafraîchissement conversations:', error)
    }
  }

  const refreshMessages = async () => {
    if (!selectedConversationId.value) return
    
    try {
      await messagesQuery.refetch()
    } catch (error) {
      console.error('❌ Erreur rafraîchissement messages:', error)
    }
  }

  // Utilitaires de formatage
  const formatMessageDate = (dateString) => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        return 'Aujourd\'hui'
      } else if (diffDays === 1) {
        return 'Hier'
      } else if (diffDays < 7) {
        return date.toLocaleDateString('fr-FR', { weekday: 'long' })
      } else {
        return date.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short' 
        })
      }
    } catch (error) {
      console.error('Erreur formatage date message:', error)
      return dateString
    }
  }

  const formatMessageTime = (dateString) => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } catch (error) {
      console.error('Erreur formatage heure message:', error)
      return dateString
    }
  }

  const truncateText = (text, maxLength = 50) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const getUserTypeClass = (userType) => {
    switch (userType) {
      case 'veterinarian':
        return 'user-type-pro'
      case 'client':
        return 'user-type-client'
      default:
        return 'user-type-default'
    }
  }

  const getUserTypeLabel = (userType) => {
    switch (userType) {
      case 'veterinarian':
        return 'Vétérinaire'
      case 'client':
        return 'Client'
      default:
        return 'Utilisateur'
    }
  }

  const formatUserName = (user) => {
    if (!user) return 'Utilisateur'
    
    if (user.nom && user.prenom) {
      return `${user.prenom} ${user.nom}`
    } else if (user.name) {
      return user.name
    } else if (user.email) {
      return user.email.split('@')[0]
    }
    
    return 'Utilisateur'
  }

  const getUserAvatar = (user, defaultAvatar) => {
    if (!user) return defaultAvatar
    return user.avatar || user.profile_picture || defaultAvatar
  }

  const getUserInitials = (user) => {
    if (!user) return 'U'
    
    const name = formatUserName(user)
    const words = name.split(' ')
    
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    } else if (words.length === 1 && words[0].length >= 2) {
      return words[0].substring(0, 2).toUpperCase()
    }
    
    return 'U'
  }

  const isRecentMessage = (dateString) => {
    if (!dateString) return false
    
    try {
      const messageDate = new Date(dateString)
      const now = new Date()
      const diffMinutes = (now.getTime() - messageDate.getTime()) / (1000 * 60)
      return diffMinutes < 5
    } catch (error) {
      return false
    }
  }

  // API publique
  return {
    // États
    conversations,
    currentConversation,
    currentMessages,
    searchResults,
    selectedConversationId,
    newMessageContent,
    searchQuery,
    isTyping,

    // États de chargement
    isLoadingConversations,
    isLoadingMessages,
    isSearching,

    // Statistiques
    totalUnreadCount,
    conversationStats,

    // Actions principales
    selectConversation,
    startConversation,
    sendMessage,
    markAsRead,
    sendTypingIndicator,
    deleteConversation,
    archiveConversation,
    searchUsers,
    refreshConversations,
    refreshMessages,

    // Mutations (pour accès direct si nécessaire)
    startOrFindConversationMutation,
    sendMessageMutation,
    markAsReadMutation,
    typingIndicatorMutation,
    deleteConversationMutation,
    toggleArchiveMutation,

    // Utilitaires de formatage
    formatMessageDate,
    formatMessageTime,
    truncateText,
    getUserTypeClass,
    getUserTypeLabel,
    formatUserName,
    getUserAvatar,
    getUserInitials,
    isRecentMessage,

    // Store (pour accès direct si nécessaire)
    messagingStore
  }
}
