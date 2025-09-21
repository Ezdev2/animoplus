// Utilitaire pour synchroniser les données de profil à travers l'application
import { authChecker } from './authChecker.js'

export const profileSync = {
  
  // Synchroniser toutes les données de profil après une mise à jour
  async syncAllProfileData(updatedUserData) {
    console.log('🔄 Synchronisation complète des données de profil...')
    
    try {
      // 1. Mettre à jour toutes les clés localStorage
      const dataToStore = JSON.stringify(updatedUserData)
      localStorage.setItem('animoplus_user_data', dataToStore)
      localStorage.setItem('user_data', dataToStore)
      localStorage.setItem('animoplus_user', dataToStore)
      
      // 2. Synchroniser avec authChecker
      authChecker.syncUserData()
      
      // 3. Mettre à jour les stores Pinia
      await this.updatePiniaStores(updatedUserData)
      
      // 4. Invalider les caches TanStack Query
      await this.invalidateQueryCache()
      
      // 5. Déclencher les événements personnalisés
      this.dispatchUpdateEvents(updatedUserData)
      
      console.log('✅ Synchronisation complète terminée')
      return true
      
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error)
      return false
    }
  },
  
  // Mettre à jour tous les stores Pinia
  async updatePiniaStores(userData) {
    try {
      // Store utilisateur principal
      const { useUserStore } = await import('@/stores/user.js')
      const userStore = useUserStore()
      
      if (userStore.updateUser) {
        userStore.updateUser(userData)
        console.log('✅ Store user.js mis à jour')
      }
      
      // Store utilisateurs (si existe)
      try {
        const { useUsersStore } = await import('@/stores/users.js')
        const usersStore = useUsersStore()
        
        if (usersStore.updateCurrentUser) {
          usersStore.updateCurrentUser(userData)
          console.log('✅ Store users.js mis à jour')
        }
      } catch (error) {
        console.log('⚠️ Store users.js non disponible')
      }
      
      // Store auth Pinia
      try {
        const { useAuthStore } = await import('@/stores/authPinia.js')
        const authStore = useAuthStore()
        
        if (authStore.setUser) {
          authStore.setUser(userData)
          console.log('✅ Store authPinia.js mis à jour')
        }
      } catch (error) {
        console.log('⚠️ Store authPinia.js non disponible')
      }
      
    } catch (error) {
      console.error('❌ Erreur mise à jour stores Pinia:', error)
    }
  },
  
  // Invalider les caches TanStack Query
  async invalidateQueryCache() {
    try {
      const { useQueryClient } = await import('@tanstack/vue-query')
      const queryClient = useQueryClient()
      
      // Invalider toutes les requêtes liées aux utilisateurs
      await queryClient.invalidateQueries({ queryKey: ['user'] })
      await queryClient.invalidateQueries({ queryKey: ['users'] })
      await queryClient.invalidateQueries({ queryKey: ['profile'] })
      await queryClient.invalidateQueries({ queryKey: ['auth'] })
      
      console.log('✅ Cache TanStack Query invalidé')
    } catch (error) {
      console.log('⚠️ TanStack Query non disponible')
    }
  },
  
  // Déclencher les événements de mise à jour
  dispatchUpdateEvents(userData) {
    // Événement pour les changements localStorage
    window.dispatchEvent(new CustomEvent('localStorageChange', {
      detail: {
        key: 'animoplus_user_data',
        newValue: userData,
        action: 'profile-updated'
      }
    }))
    
    // Événement spécifique pour la mise à jour du profil
    window.dispatchEvent(new CustomEvent('profileUpdated', {
      detail: userData
    }))
    
    console.log('✅ Événements de mise à jour déclenchés')
  },
  
  // Forcer le rafraîchissement de tous les composants
  forceRefresh() {
    console.log('🔄 Forçage du rafraîchissement des composants...')
    
    // Déclencher un événement global de rafraîchissement
    window.dispatchEvent(new CustomEvent('forceProfileRefresh', {
      detail: { timestamp: Date.now() }
    }))
  }
}

export default profileSync
