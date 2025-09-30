<template>
  <div v-if="shouldShow">
    <!-- Contenu Pro -->
    <slot v-if="hasAccess" />
    
    <!-- Message d'upgrade si pas d'accès -->
    <div v-else-if="showUpgradePrompt" class="pro-upgrade-prompt">
      <div class="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <span class="text-white text-lg">⭐</span>
          </div>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900">Fonctionnalité Pro</h4>
            <p class="text-sm text-gray-600">{{ upgradeMessage }}</p>
          </div>
          <button 
            @click="$emit('upgrade-requested')"
            class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Passer Pro
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserRole } from '@/composables/useUserRole.js'

const props = defineProps({
  // Rôles requis pour accéder à cette fonctionnalité
  requiredRoles: {
    type: Array,
    default: () => ['veterinarian_pro']
  },
  
  // Afficher le message d'upgrade si pas d'accès
  showUpgradePrompt: {
    type: Boolean,
    default: true
  },
  
  // Message personnalisé pour l'upgrade
  upgradeMessage: {
    type: String,
    default: 'Cette fonctionnalité est disponible avec le compte Pro.'
  },
  
  // Forcer l'affichage même sans accès (pour les prompts)
  alwaysShow: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['upgrade-requested'])

const { hasAccess: checkAccess, isAnyVeterinarian } = useUserRole()

// Computed pour vérifier si l'utilisateur a accès
const hasAccessToFeature = computed(() => {
  return checkAccess(props.requiredRoles)
})

// Computed pour déterminer si on doit afficher le composant
const shouldShow = computed(() => {
  if (props.alwaysShow) return true
  
  // Afficher seulement si c'est un vétérinaire (pour éviter de montrer aux clients)
  return isAnyVeterinarian.value
})

// Alias pour le template
const hasAccess = computed(() => hasAccessToFeature.value)
</script>

<style scoped>
.pro-upgrade-prompt {
  margin: 1rem 0;
}

.pro-upgrade-prompt:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}
</style>
