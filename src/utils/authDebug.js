// Utilitaire de debug pour l'authentification
export const debugAuth = () => {
  const token = localStorage.getItem('animoplus_token')
  const refreshToken = localStorage.getItem('animoplus_refresh_token')
  const userData = localStorage.getItem('animoplus_user_data')
  
  console.group('🔍 Debug Authentification')
  console.log('Token:', {
    exists: !!token,
    length: token?.length,
    preview: token ? token.substring(0, 30) + '...' : 'Aucun'
  })
  console.log('Refresh Token:', {
    exists: !!refreshToken,
    length: refreshToken?.length,
    preview: refreshToken ? refreshToken.substring(0, 30) + '...' : 'Aucun'
  })
  console.log('User Data:', {
    exists: !!userData,
    data: userData ? JSON.parse(userData) : null
  })
  console.groupEnd()
  
  return {
    hasToken: !!token,
    hasRefreshToken: !!refreshToken,
    hasUserData: !!userData,
    token,
    refreshToken,
    userData: userData ? JSON.parse(userData) : null
  }
}

// Fonction pour forcer la récupération du token depuis le store auth
export const syncTokenFromAuthStore = () => {
  try {
    // Récupérer depuis le store auth existant
    const authData = JSON.parse(localStorage.getItem('auth') || '{}')
    
    if (authData.token) {
      localStorage.setItem('animoplus_token', authData.token)
      console.log('✅ Token synchronisé depuis le store auth')
      return authData.token
    }
    
    // Vérifier aussi dans d'autres clés possibles
    const possibleKeys = ['token', 'access_token', 'authToken', 'jwt']
    for (const key of possibleKeys) {
      const token = localStorage.getItem(key)
      if (token) {
        localStorage.setItem('animoplus_token', token)
        console.log(`✅ Token trouvé dans ${key} et synchronisé`)
        return token
      }
    }
    
    console.warn('⚠️ Aucun token trouvé dans le localStorage')
    return null
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation du token:', error)
    return null
  }
}

// Fonction pour tester le refresh du token
export const testTokenRefresh = async () => {
  try {
    const { tokenService } = await import('@/services/auth/tokenService.js')
    
    console.log('🧪 Test du refresh token...')
    const result = await tokenService.forceRefreshToken()
    
    if (result.success) {
      console.log('✅ Test refresh réussi, nouveau token disponible')
      return result.token
    } else {
      console.log('❌ Test refresh échoué:', result.error)
      return null
    }
  } catch (error) {
    console.error('❌ Erreur lors du test refresh:', error)
    return null
  }
}

// Fonction pour diagnostiquer complètement l'authentification
export const fullAuthDiagnostic = async () => {
  console.group('🔍 Diagnostic Complet Authentification')
  
  const authState = debugAuth()
  
  if (authState.hasToken) {
    const { tokenService } = await import('@/services/auth/tokenService.js')
    const isExpired = tokenService.isTokenExpired()
    const decoded = tokenService.decodeToken()
    
    console.log('Token Analysis:', {
      isExpired,
      expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : 'Unknown',
      userId: decoded?.sub || decoded?.user_id,
      role: decoded?.user_type || decoded?.role
    })
    
    if (isExpired) {
      console.log('⏰ Token expiré, tentative de refresh...')
      await testTokenRefresh()
    }
  } else {
    console.log('🔄 Aucun token, tentative de synchronisation...')
    syncTokenFromAuthStore()
  }
  
  console.groupEnd()
}
