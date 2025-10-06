<template>
  <div class="test-send-message">
    <h2>Test Envoi de Messages</h2>
    
    <div class="test-section">
      <h3>Configuration</h3>
      <div class="form-group">
        <label>Conversation ID:</label>
        <input 
          v-model="conversationId" 
          type="text" 
          placeholder="0199a9d3-d59d-70f4-9c72-ce0cfd560239"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <label>Message:</label>
        <textarea 
          v-model="messageContent" 
          placeholder="Tapez votre message ici..."
          class="form-textarea"
        ></textarea>
      </div>
      <div class="form-group">
        <label>Type:</label>
        <select v-model="messageType" class="form-select">
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="file">File</option>
        </select>
      </div>
      <div class="form-group">
        <label>Priorité:</label>
        <select v-model="priority" class="form-select">
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>
    </div>

    <div class="test-section">
      <h3>Actions</h3>
      <button 
        @click="testSendMessage" 
        :disabled="!conversationId || !messageContent || isLoading"
        class="test-btn"
      >
        {{ isLoading ? 'Envoi...' : 'Envoyer Message' }}
      </button>
      <button @click="clearForm" class="test-btn secondary">
        Effacer
      </button>
    </div>

    <div class="test-section">
      <h3>Payload à Envoyer</h3>
      <pre>{{ JSON.stringify(messagePayload, null, 2) }}</pre>
    </div>

    <div class="test-section">
      <h3>Résultat</h3>
      <div v-if="isLoading" class="loading">Envoi en cours...</div>
      <div v-else-if="result" class="result success">
        <h4>✅ Succès</h4>
        <pre>{{ JSON.stringify(result, null, 2) }}</pre>
      </div>
      <div v-else-if="error" class="result error">
        <h4>❌ Erreur</h4>
        <pre>{{ error }}</pre>
      </div>
      <div v-else class="result empty">
        Aucun résultat pour le moment
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSendMessage } from '@/services/messaging/messagingQueries.js'

// État du formulaire
const conversationId = ref('0199a9d3-d59d-70f4-9c72-ce0cfd560239')
const messageContent = ref('Test message depuis Vue.js')
const messageType = ref('text')
const priority = ref('normal')

// État des résultats
const result = ref(null)
const error = ref(null)

// Mutation pour envoyer le message
const sendMessageMutation = useSendMessage()
const isLoading = computed(() => sendMessageMutation.isPending?.value || false)

// Payload calculé
const messagePayload = computed(() => ({
  content: messageContent.value,
  message_type: messageType.value,
  priority: priority.value,
  requires_response: false
}))

// Fonction de test
const testSendMessage = async () => {
  if (!conversationId.value || !messageContent.value) return

  result.value = null
  error.value = null

  try {
    console.log('🧪 Test envoi message:', {
      conversationId: conversationId.value,
      messageData: messagePayload.value
    })

    const response = await sendMessageMutation.mutateAsync({
      conversationId: conversationId.value,
      messageData: messagePayload.value
    })

    result.value = response
    console.log('✅ Message envoyé avec succès:', response)
  } catch (err) {
    error.value = err.message || 'Erreur inconnue'
    console.error('❌ Erreur envoi message:', err)
  }
}

// Effacer le formulaire
const clearForm = () => {
  messageContent.value = ''
  result.value = null
  error.value = null
}
</script>

<style scoped>
.test-send-message {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, sans-serif;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}

.test-btn {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 14px;
  font-weight: 500;
}

.test-btn:hover:not(:disabled) {
  background: #0056b3;
}

.test-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.test-btn.secondary {
  background: #6c757d;
}

.test-btn.secondary:hover {
  background: #545b62;
}

.result {
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
}

.result.success {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
}

.result.error {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
}

.result.empty {
  background: #e2e3e5;
  border: 1px solid #d6d8db;
  color: #383d41;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #007bff;
  font-weight: 500;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  margin: 0;
}

h4 {
  margin: 0 0 10px 0;
}
</style>
