<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
      <h2 class="text-2xl font-bold text-gray-900 mb-2">Redirection Admin</h2>
      <p class="text-gray-600 mb-4">Vous êtes connecté en tant qu'administrateur.</p>
      <p class="text-sm text-gray-500">Redirection vers l'interface admin...</p>
      
      <div class="mt-6">
        <RouterLink to="/admin" 
          class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          🛡️ Accéder à l'interface admin
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Redirection automatique après 2 secondes
  setTimeout(() => {
    router.push('/admin')
  }, 2000)
})
</script>
