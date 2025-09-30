<template>
  <div class="cache-test-page min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Test de Gestion du Cache</h1>
      
      <!-- Boutons de test -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Bouton Default</h2>
          <CacheRefreshButton 
            variant="default"
            @cache-refreshed="handleCacheRefresh"
            @cache-cleared="handleCacheCleared"
          />
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Bouton Primary</h2>
          <CacheRefreshButton 
            variant="primary"
            @cache-refreshed="handleCacheRefresh"
            @cache-cleared="handleCacheCleared"
          />
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Bouton Ghost</h2>
          <CacheRefreshButton 
            variant="ghost"
            @cache-refreshed="handleCacheRefresh"
            @cache-cleared="handleCacheCleared"
          />
        </div>
      </div>

      <!-- Variations -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Sans Texte</h2>
          <CacheRefreshButton 
            variant="primary"
            :show-text="false"
            @cache-refreshed="handleCacheRefresh"
          />
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow">
          <h2 class="text-lg font-semibold mb-4">Sans Dropdown</h2>
          <CacheRefreshButton 
            variant="default"
            :show-dropdown="false"
            @cache-refreshed="handleCacheRefresh"
          />
        </div>
      </div>

      <!-- Logs d'événements -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Logs d'Événements</h2>
        
        <div v-if="logs.length === 0" class="text-gray-500 text-center py-4">
          Aucun événement pour le moment
        </div>
        
        <div v-else class="space-y-2">
          <div 
            v-for="(log, index) in logs" 
            :key="index"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded text-sm"
          >
            <div 
              class="w-2 h-2 rounded-full"
              :class="log.type === 'refresh' ? 'bg-blue-500' : 'bg-red-500'"
            ></div>
            <span class="text-gray-600">{{ log.timestamp }}</span>
            <span class="font-medium">{{ log.message }}</span>
          </div>
        </div>
        
        <button 
          v-if="logs.length > 0"
          @click="clearLogs"
          class="mt-4 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          Vider les logs
        </button>
      </div>

      <!-- Liens de navigation -->
      <div class="mt-8 flex gap-4">
        <router-link 
          to="/admin/cache-management"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          → Page Administration Cache
        </router-link>
        
        <router-link 
          to="/dashboard"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Retour Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CacheRefreshButton from '@/components/common/CacheRefreshButton.vue'

// État
const logs = ref([])

// Fonctions
const addLog = (type, message) => {
  logs.value.unshift({
    type,
    message,
    timestamp: new Date().toLocaleTimeString('fr-FR')
  })
  
  // Garder seulement les 20 derniers logs
  if (logs.value.length > 20) {
    logs.value = logs.value.slice(0, 20)
  }
}

const handleCacheRefresh = (event) => {
  console.log('🔄 Cache refreshed:', event)
  addLog('refresh', `Cache ${event.type} actualisé`)
}

const handleCacheCleared = () => {
  console.log('🗑️ Cache cleared')
  addLog('clear', 'Tous les caches vidés')
}

const clearLogs = () => {
  logs.value = []
}
</script>

<style scoped>
/* Styles spécifiques à la page de test */
</style>
