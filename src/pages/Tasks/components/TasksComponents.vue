<template>
  <!-- Wrapper général de la page des tâches -->
  <div class="bg-white border border-[#e5e7eb] rounded-xl p-6 w-full font-['League_Spartan']">
    <!-- Header : Titre + boutons d'action -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-4">
        <h2 class="text-[#2e2e30] text-2xl font-bold">Mes tâches</h2>
        
        <!-- Indicateur de statut de connexion -->
        <div class="flex items-center gap-2">
          <div 
            class="w-2 h-2 rounded-full"
            :class="{
              'bg-green-500': !error && !isLoading,
              'bg-yellow-500': isLoading,
              'bg-red-500': error
            }"
          ></div>
          <span class="text-xs text-gray-500">
            {{ error ? 'Mode démo' : isLoading ? 'Synchronisation...' : 'En ligne' }}
          </span>
        </div>
        
        <!-- Actions de sélection multiple -->
        <div v-if="selectedTasks.length > 0" class="flex items-center gap-2">
          <span class="text-sm text-gray-600">{{ selectedTasks.length }} sélectionnée(s)</span>
          <button
            @click="deleteSelectedTasks"
            :disabled="isDeletingMultiple"
            class="bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-600 transition disabled:opacity-50 flex items-center"
          >
            <div v-if="isDeletingMultiple" class="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
            {{ isDeletingMultiple ? 'Suppression...' : 'Supprimer' }}
          </button>
          <button
            @click="clearSelection"
            class="bg-gray-500 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-gray-600 transition"
          >
            Annuler
          </button>
        </div>
      </div>
      <button
        @click="openCreateModal"
        class="bg-[#8c3d20] text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center cursor-pointer hover:opacity-90 transition"
        type="button"
      >
        <span class="font-bold mr-1 text-lg">+</span>
        Ajouter une tâche
      </button>
    </div>

    <!-- Séparateur -->
    <hr class="h-px bg-[rgba(197,197,197,0.5)] my-4 border-none" />

    <!-- Indicateur de chargement -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8c3d20]"></div>
      <span class="ml-3 text-[#6b7280]">Chargement des tâches...</span>
    </div>

    <!-- Message d'erreur avec options de récupération -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-red-600 text-sm font-medium">❌ Erreur lors du chargement des tâches</p>
          <p class="text-red-500 text-xs mt-1">{{ error }}</p>
          <p class="text-gray-600 text-xs mt-2">Utilisation des données de démonstration en attendant.</p>
        </div>
        <div class="flex gap-2 ml-4">
          <button 
            @click="refreshTasksManually()" 
            :disabled="isLoading"
            class="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-xs font-medium transition disabled:opacity-50"
          >
            {{ isLoading ? 'Chargement...' : 'Réessayer' }}
          </button>
          <button 
            @click="clearErrorAndUseMock()"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-medium transition"
          >
            Continuer avec démo
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des tâches -->
    <ul v-else class="list-none p-0 my-4">
      <li
        v-for="(task, index) in tasks"
        :key="task.id || index"
        class="flex justify-between items-center p-3 border border-[#e5e7eb] rounded-lg mb-3 shadow-sm transition-all bg-white hover:shadow-md"
      >
        <!-- Checkbox de sélection + informations de la tâche -->
        <div class="flex items-start flex-1">
          <!-- Checkbox de sélection multiple -->
          <input
            type="checkbox"
            :checked="selectedTasks.includes(task.id)"
            @change="toggleTaskSelection(task.id)"
            class="selection-checkbox mt-1 mr-2"
            title="Sélectionner cette tâche"
          />
          <!-- Checkbox de statut -->
          <input
            type="checkbox"
            :checked="task.done"
            @change="toggleTaskStatus(task)"
            class="custom-checkbox mt-1 mr-3"
            title="Marquer comme terminée"
          />
          <div class="flex-1">
            <!-- Titre -->
            <div class="flex items-center gap-2 mb-1">
              <span 
                class="font-medium"
                :class="{ 'line-through text-gray-500': task.done }"
              >
                {{ task.title }}
              </span>
              <!-- Badge de priorité -->
              <span 
                v-if="task.priority && task.priority !== 'medium'"
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getPriorityColor(task.priority)"
              >
                {{ formatPriority(task.priority) }}
              </span>
            </div>
            
            <!-- Description (si présente) -->
            <p 
              v-if="task.description" 
              class="text-sm text-gray-600 mb-1"
              :class="{ 'line-through': task.done }"
            >
              {{ task.description }}
            </p>
            
            <!-- Date d'échéance (si présente) -->
            <div v-if="task.due_date" class="text-xs text-gray-500">
              📅 Échéance: {{ formatDate(task.due_date) }}
            </div>
          </div>
        </div>
        <!-- Actions (Modifier, Supprimer) -->
        <div class="flex gap-2">
          <button
            v-if="!task.done"
            @click="editTask(task)"
            :disabled="isModalOpen"
            class="font-medium rounded-xl px-2 py-1 text-sm cursor-pointer transition"
            :class="{
              'bg-green-100 text-[#6cc447] hover:bg-green-200': !isModalOpen,
              'bg-gray-100 text-gray-400 cursor-not-allowed': isModalOpen
            }"
            type="button"
          >
            Modifier
          </button>
          <button
            @click="confirmDeleteTask(task)"
            :disabled="isDeletingTask === task.id"
            class="font-medium rounded-xl px-2 py-1 text-sm cursor-pointer transition flex items-center"
            :class="{
              'bg-red-100 text-[#ef5350] hover:bg-red-200': isDeletingTask !== task.id,
              'bg-gray-100 text-gray-400 cursor-not-allowed': isDeletingTask === task.id
            }"
            type="button"
          >
            <div v-if="isDeletingTask === task.id" class="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500 mr-1"></div>
            {{ isDeletingTask === task.id ? 'Suppression...' : 'Supprimer' }}
          </button>
        </div>
      </li>
    </ul>

    <!-- Modal de création/modification de tâche -->
    <TaskModal
      :is-open="isModalOpen"
      :task="editingTask"
      :is-submitting="isSubmitting"
      @close="closeModal"
      @submit="handleTaskSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasks } from '@/composables/useTasks.js'
import TaskModal from './TaskModal.vue'

// Composable Tasks avec store Pinia intégré
const {
  tasks: storeTasks,
  isLoading,
  error,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  uncompleteTask,
  formatPriority,
  getPriorityColor,
  validateTaskData,
  refreshTasks,
  resetStore
} = useTasks()

// État du modal
const isModalOpen = ref(false)
const isSubmitting = ref(false)
const editingTask = ref(null)

// État de suppression
const isDeletingTask = ref(null)
const isDeletingMultiple = ref(false)

// Sélection multiple
const selectedTasks = ref([])

// Computed pour adapter les données du store au format existant
const tasks = computed(() => {
  if (!storeTasks.value || storeTasks.value.length === 0) {
    // Fallback vers données mock si pas de données API
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    return [
      { 
        id: 'mock-1', 
        title: 'Appeler le fournisseur', 
        done: false, 
        name: 'Appeler le fournisseur', 
        is_completed: false, 
        priority: 'high',
        description: 'Contacter le fournisseur pour la commande de matériel médical',
        due_date: tomorrow.toISOString().split('T')[0]
      },
      { 
        id: 'mock-2', 
        title: 'Envoyer les factures', 
        done: true, 
        name: 'Envoyer les factures', 
        is_completed: true, 
        priority: 'medium',
        description: 'Facturation mensuelle des clients',
        due_date: null
      },
      { 
        id: 'mock-3', 
        title: 'Vérifier les stocks', 
        done: false, 
        name: 'Vérifier les stocks', 
        is_completed: false, 
        priority: 'low',
        description: '',
        due_date: nextWeek.toISOString().split('T')[0]
      },
      { 
        id: 'mock-4', 
        title: 'Préparer rapport mensuel', 
        done: false, 
        name: 'Préparer rapport mensuel', 
        is_completed: false, 
        priority: 'urgent',
        description: 'Rapport d\'activité pour la direction',
        due_date: today.toISOString().split('T')[0]
      }
    ]
  }
  
  // Adapter les données API au format existant du template
  // L'API retourne une structure paginée avec data.data[]
  let apiTasks = []
  if (storeTasks.value) {
    if (Array.isArray(storeTasks.value)) {
      // Si c'est déjà un array (cas du store)
      apiTasks = storeTasks.value
    } else if (storeTasks.value.data && Array.isArray(storeTasks.value.data)) {
      // Si c'est la structure paginée de l'API
      apiTasks = storeTasks.value.data
    }
  }
  
  return apiTasks.map(task => ({
    ...task,
    title: task.name || task.title,
    done: task.is_completed || false
  }))
})

// Charger les tâches au montage du composant
onMounted(async () => {
  console.log('🔄 Chargement des tâches...')
  try {
    const response = await fetchTasks({
      page: 1,
      per_page: 20,
      sort_by: 'created_at',
      sort_order: 'desc'
    })
    
    if (response && response.success) {
      console.log('✅ Tâches chargées depuis l\'API:', response.data?.length || 0)
    } else {
      console.warn('⚠️ Réponse API non valide, utilisation des données mock')
    }
  } catch (error) {
    console.error('❌ Erreur chargement tâches:', error)
    
    // Déterminer le type d'erreur pour un meilleur feedback
    if (error.code === 'ERR_NETWORK') {
      console.warn('🌐 Problème de connexion réseau, utilisation des données mock')
    } else if (error.response?.status === 401) {
      console.warn('🔒 Non authentifié, redirection vers login nécessaire')
    } else if (error.response?.status >= 500) {
      console.warn('🔧 Erreur serveur, utilisation des données mock')
    }
    
    // Les données mock seront utilisées en fallback automatiquement
  }
})

// Fonction pour toggle le statut d'une tâche
const toggleTaskStatus = async (task) => {
  try {
    if (task.id?.startsWith('mock-')) {
      // Pour les données mock, juste changer localement
      task.done = !task.done
      return
    }
    
    if (task.done || task.is_completed) {
      await uncompleteTask(task.id)
    } else {
      await completeTask(task.id)
    }
  } catch (error) {
    console.error('❌ Erreur toggle statut:', error)
  }
}

// Fonctions pour gérer le modal
const openCreateModal = () => {
  console.log('🔄 Ouverture modal création')
  editingTask.value = null
  isModalOpen.value = true
  console.log('📝 État modal:', isModalOpen.value)
}

const openEditModal = (task) => {
  console.log('✏️ Modification tâche:', task)
  editingTask.value = task
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingTask.value = null
}

// Fonction pour modifier une tâche (mise à jour pour utiliser le modal)
const editTask = (task) => {
  openEditModal(task)
}

// Fonction pour confirmer la suppression
const confirmDeleteTask = async (task) => {
  // Vérifier si une suppression est déjà en cours
  if (isDeletingTask.value) {
    return
  }
  
  // Construire le message de confirmation
  let confirmMessage = `Êtes-vous sûr de vouloir supprimer la tâche "${task.title}" ?`
  if (task.description) {
    confirmMessage += `\n\nDescription: ${task.description}`
  }
  if (task.due_date) {
    confirmMessage += `\nÉchéance: ${formatDate(task.due_date)}`
  }
  confirmMessage += '\n\nCette action est irréversible.'
  
  if (!confirm(confirmMessage)) {
    return
  }
  
  // Si la tâche en cours de suppression est en édition dans le modal, fermer le modal
  if (isModalOpen.value && editingTask.value?.id === task.id) {
    closeModal()
  }
  
  isDeletingTask.value = task.id
  
  try {
    console.log('🗑️ Suppression tâche:', task.id, task.title)
    
    if (task.id?.startsWith('mock-')) {
      // Pour les tâches mock, simuler la suppression et supprimer du store local
      console.log('🗑️ Suppression tâche mock:', task.title)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Supprimer de la liste des tâches (pour les données mock)
      const index = tasks.value.findIndex(t => t.id === task.id)
      if (index > -1) {
        tasks.value.splice(index, 1)
      }
      
      console.log('✅ Tâche mock supprimée:', task.title)
    } else {
      // Pour les vraies tâches API
      await deleteTask(task.id)
      console.log('✅ Tâche supprimée avec succès:', task.title)
    }
    
  } catch (error) {
    console.error('❌ Erreur suppression tâche:', error)
    
    // Afficher un message d'erreur plus détaillé
    const errorMessage = error.error || error.message || 'Erreur inconnue lors de la suppression'
    alert(`Erreur lors de la suppression de la tâche "${task.title}":\n\n${errorMessage}\n\nVeuillez réessayer.`)
    
  } finally {
    isDeletingTask.value = null
  }
}

// Fonction pour gérer la soumission du formulaire depuis le modal
const handleTaskSubmit = async (payload) => {
  // Validation avec le composable
  const validation = validateTaskData(payload)
  if (!validation.isValid) {
    alert(`Erreurs de validation :\n${validation.errors.join('\n')}`)
    return
  }
  
  isSubmitting.value = true
  
  try {
    if (editingTask.value) {
      // Mode modification
      console.log('✏️ Modification tâche:', editingTask.value.id, payload)
      
      // Pour la modification, on ne garde que les champs modifiés
      const originalTask = editingTask.value
      const changedData = {}
      
      if (payload.name !== (originalTask.name || originalTask.title)) {
        changedData.name = payload.name
      }
      if (payload.description !== (originalTask.description || '')) {
        changedData.description = payload.description
      }
      if (payload.priority !== (originalTask.priority || 'medium')) {
        changedData.priority = payload.priority
      }
      
      // Gérer la date d'échéance
      const originalDueDate = originalTask.due_date ? new Date(originalTask.due_date).toISOString().split('T')[0] : null
      if (payload.due_date !== originalDueDate) {
        changedData.due_date = payload.due_date
      }
      
      if (Object.keys(changedData).length === 0) {
        alert('Aucune modification détectée')
        closeModal()
        return
      }
      
      await updateTask(originalTask.id, changedData)
      console.log('✅ Tâche modifiée avec succès')
    } else {
      // Mode création
      console.log('📝 Création nouvelle tâche:', payload)
      await createTask(payload)
      console.log('✅ Nouvelle tâche créée')
    }
    
    // Fermer le modal
    closeModal()
    
  } catch (error) {
    console.error('❌ Erreur soumission tâche:', error)
    alert(`Erreur lors de ${editingTask.value ? 'la modification' : 'la création'} de la tâche`)
  } finally {
    isSubmitting.value = false
  }
}


// Fonction pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  try {
    // Gérer les dates ISO (2025-12-10T00:00:00.000000Z) et les dates simples (2025-12-10)
    let date
    if (dateString.includes('T')) {
      // Date ISO complète
      date = new Date(dateString)
    } else {
      // Date simple (YYYY-MM-DD)
      date = new Date(dateString + 'T00:00:00')
    }
    
    if (isNaN(date.getTime())) {
      return dateString
    }
    
    const now = new Date()
    // Comparer seulement les dates (pas les heures)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const diffTime = dateOnly.getTime() - nowOnly.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    const options = { 
      day: 'numeric', 
      month: 'long', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    }
    const formattedDate = date.toLocaleDateString('fr-FR', options)
    
    if (diffDays < 0) {
      return `${formattedDate} (en retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''})`
    } else if (diffDays === 0) {
      return `${formattedDate} (aujourd'hui)`
    } else if (diffDays === 1) {
      return `${formattedDate} (demain)`
    } else if (diffDays <= 7) {
      return `${formattedDate} (dans ${diffDays} jour${diffDays > 1 ? 's' : ''})`
    } else {
      return formattedDate
    }
  } catch (error) {
    console.error('Erreur formatage date:', error, dateString)
    return dateString
  }
}

// Fonctions de sélection multiple
const toggleTaskSelection = (taskId) => {
  const index = selectedTasks.value.indexOf(taskId)
  if (index > -1) {
    selectedTasks.value.splice(index, 1)
  } else {
    selectedTasks.value.push(taskId)
  }
}

const clearSelection = () => {
  selectedTasks.value = []
}

const deleteSelectedTasks = async () => {
  if (selectedTasks.value.length === 0) return
  
  const selectedTasksData = tasks.value.filter(task => selectedTasks.value.includes(task.id))
  const taskTitles = selectedTasksData.map(task => task.title).join('\n- ')
  
  const confirmMessage = `Êtes-vous sûr de vouloir supprimer ${selectedTasks.value.length} tâche(s) ?\n\nTâches sélectionnées :\n- ${taskTitles}\n\nCette action est irréversible.`
  
  if (!confirm(confirmMessage)) {
    return
  }
  
  isDeletingMultiple.value = true
  
  try {
    const deletePromises = selectedTasks.value.map(async (taskId) => {
      try {
        if (taskId?.startsWith('mock-')) {
          console.log('🗑️ Suppression tâche mock:', taskId)
          // Simuler un délai pour les données mock
          await new Promise(resolve => setTimeout(resolve, 500))
          return { success: true, taskId }
        }
        
        await deleteTask(taskId)
        return { success: true, taskId }
      } catch (error) {
        console.error('❌ Erreur suppression tâche:', taskId, error)
        return { success: false, taskId, error }
      }
    })
    
    const results = await Promise.allSettled(deletePromises)
    const successful = results.filter(result => result.status === 'fulfilled' && result.value.success).length
    const failed = results.length - successful
    
    if (failed > 0) {
      alert(`${successful} tâche(s) supprimée(s) avec succès.\n${failed} tâche(s) n'ont pas pu être supprimées.`)
    } else {
      console.log(`✅ ${successful} tâche(s) supprimée(s) avec succès`)
    }
    
    // Nettoyer la sélection
    clearSelection()
    
  } catch (error) {
    console.error('❌ Erreur suppression multiple:', error)
    alert('Erreur lors de la suppression des tâches sélectionnées.')
  } finally {
    isDeletingMultiple.value = false
  }
}

// Fonction pour gérer les erreurs et continuer avec les données mock
const clearErrorAndUseMock = () => {
  // Réinitialiser l'erreur dans le store pour afficher les données mock
  resetStore()
  console.log('🔄 Basculement vers les données de démonstration')
}

// Fonction pour rafraîchir les tâches manuellement
const refreshTasksManually = async () => {
  try {
    await refreshTasks()
    console.log('🔄 Rafraîchissement manuel des tâches')
  } catch (error) {
    console.error('❌ Erreur lors du rafraîchissement:', error)
  }
}
</script>

<style scoped>
.custom-checkbox {
  width: 20px;
  height: 20px;
  appearance: none;
  border: 1.5px solid #000;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  position: relative;
  vertical-align: middle;
}
.custom-checkbox:checked::after {
  content: "✔";
  color: #000;
  font-size: 12px;
  position: absolute;
  top: 1px;
  left: 4px;
}

/* Checkbox de sélection multiple */
.selection-checkbox {
  width: 16px;
  height: 16px;
  appearance: none;
  border: 1.5px solid #8c3d20;
  border-radius: 3px;
  background: #fff;
  cursor: pointer;
  position: relative;
  vertical-align: middle;
}

.selection-checkbox:checked {
  background: #8c3d20;
  border-color: #8c3d20;
}

.selection-checkbox:checked::after {
  content: "✔";
  color: #fff;
  font-size: 10px;
  position: absolute;
  top: 0px;
  left: 2px;
  font-weight: bold;
}

.selection-checkbox:hover {
  border-color: #a0522d;
}

/* Griser l'icône SVG */
.date-icon {
  filter: grayscale(1) brightness(0.5);
}
</style>
