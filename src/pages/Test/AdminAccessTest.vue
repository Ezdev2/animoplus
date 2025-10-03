<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- En-tête -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">🛡️ Test d'Accès Admin</h1>
        <p class="text-gray-600">Vérification des permissions et de l'accès aux routes administrateur</p>
      </div>

      <!-- État de l'utilisateur -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">État de l'utilisateur actuel</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-gray-700 mb-2">Authentification</h3>
            <p :class="isAuthenticated ? 'text-green-600' : 'text-red-600'">
              {{ isAuthenticated ? '✅ Connecté' : '❌ Non connecté' }}
            </p>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-gray-700 mb-2">Rôle utilisateur</h3>
            <p :class="getUserRoleClass()">
              {{ currentUser?.user_type || currentUser?.role || 'Aucun rôle' }}
            </p>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-gray-700 mb-2">Nom utilisateur</h3>
            <p class="text-gray-900">{{ currentUser?.name || 'Utilisateur inconnu' }}</p>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium text-gray-700 mb-2">Accès Admin</h3>
            <p :class="hasAdminAccess ? 'text-green-600' : 'text-red-600'">
              {{ hasAdminAccess ? '✅ Autorisé' : '❌ Refusé' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Test des routes admin -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Test des Routes Admin</h2>
        
        <div class="space-y-3">
          <div v-for="route in adminRoutes" :key="route.path" 
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 class="font-medium text-gray-900">{{ route.name }}</h3>
              <p class="text-sm text-gray-600">{{ route.path }}</p>
            </div>
            <div class="flex gap-2">
              <RouterLink v-if="hasAdminAccess" :to="route.path" 
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Accéder
              </RouterLink>
              <button v-else disabled
                class="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed">
                Accès refusé
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Simulation de rôles -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">🎭 Simulation de Rôles (Dev uniquement)</h2>
        <p class="text-sm text-gray-600 mb-4">
          Ces boutons permettent de simuler différents types d'utilisateurs pour tester les permissions.
        </p>
        
        <div class="flex flex-wrap gap-3">
          <button @click="simulateRole('admin')" 
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            🔴 Simuler Admin
          </button>
          <button @click="simulateRole('veterinarian')" 
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            🟢 Simuler Vétérinaire
          </button>
          <button @click="simulateRole('client')" 
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            🔵 Simuler Client
          </button>
          <button @click="clearSimulation" 
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            🔄 Reset
          </button>
        </div>
      </div>

      <!-- Logs de navigation -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">📋 Logs de Navigation</h2>
        <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
          <div v-for="(log, index) in navigationLogs" :key="index" class="mb-1">
            {{ log }}
          </div>
          <div v-if="navigationLogs.length === 0" class="text-gray-500">
            Aucun log pour le moment...
          </div>
        </div>
      </div>

      <!-- Retour -->
      <div class="text-center">
        <RouterLink to="/dashboard" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          ← Retour au Dashboard
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { useRouter } from 'vue-router'

const auth = useSimpleAuth()
const router = useRouter()

// État réactif
const navigationLogs = ref([])

// Routes admin à tester
const adminRoutes = [
  { name: 'Dashboard Admin', path: '/admin' },
  { name: 'Service Types', path: '/admin/test/service-types' },
  { name: 'Coopération Admin', path: '/admin/coop-admin' }
]

// Computed
const currentUser = computed(() => auth.getCurrentUser.value)
const isAuthenticated = computed(() => auth.isAuthenticated.value)

const hasAdminAccess = computed(() => {
  const user = currentUser.value
  if (!user) return false
  
  const userType = user.user_type || user.role
  return userType === 'admin'
})

// Méthodes
const getUserRoleClass = () => {
  const user = currentUser.value
  if (!user) return 'text-gray-500'
  
  const userType = user.user_type || user.role
  switch (userType) {
    case 'admin': return 'text-red-600 font-bold'
    case 'veterinarian': return 'text-green-600'
    case 'client': return 'text-blue-600'
    default: return 'text-gray-500'
  }
}

const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString()
  navigationLogs.value.unshift(`[${timestamp}] ${message}`)
  
  // Garder seulement les 20 derniers logs
  if (navigationLogs.value.length > 20) {
    navigationLogs.value = navigationLogs.value.slice(0, 20)
  }
}

const simulateRole = (role) => {
  try {
    // Récupérer les données actuelles
    const data = localStorage.getItem('data')
    if (!data) {
      addLog(`❌ Aucune donnée d'authentification trouvée`)
      return
    }
    
    const parsed = JSON.parse(data)
    
    // Modifier le rôle
    parsed.user.user_type = role
    parsed.user.role = role
    
    // Sauvegarder
    localStorage.setItem('data', JSON.stringify(parsed))
    
    addLog(`🎭 Simulation du rôle: ${role}`)
    
    // Forcer le rechargement de la page pour que les changements prennent effet
    setTimeout(() => {
      window.location.reload()
    }, 500)
    
  } catch (error) {
    console.error('Erreur simulation rôle:', error)
    addLog(`❌ Erreur lors de la simulation: ${error.message}`)
  }
}

const clearSimulation = () => {
  addLog(`🔄 Reset de la simulation`)
  // Recharger la page pour revenir à l'état normal
  window.location.reload()
}

// Lifecycle
onMounted(() => {
  addLog(`📱 Page de test d'accès admin chargée`)
  addLog(`👤 Utilisateur actuel: ${currentUser.value?.name || 'Inconnu'}`)
  addLog(`🔑 Rôle: ${currentUser.value?.user_type || currentUser.value?.role || 'Aucun'}`)
  addLog(`🛡️ Accès admin: ${hasAdminAccess.value ? 'Autorisé' : 'Refusé'}`)
})
</script>
