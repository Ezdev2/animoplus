<template>
  <div class="test-messaging">
    <h2>Test Messaging System</h2>
    
    <div class="test-section">
      <h3>Conversations</h3>
      <div v-if="isLoadingConversations">Chargement...</div>
      <div v-else-if="conversations.length === 0">Aucune conversation</div>
      <div v-else>
        <div v-for="conv in conversations" :key="conv.id" class="conversation-item">
          <strong>{{ conv.name }}</strong> - {{ conv.message }}
        </div>
      </div>
    </div>

    <div class="test-section">
      <h3>Actions</h3>
      <button @click="handleRefresh" :disabled="isLoadingConversations">
        Rafraîchir
      </button>
    </div>

    <div class="test-section">
      <h3>Debug Info</h3>
      <pre>{{ debugInfo }}</pre>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useMessaging } from '@/composables/useMessaging.js'

const {
  conversations: apiConversations,
  isLoadingConversations,
  refreshConversations,
  formatUserName,
  truncateText
} = useMessaging()

const conversations = computed(() => {
  if (!apiConversations.value || apiConversations.value.length === 0) {
    return []
  }
  
  return apiConversations.value.map(conv => ({
    id: conv.id,
    name: formatUserName(conv.other_participant) || 'Utilisateur',
    message: truncateText(conv.last_message?.content || 'Nouvelle conversation', 50)
  }))
})

const debugInfo = computed(() => ({
  conversationsCount: conversations.value.length,
  isLoading: isLoadingConversations.value,
  rawData: apiConversations.value
}))

const handleRefresh = async () => {
  try {
    await refreshConversations()
    console.log('✅ Refresh successful')
  } catch (error) {
    console.error('❌ Refresh error:', error)
  }
}
</script>

<style scoped>
.test-messaging {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.conversation-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}

button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
