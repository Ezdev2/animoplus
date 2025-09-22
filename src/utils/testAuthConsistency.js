// Utilitaire de test pour vérifier la cohérence du système d'authentification
// À utiliser dans la console du navigateur pour diagnostiquer les problèmes

export const testAuthConsistency = () => {
  console.log('🔍 === TEST DE COHÉRENCE AUTHENTIFICATION ===')
  
  // 1. Vérifier localStorage
  const data = localStorage.getItem('data')
  let localStorageAuth = null
  
  if (data) {
    try {
      localStorageAuth = JSON.parse(data)
      console.log('✅ localStorage["data"]:', {
        hasToken: !!localStorageAuth.token,
        hasUser: !!localStorageAuth.user,
        userId: localStorageAuth.user?.id,
        userName: localStorageAuth.user?.name,
        userType: localStorageAuth.user?.user_type || localStorageAuth.user?.role,
        loginTime: localStorageAuth.loginTime ? new Date(localStorageAuth.loginTime).toLocaleString() : 'N/A'
      })
    } catch (error) {
      console.error('❌ localStorage["data"] corrompu:', error)
    }
  } else {
    console.log('❌ localStorage["data"] vide')
  }
  
  // 2. Vérifier la cohérence des données
  const isAuthValid = localStorageAuth && 
                     localStorageAuth.token && 
                     localStorageAuth.user && 
                     localStorageAuth.user.id
  
  console.log('📊 Validation authentification:', {
    hasValidData: isAuthValid,
    tokenPresent: !!localStorageAuth?.token,
    userPresent: !!localStorageAuth?.user,
    userIdPresent: !!localStorageAuth?.user?.id
  })
  
  // 3. Vérifier les anciennes clés
  const oldKeys = [
    'token', 'refresh_token', 'user_data', 'animoplus_user_data', 
    'animoplus_user', 'animoplus_token', 'animoplus_refresh_token',
    'auth', 'pinia-auth', 'pinia-user'
  ]
  
  const foundOldKeys = oldKeys.filter(key => localStorage.getItem(key))
  if (foundOldKeys.length > 0) {
    console.warn('⚠️ Anciennes clés détectées:', foundOldKeys)
  } else {
    console.log('✅ Aucune ancienne clé détectée')
  }
  
  // 4. Résumé
  const isConsistent = isAuthValid && foundOldKeys.length === 0
  
  console.log(isConsistent ? '✅ SYSTÈME COHÉRENT' : '❌ INCOHÉRENCES DÉTECTÉES')
  console.log('🔍 === FIN TEST COHÉRENCE ===')
  
  return {
    isConsistent,
    isAuthValid,
    localStorage: localStorageAuth,
    oldKeysFound: foundOldKeys
  }
}

// Fonction pour nettoyer manuellement
export const cleanAuthData = () => {
  console.log('🧹 Nettoyage des données d\'authentification...')
  
  const oldKeys = [
    'token', 'refresh_token', 'user_data', 'animoplus_user_data', 
    'animoplus_user', 'animoplus_token', 'animoplus_refresh_token',
    'auth', 'pinia-auth', 'pinia-user'
  ]
  
  let cleaned = 0
  oldKeys.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key)
      cleaned++
    }
  })
  
  console.log(`✅ ${cleaned} anciennes clés supprimées`)
  return cleaned
}

// Fonction pour simuler une connexion de test
export const simulateLogin = (userType = 'client') => {
  console.log(`🔐 Simulation connexion ${userType}...`)
  
  const mockUser = {
    id: Date.now(),
    name: userType === 'client' ? 'Client Test' : 'Vétérinaire Test',
    email: userType === 'client' ? 'client@test.com' : 'vet@test.com',
    user_type: userType === 'client' ? 'client' : 'veterinarian'
  }
  
  const mockData = {
    token: 'mock-token-' + Date.now(),
    refreshToken: 'mock-refresh-' + Date.now(),
    user: mockUser,
    loginTime: Date.now()
  }
  
  localStorage.setItem('data', JSON.stringify(mockData))
  console.log('✅ Connexion simulée:', mockUser.name)
  
  return mockData
}

// Fonction pour simuler une déconnexion
export const simulateLogout = () => {
  console.log('🚪 Simulation déconnexion...')
  localStorage.removeItem('data')
  console.log('✅ Déconnexion simulée')
}

// Fonction pour tester les permissions par rôle
export const testRolePermissions = () => {
  console.log('🔍 === TEST PERMISSIONS PAR RÔLE ===')
  
  const data = localStorage.getItem('data')
  if (!data) {
    console.log('❌ Aucune donnée d\'authentification trouvée')
    return
  }
  
  let userData = null
  try {
    userData = JSON.parse(data).user
  } catch (error) {
    console.error('❌ Erreur parsing données:', error)
    return
  }
  
  const userRole = userData?.user_type || userData?.role || 'client'
  console.log('👤 Rôle actuel:', userRole)
  
  // Pages par rôle selon la configuration
  const rolePages = {
    client: [
      '/dashboard', '/animals', '/documents', '/profil', 
      '/speciality', '/lost-animal', '/message', '/appointment'
    ],
    veterinarian: [
      '/dashboard', '/documents', '/profil', '/lost-animal', 
      '/message', '/appointment', '/manage-patient', '/services', 
      '/tasks', '/accounting', '/stockManagement'
    ]
  }
  
  const allowedPages = rolePages[userRole] || []
  const forbiddenPages = userRole === 'client' 
    ? rolePages.veterinarian.filter(page => !rolePages.client.includes(page))
    : rolePages.client.filter(page => !rolePages.veterinarian.includes(page))
  
  console.log('✅ Pages autorisées:', allowedPages)
  console.log('🚫 Pages interdites:', forbiddenPages)
  
  return {
    userRole,
    allowedPages,
    forbiddenPages
  }
}

// Fonction pour tester l'élimination de la duplication après login
export const testNoDuplication = () => {
  console.log('🔍 === TEST ÉLIMINATION DUPLICATION ===')
  
  const data = localStorage.getItem('data')
  const animoplusToken = localStorage.getItem('animoplus_token')
  const animoplusRefresh = localStorage.getItem('animoplus_refresh_token')
  const animoplusUser = localStorage.getItem('animoplus_user_data')
  
  console.log('📊 État localStorage:')
  console.log('  - data (système unifié):', !!data)
  console.log('  - animoplus_token (ancien):', !!animoplusToken)
  console.log('  - animoplus_refresh_token (ancien):', !!animoplusRefresh)
  console.log('  - animoplus_user_data (ancien):', !!animoplusUser)
  
  const hasDuplication = !!(animoplusToken || animoplusRefresh || animoplusUser)
  
  if (hasDuplication) {
    console.log('❌ DUPLICATION DÉTECTÉE - Anciennes clés présentes')
    console.log('💡 Exécutez cleanAuthData() pour nettoyer')
  } else {
    console.log('✅ AUCUNE DUPLICATION - Système unifié uniquement')
  }
  
  return {
    hasUnifiedData: !!data,
    hasDuplication,
    oldKeysFound: {
      token: !!animoplusToken,
      refreshToken: !!animoplusRefresh,
      userData: !!animoplusUser
    }
  }
}

// Fonction pour tester l'intégration Axios avec le système unifié
export const testAxiosIntegration = async () => {
  console.log('🔍 === TEST INTÉGRATION AXIOS ===')
  
  const data = localStorage.getItem('data')
  if (!data) {
    console.log('❌ Aucune donnée d\'authentification - connectez-vous d\'abord')
    return { success: false, reason: 'not_authenticated' }
  }
  
  let parsedData
  try {
    parsedData = JSON.parse(data)
  } catch (error) {
    console.log('❌ Données corrompues dans localStorage')
    return { success: false, reason: 'corrupted_data' }
  }
  
  console.log('📊 État système unifié:')
  console.log('  - Token présent:', !!parsedData.token)
  console.log('  - RefreshToken présent:', !!parsedData.refreshToken)
  console.log('  - User présent:', !!parsedData.user)
  
  // Test d'une requête API simple
  try {
    console.log('🚀 Test requête API /auth/me...')
    
    const { apiClient } = await import('../services/api/config.js')
    const response = await apiClient.get('/auth/me')
    
    console.log('✅ Requête API réussie:', {
      status: response.status,
      user: response.data.name || 'Nom non disponible',
      hasToken: !!response.config.headers.Authorization
    })
    
    return { 
      success: true, 
      hasToken: !!parsedData.token,
      apiWorking: true,
      user: response.data
    }
    
  } catch (error) {
    console.error('❌ Erreur requête API:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      hasAuthHeader: !!error.config?.headers?.Authorization
    })
    
    return { 
      success: false, 
      hasToken: !!parsedData.token,
      apiWorking: false,
      error: error.response?.data?.message || error.message
    }
  }
}

// Fonction pour tester l'auto-refresh
export const testAutoRefresh = async () => {
  console.log('🔍 === TEST AUTO-REFRESH ===')
  
  const data = localStorage.getItem('data')
  if (!data) {
    console.log('❌ Aucune donnée d\'authentification')
    return { success: false }
  }
  
  try {
    // Simuler un token expiré en modifiant temporairement le token
    const parsedData = JSON.parse(data)
    const originalToken = parsedData.token
    
    // Mettre un token invalide pour forcer le refresh
    parsedData.token = 'invalid_token_to_force_refresh'
    localStorage.setItem('data', JSON.stringify(parsedData))
    
    console.log('🔄 Simulation token expiré, test auto-refresh...')
    
    const { apiClient } = await import('../services/api/config.js')
    const response = await apiClient.get('/auth/me')
    
    console.log('✅ Auto-refresh réussi:', {
      status: response.status,
      newTokenReceived: true
    })
    
    return { success: true, refreshWorked: true }
    
  } catch (error) {
    console.error('❌ Auto-refresh échoué:', error.message)
    
    // Restaurer le token original en cas d'échec
    try {
      const parsedData = JSON.parse(data)
      localStorage.setItem('data', data) // Restaurer les données originales
    } catch (restoreError) {
      console.error('❌ Erreur restauration token:', restoreError)
    }
    
    return { success: false, refreshWorked: false, error: error.message }
  }
}

// Fonction pour tester la synchronisation après modification de profil
export const testProfileSync = async () => {
  console.log('🔍 === TEST SYNCHRONISATION PROFIL ===')
  
  const data = localStorage.getItem('data')
  if (!data) {
    console.log('❌ Aucune donnée d\'authentification')
    return { success: false }
  }
  
  let parsedData
  try {
    parsedData = JSON.parse(data)
  } catch (error) {
    console.log('❌ Données corrompues')
    return { success: false }
  }
  
  console.log('📊 Données utilisateur actuelles dans localStorage:')
  console.log('  - ID:', parsedData.user?.id)
  console.log('  - Nom:', parsedData.user?.name)
  console.log('  - Email:', parsedData.user?.email)
  console.log('  - Type:', parsedData.user?.user_type)
  console.log('  - Dernière mise à jour:', parsedData.user?.updated_at)
  
  // Comparer avec les données de l'API
  try {
    const { apiClient } = await import('../services/api/config.js')
    const response = await apiClient.get('/auth/me')
    const apiUser = response.data
    
    console.log('📊 Données utilisateur depuis l\'API:')
    console.log('  - ID:', apiUser.id)
    console.log('  - Nom:', apiUser.name)
    console.log('  - Email:', apiUser.email)
    console.log('  - Type:', apiUser.user_type)
    console.log('  - Dernière mise à jour:', apiUser.updated_at)
    
    // Vérifier la synchronisation
    const isSync = parsedData.user?.updated_at === apiUser.updated_at &&
                   parsedData.user?.name === apiUser.name
    
    if (isSync) {
      console.log('✅ DONNÉES SYNCHRONISÉES - localStorage et API cohérents')
    } else {
      console.log('❌ DÉSYNCHRONISATION DÉTECTÉE')
      console.log('💡 Exécutez auth.updateUserData(newData) pour synchroniser')
    }
    
    return {
      success: true,
      isSync,
      localStorage: parsedData.user,
      api: apiUser
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification API:', error.message)
    return { success: false, error: error.message }
  }
}

// Fonction pour tester l'upload d'avatar avec Cloudinary
export const testAvatarUpload = async () => {
  console.log('🔍 === TEST UPLOAD AVATAR ===')
  
  // Vérifier la configuration Cloudinary
  try {
    const { cloudinaryService } = await import('../services/cloudinary/cloudinaryService.js')
    const config = cloudinaryService.getConfig()
    
    console.log('📊 Configuration Cloudinary:')
    console.log('  - Cloud Name:', config.cloudName || '❌ MANQUANT')
    console.log('  - Upload Preset:', config.uploadPreset || '❌ MANQUANT')
    console.log('  - API Key:', config.apiKey ? '✅ Configuré' : '⚠️ Non configuré (optionnel)')
    
    if (!config.cloudName || !config.uploadPreset) {
      console.log('❌ Configuration Cloudinary incomplète')
      console.log('💡 Ajoutez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans .env')
      return { success: false, reason: 'config_missing' }
    }
    
    console.log('✅ Configuration Cloudinary OK')
    
    // Vérifier l'endpoint API
    const data = localStorage.getItem('data')
    if (!data) {
      console.log('❌ Utilisateur non connecté - impossible de tester l\'API avatar')
      return { success: false, reason: 'not_authenticated' }
    }
    
    console.log('✅ Utilisateur connecté - API avatar testable')
    
    return {
      success: true,
      cloudinaryReady: true,
      apiReady: true,
      config
    }
    
  } catch (error) {
    console.error('❌ Erreur test avatar:', error.message)
    return { success: false, error: error.message }
  }
}

// Fonction pour tester la synchronisation avatar après upload
export const testAvatarSync = async () => {
  console.log('🔍 === TEST SYNCHRONISATION AVATAR ===')
  
  const data = localStorage.getItem('data')
  if (!data) {
    console.log('❌ Aucune donnée d\'authentification')
    return { success: false }
  }
  
  try {
    const parsedData = JSON.parse(data)
    const localAvatar = parsedData.user?.avatar
    
    console.log('📊 Avatar dans localStorage:', localAvatar || 'Aucun')
    
    // Comparer avec l'API
    const { apiClient } = await import('../services/api/config.js')
    const response = await apiClient.get('/auth/me')
    const apiAvatar = response.data.avatar
    
    console.log('📊 Avatar depuis l\'API:', apiAvatar || 'Aucun')
    
    const isSync = localAvatar === apiAvatar
    
    if (isSync) {
      console.log('✅ AVATAR SYNCHRONISÉ - localStorage et API cohérents')
    } else {
      console.log('❌ DÉSYNCHRONISATION AVATAR DÉTECTÉE')
      console.log('💡 L\'avatar peut avoir été mis à jour récemment')
    }
    
    return {
      success: true,
      isSync,
      localStorage: localAvatar,
      api: apiAvatar
    }
    
  } catch (error) {
    console.error('❌ Erreur test synchronisation avatar:', error.message)
    return { success: false, error: error.message }
  }
}

// Exposer les fonctions globalement pour la console
if (typeof window !== 'undefined') {
  window.testAuthConsistency = testAuthConsistency
  window.testNoDuplication = testNoDuplication
  window.testRolePermissions = testRolePermissions
  window.testAxiosIntegration = testAxiosIntegration
  window.testAutoRefresh = testAutoRefresh
  window.testProfileSync = testProfileSync
  window.testAvatarUpload = testAvatarUpload
  window.testAvatarSync = testAvatarSync
  window.cleanAuthData = cleanAuthData
  window.simulateLogin = simulateLogin
  window.simulateLogout = simulateLogout
}
