<template>
  <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg shadow-lg">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-xl">⭐</span>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Tableau de bord Pro</h3>
          <p class="text-purple-100 text-sm">Aperçu de vos performances</p>
        </div>
      </div>
      <span class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
        PRO
      </span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Revenus du mois -->
      <div class="bg-white bg-opacity-10 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Revenus ce mois</p>
            <p class="text-2xl font-bold">€12,450</p>
            <p class="text-green-300 text-sm">+15% vs mois dernier</p>
          </div>
          <span class="text-2xl">💰</span>
        </div>
      </div>

      <!-- Patients traités -->
      <div class="bg-white bg-opacity-10 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Patients traités</p>
            <p class="text-2xl font-bold">248</p>
            <p class="text-green-300 text-sm">+8% vs mois dernier</p>
          </div>
          <span class="text-2xl">🐕</span>
        </div>
      </div>

      <!-- Taux satisfaction -->
      <div class="bg-white bg-opacity-10 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-purple-100 text-sm">Satisfaction</p>
            <p class="text-2xl font-bold">96%</p>
            <p class="text-green-300 text-sm">+2% vs mois dernier</p>
          </div>
          <span class="text-2xl">⭐</span>
        </div>
      </div>
    </div>

    <!-- Actions rapides Pro -->
    <div class="flex gap-3 mt-6">
      <RouterLink 
        to="/pro-analytics" 
        class="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-center transition-all"
      >
        📊 Analytics
      </RouterLink>
      <RouterLink 
        to="/pro-reports" 
        class="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-center transition-all"
      >
        📋 Rapports
      </RouterLink>
      <button 
        @click="openUpgradeModal"
        class="flex-1 bg-yellow-400 hover:bg-yellow-300 text-yellow-900 px-4 py-2 rounded-lg text-center transition-all font-semibold"
      >
        ⚙️ Gérer Pro
      </button>
    </div>

    <!-- Insight du jour -->
    <div class="mt-4 bg-white bg-opacity-10 rounded-lg p-3">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-yellow-300">💡</span>
        <span class="font-semibold text-sm">Insight du jour</span>
      </div>
      <p class="text-purple-100 text-sm">
        Vos consultations de vaccination sont en hausse de 15%. 
        Considérez augmenter vos créneaux le mardi et jeudi pour optimiser vos revenus.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useUserRole } from '@/composables/useUserRole.js'

const { isVeterinarianPro, getRoleLabel } = useUserRole()

const openUpgradeModal = () => {
  console.log('🔧 Ouverture modal gestion Pro')
  // TODO: Implémenter modal de gestion Pro
}
</script>

<style scoped>
/* Animations pour les hover effects */
.transition-all {
  transition: all 0.2s ease;
}
</style>
