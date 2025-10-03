<template>
  <div class="pro-analytics-page">
    <!-- En-tête Pro -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-2xl">📊</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold">Analytics Pro</h1>
          <p class="text-purple-100">Analyses avancées et insights détaillés</p>
        </div>
        <div class="ml-auto">
          <span class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
            ⭐ PRO
          </span>
        </div>
      </div>
    </div>

    <!-- Statistiques principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">Revenus ce mois</p>
            <p class="text-2xl font-bold text-gray-900">€12,450</p>
            <p class="text-green-600 text-sm">+15% vs mois dernier</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span class="text-blue-600 text-xl">💰</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">Patients traités</p>
            <p class="text-2xl font-bold text-gray-900">248</p>
            <p class="text-green-600 text-sm">+8% vs mois dernier</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span class="text-green-600 text-xl">🐕</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">Taux satisfaction</p>
            <p class="text-2xl font-bold text-gray-900">96%</p>
            <p class="text-green-600 text-sm">+2% vs mois dernier</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span class="text-purple-600 text-xl">⭐</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm">Temps moyen/consultation</p>
            <p class="text-2xl font-bold text-gray-900">28min</p>
            <p class="text-red-600 text-sm">+3min vs mois dernier</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <span class="text-orange-600 text-xl">⏱️</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques et analyses -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Graphique des revenus -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Évolution des revenus</h3>
        <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div class="text-center text-gray-500">
            <span class="text-4xl mb-2 block">📈</span>
            <p>Graphique des revenus</p>
            <p class="text-sm">(Intégration Chart.js à venir)</p>
          </div>
        </div>
      </div>

      <!-- Répartition des services -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Services les plus demandés</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span class="text-gray-700">Consultations générales</span>
            </div>
            <span class="font-semibold text-gray-900">45%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-green-500 rounded-full"></div>
              <span class="text-gray-700">Vaccinations</span>
            </div>
            <span class="font-semibold text-gray-900">28%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
              <span class="text-gray-700">Chirurgies</span>
            </div>
            <span class="font-semibold text-gray-900">18%</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span class="text-gray-700">Urgences</span>
            </div>
            <span class="font-semibold text-gray-900">9%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Analyses avancées -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Insights Pro</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-blue-50 p-4 rounded-lg">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-blue-600 text-xl">💡</span>
            <h4 class="font-semibold text-blue-900">Recommandation</h4>
          </div>
          <p class="text-blue-800 text-sm">
            Vos consultations de vaccination sont en hausse de 15%. 
            Considérez augmenter vos créneaux le mardi et jeudi.
          </p>
        </div>

        <div class="bg-green-50 p-4 rounded-lg">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-green-600 text-xl">📈</span>
            <h4 class="font-semibold text-green-900">Tendance</h4>
          </div>
          <p class="text-green-800 text-sm">
            Votre taux de fidélisation client est excellent (89%). 
            Vos clients reviennent régulièrement.
          </p>
        </div>

        <div class="bg-purple-50 p-4 rounded-lg">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-purple-600 text-xl">🎯</span>
            <h4 class="font-semibold text-purple-900">Objectif</h4>
          </div>
          <p class="text-purple-800 text-sm">
            Vous êtes à 78% de votre objectif mensuel de revenus. 
            Encore €2,750 pour l'atteindre.
          </p>
        </div>

        <div class="bg-orange-50 p-4 rounded-lg">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-orange-600 text-xl">⚠️</span>
            <h4 class="font-semibold text-orange-900">Attention</h4>
          </div>
          <p class="text-orange-800 text-sm">
            Stock de vaccins antirabiques faible (3 unités restantes). 
            Pensez à renouveler votre commande.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserRole } from '@/composables/useUserRole.js'

const { isVeterinarianPro, getRoleLabel } = useUserRole()

onMounted(() => {
  console.log('📊 Page Analytics Pro chargée')
  console.log('👤 Rôle utilisateur:', getRoleLabel())
  console.log('⭐ Accès Pro:', isVeterinarianPro.value)
})
</script>

<style scoped>
.pro-analytics-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .pro-analytics-page {
    padding: 1rem;
  }
}
</style>
