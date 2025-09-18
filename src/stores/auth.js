// FICHIER DE COMPATIBILITÉ - Redirection vers le nouveau système Pinia
// Ce fichier maintient la compatibilité avec l'ancien système

import { useAuthStore } from './authPinia.js'
import { useUserStore } from './user.js'
import { computed } from 'vue'

// Créer une instance du store pour la compatibilité
let authStore = null
let userStore = null

// Initialiser les stores si pas encore fait
const initStores = () => {
  if (!authStore) {
    authStore = useAuthStore()
    userStore = useUserStore()
  }
}

// Objet réactif pour la compatibilité avec l'ancien système
export const auth = {
  get isAuthenticated() {
    initStores()
    return authStore.isAuthenticated
  },
  
  get role() {
    initStores()
    return authStore.role
  },
  
  set isAuthenticated(value) {
    initStores()
    if (!value) {
      authStore.logout()
    }
  },
  
  set role(value) {
    initStores()
    // Cette propriété est maintenant gérée par le système d'authentification
    console.warn('La propriété role est maintenant en lecture seule. Utilisez les méthodes d\'authentification.')
  }
}

// Méthodes pour gérer l'authentification (compatibilité)
export const authMethods = {
  async login(role) {
    initStores()
    return await authStore.loginAs(role)
  },
  
  async logout() {
    initStores()
    return await authStore.logout()
  },
  
  // Méthode pour vérifier le rôle
  hasRole(role) {
    initStores()
    return authStore.hasRole(role)
  },
  
  // Méthode pour nettoyer complètement
  clearAuth() {
    initStores()
    authStore.clearAuth()
  }
}

// Note: Ce fichier est maintenu pour la compatibilité
// Il est recommandé d'utiliser directement useAuth() dans les nouveaux composants