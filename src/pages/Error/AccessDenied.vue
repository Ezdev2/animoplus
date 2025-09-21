<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
      <!-- Icône d'accès refusé -->
      <div class="mb-6">
        <div class="text-6xl mb-4">🚫</div>
        <div class="text-xl text-red-600 font-bold mb-2">Accès refusé</div>
        <div class="text-gray-600">Vous n'avez pas les permissions nécessaires</div>
      </div>
      
      <!-- Message d'erreur -->
      <div class="mb-8">
        <p class="text-gray-500 mb-4">
          Cette page est réservée aux {{ requiredRoleText }}.
        </p>
        <p class="text-sm text-gray-400 mb-2">
          Votre rôle actuel : <span class="font-medium">{{ currentRoleText }}</span>
        </p>
        <p class="text-sm text-gray-400">
          Page demandée : <code class="bg-gray-100 px-2 py-1 rounded">{{ $route.fullPath }}</code>
        </p>
      </div>
      
      <!-- Actions -->
      <div class="space-y-3">
        <button 
          @click="goBack"
          class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition"
        >
          Retour à la page précédente
        </button>
        
        <router-link 
          to="/dashboard"
          class="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Aller au tableau de bord
        </router-link>
        
        <button 
          @click="logout"
          class="block w-full text-red-600 hover:text-red-700 transition"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

const router = useRouter()
const route = useRoute()
const auth = useSimpleAuth()

// Récupérer les informations depuis les query params
const requiredRole = computed(() => route.query.required || 'professionnel')
const currentRole = computed(() => {
  const user = auth.getCurrentUser.value
  return user?.user_type || user?.role || 'inconnu'
})

// Textes lisibles
const requiredRoleText = computed(() => {
  switch (requiredRole.value) {
    case 'pro':
    case 'veterinarian':
      return 'professionnels vétérinaires'
    case 'client':
      return 'clients'
    default:
      return requiredRole.value
  }
})

const currentRoleText = computed(() => {
  switch (currentRole.value) {
    case 'veterinarian':
      return 'Vétérinaire'
    case 'client':
      return 'Client'
    default:
      return currentRole.value
  }
})

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/dashboard')
  }
}

const logout = () => {
  auth.logout()
  window.location.href = '/login'
}
</script>

<style scoped>
code {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}
</style>
