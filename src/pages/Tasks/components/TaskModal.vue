<template>
  <div 
    v-if="props.isOpen" 
    class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4 font-['League_Spartan']">
      <!-- Header du modal -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-[#2e2e30]">
          {{ isEditing ? 'Modifier la tâche' : 'Nouvelle tâche' }}
        </h3>
        <button 
          @click="closeModal"
          class="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
        >
          ×
        </button>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="submitTask">
        <!-- Titre -->
        <div class="mb-4">
          <label class="block text-[#4b5563] text-sm font-medium mb-2">
            Titre <span class="text-red-500">*</span>
          </label>
          <input
            ref="titleInput"
            type="text"
            v-model="form.name"
            placeholder="Ex: Révision des dossiers médicaux"
            class="w-full p-3 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:border-[#8c3d20] focus:ring-1 focus:ring-[#8c3d20]"
            required
          />
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label class="block text-[#4b5563] text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            placeholder="Réviser et mettre à jour les dossiers médicaux des patients..."
            rows="3"
            class="w-full p-3 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:border-[#8c3d20] focus:ring-1 focus:ring-[#8c3d20] resize-none"
          ></textarea>
        </div>

        <!-- Priorité -->
        <div class="mb-4">
          <label class="block text-[#4b5563] text-sm font-medium mb-2">
            Priorité <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.priority"
            class="w-full p-3 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:border-[#8c3d20] focus:ring-1 focus:ring-[#8c3d20]"
            required
          >
            <option value="low">🟢 Faible</option>
            <option value="medium">🟡 Moyenne</option>
            <option value="high">🟠 Élevée</option>
            <option value="urgent">🔴 Urgente</option>
          </select>
        </div>

        <!-- Date d'échéance -->
        <div class="mb-6">
          <label class="block text-[#4b5563] text-sm font-medium mb-2">
            Date d'échéance
          </label>
          <div class="relative">
            <input
              type="date"
              v-model="form.due_date"
              class="w-full p-3 border border-[#ddd] rounded-lg text-sm focus:outline-none focus:border-[#8c3d20] focus:ring-1 focus:ring-[#8c3d20]"
            />
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex gap-3 justify-end">
          <button 
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm transition"
          >
            Annuler
          </button>
          <button 
            type="submit"
            :disabled="!form.name.trim() || isSubmitting"
            class="bg-[#8c3d20] text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-[#7a3419] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <div v-if="isSubmitting" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {{ isEditing ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  task: {
    type: Object,
    default: null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close', 'submit'])

// Refs
const titleInput = ref(null)

// État du formulaire
const form = ref({
  name: '',
  description: '',
  priority: 'medium',
  due_date: '',
  is_completed: false
})

// Computed
const isEditing = computed(() => !!props.task)

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    priority: 'medium',
    due_date: '',
    is_completed: false
  }
}

// Pré-remplir le formulaire pour l'édition
const populateForm = (task) => {
  if (!task) {
    resetForm()
    return
  }

  // Convertir la date ISO en format YYYY-MM-DD pour l'input date
  let formattedDueDate = ''
  if (task.due_date) {
    try {
      const date = new Date(task.due_date)
      if (!isNaN(date.getTime())) {
        formattedDueDate = date.toISOString().split('T')[0]
      }
    } catch (error) {
      console.error('Erreur conversion date:', error)
    }
  }

  form.value = {
    name: task.title || task.name || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    due_date: formattedDueDate,
    is_completed: task.is_completed || false
  }
}

// Watcher pour pré-remplir le formulaire quand le modal s'ouvre
watch(() => props.isOpen, (newValue) => {
  console.log('🔄 Modal isOpen changed:', newValue)
  if (newValue) {
    populateForm(props.task)
    // Focus sur l'input titre après ouverture
    nextTick(() => {
      if (titleInput.value) {
        titleInput.value.focus()
      }
    })
  }
})

// Watcher pour la tâche (cas où la tâche change sans fermer le modal)
watch(() => props.task, (newTask) => {
  if (props.isOpen) {
    populateForm(newTask)
  }
})

// Fonctions
const closeModal = () => {
  resetForm()
  emit('close')
}

const submitTask = () => {
  if (!form.value.name.trim()) {
    return
  }

  // Créer le payload selon le format API
  const payload = {
    name: form.value.name.trim(),
    description: form.value.description.trim() || '',
    priority: form.value.priority,
    due_date: form.value.due_date || null,
    is_completed: form.value.is_completed
  }

  emit('submit', payload)
}

// Fermer le modal avec Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

// Ajouter/retirer l'event listener pour Escape et gérer le scroll du body
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeydown)
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    // Restaurer le scroll du body
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
/* Styles pour le modal */
</style>
