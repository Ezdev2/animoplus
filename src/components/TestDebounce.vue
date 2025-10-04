<template>
  <div class="test-debounce">
    <h2>Test Debounce Search</h2>
    
    <div class="test-section">
      <h3>Recherche avec Debounce (500ms)</h3>
      <div class="search-wrapper">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Tapez pour tester le debounce..."
          class="search-input"
        />
        <div v-if="isTyping" class="indicator typing">✏️ En train de taper...</div>
        <div v-else-if="isSearching" class="indicator searching">🔍 Recherche...</div>
        <div v-else class="indicator idle">💤 En attente</div>
      </div>
    </div>

    <div class="test-section">
      <h3>Statistiques</h3>
      <div class="stats">
        <div class="stat">
          <strong>Valeur actuelle:</strong> "{{ searchQuery }}"
        </div>
        <div class="stat">
          <strong>Valeur debouncée:</strong> "{{ debouncedSearchQuery }}"
        </div>
        <div class="stat">
          <strong>Nombre de requêtes:</strong> {{ requestCount }}
        </div>
        <div class="stat">
          <strong>Dernière requête:</strong> {{ lastRequest || 'Aucune' }}
        </div>
      </div>
    </div>

    <div class="test-section">
      <h3>Historique des Requêtes</h3>
      <div class="requests-history">
        <div v-if="requestHistory.length === 0" class="empty">
          Aucune requête encore
        </div>
        <div v-else>
          <div 
            v-for="(request, index) in requestHistory" 
            :key="index"
            class="request-item"
          >
            <span class="request-number">{{ index + 1 }}.</span>
            <span class="request-query">"{{ request.query }}"</span>
            <span class="request-time">{{ request.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="test-section">
      <button @click="clearHistory" class="clear-btn">
        Effacer l'historique
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

// Fonction utilitaire pour debounce
const useDebounce = (value, delay) => {
  const debouncedValue = ref(value.value)
  let timeoutId = null

  watch(value, (newValue) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

// État
const searchQuery = ref('')
const requestCount = ref(0)
const lastRequest = ref('')
const requestHistory = ref([])

// Debounce
const debouncedSearchQuery = useDebounce(searchQuery, 500)

// Computed
const isTyping = computed(() => searchQuery.value !== debouncedSearchQuery.value)
const isSearching = computed(() => {
  // Simuler un état de recherche pendant 1 seconde après chaque requête
  return false // Pour ce test, on ne simule pas vraiment de requête
})

// Watcher pour simuler les requêtes
watch(debouncedSearchQuery, (newValue) => {
  if (newValue.length >= 2) {
    requestCount.value++
    lastRequest.value = newValue
    requestHistory.value.push({
      query: newValue,
      time: new Date().toLocaleTimeString()
    })
    
    console.log(`🔍 Requête ${requestCount.value}: "${newValue}"`)
  }
})

// Fonctions
const clearHistory = () => {
  requestCount.value = 0
  lastRequest.value = ''
  requestHistory.value = []
  searchQuery.value = ''
}
</script>

<style scoped>
.test-debounce {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  margin-bottom: 10px;
}

.search-input:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.indicator {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.indicator.typing {
  background: #FEF3C7;
  color: #92400E;
}

.indicator.searching {
  background: #DBEAFE;
  color: #1E40AF;
}

.indicator.idle {
  background: #F3F4F6;
  color: #6B7280;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat {
  padding: 8px;
  background: white;
  border-radius: 4px;
  font-size: 14px;
}

.requests-history {
  max-height: 200px;
  overflow-y: auto;
}

.request-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: white;
  border-radius: 4px;
  margin-bottom: 4px;
  font-size: 14px;
}

.request-number {
  font-weight: bold;
  color: #3B82F6;
  min-width: 20px;
}

.request-query {
  flex: 1;
  font-family: monospace;
  background: #F3F4F6;
  padding: 2px 6px;
  border-radius: 3px;
}

.request-time {
  font-size: 12px;
  color: #6B7280;
}

.empty {
  text-align: center;
  color: #6B7280;
  font-style: italic;
  padding: 20px;
}

.clear-btn {
  padding: 10px 20px;
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.clear-btn:hover {
  background: #DC2626;
}
</style>
