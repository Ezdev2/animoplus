<template>
  <div class="pro-reports-page">
    <!-- En-tête Pro -->
    <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span class="text-2xl">📋</span>
        </div>
        <div>
          <h1 class="text-2xl font-bold">Rapports Pro</h1>
          <p class="text-purple-100">Rapports détaillés et exports avancés</p>
        </div>
        <div class="ml-auto">
          <span class="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
            ⭐ PRO
          </span>
        </div>
      </div>
    </div>

    <!-- Filtres et contrôles -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Générer un rapport</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de rapport</label>
          <select v-model="selectedReportType" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="financial">Rapport financier</option>
            <option value="patients">Rapport patients</option>
            <option value="services">Rapport services</option>
            <option value="inventory">Rapport stock</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Période</label>
          <select v-model="selectedPeriod" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
            <option value="custom">Période personnalisée</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Format</label>
          <select v-model="selectedFormat" class="w-full border border-gray-300 rounded-lg px-3 py-2">
            <option value="pdf">PDF</option>
            <option value="excel">Excel</option>
            <option value="csv">CSV</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button 
            @click="generateReport"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            :disabled="isGenerating"
          >
            <span v-if="isGenerating" class="flex items-center justify-center gap-2">
              <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Génération...
            </span>
            <span v-else>Générer</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Rapports prédéfinis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Rapport financier -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Rapport Financier</h3>
          <span class="text-green-600 text-2xl">💰</span>
        </div>
        
        <div class="space-y-3 mb-4">
          <div class="flex justify-between">
            <span class="text-gray-600">Revenus totaux</span>
            <span class="font-semibold">€12,450</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Dépenses</span>
            <span class="font-semibold text-red-600">€3,200</span>
          </div>
          <div class="flex justify-between border-t pt-2">
            <span class="text-gray-900 font-semibold">Bénéfice net</span>
            <span class="font-bold text-green-600">€9,250</span>
          </div>
        </div>
        
        <button class="w-full bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors">
          Voir le détail
        </button>
      </div>

      <!-- Rapport patients -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Rapport Patients</h3>
          <span class="text-blue-600 text-2xl">🐕</span>
        </div>
        
        <div class="space-y-3 mb-4">
          <div class="flex justify-between">
            <span class="text-gray-600">Nouveaux patients</span>
            <span class="font-semibold">42</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Patients fidèles</span>
            <span class="font-semibold">206</span>
          </div>
          <div class="flex justify-between border-t pt-2">
            <span class="text-gray-900 font-semibold">Total actif</span>
            <span class="font-bold text-blue-600">248</span>
          </div>
        </div>
        
        <button class="w-full bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition-colors">
          Voir le détail
        </button>
      </div>
    </div>

    <!-- Historique des rapports -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Historique des rapports</h3>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Rapport</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Période</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Format</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Date création</th>
              <th class="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="report in reportHistory" :key="report.id" class="border-b hover:bg-gray-50">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2">
                  <span :class="getReportIcon(report.type)">{{ getReportEmoji(report.type) }}</span>
                  <span class="font-medium">{{ report.name }}</span>
                </div>
              </td>
              <td class="py-3 px-4 text-gray-600">{{ report.period }}</td>
              <td class="py-3 px-4">
                <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                  {{ report.format.toUpperCase() }}
                </span>
              </td>
              <td class="py-3 px-4 text-gray-600">{{ report.createdAt }}</td>
              <td class="py-3 px-4">
                <div class="flex gap-2">
                  <button class="text-blue-600 hover:text-blue-800 text-sm">
                    Télécharger
                  </button>
                  <button class="text-red-600 hover:text-red-800 text-sm">
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserRole } from '@/composables/useUserRole.js'
import { useToast } from '@/composables/useToast.js'

const { isVeterinarianPro, getRoleLabel } = useUserRole()
const { showToast } = useToast()

// États réactifs
const selectedReportType = ref('financial')
const selectedPeriod = ref('month')
const selectedFormat = ref('pdf')
const isGenerating = ref(false)

// Données simulées
const reportHistory = ref([
  {
    id: 1,
    name: 'Rapport Financier Novembre',
    type: 'financial',
    period: 'Novembre 2024',
    format: 'pdf',
    createdAt: '28/11/2024'
  },
  {
    id: 2,
    name: 'Rapport Patients Q4',
    type: 'patients',
    period: 'Q4 2024',
    format: 'excel',
    createdAt: '25/11/2024'
  },
  {
    id: 3,
    name: 'Rapport Services Octobre',
    type: 'services',
    period: 'Octobre 2024',
    format: 'csv',
    createdAt: '01/11/2024'
  }
])

// Fonctions utilitaires
const getReportEmoji = (type) => {
  const emojis = {
    financial: '💰',
    patients: '🐕',
    services: '🏥',
    inventory: '📦'
  }
  return emojis[type] || '📋'
}

const getReportIcon = (type) => {
  const colors = {
    financial: 'text-green-600',
    patients: 'text-blue-600',
    services: 'text-purple-600',
    inventory: 'text-orange-600'
  }
  return colors[type] || 'text-gray-600'
}

// Fonction de génération de rapport
const generateReport = async () => {
  if (isGenerating.value) return
  
  isGenerating.value = true
  
  try {
    console.log('📋 Génération rapport:', {
      type: selectedReportType.value,
      period: selectedPeriod.value,
      format: selectedFormat.value
    })
    
    // Simuler la génération
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    showToast({
      type: 'success',
      title: 'Rapport généré',
      message: `Votre rapport ${selectedReportType.value} en format ${selectedFormat.value} est prêt !`,
      duration: 4000
    })
    
    // Ajouter le nouveau rapport à l'historique
    const newReport = {
      id: Date.now(),
      name: `Rapport ${getReportTypeName(selectedReportType.value)} ${getPeriodName(selectedPeriod.value)}`,
      type: selectedReportType.value,
      period: getPeriodName(selectedPeriod.value),
      format: selectedFormat.value,
      createdAt: new Date().toLocaleDateString('fr-FR')
    }
    
    reportHistory.value.unshift(newReport)
    
  } catch (error) {
    console.error('❌ Erreur génération rapport:', error)
    showToast({
      type: 'error',
      title: 'Erreur',
      message: 'Impossible de générer le rapport. Veuillez réessayer.',
      duration: 4000
    })
  } finally {
    isGenerating.value = false
  }
}

const getReportTypeName = (type) => {
  const names = {
    financial: 'Financier',
    patients: 'Patients',
    services: 'Services',
    inventory: 'Stock'
  }
  return names[type] || 'Général'
}

const getPeriodName = (period) => {
  const names = {
    week: 'Semaine courante',
    month: 'Mois courant',
    quarter: 'Trimestre courant',
    year: 'Année courante',
    custom: 'Période personnalisée'
  }
  return names[period] || 'Période'
}

onMounted(() => {
  console.log('📋 Page Rapports Pro chargée')
  console.log('👤 Rôle utilisateur:', getRoleLabel())
  console.log('⭐ Accès Pro:', isVeterinarianPro.value)
})
</script>

<style scoped>
.pro-reports-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .pro-reports-page {
    padding: 1rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
