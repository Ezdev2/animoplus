<script setup>
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router'
import { useAuth } from './composables/useAuth.js'

import AppNavbar from './components/AppNavbar.vue';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

import ChatPopup from './components/ChatPopup.vue';
import botIcon from '@/assets/icons/bot.svg';

const isOpenBot = ref(false)
const { isAuthenticated, role, initAuth } = useAuth()

onMounted(async () => {
  // Initialiser l'authentification au démarrage
  await initAuth()
  
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

  <!-- Connecté - Vétérinaire -->
  <div v-else-if="role === 'veterinarian'" class="layout">
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

  <ChatPopup v-if="isOpenBot" @close-pop-up="isOpenBot = false" />
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
