<template>
  <div class="w-full py-4 flex justify-between items-center flex-wrap gap-4">
    <!-- Gauche : titre et support -->
    <div class="flex flex-col">
      <h1 class="text-black text-xl font-bold font-['League_Spartan']">
        {{ role === 'client' ? 'Profil client' : 'Profil professionnel' }}
      </h1>
      <a href="#" class="text-gray-600 text-base underline font-['League_Spartan']">
        Contacter le support
      </a>
    </div>

    <!-- Droite : Bot, profil et déconnexion -->
    <div class="flex items-center gap-8 flex-wrap">

      <!-- Bot -->
      <div class="p-2 rounded-full outline outline-1 outline-primary-600 flex items-center justify-center cursor-pointer">
        <img @click="$emit('show-pop-up')" :src="botIcon" alt="bot icon" class="feature-icon w-6">
      </div>

      <!-- Notifications -->
      <div class="relative cursor-pointer notifications-container" @click="toggleNotifications">
        <div class="p-2 rounded-full outline outline-1 outline-primary-600 flex items-center justify-center hover:bg-primary-50 transition-colors">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
          <!-- Badge pour notifications non lues -->
          <div v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </div>
        </div>

        <!-- Dropdown des notifications -->
        <NotificationsDropdown 
          :show="showNotificationsDropdown" 
          @close="showNotificationsDropdown = false" 
        />
      </div>

      <!-- Lien profil -->
      <router-link to="/profil" class="flex items-center gap-2 cursor-pointer no-underline">
        <img :src="userIcon" alt="user profil" class="feature-icon w-6" />
        <span class="text-primary-600 text-base font-normal font-['League_Spartan']">Mon profil</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import userIcon from '@/assets/icons/user-profil.svg';
import botIcon from '@/assets/icons/bot.svg';
import { useNotifications } from '@/composables/useNotifications.js'
import NotificationsDropdown from '@/components/notifications/NotificationsDropdown.vue'

// Composable notifications
const { 
  notifications, 
  stats, 
  isLoading, 
  loadNotifications,
  markAsRead
} = useNotifications()

// État local
const showNotificationsDropdown = ref(false)

// Computed pour le nombre de notifications non lues
const unreadCount = computed(() => {
  return stats.value?.unread || 0
})

// Fonction pour basculer l'affichage des notifications
const toggleNotifications = async () => {
  showNotificationsDropdown.value = !showNotificationsDropdown.value
  
  if (showNotificationsDropdown.value) {
    try {
      // loadNotifications utilise le cache si valide, sinon fetch
      await loadNotifications()
    } catch (error) {
      console.warn('Erreur lors de l\'ouverture des notifications:', error)
    }
  }
}

// Fonction pour fermer les notifications en cliquant à l'extérieur
const handleClickOutside = (event) => {
  // Si le clic n'est pas dans le conteneur des notifications, fermer le dropdown
  if (!event.target.closest('.notifications-container')) {
    showNotificationsDropdown.value = false
  }
}

// Charger les notifications au montage (utilise le cache si disponible)
onMounted(async () => {
  console.log('🚀 AppNavbar monté - Vérification cache notifications...')
  
  try {
    // loadNotifications utilise automatiquement le cache si valide
    await loadNotifications()
  } catch (error) {
    console.warn('⚠️ Erreur chargement notifications dans navbar:', error)
  }
  
  // Ajouter l'écouteur pour fermer en cliquant à l'extérieur
  document.addEventListener('click', handleClickOutside)
})

// Nettoyer l'écouteur au démontage
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineProps({
  role: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['show-pop-up']);
</script>
