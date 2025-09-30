<template>
  <div class="service-types-test-page min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Test Service Types</h1>
      
      <!-- Actions de test -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Actions de Test</h2>
        
        <div class="flex flex-wrap gap-4">
          <button
            @click="testGetServiceTypes"
            :disabled="isLoading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {{ isLoading ? 'Chargement...' : 'Récupérer Types Services' }}
          </button>
          
          <button
            @click="testForceRefresh"
            :disabled="isRefreshing"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {{ isRefreshing ? 'Actualisation...' : 'Force Refresh Cache' }}
          </button>
          
          <button
            @click="testCacheStats"
            class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Statistiques Cache
          </button>
          
          <button
            @click="loadFromCache"
            class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Charger depuis Cache
          </button>
          
          <button
            @click="clearCache"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Vider Cache
          </button>
        </div>
      </div>

      <!-- Résultats -->
      <div v-if="serviceTypes.length > 0" class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Types de Services ({{ serviceTypes.length }})</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="serviceType in serviceTypes" 
            :key="serviceType.id"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex items-center gap-3 mb-2">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                :style="{ backgroundColor: serviceType.color }"
              >
                {{ getServiceTypeIcon(serviceType.icon) }}
              </div>
              <div>
                <h3 class="font-medium text-gray-900">{{ serviceType.name }}</h3>
                <p class="text-sm text-gray-600">{{ serviceType.description }}</p>
              </div>
            </div>
            
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ serviceType.id.slice(0, 8) }}...</span>
              <span 
                class="px-2 py-1 rounded-full"
                :class="serviceType.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ serviceType.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques du cache -->
      <div v-if="cacheStats" class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Statistiques du Cache</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Existe :</span>
              <span class="font-medium">{{ cacheStats.exists ? 'Oui' : 'Non' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Valide :</span>
              <span class="font-medium">{{ cacheStats.valid ? 'Oui' : 'Non' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Nombre d'éléments :</span>
              <span class="font-medium">{{ cacheStats.count || 0 }}</span>
            </div>
          </div>
          
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-600">Dernière MAJ :</span>
              <span class="font-medium text-sm">{{ cacheStats.lastUpdate || 'Jamais' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Expire à :</span>
              <span class="font-medium text-sm">{{ cacheStats.expiresAt || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Taille :</span>
              <span class="font-medium">{{ formatBytes(cacheStats.size) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Logs -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Logs de Test</h2>
          <button 
            @click="clearLogs"
            class="text-sm text-gray-600 hover:text-gray-900"
          >
            Vider
          </button>
        </div>
        
        <div v-if="logs.length === 0" class="text-gray-500 text-center py-4">
          Aucun log pour le moment
        </div>
        
        <div v-else class="space-y-2 max-h-64 overflow-y-auto">
          <div 
            v-for="(log, index) in logs" 
            :key="index"
            class="flex items-start gap-3 p-3 bg-gray-50 rounded text-sm"
          >
            <div 
              class="w-2 h-2 rounded-full mt-2"
              :class="log.type === 'success' ? 'bg-green-500' : log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'"
            ></div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-medium">{{ log.action }}</span>
                <span class="text-gray-500">{{ log.timestamp }}</span>
              </div>
              <div class="text-gray-700">{{ log.message }}</div>
              <pre v-if="log.data" class="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">{{ JSON.stringify(log.data, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { serviceTypesService } from '@/services/serviceTypes/serviceTypesService.js'

// État
const serviceTypes = ref([])
const cacheStats = ref(null)
const logs = ref([])
const isLoading = ref(false)
const isRefreshing = ref(false)

// Fonctions utilitaires
const addLog = (type, action, message, data = null) => {
  logs.value.unshift({
    type,
    action,
    message,
    data,
    timestamp: new Date().toLocaleTimeString('fr-FR')
  })
  
  // Garder seulement les 20 derniers logs
  if (logs.value.length > 20) {
    logs.value = logs.value.slice(0, 20)
  }
}

const clearLogs = () => {
  logs.value = []
}

const formatBytes = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getServiceTypeIcon = (icon) => {
  const icons = {
    'scissors': '✂️',
    'stethoscope': '🩺',
    'tooth': '🦷',
    'search': '🔍',
    'bed': '🛏️',
    'star': '⭐',
    'alert': '🚨',
    'syringe': '💉'
  }
  return icons[icon] || '📋'
}

// Actions de test
const testGetServiceTypes = async () => {
  isLoading.value = true
  
  try {
    addLog('info', 'GET_SERVICE_TYPES', 'Récupération des types de services...')
    
    const data = await serviceTypesService.getServiceTypes()
    
    serviceTypes.value = data
    addLog('success', 'GET_SERVICE_TYPES', `${data.length} types de services récupérés`, data)
    
  } catch (error) {
    console.error('❌ Erreur test getServiceTypes:', error)
    addLog('error', 'GET_SERVICE_TYPES', `Erreur: ${error.message}`, error)
  } finally {
    isLoading.value = false
  }
}

const testForceRefresh = async () => {
  isRefreshing.value = true
  
  try {
    addLog('info', 'FORCE_REFRESH', 'Actualisation forcée du cache...')
    
    const data = await serviceTypesService.forceRefreshCache()
    
    serviceTypes.value = data
    addLog('success', 'FORCE_REFRESH', `Cache actualisé avec ${data.length} éléments`, data)
    
  } catch (error) {
    console.error('❌ Erreur test forceRefresh:', error)
    addLog('error', 'FORCE_REFRESH', `Erreur: ${error.message}`, error)
  } finally {
    isRefreshing.value = false
  }
}

const testCacheStats = () => {
  try {
    addLog('info', 'CACHE_STATS', 'Récupération des statistiques du cache...')
    
    const stats = serviceTypesService.getCacheStats()
    
    cacheStats.value = stats
    addLog('success', 'CACHE_STATS', 'Statistiques récupérées', stats)
    
  } catch (error) {
    console.error('❌ Erreur test cacheStats:', error)
    addLog('error', 'CACHE_STATS', `Erreur: ${error.message}`, error)
  }
}

const loadFromCache = () => {
  try {
    addLog('info', 'LOAD_CACHE', 'Chargement depuis le cache...')
    
    // Récupérer directement depuis le localStorage
    const cacheKey = 'animoplus_service_types_cache'
    const cached = localStorage.getItem(cacheKey)
    
    if (cached) {
      const data = JSON.parse(cached)
      if (data.data && Array.isArray(data.data)) {
        serviceTypes.value = data.data
        addLog('success', 'LOAD_CACHE', `${data.data.length} types de services chargés depuis le cache`, data.data)
      } else {
        addLog('error', 'LOAD_CACHE', 'Format de cache invalide')
      }
    } else {
      addLog('info', 'LOAD_CACHE', 'Aucun cache trouvé')
    }
    
  } catch (error) {
    console.error('❌ Erreur chargement cache:', error)
    addLog('error', 'LOAD_CACHE', `Erreur: ${error.message}`, error)
  }
}

// Lifecycle
onMounted(async () => {
  addLog('info', 'MOUNTED', 'Page de test chargée')
  
  // Charger les statistiques du cache
  testCacheStats()
  
  // Essayer de charger les données depuis le cache d'abord
  try {
    addLog('info', 'CACHE_CHECK', 'Vérification du cache existant...')
    
    const cachedData = serviceTypesService.getCacheStats()
    if (cachedData.exists && cachedData.valid) {
      addLog('success', 'CACHE_FOUND', 'Cache valide trouvé, chargement des données...')
      loadFromCache()
    } else {
      addLog('info', 'NO_CACHE', 'Aucun cache valide trouvé. Cliquez sur "Récupérer Types Services" pour charger.')
    }
  } catch (error) {
    addLog('error', 'MOUNT_ERROR', `Erreur au montage: ${error.message}`)
  }
})
</script>

<style scoped>
/* Styles spécifiques à la page de test */
</style>
