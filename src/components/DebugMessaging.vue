<template>
  <div class="debug-messaging">
    <h2>Debug Messaging System</h2>
    
    <div class="debug-section">
      <h3>Conversations List</h3>
      <div v-if="isLoadingConversations">Chargement...</div>
      <div v-else>
        <div v-for="conv in conversations" :key="conv.id" class="debug-conversation">
          <button @click="selectConversation(conv)" class="debug-btn">
            Sélectionner: {{ conv.name }}
          </button>
          <div class="debug-info">
            <strong>ID:</strong> {{ conv.id }} ({{ typeof conv.id }})<br>
            <strong>Raw ID:</strong> {{ conv.rawData?.id }} ({{ typeof conv.rawData?.id }})
          </div>
        </div>
      </div>
    </div>

    <div class="debug-section">
      <h3>Selected Conversation</h3>
      <div>
        <strong>Selected ID:</strong> {{ selectedConversationId }} ({{ typeof selectedConversationId }})
      </div>
      <div v-if="selectedConversation">
        <pre>{{ JSON.stringify(selectedConversation, null, 2) }}</pre>
      </div>
    </div>

    <div class="debug-section">
      <h3>Messages</h3>
      <div v-if="isLoadingMessages">Chargement des messages...</div>
      <div v-else-if="conversationMessages.length > 0">
        <div v-for="msg in conversationMessages" :key="msg.id" class="debug-message">
          {{ msg.content }}
        </div>
      </div>
      <div v-else>Aucun message</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useMessaging } from '@/composables/useMessaging.js'
import { useConversationQuery, useMessagesQuery } from '@/services/messaging/messagingQueries.js'

// État local
const selectedConversationId = ref(null)

// Composable principal
const {
  conversations: apiConversations,
  isLoadingConversations,
  formatUserName,
  getUserAvatar,
  truncateText
} = useMessaging()

// Queries pour la conversation sélectionnée
const selectedConversationQuery = useConversationQuery(selectedConversationId)
const messagesQuery = useMessagesQuery(selectedConversationId)

// Computed properties
const conversations = computed(() => {
  if (!apiConversations.value || apiConversations.value.length === 0) {
    return []
  }
  
  return apiConversations.value.map(conv => {
    const otherParticipant = conv.other_participant
    let displayName = 'Conversation'

    if (conv.type === 'direct' && otherParticipant) {
      displayName = formatUserName(otherParticipant) || otherParticipant.name || 'Utilisateur'
    } else if (conv.type === 'group' && conv.title) {
      displayName = conv.title
    }

    return {
      id: conv.id,
      name: displayName,
      rawData: conv
    }
  })
})

const selectedConversation = computed(() => {
  return selectedConversationQuery.data?.value?.data
})

const conversationMessages = computed(() => {
  return messagesQuery.data?.value?.data || []
})

const isLoadingMessages = computed(() => {
  return messagesQuery.isLoading?.value || false
})

// Fonction de sélection avec debug
const selectConversation = (conversation) => {
  console.log('🎯 DEBUG - Sélection conversation:', conversation)
  console.log('🔍 DEBUG - ID:', conversation.id, typeof conversation.id)
  console.log('🔍 DEBUG - Raw ID:', conversation.rawData?.id, typeof conversation.rawData?.id)
  
  const conversationId = conversation.rawData?.id || conversation.id
  console.log('🔍 DEBUG - ID final:', conversationId, typeof conversationId)
  
  selectedConversationId.value = String(conversationId)
  console.log('🔍 DEBUG - ID assigné:', selectedConversationId.value, typeof selectedConversationId.value)
}
</script>

<style scoped>
.debug-messaging {
  padding: 20px;
  font-family: monospace;
}

.debug-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.debug-conversation {
  margin-bottom: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.debug-btn {
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 8px;
}

.debug-info {
  font-size: 12px;
  color: #666;
}

.debug-message {
  padding: 8px;
  margin: 4px 0;
  background: #e9ecef;
  border-radius: 4px;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>
