<template>
  <div>
    <!-- Overlay pour fermer le menu (doit être en premier) -->
    <div 
      v-if="isOpen" 
      class="context-menu-overlay" 
      @click.stop="closeMenu"
    ></div>

    <div class="context-menu-container">
      <!-- Bouton pour ouvrir le menu -->
      <button 
        @click.stop="toggleMenu" 
        class="context-menu-trigger"
        :class="{ 'active': isOpen }"
        :title="title"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="5" r="2" fill="currentColor"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
          <circle cx="12" cy="19" r="2" fill="currentColor"/>
        </svg>
      </button>

      <!-- Menu contextuel -->
      <div 
        v-if="isOpen" 
        class="context-menu"
        :class="menuPosition"
        @click.stop
      >
        <div class="context-menu-content">
          <slot name="menu-items">
            <!-- Items par défaut si pas de slot -->
            <button class="context-menu-item edit" @click="handleEdit">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Modifier
            </button>
            
            <button class="context-menu-item delete" @click="handleDelete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Supprimer
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Options'
  },
  position: {
    type: String,
    default: 'bottom-left', // bottom-left, bottom-right, top-left, top-right, auto, bottom-left-modal
    validator: (value) => ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'auto', 'bottom-left-modal'].includes(value)
  }
})

// Émissions
const emit = defineEmits(['edit', 'delete', 'menu-opened', 'menu-closed'])

// État local
const isOpen = ref(false)

// Position du menu
const menuPosition = computed(() => {
  if (props.position === 'auto') {
    return 'position-auto'
  }
  if (props.position === 'bottom-left-modal') {
    return 'position-bottom-left-modal'
  }
  return `position-${props.position}`
})

// Fonctions
function toggleMenu() {
  if (isOpen.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

function openMenu() {
  isOpen.value = true
  emit('menu-opened')
}

function closeMenu() {
  isOpen.value = false
  emit('menu-closed')
}

// Fonctions pour gérer les actions et fermer le menu
function handleEdit() {
  emit('edit')
  closeMenu()
}

function handleDelete() {
  emit('delete')
  closeMenu()
}

// Fermer le menu avec Escape
function handleKeydown(event) {
  if (event.key === 'Escape' && isOpen.value) {
    closeMenu()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.context-menu-container {
  position: relative;
  display: inline-block;
}

.context-menu-trigger {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: #6b7280;
}

.context-menu-trigger:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
  color: #374151;
  transform: scale(1.05);
}

.context-menu-trigger.active {
  background-color: #43a047;
  border-color: #43a047;
  color: white;
}

.context-menu {
  position: absolute;
  z-index: 9999;
  min-width: 150px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: menuSlideIn 0.2s ease-out;
}

/* Positions du menu */
.position-bottom-left {
  top: calc(100% + 8px);
  left: 0;
}

.position-bottom-right {
  top: calc(100% + 8px);
  right: 0;
}

.position-top-left {
  bottom: calc(100% + 8px);
  left: 0;
}

.position-top-right {
  bottom: calc(100% + 8px);
  right: 0;
}

.position-auto {
  top: calc(100% + 8px);
  right: 0;
  transform: translateX(0);
}

/* Ajustement automatique si le menu dépasse à droite */
.position-auto {
  /* Par défaut à droite du bouton */
  right: 0;
}

/* Si dans un conteneur avec overflow, ajuster à gauche */
.context-menu-container:has(.position-auto) {
  position: relative;
}

/* Classe pour forcer l'alignement à gauche dans les modals */
.modal .position-auto,
.position-auto.in-modal {
  right: auto;
  left: 0;
  transform: translateX(-100%);
}

/* Position spéciale pour les modals - s'ouvre directement à gauche du bouton */
.position-bottom-left-modal {
  top: calc(100% + 8px);
  right: 100%;
  left: auto;
  margin-right: 8px;
}

.context-menu-content {
  padding: 4px 0;
}

.context-menu-item {
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s ease;
}

.context-menu-item:hover {
  background-color: #f9fafb;
}

.context-menu-item.edit:hover {
  background-color: #f0f9ff;
  color: #0369a1;
}

.context-menu-item.delete:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

.context-menu-item svg {
  flex-shrink: 0;
}

.context-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  background: transparent;
}

/* Animation */
@keyframes menuSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .context-menu {
    min-width: 140px;
  }
  
  .context-menu-item {
    padding: 12px 16px;
    font-size: 16px;
  }
}
</style>
