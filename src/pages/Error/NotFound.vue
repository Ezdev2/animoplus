<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
      <!-- Icône 404 -->
      <div class="mb-6">
        <div class="text-6xl font-bold text-primary-600 mb-2">404</div>
        <div class="text-xl text-gray-600 font-medium">Page non trouvée</div>
      </div>
      
      <!-- Message d'erreur -->
      <div class="mb-8">
        <p class="text-gray-500 mb-4">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <p class="text-sm text-gray-400">
          URL demandée : <code class="bg-gray-100 px-2 py-1 rounded">{{ $route.fullPath }}</code>
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
        
        <router-link 
          to="/"
          class="block text-primary-600 hover:text-primary-700 transition"
        >
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  // Vérifier s'il y a un historique
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    // Sinon aller au dashboard ou à l'accueil
    router.push('/dashboard')
  }
}
</script>

<style scoped>
code {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}
</style>
