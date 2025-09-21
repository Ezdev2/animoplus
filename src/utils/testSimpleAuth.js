// Utilitaire de test pour le système d'authentification simple

export const testSimpleAuth = () => {
  console.log('🧪 Test du système d\'authentification simple')
  
  // Test 1: Vérifier la migration
  console.log('\n1️⃣ Test Migration:')
  const data = localStorage.getItem('data')
  if (data) {
    try {
      const parsed = JSON.parse(data)
      console.log('✅ Données migrées:', {
        hasToken: !!parsed.token,
        hasUser: !!parsed.user,
        userName: parsed.user?.name,
        migrated: parsed.migrated
      })
    } catch (error) {
      console.error('❌ Erreur parsing données:', error)
    }
  } else {
    console.log('⚠️ Aucune donnée dans localStorage["data"]')
  }
  
  // Test 2: Vérifier le nettoyage
  console.log('\n2️⃣ Test Nettoyage:')
  const oldKeys = [
    'token', 'refresh_token', 'user_data', 'animoplus_user_data', 
    'animoplus_user', 'auth', 'pinia-auth', 'pinia-user'
  ]
  
  const remainingKeys = oldKeys.filter(key => localStorage.getItem(key))
  if (remainingKeys.length === 0) {
    console.log('✅ Toutes les anciennes clés supprimées')
  } else {
    console.log('⚠️ Clés restantes:', remainingKeys)
  }
  
  // Test 3: Tester le composable
  console.log('\n3️⃣ Test Composable:')
  try {
    import('@/composables/useSimpleAuth.js').then(({ useSimpleAuth }) => {
      const auth = useSimpleAuth()
      auth.init()
      
      console.log('✅ Composable testé:', {
        isAuthenticated: auth.isAuthenticated.value,
        user: auth.getCurrentUser.value?.name,
        hasToken: !!auth.getCurrentToken.value
      })
    })
  } catch (error) {
    console.error('❌ Erreur test composable:', error)
  }
  
  // Test 4: Diagnostic localStorage
  console.log('\n4️⃣ Diagnostic localStorage:')
  const allKeys = Object.keys(localStorage)
  const authRelatedKeys = allKeys.filter(key => 
    key.includes('auth') || 
    key.includes('user') || 
    key.includes('token') ||
    key === 'data'
  )
  
  console.table(authRelatedKeys.map(key => ({
    key,
    size: localStorage.getItem(key)?.length || 0,
    preview: localStorage.getItem(key)?.substring(0, 50) + '...'
  })))
  
  return {
    hasData: !!data,
    cleanedUp: remainingKeys.length === 0,
    authKeys: authRelatedKeys
  }
}

// Export global pour debug
if (typeof window !== 'undefined') {
  window.testSimpleAuth = testSimpleAuth
}
