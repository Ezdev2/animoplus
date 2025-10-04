<template>
  <div class="debug-conversation">
    <h2>Debug Conversation Data</h2>
    
    <div class="debug-section">
      <h3>Selected Conversation ID</h3>
      <div>{{ selectedConversationId || 'Aucune conversation sélectionnée' }}</div>
    </div>

    <div class="debug-section">
      <h3>Raw Conversation Data</h3>
      <div v-if="selectedConversationQuery.isLoading?.value">Chargement conversation...</div>
      <div v-else-if="selectedConversationQuery.data?.value">
        <pre>{{ JSON.stringify(selectedConversationQuery.data.value, null, 2) }}</pre>
      </div>
      <div v-else>Aucune donnée de conversation</div>
    </div>

    <div class="debug-section">
      <h3>Processed Conversation</h3>
      <div v-if="selectedConversation">
        <div><strong>ID:</strong> {{ selectedConversation.id }}</div>
        <div><strong>Type:</strong> {{ selectedConversation.type }}</div>
        <div><strong>Active:</strong> {{ selectedConversation.is_active }}</div>
        <div><strong>Participants Count:</strong> {{ selectedConversation.participants?.length }}</div>
        <div v-if="selectedConversation.otherParticipant">
          <strong>Other Participant:</strong>
          <ul>
            <li>Name: {{ selectedConversation.otherParticipant.name }}</li>
            <li>Type: {{ selectedConversation.otherParticipant.user_type }}</li>
            <li>Role: {{ selectedConversation.otherParticipant.pivot?.role }}</li>
          </ul>
        </div>
      </div>
      <div v-else>Aucune conversation traitée</div>
    </div>

    <div class="debug-section">
      <h3>Messages Data</h3>
      <div v-if="messagesQuery.isLoading?.value">Chargement messages...</div>
      <div v-else-if="messagesQuery.data?.value">
        <pre>{{ JSON.stringify(messagesQuery.data.value, null, 2) }}</pre>
      </div>
      <div v-else>Aucun message</div>
    </div>

    <div class="debug-section">
      <h3>Test Conversation Selection</h3>
      <button @click="testSelectConversation" class="debug-btn">
        Test Select Conversation
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useConversationQuery, useMessagesQuery } from '@/services/messaging/messagingQueries.js'

// État local
const selectedConversationId = ref(null)

// Queries
const selectedConversationQuery = useConversationQuery(selectedConversationId)
const messagesQuery = useMessagesQuery(selectedConversationId)

// Computed pour la conversation traitée
const selectedConversation = computed(() => {
  const conversation = selectedConversationQuery.data?.value?.data
  if (!conversation) return null

  console.log('🔍 Raw conversation data:', conversation)

  // Trouver l'autre participant (pas l'utilisateur actuel)
  const otherParticipant = conversation.participants?.find(p => 
    p.pivot?.role !== 'owner' // Assumant que l'utilisateur actuel est le owner
  ) || conversation.participants?.[0] // Fallback au premier participant

  console.log('🔍 Other participant found:', otherParticipant)

  return {
    ...conversation,
    otherParticipant
  }
})

// Test avec un ID réel
const testSelectConversation = () => {
  selectedConversationId.value = '0199a9d3-d59d-70f4-9c72-ce0cfd560239'
  console.log('🧪 Test conversation selected:', selectedConversationId.value)
}
</script>

<style scoped>
.debug-conversation {
  padding: 20px;
  font-family: monospace;
}

.debug-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.debug-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
}

ul {
  margin: 5px 0;
  padding-left: 20px;
}
</style>
