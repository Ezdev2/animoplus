<template>
  <div class="test-sort">
    <h2>Test Tri des Messages</h2>
    
    <div class="test-section">
      <h3>Messages de Test</h3>
      <button @click="generateTestMessages" class="test-btn">
        Générer Messages Test
      </button>
      <button @click="toggleSort" class="test-btn">
        Changer Tri ({{ currentSort }})
      </button>
    </div>

    <div class="test-section">
      <h3>Messages Affichés ({{ sortedMessages.length }})</h3>
      <div class="messages-container">
        <div 
          v-for="(message, index) in sortedMessages" 
          :key="message.id"
          class="message-item"
          :class="{ 'recent': index >= sortedMessages.length - 2 }"
        >
          <div class="message-content">
            <strong>{{ message.content }}</strong>
          </div>
          <div class="message-meta">
            <span>{{ formatDate(message.sent_at) }}</span>
            <span class="position">Position: {{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="test-section">
      <h3>Données Brutes</h3>
      <pre>{{ JSON.stringify(testMessages.map(m => ({
        content: m.content,
        sent_at: m.sent_at,
        date: new Date(m.sent_at).toLocaleString()
      })), null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// État
const testMessages = ref([])
const currentSort = ref('asc')

// Messages triés
const sortedMessages = computed(() => {
  if (testMessages.value.length === 0) return []
  
  const messages = [...testMessages.value]
  
  if (currentSort.value === 'asc') {
    // Anciens en haut, récents en bas
    return messages.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at))
  } else {
    // Récents en haut, anciens en bas
    return messages.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))
  }
})

// Générer des messages de test
const generateTestMessages = () => {
  const now = new Date()
  testMessages.value = [
    {
      id: '1',
      content: 'Message ancien (il y a 2 heures)',
      sent_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2', 
      content: 'Message moyen (il y a 1 heure)',
      sent_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      content: 'Message récent (il y a 30 min)',
      sent_at: new Date(now.getTime() - 30 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      content: 'Message très récent (il y a 5 min)',
      sent_at: new Date(now.getTime() - 5 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      content: 'Message tout récent (maintenant)',
      sent_at: now.toISOString()
    }
  ]
}

// Changer le tri
const toggleSort = () => {
  currentSort.value = currentSort.value === 'asc' ? 'desc' : 'asc'
}

// Formater la date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('fr-FR')
}
</script>

<style scoped>
.test-sort {
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

.test-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.messages-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
}

.message-item {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  background: #f8f9fa;
  border-left: 3px solid #dee2e6;
}

.message-item.recent {
  background: #e7f3ff;
  border-left-color: #007bff;
}

.message-content {
  margin-bottom: 5px;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.position {
  font-weight: bold;
  color: #007bff;
}

pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>
