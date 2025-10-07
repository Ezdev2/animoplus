<template>
  <div v-if="props.show" @click.stop class="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-[9999] max-h-96 overflow-hidden">
    <!-- En-tête -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-gray-900">Notifications</h3>
        <span v-if="stats && stats.unread > 0" class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {{ stats.unread }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button v-if="stats && stats.unread > 0" @click="handleMarkAllAsRead" :disabled="isMarkingAllAsRead"
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
    <div v-else-if="!notifications || notifications.length === 0" class="p-8 text-center">
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
           class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors relative">
        
        <!-- Indicateur non lu -->
        <div v-if="!notification.read_at" class="absolute left-2 top-6 w-2 h-2 bg-blue-500 rounded-full"></div>
        
        <div class="flex items-start gap-3 ml-4">
          <!-- Icône de notification -->
          <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
               :style="{ backgroundColor: getNotificationColor(notification.type) + '20', color: getNotificationColor(notification.type) }">
            {{ getNotificationIcon(notification.type) }}
          </div>
          
          <!-- Contenu -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900 truncate">
                  {{ getNotificationTitle(notification) }}
                </h4>
                <p class="text-sm text-gray-600 mt-1">
                  {{ getNotificationMessage(notification) }}
                </p>
                <p class="text-xs text-gray-500 mt-2">
                  {{ formatNotificationDate(notification.sent_at) }}
                </p>
              </div>

              <!-- Actions -->
              <div class="relative ml-2">
                <button @click="toggleActionMenu(notification.id)" 
                        class="p-1 text-gray-400 hover:text-gray-600 rounded">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01"></path>
                  </svg>
                </button>
                
                <!-- Menu d'actions -->
                <div v-if="activeActionMenu === notification.id" 
                     @click.stop
                     class="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                  <button v-if="!notification.read_at" 
                          @click="handleMarkAsRead(notification.id)" 
                          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Marquer comme lu
                  </button>
                  <button v-else 
                          @click="handleMarkAsUnread(notification.id)" 
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

    <!-- Pied de page -->
    <div v-if="notifications && notifications.length > 0" class="p-3 border-t border-gray-200 bg-gray-50">
      <button class="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
        Voir toutes les notifications
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications.js'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

// Composable notifications
const {
  notifications,
  stats,
  isLoading,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  getNotificationIcon,
  getNotificationColor,
  getNotificationTitle,
  getNotificationMessage,
  formatNotificationDate
} = useNotifications()

// État local
const activeActionMenu = ref(null)
const isMarkingAllAsRead = ref(false)

// Fonctions
const closeDropdown = () => {
  emit('close')
}

const toggleActionMenu = (notificationId) => {
  activeActionMenu.value = activeActionMenu.value === notificationId ? null : notificationId
}

const closeActionMenu = () => {
  activeActionMenu.value = null
}

const handleMarkAsRead = async (notificationId) => {
  try {
    await markAsRead(notificationId)
    closeActionMenu()
  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error)
  }
}

const handleMarkAsUnread = async (notificationId) => {
  try {
    await markAsUnread(notificationId)
    closeActionMenu()
  } catch (error) {
    console.error('Erreur lors du marquage comme non lu:', error)
  }
}

const handleMarkAllAsRead = async () => {
  try {
    isMarkingAllAsRead.value = true
    await markAllAsRead()
  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications:', error)
  } finally {
    isMarkingAllAsRead.value = false
  }
}

const handleDeleteNotification = async (notificationId) => {
  try {
    await deleteNotification(notificationId)
    closeActionMenu()
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

// Fermer le menu d'actions en cliquant à l'extérieur
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    closeActionMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
