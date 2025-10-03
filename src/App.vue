<script setup>
import { onMounted, ref, computed } from 'vue';
import { RouterView } from 'vue-router'
import { useSimpleAuth } from './composables/useSimpleAuth.js'

import AppNavbar from './components/AppNavbar.vue';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

import ChatPopup from './components/ChatPopup.vue';
import ToastContainer from './components/common/ToastContainer.vue';
import AdminTestHelper from './components/dev/AdminTestHelper.vue';
import botIcon from '@/assets/icons/bot.svg';

const isOpenBot = ref(false)
const auth = useSimpleAuth()

// États réactifs basés sur useSimpleAuth
const isAuthenticated = computed(() => auth.isAuthenticated.value)
const currentUser = computed(() => auth.getCurrentUser.value)
const role = computed(() => {
  if (!currentUser.value) return null
  // Normaliser le rôle pour compatibilité
  return currentUser.value.user_type || currentUser.value.role || 'client'
})

onMounted(async () => {
  // Initialiser l'authentification au démarrage avec le système simple
  console.log('🚀 App.vue - Initialisation avec useSimpleAuth')
  auth.init()
  
  console.log('📊 App.vue - État initial:', {
    isAuthenticated: isAuthenticated.value,
    user: currentUser.value?.name || 'Aucun',
    role: role.value,
    userData: currentUser.value
  })
  
  // Debugging détaillé
  console.log('🔍 App.vue - Debugging détaillé:')
  console.log('  - isAuthenticated:', isAuthenticated.value)
  console.log('  - currentUser:', currentUser.value)
  console.log('  - role:', role.value)
  console.log('  - user_type:', currentUser.value?.user_type)
  console.log('  - localStorage data:', localStorage.getItem('data'))
  
  setTimeout(() => {
    isOpenBot.value = true
  }, 5000)
})

</script>

<template>
  <!-- Non connecté -->
  <template v-if="!isAuthenticated">
    <Navbar class="appbar" />
    <RouterView />

    <!-- Bouton flottant pour ouvrir le chatbot -->
    <button @click="isOpenBot = true"
      class="fixed bottom-6 right-6 z-50 bg-white border border-primary-600 hover:bg-neutral-200 text-white rounded-full p-4 shadow-lg">
      <img :src="botIcon" alt="bot icon">
    </button>
    <Footer />
  </template>

  <!-- Connecté - Client -->
  <div v-else-if="role === 'client'" class="layout">
    <Sidebar role="client" />
    <div class="main flex flex-col h-screen w-full overflow-hidden px-[24px]">
      <div class="appbar bg-white">
        <AppNavbar @show-pop-up="isOpenBot = true" role="client" />
      </div>
      <div class="content flex-1 overflow-y-auto">
        <RouterView />
      </div>
    </div>
  </div>

  <!-- Connecté - Vétérinaire (normal ou Pro) -->
  <div v-else-if="role === 'veterinarian' || role === 'veterinarian_pro'" class="layout">
    <Sidebar role="pro" />
    <div class="main flex flex-col h-screen w-full overflow-hidden px-[24px]">
      <div class="appbar bg-white">
        <AppNavbar @show-pop-up="isOpenBot = true" role="pro" />
      </div>
      <div class="content flex-1 overflow-y-auto">
        <RouterView />
      </div>
    </div>
  </div>

  <!-- Connecté - Admin -->
  <div v-else-if="role === 'admin'" class="layout">
    <!-- Pour les admins, on utilise directement le RouterView car AdminLayout gère son propre sidebar -->
    <RouterView />
  </div>

  <!-- Rôle non reconnu ou en attente -->
  <div v-else class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Chargement...</p>
      <p class="text-sm text-gray-500 mt-2">Rôle: {{ role || 'En cours de détection' }}</p>
    </div>
  </div>

  <ChatPopup v-if="isOpenBot" @close-pop-up="isOpenBot = false" />
  
  <!-- Container global pour les toasts -->
  <ToastContainer />
  
  <!-- Helper de test admin (dev uniquement) -->
  <AdminTestHelper />
</template>

<style scoped>
.layout {
  display: flex;
  /* gap: 24px; */
  height: 100vh;
}

.appbar {
  position: sticky;
  top: 0;
  z-index: 10;
  /* box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05); */
}
</style>
