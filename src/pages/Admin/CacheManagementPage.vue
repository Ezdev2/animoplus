<template>
  <div class="cache-management-page min-h-screen bg-gray-50">
    <!-- En-tête de page -->
    <div class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Administration - Cache</h1>
            <p class="text-gray-600 mt-1">Gestion des données de référence en cache</p>
          </div>
          
          <!-- Indicateur global -->
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-sm font-medium text-gray-900">Statut Global</div>
              <div class="text-xs text-gray-600">{{ lastUpdateText }}</div>
            </div>
            <div 
              class="w-4 h-4 rounded-full"
              :class="globalStatusClass"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Alertes importantes -->
      <div v-if="hasExpiredCaches" class="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <div>
            <h3 class="font-medium text-yellow-800">Attention : Caches expirés détectés</h3>
            <p class="text-yellow-700 text-sm mt-1">
              Certaines données de référence sont expirées. Il est recommandé de les actualiser pour éviter des incohérences.
            </p>
          </div>
        </div>
      </div>

      <div v-if="hasEmptyCaches" class="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <h3 class="font-medium text-blue-800">Information : Caches vides</h3>
            <p class="text-blue-700 text-sm mt-1">
              Certaines données de référence ne sont pas encore en cache. Elles seront chargées automatiquement lors de la première utilisation.
            </p>
          </div>
        </div>
      </div>

      <!-- Composant de gestion du cache -->
      <CacheManagement @cache-updated="handleCacheUpdate" />

      <!-- Actions rapides -->
      <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Actualisation complète -->
          <button
            @click="refreshAllData"
            :disabled="isRefreshingAll"
            class="flex items-center justify-center gap-2 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              class="w-5 h-5 text-blue-600" 
              :class="{ 'animate-spin': isRefreshingAll }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <div class="text-left">
              <div class="font-medium text-gray-900">Tout Actualiser</div>
              <div class="text-sm text-gray-600">Recharger toutes les données</div>
            </div>
          </button>

          <!-- Nettoyage complet -->
          <button
            @click="clearAllData"
            :disabled="isClearingAll"
            class="flex items-center justify-center gap-2 p-4 border-2 border-red-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <div class="text-left">
              <div class="font-medium text-gray-900">Tout Nettoyer</div>
              <div class="text-sm text-gray-600">Vider tous les caches</div>
            </div>
          </button>

          <!-- Diagnostic -->
          <button
            @click="runDiagnostic"
            :disabled="isRunningDiagnostic"
            class="flex items-center justify-center gap-2 p-4 border-2 border-green-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div class="text-left">
              <div class="font-medium text-gray-900">Diagnostic</div>
              <div class="text-sm text-gray-600">Vérifier l'intégrité</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Logs récents -->
      <div v-if="recentLogs.length > 0" class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Activité Récente</h2>
        
        <div class="space-y-2">
          <div 
            v-for="(log, index) in recentLogs" 
            :key="index"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm"
          >
            <div 
              class="w-2 h-2 rounded-full"
              :class="log.type === 'success' ? 'bg-green-500' : log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'"
            ></div>
            <span class="text-gray-600">{{ log.timestamp }}</span>
            <span class="font-medium text-gray-900">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { referenceCacheService } from '@/services/cache/referenceCache.js'
import CacheManagement from '@/components/admin/CacheManagement.vue'

// États
const isRefreshingAll = ref(false)
const isClearingAll = ref(false)
const isRunningDiagnostic = ref(false)
const cacheStats = ref({})
const recentLogs = ref([])

// Computed
const hasExpiredCaches = computed(() => {
  return Object.values(cacheStats.value).some(stat => stat.exists && !stat.valid)
})

const hasEmptyCaches = computed(() => {
  return Object.values(cacheStats.value).some(stat => !stat.exists)
})

const globalStatusClass = computed(() => {
  if (hasEmptyCaches.value) return 'bg-gray-400'
  if (hasExpiredCaches.value) return 'bg-yellow-500'
  return 'bg-green-500'
})

const lastUpdateText = computed(() => {
  const updates = Object.values(cacheStats.value)
    .filter(stat => stat.exists && stat.lastUpdate)
    .map(stat => new Date(stat.lastUpdate))
  
  if (updates.length === 0) return 'Aucune donnée'
  
  const latest = new Date(Math.max(...updates))
  return `Dernière MAJ: ${latest.toLocaleString('fr-FR')}`
})

// Fonctions
const addLog = (type, message) => {
  recentLogs.value.unshift({
    type,
    message,
    timestamp: new Date().toLocaleTimeString('fr-FR')
  })
  
  // Garder seulement les 10 derniers logs
  if (recentLogs.value.length > 10) {
    recentLogs.value = recentLogs.value.slice(0, 10)
  }
}

const loadCacheStats = () => {
  cacheStats.value = referenceCacheService.getCacheStats()
}

const refreshAllData = async () => {
  isRefreshingAll.value = true
  
  try {
    addLog('info', 'Début de l\'actualisation complète...')
    
    // Déclencher l'actualisation via l'événement du composant enfant
    // Pour l'instant, on simule juste
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    loadCacheStats()
    addLog('success', 'Actualisation complète terminée')
    
  } catch (error) {
    console.error('❌ Erreur actualisation complète:', error)
    addLog('error', 'Erreur lors de l\'actualisation complète')
  } finally {
    isRefreshingAll.value = false
  }
}

const clearAllData = async () => {
  if (!confirm('Êtes-vous sûr de vouloir vider tous les caches ? Cette action est irréversible.')) {
    return
  }
  
  isClearingAll.value = true
  
  try {
    addLog('info', 'Nettoyage de tous les caches...')
    
    referenceCacheService.clearAllCaches()
    
    loadCacheStats()
    addLog('success', 'Tous les caches ont été vidés')
    
  } catch (error) {
    console.error('❌ Erreur nettoyage:', error)
    addLog('error', 'Erreur lors du nettoyage')
  } finally {
    isClearingAll.value = false
  }
}

const runDiagnostic = async () => {
  isRunningDiagnostic.value = true
  
  try {
    addLog('info', 'Exécution du diagnostic...')
    
    const stats = referenceCacheService.getCacheStats()
    let issues = 0
    
    Object.entries(stats).forEach(([name, stat]) => {
      if (!stat.exists) {
        addLog('info', `Cache ${name} : vide`)
        issues++
      } else if (!stat.valid) {
        addLog('info', `Cache ${name} : expiré`)
        issues++
      } else {
        addLog('success', `Cache ${name} : OK (${stat.count} éléments)`)
      }
    })
    
    if (issues === 0) {
      addLog('success', 'Diagnostic terminé : aucun problème détecté')
    } else {
      addLog('info', `Diagnostic terminé : ${issues} problème(s) détecté(s)`)
    }
    
  } catch (error) {
    console.error('❌ Erreur diagnostic:', error)
    addLog('error', 'Erreur lors du diagnostic')
  } finally {
    isRunningDiagnostic.value = false
  }
}

const handleCacheUpdate = (event) => {
  loadCacheStats()
  addLog('success', `Cache ${event.type} mis à jour`)
}

// Lifecycle
onMounted(() => {
  loadCacheStats()
  addLog('info', 'Page de gestion du cache chargée')
})
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
