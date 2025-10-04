<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Nouveau message</h3>
        <button @click="closeModal" class="close-btn">×</button>
      </div>

      <div class="modal-body">
        <!-- Barre de recherche -->
        <div class="search-section">
          <div class="search-input-wrapper">
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Rechercher un utilisateur..."
              class="search-input"
            />
            <div v-if="isTyping" class="search-loading">✏️</div>
            <div v-else-if="isSearching" class="search-loading">🔍</div>
          </div>
        </div>

        <!-- Résultats de recherche -->
        <div class="results-section">
          <div v-if="isSearching" class="loading-state">
            <p>Recherche en cours...</p>
          </div>

          <div v-else-if="searchError" class="error-state">
            <p>❌ Erreur: {{ searchError }}</p>
          </div>

          <div v-else-if="debouncedSearchQuery.length >= 2 && searchResults.length === 0" class="empty-state">
            <p>Aucun utilisateur trouvé</p>
          </div>

          <div v-else-if="isCreatingConversation" class="loading-state">
            <p>🚀 Création de la conversation...</p>
          </div>

          <div v-else-if="searchResults.length > 0" class="users-list">
            <div 
              v-for="user in searchResults" 
              :key="user.id"
              class="user-item"
              :class="{ 'disabled': isCreatingConversation }"
              @click="!isCreatingConversation && selectUser(user)"
            >
              <div class="user-avatar">
                <img :src="user.avatar || defaultAvatar" :alt="user.name" />
              </div>
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-details">
                  <span class="user-type">{{ user.user_type === 'client' ? 'PATIENT' : 'PRO' }}</span>
                  <span class="user-email">{{ user.email }}</span>
                </div>
              </div>
              <div class="select-btn">
                <span>Sélectionner</span>
              </div>
            </div>
          </div>

          <div v-else class="initial-state">
            <p>💬 Tapez au moins 2 caractères pour rechercher un utilisateur</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="cancel-btn">Annuler</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useUserSearchQuery } from '@/services/messaging/messagingQueries.js'
import defaultAvatar from '@/assets/images/image1.svg'

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

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  isCreatingConversation: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'userSelected'])

// État local
const searchQuery = ref('')
const searchError = ref(null)

// Debounce de la recherche (attendre 500ms après la dernière frappe)
const debouncedSearchQuery = useDebounce(searchQuery, 500)

// Query pour la recherche d'utilisateurs (utilise la valeur debouncée)
const userSearchQuery = useUserSearchQuery(debouncedSearchQuery, {
  per_page: 10,
  with_profile: true,
  is_active: true
})

// Computed properties
const isSearching = computed(() => userSearchQuery.isLoading?.value || false)
const isTyping = computed(() => searchQuery.value !== debouncedSearchQuery.value)
const searchResults = computed(() => userSearchQuery.data?.value?.data || [])

// Fonctions
const closeModal = () => {
  emit('close')
  // Reset search
  searchQuery.value = ''
  searchError.value = null
}

const handleSearch = () => {
  searchError.value = null
}

const selectUser = (user) => {
  console.log('👤 Utilisateur sélectionné:', user)
  emit('userSelected', user)
  closeModal()
}

// Watcher pour les erreurs
watch(() => userSearchQuery.error?.value, (error) => {
  if (error) {
    searchError.value = error.message || 'Erreur lors de la recherche'
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6B7280;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #F3F4F6;
}

.modal-body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.search-section {
  margin-bottom: 20px;
}

.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-loading {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
}

.results-section {
  min-height: 200px;
}

.loading-state, .error-state, .empty-state, .initial-state {
  text-align: center;
  padding: 40px 20px;
  color: #6B7280;
}

.error-state {
  color: #DC2626;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-item:hover:not(.disabled) {
  border-color: #3B82F6;
  background-color: #F8FAFC;
}

.user-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 12px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}

.user-details {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.user-type {
  background: #3B82F6;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.user-type:contains('PATIENT') {
  background: #10B981;
}

.user-email {
  color: #6B7280;
}

.select-btn {
  color: #3B82F6;
  font-size: 12px;
  font-weight: 500;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #E5E7EB;
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 8px 16px;
  background: #F3F4F6;
  color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background: #E5E7EB;
}
</style>
