<script setup>
import { onMounted, ref, computed, watch, nextTick } from 'vue';
import { RouterView } from 'vue-router'
import { useAuth } from '@/services'

import AppNavbar from './components/AppNavbar.vue';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

import ChatPopup from './components/ChatPopup.vue';
import botIcon from '@/assets/icons/bot.svg';

const isOpenBot = ref(false)
const { isAuthenticated, user, userType, initAuth } = useAuth()

// Computed properties for role detection
const isClient = computed(() => isAuthenticated.value && userType.value === 'client')
const isPro = computed(() => isAuthenticated.value && userType.value === 'veterinarian')

// Force reactivity on authentication changes
watch([isAuthenticated, userType], ([authValue, typeValue]) => {
  console.log('Auth state changed:', { isAuthenticated: authValue, userType: typeValue })
  
  // Force re-render on any auth state change
  nextTick(() => {
    console.log('Computed values:', { 
      isClient: isClient.value, 
      isPro: isPro.value,
      shouldShowSidebar: authValue && typeValue
    })
  })
}, { immediate: true, flush: 'sync' })

onMounted(() => {
  // Initialize authentication state immediately
  initAuth()
  
  setTimeout(() => {
    isOpenBot.value = true
  }, 5000)
})

</script>

<template>
  <!-- Non connecté -->
  <Navbar class="appbar" v-if="!isAuthenticated" />
  <RouterView v-if="!isAuthenticated" />

  <!-- Bouton flottant pour ouvrir le chatbot -->
  <button v-if="!isAuthenticated" @click="isOpenBot = true"
    class="fixed bottom-6 right-6 z-50 bg-white border border-primary-600 hover:bg-neutral-200 text-white rounded-full p-4 shadow-lg">
    <img :src="botIcon" alt="bot icon">
  </button>
  <Footer v-if="!isAuthenticated" />

  <!-- Connecté - Client -->
  <div v-else-if="isClient" class="layout">
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

  <!-- Connecté - Pro/Veterinarian -->
  <div v-else-if="isPro" class="layout">
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

  <!-- Fallback for authenticated users without proper role detection -->
  <div v-else-if="isAuthenticated && userType" class="layout">
    <Sidebar :role="userType === 'veterinarian' ? 'pro' : 'client'" />
    <div class="main flex flex-col h-screen w-full overflow-hidden px-[24px]">
      <div class="appbar bg-white">
        <AppNavbar @show-pop-up="isOpenBot = true" :role="userType === 'veterinarian' ? 'pro' : 'client'" />
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
