<template>
  <div v-if="show" @click.stop class="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
    <!-- En-tête -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-gray-900">Notifications</h3>
        <span v-if="stats.unread > 0" class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {{ stats.unread }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button v-if="stats.unread > 0" @click="markAllAsRead" :disabled="isMarkingAllAsRead"
          class="text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50">
          Tout marquer comme lu
        </button>
        <button @click="closeDropdown" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <!-- Aucune notification -->
    <div v-else-if="notifications.length === 0" class="p-8 text-center">
      <div class="text-gray-400 mb-2">
        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
        </svg>
      </div>
      <p class="text-gray-600 font-medium">Aucune notification</p>
      <p class="text-gray-500 text-sm">Vous êtes à jour !</p>
    </div>

    <!-- Liste des notifications -->
    <div v-else class="max-h-80 overflow-y-auto">
      <div v-for="notification in notifications" :key="notification.id" 
        class="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
        
        <div class="p-4 flex items-start gap-3">
          <!-- Icône de type -->
          <div :class="[
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg',
            getNotificationColor(notification.type)
          ]">
            {{ getNotificationIcon(notification.type) }}
          </div>

          <!-- Contenu -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900 truncate">
                  {{ getNotificationTitle(notification) }}
                </h4>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                  {{ getNotificationMessage(notification) }}
                </p>
                <p class="text-xs text-gray-500 mt-2">
                  {{ formatNotificationDate(notification.sent_at) }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-1 ml-2">
                <!-- Indicateur non lu -->
                <div v-if="!notification.read_at" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                
                <!-- Menu actions -->
                <div class="relative" @click.stop>
                  <button @click="toggleActionMenu(notification.id)" 
                    class="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                    </svg>
                  </button>

                  <!-- Menu déroulant -->
                  <div v-if="activeActionMenu === notification.id" 
                    class="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                    
                    <button v-if="!notification.read_at" @click="handleMarkAsRead(notification.id)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Marquer comme lu
                    </button>
                    
                    <button v-else @click="handleMarkAsUnread(notification.id)"
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Marquer comme non lu
                    </button>
                    
                    <button @click="handleDeleteNotification(notification.id)"
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pied de page -->
    <div v-if="notifications.length > 0" class="p-3 border-t border-gray-200 bg-gray-50">
      <button class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
        Voir toutes les notifications
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications.js'

// Props
defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// Fonction pour fermer le dropdown
const closeDropdown = () => {
  emit('close')
}

// Composable notifications
const {
  notifications,
  stats,
  isLoading,
  loadNotifications,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  getNotificationIcon,
  getNotificationColor,
  getNotificationTitle,
  getNotificationMessage,
  formatNotificationDate,
  isMarkingAllAsRead
} = useNotifications()

// État local
const activeActionMenu = ref(null)

// Fonctions
const toggleActionMenu = (notificationId) => {
  activeActionMenu.value = activeActionMenu.value === notificationId ? null : notificationId
}

const closeActionMenu = () => {
  activeActionMenu.value = null
}

// Fonctions pour gérer les actions avec fermeture du menu
const handleMarkAsRead = async (notificationId) => {
  await markAsRead(notificationId)
  closeActionMenu()
}

const handleMarkAsUnread = async (notificationId) => {
  await markAsUnread(notificationId)
  closeActionMenu()
}

const handleDeleteNotification = async (notificationId) => {
  await deleteNotification(notificationId)
  closeActionMenu()
}

// Fermer le menu d'actions en cliquant ailleurs
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    closeActionMenu()
  }
}

// Charger les notifications au montage
onMounted(() => {
  loadNotifications({ per_page: 10 })
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
