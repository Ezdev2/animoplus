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

  <!-- Fallback pour rôles non reconnus -->
  <div v-else-if="isAuthenticated" class="layout">
    <div class="p-8 bg-red-50 border border-red-200 rounded-lg m-4">
      <h2 class="text-red-800 font-bold mb-2">⚠️ Rôle utilisateur non reconnu</h2>
      <p class="text-red-600 mb-4">Rôle détecté: <code class="bg-red-100 px-2 py-1 rounded">{{ role }}</code></p>
      <p class="text-red-600 mb-4">Utilisateur: <code class="bg-red-100 px-2 py-1 rounded">{{ currentUser?.name }}</code></p>
      <button @click="auth.logout()" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Se déconnecter
      </button>
    </div>
  </div>

  <ChatPopup v-if="isOpenBot" @close-pop-up="isOpenBot = false" />
  
  <!-- Container global pour les toasts -->
  <ToastContainer />
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
