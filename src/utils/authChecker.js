// Règle d'authentification unique et fiable
// Cette fonction est la SEULE source de vérité pour l'état d'authentification

export const authChecker = {
  
  // Règle principale : Un utilisateur est authentifié SI ET SEULEMENT SI
  // 1. Il a un token valide
  // 2. Il a des données utilisateur
  isAuthenticated() {
    try {
      // Vérifier les différentes clés possibles pour le token
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('animoplus_token')
      
      // Vérifier les différentes clés possibles pour les données utilisateur
      const userData = localStorage.getItem('user_data') || 
                      localStorage.getItem('animoplus_user_data')
      
      const hasValidToken = !!(token && token.length > 10)
      const hasValidUserData = !!(userData && this.parseUserData(userData))
      
      const isAuth = hasValidToken && hasValidUserData
      
      console.log('🔍 Vérification authentification:', {
        hasValidToken,
        hasValidUserData,
        isAuthenticated: isAuth,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'Aucun',
        userDataExists: !!userData
      })
      
      return isAuth
      
    } catch (error) {
      console.error('❌ Erreur lors de la vérification auth:', error)
      return false
    }
  },

  // Récupérer les données utilisateur de manière fiable
  getUserData() {
    try {
      const userData = localStorage.getItem('user_data') || 
                      localStorage.getItem('animoplus_user_data')
      
      return this.parseUserData(userData)
    } catch (error) {
      console.error('❌ Erreur récupération user data:', error)
      return null
    }
  },

  // Récupérer le token de manière fiable
  getToken() {
    // PRIORITÉ aux tokens existants dans votre localStorage
    return localStorage.getItem('token') || 
           localStorage.getItem('animoplus_token')
  },

  // Récupérer le refresh token
  getRefreshToken() {
    return localStorage.getItem('refresh_token') || 
           localStorage.getItem('animoplus_refresh_token')
  },

  // Parser les données utilisateur en toute sécurité
  parseUserData(userData) {
    if (!userData) return null
    
    try {
      // Nettoyer les données avant parsing (supprimer les accolades supplémentaires)
      let cleanedData = userData.trim()
      
      // Si les données commencent par des accolades multiples, essayer de les nettoyer
      if (cleanedData.includes('}}}}')) {
        console.warn('⚠️ Données corrompues détectées, tentative de nettoyage...')
        
        // Essayer de trouver le JSON valide dans la chaîne
        const jsonStart = cleanedData.indexOf('{')
        if (jsonStart !== -1) {
          // Trouver la fin du premier objet JSON valide
          let braceCount = 0
          let jsonEnd = -1
          
          for (let i = jsonStart; i < cleanedData.length; i++) {
            if (cleanedData[i] === '{') braceCount++
            if (cleanedData[i] === '}') braceCount--
            
            if (braceCount === 0) {
              jsonEnd = i
              break
            }
          }
          
          if (jsonEnd !== -1) {
            cleanedData = cleanedData.substring(jsonStart, jsonEnd + 1)
            console.log('✅ Données nettoyées:', cleanedData.substring(0, 100) + '...')
          }
        }
      }
      
      const parsed = JSON.parse(cleanedData)
      
      // Vérifier que c'est un objet valide avec au moins un ID
      if (parsed && typeof parsed === 'object' && parsed.id) {
        return parsed
      }
      
      // Si pas d'ID direct, vérifier si c'est une réponse API avec data
      if (parsed && parsed.success && parsed.data && parsed.data.id) {
        console.log('📦 Extraction des données depuis réponse API')
        return parsed.data
      }
      
      return null
    } catch (error) {
      console.error('❌ Erreur parsing user data:', error)
      console.error('📋 Données problématiques:', userData.substring(0, 200) + '...')
      return null
    }
  },

  // Synchroniser les tokens vers les clés standardisées
  syncTokens() {
    try {
      const token = this.getToken()
      const refreshToken = this.getRefreshToken()
      
      if (token) {
        // Synchroniser DANS LES DEUX SENS pour compatibilité
        localStorage.setItem('animoplus_token', token)
        // S'assurer que 'token' existe aussi
        if (!localStorage.getItem('token')) {
          localStorage.setItem('token', token)
        }
        console.log('✅ Token synchronisé (token ↔ animoplus_token)')
      }
      
      if (refreshToken) {
        localStorage.setItem('animoplus_refresh_token', refreshToken)
        // S'assurer que 'refresh_token' existe aussi
        if (!localStorage.getItem('refresh_token')) {
          localStorage.setItem('refresh_token', refreshToken)
        }
        console.log('✅ Refresh token synchronisé (refresh_token ↔ animoplus_refresh_token)')
      }
      
      return { token, refreshToken }
    } catch (error) {
      console.error('❌ Erreur synchronisation tokens:', error)
      return { token: null, refreshToken: null }
    }
  },

  // Synchroniser les données utilisateur
  syncUserData() {
    try {
      const userData = this.getUserData()
      
      if (userData) {
        // Synchroniser vers animoplus_user_data pour compatibilité
        localStorage.setItem('animoplus_user_data', JSON.stringify(userData))
        console.log('✅ User data synchronisé vers animoplus_user_data')
      }
      
      return userData
    } catch (error) {
      console.error('❌ Erreur synchronisation user data:', error)
      return null
    }
  },

  // Synchronisation complète de l'authentification
  syncAll() {
    console.log('🔄 Synchronisation complète de l\'authentification...')
    
    const tokens = this.syncTokens()
    const userData = this.syncUserData()
    const isAuth = this.isAuthenticated()
    
    console.log('📊 État après synchronisation:', {
      isAuthenticated: isAuth,
      hasToken: !!tokens.token,
      hasRefreshToken: !!tokens.refreshToken,
      hasUserData: !!userData
    })
    
    return {
      isAuthenticated: isAuth,
      tokens,
      userData
    }
  },

  // Nettoyer l'authentification complètement
  clearAuth() {
    console.log('🧹 Nettoyage complet de l\'authentification...')
    
    // Nettoyer tous les tokens
    const tokenKeys = ['token', 'animoplus_token', 'access_token', 'authToken']
    const refreshKeys = ['refresh_token', 'animoplus_refresh_token']
    const userDataKeys = ['user_data', 'animoplus_user_data', 'animoplus_user']
    const authStateKeys = ['auth', 'pinia-auth', 'pinia-user']
    
    const allKeys = [...tokenKeys, ...refreshKeys, ...userDataKeys, ...authStateKeys]
    allKeys.forEach(key => {
      localStorage.removeItem(key)
    })
    
    console.log('✅ Authentification nettoyée')
  }
}

// Export par défaut pour faciliter l'import
export default authChecker
