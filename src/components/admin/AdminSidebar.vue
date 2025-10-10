<template>
  <div class="w-80 h-full p-6 bg-red-600 flex flex-col justify-between">
    <!-- Logo + Menu -->
    <div class="flex flex-col gap-8">
      <div class="flex items-center gap-3">
        <img class="w-28 h-9" src="../../assets/animoplus_header.png" />
        <div class="bg-white px-2 py-1 rounded text-red-600 text-xs font-bold">
          ADMIN
        </div>
      </div>

      <!-- Menu principal -->
      <nav class="flex flex-col gap-6">
        <RouterLink v-for="item in adminMenuItems" :key="item.label" :to="item.link"
          class="flex items-center gap-4 text-base hover:text-red-200 transition"
          :class="route.path === item.link ? 'text-white font-bold bg-red-700 px-3 py-2 rounded-lg' : 'text-red-100'">
          <component :is="item.icon"
            :class="route.path === item.link ? 'text-white' : 'text-red-200'" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
    </div>

    <!-- Bouton retour au dashboard -->
    <div class="space-y-3">
      <RouterLink to="/dashboard"
        class="w-full px-4 py-2 bg-white rounded-xl shadow flex items-center gap-2 hover:bg-gray-50 transition">
        <span class="text-red-600 text-base font-['League_Spartan']">← Retour au Dashboard</span>
      </RouterLink>
      
      <button @click="handleLogout"
        class="w-full px-4 py-2 bg-red-700 rounded-xl shadow flex items-center gap-2 hover:bg-red-800 transition">
        <span class="text-white text-base font-['League_Spartan']">Déconnexion</span>
        <img :src="logoutIcon" alt="log out" class="feature-icon w-6 filter brightness-0 invert">
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

// Icons
import dashboardIcon from '@/assets/icons/sidebar/DasboardIcon.vue'
import animalIcon from '@/assets/icons/sidebar/AnimalIcon.vue'
import sheetIcon from '@/assets/icons/sidebar/SheetIcon.vue'

import logoutIcon from '@/assets/icons/logout.svg'

const route = useRoute()
const auth = useSimpleAuth()

// Menu items spécifiques à l'admin
const adminMenuItems = [
  {
    label: "Dashboard Admin",
    icon: dashboardIcon,
    link: "/admin"
  },
  {
    label: "Service Types",
    icon: animalIcon,
    link: "/admin/test/service-types"
  },
  {
    label: "Gestion Annonces",
    icon: sheetIcon,
    link: "/admin/announcements"
  }
]

// Fonction de déconnexion
const logout = () => {
  auth.logout()
  window.location.href = '/login'
}

async function handleLogout() {
  await logout()
}
</script>
