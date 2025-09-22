// Provider d'authentification ultra-simple
// UNE SEULE SOURCE DE VÉRITÉ : localStorage "data"

import { ref, computed } from 'vue'

// État global réactif
const userData = ref(null)
const isLoading = ref(false)

// Clé unique pour le localStorage
const STORAGE_KEY = 'data'

export const useSimpleAuth = () => {
  
  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = computed(() => {
    const data = getStoredData()
    return !!(data && data.token && data.user && data.user.id)
  })
  
  // Récupérer les données du localStorage
  const getStoredData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null
      
      const parsed = JSON.parse(stored)
      return parsed
    } catch (error) {
      console.error('❌ Erreur lecture localStorage:', error)
      return null
    }
  }
  
  // Sauvegarder les données dans le localStorage
  const setStoredData = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      userData.value = data
      console.log('✅ Données sauvegardées:', data.user?.name)
      return true
    } catch (error) {
      console.error('❌ Erreur sauvegarde localStorage:', error)
      return false
    }
  }
  
  // Charger les données depuis le localStorage
  const loadUserData = () => {
    const data = getStoredData()
    if (data) {
      userData.value = data
      console.log('📦 Données chargées:', data.user?.name)
      return data
    }
    return null
  }
  
  // Mettre à jour les données utilisateur
  const updateUserData = (newUserData) => {
    const currentData = getStoredData()
    if (currentData) {
      const updatedData = {
        ...currentData,
        user: { ...currentData.user, ...newUserData }
      }
      setStoredData(updatedData)
      return updatedData
    }
    return null
  }
  
  // Connexion - sauvegarder token + user
  const login = (token, refreshToken, user) => {
    const data = {
      token,
      refreshToken,
      user,
      loginTime: Date.now()
    }
    
    setStoredData(data)
    console.log('🔐 Utilisateur connecté:', user.name)
    return data
  }
  
  // Déconnexion - nettoyer tout
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    userData.value = null
    console.log('🚪 Utilisateur déconnecté')
  }
  
  // Nettoyer les anciennes clés du localStorage
  const cleanOldKeys = () => {
    const oldKeys = [
      'token', 'refresh_token', 'user_data', 'animoplus_user_data', 
      'animoplus_user', 'animoplus_token', 'animoplus_refresh_token',
      'auth', 'pinia-auth', 'pinia-user'
    ]
    
    let cleanedCount = 0
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
        cleanedCount++
        console.log(`🧹 Suppression ancienne clé: ${key}`)
      }
    })
    
    return cleanedCount
  }
  
  // Récupérer les données utilisateur actuelles
  const getCurrentUser = computed(() => {
    const data = userData.value || getStoredData()
    return data?.user || null
  })
  
  // Récupérer le token actuel
  const getCurrentToken = computed(() => {
    const data = userData.value || getStoredData()
    return data?.token || null
  })
  
  // Initialisation
  const init = () => {
    console.log('🚀 SimpleAuth - Initialisation...')
    
    // Migration automatique des anciennes données
    tryAutoMigration()
    
    // Charger les données actuelles
    const data = loadUserData()
    
    console.log('📊 SimpleAuth - État initial:', {
      isAuthenticated: isAuthenticated.value,
      user: data?.user?.name || 'Aucun',
      userType: data?.user?.user_type || data?.user?.role || 'N/A',
      hasToken: !!data?.token,
      timestamp: new Date().toLocaleTimeString()
    })
    
    return data
  }
  
  // Tentative de migration automatique et nettoyage
  const tryAutoMigration = async () => {
    try {
      // TOUJOURS nettoyer les anciennes clés, même si "data" existe déjà
      const cleanedCount = cleanOldKeys()
      if (cleanedCount > 0) {
        console.log(`🧹 Nettoyage automatique: ${cleanedCount} anciennes clés supprimées`)
      }
      
      // Si déjà migré, pas besoin de continuer
      if (localStorage.getItem(STORAGE_KEY)) {
        return
      }
      
      // Vérifier si il y a des données à migrer
      const hasOldData = localStorage.getItem('token') && 
                        (localStorage.getItem('user_data') || localStorage.getItem('animoplus_user_data'))
      
      if (hasOldData) {
        console.log('🔄 Migration automatique des données...')
        
        const token = localStorage.getItem('token')
        const refreshToken = localStorage.getItem('refresh_token')
        const userDataRaw = localStorage.getItem('user_data') || localStorage.getItem('animoplus_user_data')
        
        if (userDataRaw) {
          const user = JSON.parse(userDataRaw)
          
          // Créer les nouvelles données
          const newData = {
            token,
            refreshToken,
            user,
            loginTime: Date.now(),
            migrated: true
          }
          
          // Sauvegarder
          setStoredData(newData)
          
          console.log('✅ Migration automatique réussie:', user.name)
        }
      }
    } catch (error) {
      console.error('❌ Erreur migration automatique:', error)
    }
  }
  
  return {
    // État
    userData,
    isLoading,
    isAuthenticated,
    getCurrentUser,
    getCurrentToken,
    
    // Actions
    login,
    logout,
    updateUserData,
    loadUserData,
    init,
    
    // Utilitaires
    getStoredData,
    setStoredData,
    cleanOldKeys
  }
}

// Instance globale
let globalAuthInstance = null

export const getGlobalAuth = () => {
  if (!globalAuthInstance) {
    globalAuthInstance = useSimpleAuth()
    globalAuthInstance.init()
  }
  return globalAuthInstance
}

export default useSimpleAuth
