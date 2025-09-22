// Fix d'urgence pour synchroniser l'authentification
import { authChecker } from './authChecker.js'

export const emergencyAuthFix = () => {
  console.log('🚨 FIX D\'URGENCE - Synchronisation authentification')
  
  // Vérifier l'état actuel
  const currentState = {
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refresh_token'),
    userData: localStorage.getItem('user_data'),
    animoplusToken: localStorage.getItem('animoplus_token'),
    animoplusUserData: localStorage.getItem('animoplus_user_data'),
    piniaAuth: JSON.parse(localStorage.getItem('pinia-auth') || '{}')
  }
  
  console.log('📊 État avant fix:', currentState)
  
  // NETTOYER les données corrompues d'abord
  cleanCorruptedData()
  
  // Forcer la synchronisation
  const syncResult = authChecker.syncAll()
  const isAuth = authChecker.isAuthenticated()
  
  console.log('📊 État après fix:', {
    isAuthenticated: isAuth,
    syncResult,
    newAnimoplusToken: localStorage.getItem('animoplus_token'),
    newAnimoplusUserData: localStorage.getItem('animoplus_user_data')
  })
  
  return {
    wasFixed: isAuth,
    beforeState: currentState,
    afterState: syncResult
  }
}

// Fonction pour nettoyer les données corrompues
const cleanCorruptedData = () => {
  console.log('🧹 Nettoyage des données corrompues...')
  
  // Vérifier et nettoyer animoplus_user_data
  const animoplusUserData = localStorage.getItem('animoplus_user_data')
  if (animoplusUserData && animoplusUserData.includes('}}}}')) {
    console.warn('⚠️ animoplus_user_data corrompu détecté')
    
    try {
      // Essayer d'extraire les données valides depuis user_data
      const cleanUserData = localStorage.getItem('user_data')
      if (cleanUserData) {
        const parsed = JSON.parse(cleanUserData)
        if (parsed && parsed.id) {
          localStorage.setItem('animoplus_user_data', cleanUserData)
          console.log('✅ animoplus_user_data restauré depuis user_data')
          return
        }
      }
      
      // Si pas de user_data valide, utiliser les données de base du localStorage
      const userData = localStorage.getItem('animoplus_user')
      if (userData) {
        const parsed = JSON.parse(userData)
        if (parsed && parsed.id) {
          localStorage.setItem('animoplus_user_data', userData)
          console.log('✅ animoplus_user_data restauré depuis animoplus_user')
          return
        }
      }
      
      // En dernier recours, supprimer les données corrompues
      localStorage.removeItem('animoplus_user_data')
      console.log('🗑️ Données corrompues supprimées')
      
    } catch (error) {
      console.error('❌ Erreur nettoyage:', error)
      localStorage.removeItem('animoplus_user_data')
    }
  }
}

// Auto-exécution si appelé directement
if (typeof window !== 'undefined') {
  window.emergencyAuthFix = emergencyAuthFix
}
