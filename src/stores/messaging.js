import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store Pinia pour la gestion de la messagerie
 * Gère l'état local des conversations et messages
 */
export const useMessagingStore = defineStore('messaging', () => {
  // État réactif
  const conversations = ref([])
  const currentConversation = ref(null)
  const messages = ref(new Map()) // Map<conversationId, messages[]>
  const unreadCounts = ref(new Map()) // Map<conversationId, count>
  const typingUsers = ref(new Map()) // Map<conversationId, Set<userId>>
  const onlineUsers = ref(new Set()) // Set<userId>
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const totalUnreadCount = computed(() => {
    return Array.from(unreadCounts.value.values()).reduce((total, count) => total + count, 0)
  })

  const sortedConversations = computed(() => {
    return [...conversations.value].sort((a, b) => {
      const aTime = new Date(a.last_activity_at || a.updated_at || a.created_at)
      const bTime = new Date(b.last_activity_at || b.updated_at || b.created_at)
      return bTime - aTime
    })
  })

  const activeConversations = computed(() => {
    return conversations.value.filter(conv => conv.is_active && !conv.is_archived)
  })

  const archivedConversations = computed(() => {
    return conversations.value.filter(conv => conv.is_archived)
  })

  const conversationsWithUnread = computed(() => {
    return conversations.value.filter(conv => (unreadCounts.value.get(conv.id) || 0) > 0)
  })

  const getConversationById = computed(() => {
    return (id) => conversations.value.find(conv => conv.id === id)
  })

  const getMessagesForConversation = computed(() => {
    return (conversationId) => messages.value.get(conversationId) || []
  })

  const getUnreadCount = computed(() => {
    return (conversationId) => unreadCounts.value.get(conversationId) || 0
  })

  const getTypingUsers = computed(() => {
    return (conversationId) => Array.from(typingUsers.value.get(conversationId) || [])
  })

  const isUserOnline = computed(() => {
    return (userId) => onlineUsers.value.has(userId)
  })

  // Actions
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (err) => {
    error.value = err
  }

  const clearError = () => {
    error.value = null
  }

  const setConversations = (newConversations) => {
    conversations.value = newConversations
    
    // Mettre à jour les compteurs non lus
    newConversations.forEach(conv => {
      if (conv.unread_count !== undefined) {
        unreadCounts.value.set(conv.id, conv.unread_count)
      }
    })
  }

  const addConversation = (conversation) => {
    const existingIndex = conversations.value.findIndex(conv => conv.id === conversation.id)
    
    if (existingIndex >= 0) {
      // Mettre à jour la conversation existante
      conversations.value[existingIndex] = { ...conversations.value[existingIndex], ...conversation }
    } else {
      // Ajouter la nouvelle conversation
      conversations.value.unshift(conversation)
    }
    
    // Mettre à jour le compteur non lu
    if (conversation.unread_count !== undefined) {
      unreadCounts.value.set(conversation.id, conversation.unread_count)
    }
  }

  const updateConversation = (conversationId, updates) => {
    const index = conversations.value.findIndex(conv => conv.id === conversationId)
    if (index >= 0) {
      conversations.value[index] = { ...conversations.value[index], ...updates }
      
      // Mettre à jour le compteur non lu si fourni
      if (updates.unread_count !== undefined) {
        unreadCounts.value.set(conversationId, updates.unread_count)
      }
    }
  }

  const removeConversation = (conversationId) => {
    const index = conversations.value.findIndex(conv => conv.id === conversationId)
    if (index >= 0) {
      conversations.value.splice(index, 1)
    }
    
    // Nettoyer les données associées
    messages.value.delete(conversationId)
    unreadCounts.value.delete(conversationId)
    typingUsers.value.delete(conversationId)
    
    // Si c'était la conversation courante, la désélectionner
    if (currentConversation.value?.id === conversationId) {
      currentConversation.value = null
    }
  }

  const setCurrentConversation = (conversation) => {
    currentConversation.value = conversation
  }

  const clearCurrentConversation = () => {
    currentConversation.value = null
  }

  const setMessages = (conversationId, newMessages) => {
    messages.value.set(conversationId, newMessages)
  }

  const addMessage = (conversationId, message) => {
    const conversationMessages = messages.value.get(conversationId) || []
    
    // Vérifier si le message existe déjà (éviter les doublons)
    const existingIndex = conversationMessages.findIndex(msg => msg.id === message.id)
    
    if (existingIndex >= 0) {
      // Mettre à jour le message existant
      conversationMessages[existingIndex] = { ...conversationMessages[existingIndex], ...message }
    } else {
      // Ajouter le nouveau message
      conversationMessages.push(message)
      
      // Trier par date d'envoi
      conversationMessages.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at))
    }
    
    messages.value.set(conversationId, conversationMessages)
    
    // Mettre à jour la conversation avec le dernier message
    updateConversation(conversationId, {
      last_message: message,
      last_activity_at: message.sent_at
    })
  }

  const updateMessage = (conversationId, messageId, updates) => {
    const conversationMessages = messages.value.get(conversationId) || []
    const messageIndex = conversationMessages.findIndex(msg => msg.id === messageId)
    
    if (messageIndex >= 0) {
      conversationMessages[messageIndex] = { ...conversationMessages[messageIndex], ...updates }
      messages.value.set(conversationId, conversationMessages)
    }
  }

  const removeMessage = (conversationId, messageId) => {
    const conversationMessages = messages.value.get(conversationId) || []
    const filteredMessages = conversationMessages.filter(msg => msg.id !== messageId)
    messages.value.set(conversationId, filteredMessages)
  }

  const setUnreadCount = (conversationId, count) => {
    unreadCounts.value.set(conversationId, count)
    
    // Mettre à jour aussi dans la conversation
    updateConversation(conversationId, { unread_count: count })
  }

  const incrementUnreadCount = (conversationId) => {
    const currentCount = unreadCounts.value.get(conversationId) || 0
    setUnreadCount(conversationId, currentCount + 1)
  }

  const markConversationAsRead = (conversationId) => {
    setUnreadCount(conversationId, 0)
  }

  const addTypingUser = (conversationId, userId) => {
    if (!typingUsers.value.has(conversationId)) {
      typingUsers.value.set(conversationId, new Set())
    }
    typingUsers.value.get(conversationId).add(userId)
  }

  const removeTypingUser = (conversationId, userId) => {
    if (typingUsers.value.has(conversationId)) {
      typingUsers.value.get(conversationId).delete(userId)
    }
  }

  const clearTypingUsers = (conversationId) => {
    if (typingUsers.value.has(conversationId)) {
      typingUsers.value.get(conversationId).clear()
    }
  }

  const setUserOnline = (userId) => {
    onlineUsers.value.add(userId)
  }

  const setUserOffline = (userId) => {
    onlineUsers.value.delete(userId)
  }

  const clearOnlineUsers = () => {
    onlineUsers.value.clear()
  }

  const reset = () => {
    conversations.value = []
    currentConversation.value = null
    messages.value.clear()
    unreadCounts.value.clear()
    typingUsers.value.clear()
    onlineUsers.value.clear()
    isLoading.value = false
    error.value = null
  }

  // Utilitaires
  const findConversationByParticipant = (userId) => {
    return conversations.value.find(conv => {
      if (conv.type === 'direct') {
        return conv.other_participant?.id === userId ||
               conv.participants?.some(p => p.id === userId && !p.is_current_user)
      }
      return false
    })
  }

  const getConversationStats = () => {
    return {
      total: conversations.value.length,
      active: activeConversations.value.length,
      archived: archivedConversations.value.length,
      withUnread: conversationsWithUnread.value.length,
      totalUnread: totalUnreadCount.value,
      totalMessages: Array.from(messages.value.values()).reduce((total, msgs) => total + msgs.length, 0)
    }
  }

  const searchConversations = (query) => {
    if (!query || query.length < 2) return conversations.value
    
    const lowerQuery = query.toLowerCase()
    return conversations.value.filter(conv => {
      // Rechercher dans le nom/titre
      if (conv.title?.toLowerCase().includes(lowerQuery)) return true
      if (conv.other_participant?.name?.toLowerCase().includes(lowerQuery)) return true
      if (conv.other_participant?.email?.toLowerCase().includes(lowerQuery)) return true
      
      // Rechercher dans le dernier message
      if (conv.last_message?.content?.toLowerCase().includes(lowerQuery)) return true
      
      return false
    })
  }

  const searchMessages = (conversationId, query) => {
    if (!query || query.length < 2) return getMessagesForConversation.value(conversationId)
    
    const conversationMessages = messages.value.get(conversationId) || []
    const lowerQuery = query.toLowerCase()
    
    return conversationMessages.filter(msg => 
      msg.content?.toLowerCase().includes(lowerQuery)
    )
  }

  return {
    // État
    conversations,
    currentConversation,
    messages,
    unreadCounts,
    typingUsers,
    onlineUsers,
    isLoading,
    error,

    // Getters
    totalUnreadCount,
    sortedConversations,
    activeConversations,
    archivedConversations,
    conversationsWithUnread,
    getConversationById,
    getMessagesForConversation,
    getUnreadCount,
    getTypingUsers,
    isUserOnline,

    // Actions
    setLoading,
    setError,
    clearError,
    setConversations,
    addConversation,
    updateConversation,
    removeConversation,
    setCurrentConversation,
    clearCurrentConversation,
    setMessages,
    addMessage,
    updateMessage,
    removeMessage,
    setUnreadCount,
    incrementUnreadCount,
    markConversationAsRead,
    addTypingUser,
    removeTypingUser,
    clearTypingUsers,
    setUserOnline,
    setUserOffline,
    clearOnlineUsers,
    reset,

    // Utilitaires
    findConversationByParticipant,
    getConversationStats,
    searchConversations,
    searchMessages
  }
})
