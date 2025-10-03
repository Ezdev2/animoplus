<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-900">🔍 Diagnostic d'Authentification</h1>
    
    <!-- État d'authentification -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">État d'Authentification</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-gray-50 p-4 rounded">
          <strong>Authentifié:</strong> 
          <span :class="isAuthenticated ? 'text-green-600' : 'text-red-600'">
            {{ isAuthenticated ? '✅ OUI' : '❌ NON' }}
          </span>
        </div>
        <div class="bg-gray-50 p-4 rounded">
          <strong>Rôle détecté:</strong> 
          <code class="bg-gray-200 px-2 py-1 rounded">{{ role || 'N/A' }}</code>
        </div>
        <div class="bg-gray-50 p-4 rounded">
          <strong>Nom utilisateur:</strong> 
          <span>{{ currentUser?.name || 'N/A' }}</span>
        </div>
        <div class="bg-gray-50 p-4 rounded">
          <strong>Email:</strong> 
          <span>{{ currentUser?.email || 'N/A' }}</span>
        </div>
      </div>
    </div>

    <!-- Données localStorage -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Données localStorage</h2>
      <div class="bg-gray-100 p-4 rounded overflow-x-auto">
        <pre class="text-sm">{{ localStorageData }}</pre>
      </div>
    </div>

    <!-- Données utilisateur complètes -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Données Utilisateur Complètes</h2>
      <div class="bg-gray-100 p-4 rounded overflow-x-auto">
        <pre class="text-sm">{{ JSON.stringify(currentUser, null, 2) }}</pre>
      </div>
    </div>

    <!-- Tests de rôles -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Tests de Rôles (useUserRole)</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gray-50 p-3 rounded text-center">
          <div class="font-semibold">Client</div>
          <div :class="userRoles.isClient ? 'text-green-600' : 'text-gray-400'">
            {{ userRoles.isClient ? '✅' : '❌' }}
          </div>
        </div>
        <div class="bg-gray-50 p-3 rounded text-center">
          <div class="font-semibold">Vétérinaire</div>
          <div :class="userRoles.isVeterinarian ? 'text-green-600' : 'text-gray-400'">
            {{ userRoles.isVeterinarian ? '✅' : '❌' }}
          </div>
        </div>
        <div class="bg-gray-50 p-3 rounded text-center">
          <div class="font-semibold">Vétérinaire Pro</div>
          <div :class="userRoles.isVeterinarianPro ? 'text-green-600' : 'text-gray-400'">
            {{ userRoles.isVeterinarianPro ? '✅' : '❌' }}
          </div>
        </div>
        <div class="bg-gray-50 p-3 rounded text-center">
          <div class="font-semibold">Any Vétérinaire</div>
          <div :class="userRoles.isAnyVeterinarian ? 'text-green-600' : 'text-gray-400'">
            {{ userRoles.isAnyVeterinarian ? '✅' : '❌' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions de test -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Actions de Test</h2>
      <div class="flex flex-wrap gap-4">
        <button @click="refreshAuth" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          🔄 Rafraîchir Auth
        </button>
        <button @click="clearStorage" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          🗑️ Vider localStorage
        </button>
        <button @click="simulateLogin" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          🎭 Simuler Connexion Pro
        </button>
        <button @click="goToDashboard" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          🏠 Aller au Dashboard
        </button>
      </div>
    </div>

    <!-- Logs en temps réel -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Logs en Temps Réel</h2>
      <div class="bg-black text-green-400 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
        <div v-for="(log, index) in logs" :key="index" class="mb-1">
          <span class="text-gray-500">[{{ log.time }}]</span> {{ log.message }}
        </div>
      </div>
      <button @click="clearLogs" class="mt-2 bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
        Vider les logs
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { useUserRole } from '@/composables/useUserRole.js'

const router = useRouter()
const auth = useSimpleAuth()
const logs = ref([])

// États d'authentification
const isAuthenticated = computed(() => auth.isAuthenticated.value)
const currentUser = computed(() => auth.getCurrentUser.value)
const role = computed(() => {
  if (!currentUser.value) return null
  return currentUser.value.user_type || currentUser.value.role || 'client'
})

// Rôles détaillés
const { isClient, isVeterinarian, isVeterinarianPro, isAnyVeterinarian } = useUserRole()
const userRoles = computed(() => ({
  isClient: isClient.value,
  isVeterinarian: isVeterinarian.value,
  isVeterinarianPro: isVeterinarianPro.value,
  isAnyVeterinarian: isAnyVeterinarian.value
}))

// Données localStorage
const localStorageData = computed(() => {
  try {
    const data = localStorage.getItem('data')
    return data ? JSON.parse(data) : 'Aucune donnée'
  } catch (error) {
    return 'Erreur de parsing: ' + error.message
  }
})

// Fonctions utilitaires
const addLog = (message) => {
  logs.value.push({
    time: new Date().toLocaleTimeString(),
    message
  })
  console.log('🔍 DEBUG:', message)
}

const refreshAuth = () => {
  addLog('Rafraîchissement de l\'authentification...')
  auth.init()
  addLog(`État après rafraîchissement: ${isAuthenticated.value ? 'Connecté' : 'Déconnecté'}`)
}

const clearStorage = () => {
  addLog('Vidage du localStorage...')
  localStorage.clear()
  auth.init()
  addLog('localStorage vidé et auth rafraîchie')
}

const simulateLogin = () => {
  addLog('Simulation d\'une connexion Pro...')
  const mockUser = {
    id: "01999a04-f366-7335-91fb-a9d5d876c3c2",
    name: "User to Pro",
    email: "hevofim872@etenx.com",
    user_type: "veterinarian_pro",
    is_verified: true,
    is_veterinarian_pro: true
  }
  
  auth.login('mock-token', 'mock-refresh-token', mockUser)
  addLog(`Connexion simulée pour: ${mockUser.name} (${mockUser.user_type})`)
}

const goToDashboard = () => {
  addLog('Navigation vers le dashboard...')
  router.push('/dashboard')
}

const clearLogs = () => {
  logs.value = []
}

onMounted(() => {
  addLog('Page de diagnostic chargée')
  addLog(`État initial: ${isAuthenticated.value ? 'Connecté' : 'Déconnecté'}`)
  addLog(`Rôle détecté: ${role.value || 'N/A'}`)
  addLog(`Utilisateur: ${currentUser.value?.name || 'N/A'}`)
})
</script>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>
