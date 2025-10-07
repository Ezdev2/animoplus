<template>
  <!-- Bouton flottant pour accès rapide aux tests admin (dev uniquement) -->
  <div v-if="isDev" class="fixed bottom-4 right-4 z-50">
    <div class="relative">
      <!-- Bouton principal -->
      <button @click="toggleMenu" 
        :class="[
          'w-14 h-14 rounded-full shadow-lg transition-all duration-300',
          isOpen ? 'bg-red-600 rotate-45' : 'bg-blue-600 hover:bg-blue-700'
        ]">
        <span class="text-white text-2xl">{{ isOpen ? '×' : '🛠️' }}</span>
      </button>
      
      <!-- Menu déroulant -->
      <div v-if="isOpen" class="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 min-w-64 overflow-hidden">
        <div class="p-3 bg-gray-50 border-b">
          <h3 class="font-semibold text-gray-900 text-sm">🔧 Tests Admin</h3>
          <p class="text-xs text-gray-600">Outils de développement</p>
        </div>
        
        <div class="p-2 space-y-1">
          <!-- État actuel -->
          <div class="px-3 py-2 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-600">Rôle:</span>
              <span :class="getRoleClass()" class="font-medium">{{ currentRole }}</span>
            </div>
            <div class="flex justify-between mt-1">
              <span class="text-gray-600">Admin:</span>
              <span :class="hasAdminAccess ? 'text-green-600' : 'text-red-600'" class="font-medium">
                {{ hasAdminAccess ? '✅' : '❌' }}
              </span>
            </div>
          </div>
          
          <hr class="my-2">
          
          <!-- Actions rapides -->
          <button @click="simulateAdmin" 
            class="w-full text-left px-3 py-2 text-sm hover:bg-red-50 rounded flex items-center gap-2">
            <span class="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">A</span>
            Simuler Admin
          </button>
          
          <button @click="simulateVet" 
            class="w-full text-left px-3 py-2 text-sm hover:bg-green-50 rounded flex items-center gap-2">
            <span class="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center text-white text-xs">V</span>
            Simuler Vétérinaire
          </button>
          
          <button @click="simulateClient" 
            class="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 rounded flex items-center gap-2">
            <span class="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">C</span>
            Simuler Client
          </button>
          
          <hr class="my-2">
          
          <!-- Liens rapides -->
          <RouterLink to="/admin" @click="closeMenu"
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2">
            🏠 Dashboard Admin
          </RouterLink>
          
          <RouterLink to="/admin/test/service-types" @click="closeMenu"
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2">
            ⚙️ Service Types
          </RouterLink>
          
          <RouterLink to="/admin/announcements" @click="closeMenu"
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2">
            📋 Gestion Annonces
          </RouterLink>
          
          <RouterLink to="/test/admin-access" @click="closeMenu"
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded flex items-center gap-2">
            🧪 Test Accès
          </RouterLink>
          
          <hr class="my-2">
          
          <button @click="resetRole" 
            class="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded text-gray-600">
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

const auth = useSimpleAuth()

// État
const isOpen = ref(false)
const isDev = import.meta.env.DEV

// Computed
const currentUser = computed(() => auth.getCurrentUser.value)
const currentRole = computed(() => {
  const user = currentUser.value
  return user?.user_type || user?.role || 'Aucun'
})

const hasAdminAccess = computed(() => {
  return currentRole.value === 'admin'
})

// Méthodes
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}

const getRoleClass = () => {
  switch (currentRole.value) {
    case 'admin': return 'text-red-600'
    case 'veterinarian': return 'text-green-600'
    case 'client': return 'text-blue-600'
    default: return 'text-gray-500'
  }
}

const updateUserRole = (newRole) => {
  try {
    const data = localStorage.getItem('data')
    if (!data) return
    
    const parsed = JSON.parse(data)
    parsed.user.user_type = newRole
    parsed.user.role = newRole
    
    localStorage.setItem('data', JSON.stringify(parsed))
    
    // Recharger la page pour appliquer les changements
    setTimeout(() => {
      window.location.reload()
    }, 300)
    
  } catch (error) {
    console.error('Erreur mise à jour rôle:', error)
  }
}

const simulateAdmin = () => {
  updateUserRole('admin')
  closeMenu()
}

const simulateVet = () => {
  updateUserRole('veterinarian')
  closeMenu()
}

const simulateClient = () => {
  updateUserRole('client')
  closeMenu()
}

const resetRole = () => {
  window.location.reload()
  closeMenu()
}

// Fermer le menu si on clique ailleurs
document.addEventListener('click', (e) => {
  if (isOpen.value && !e.target.closest('.fixed')) {
    isOpen.value = false
  }
})
</script>
