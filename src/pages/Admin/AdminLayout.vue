<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar Admin -->
    <AdminSidebar />
    
    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header Admin -->
      <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Administration</h1>
            <p class="text-sm text-gray-600">Panneau d'administration AnimoPlus</p>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-600">Connecté en tant qu'administrateur</span>
            <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">A</span>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Zone de contenu -->
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

const router = useRouter()
const auth = useSimpleAuth()

// Vérifier les permissions admin au montage
onMounted(() => {
  const user = auth.getCurrentUser.value
  
  if (!user || user.user_type !== 'admin') {
    // Rediriger vers le dashboard si pas admin
    router.push('/dashboard')
    return
  }
})
</script>
