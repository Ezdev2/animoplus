<template>
  <div class="test-endpoints">
    <h2>Test des Endpoints Messaging</h2>
    
    <div class="test-section">
      <h3>Test des URLs générées</h3>
      <div class="endpoint-test">
        <strong>Conversation Detail:</strong><br>
        <code>{{ conversationDetailUrl }}</code>
      </div>
      <div class="endpoint-test">
        <strong>Messages:</strong><br>
        <code>{{ messagesUrl }}</code>
      </div>
    </div>

    <div class="test-section">
      <h3>Test API Calls</h3>
      <button @click="testConversationDetail" class="test-btn">
        Test Conversation Detail
      </button>
      <button @click="testMessages" class="test-btn">
        Test Messages
      </button>
    </div>

    <div class="test-section">
      <h3>Résultats</h3>
      <div v-if="loading">Chargement...</div>
      <div v-if="result" class="result">
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
      <div v-if="error" class="error">
        <strong>Erreur:</strong> {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'
import { messagingService } from '@/services/messaging/messagingService.js'

// État
const loading = ref(false)
const result = ref(null)
const error = ref(null)

// ID de test (remplacez par un vrai ID de votre API)
const testConversationId = '0199a9d3-d59d-70f4-9c72-ce0cfd560239'

// URLs générées
const conversationDetailUrl = computed(() => {
  return API_ENDPOINTS.MESSAGING.CONVERSATIONS.DETAIL(testConversationId)
})

const messagesUrl = computed(() => {
  return API_ENDPOINTS.MESSAGING.CONVERSATIONS.MESSAGES(testConversationId)
})

// Test de l'endpoint conversation detail
const testConversationDetail = async () => {
  loading.value = true
  error.value = null
  result.value = null

  try {
    console.log('🧪 Test Conversation Detail URL:', conversationDetailUrl.value)
    const response = await messagingService.getConversationById(testConversationId)
    result.value = response
    console.log('✅ Conversation Detail Response:', response)
  } catch (err) {
    error.value = err.message
    console.error('❌ Conversation Detail Error:', err)
  } finally {
    loading.value = false
  }
}

// Test de l'endpoint messages
const testMessages = async () => {
  loading.value = true
  error.value = null
  result.value = null

  try {
    console.log('🧪 Test Messages URL:', messagesUrl.value)
    const response = await messagingService.getConversationMessages(testConversationId)
    result.value = response
    console.log('✅ Messages Response:', response)
  } catch (err) {
    error.value = err.message
    console.error('❌ Messages Error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.test-endpoints {
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

.endpoint-test {
  margin-bottom: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
}

.test-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
}

.test-btn:hover {
  background: #0056b3;
}

.result {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 10px;
  border-radius: 4px;
}

.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  color: #721c24;
}

code {
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>
