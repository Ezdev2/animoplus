// Script de migration vers le système d'authentification simple

export const migrateToSimple = () => {
  console.log('🔄 Migration vers système simple...')
  
  // Récupérer les données existantes
  const existingData = {
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refresh_token'),
    userData: localStorage.getItem('user_data') || localStorage.getItem('animoplus_user_data')
  }
  
  console.log('📦 Données existantes:', existingData)
  
  // Vérifier si on a les données nécessaires
  if (!existingData.token || !existingData.userData) {
    console.warn('⚠️ Données insuffisantes pour la migration')
    return false
  }
  
  try {
    // Parser les données utilisateur
    const user = JSON.parse(existingData.userData)
    
    // Créer le nouvel objet de données
    const newData = {
      token: existingData.token,
      refreshToken: existingData.refreshToken,
      user: user,
      loginTime: Date.now(),
      migrated: true
    }
    
    // Sauvegarder dans la nouvelle clé
    localStorage.setItem('data', JSON.stringify(newData))
    
    // Nettoyer les anciennes clés
    const oldKeys = [
      'token', 'refresh_token', 'user_data', 'animoplus_user_data', 
      'animoplus_user', 'animoplus_token', 'animoplus_refresh_token',
      'auth', 'pinia-auth', 'pinia-user', 'user_id', 'user_subscription'
    ]
    
    let cleaned = 0
    oldKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
        cleaned++
      }
    })
    
    console.log('✅ Migration réussie!')
    console.log(`🧹 ${cleaned} anciennes clés supprimées`)
    console.log('👤 Utilisateur migré:', user.name)
    
    return true
    
  } catch (error) {
    console.error('❌ Erreur migration:', error)
    return false
  }
}

// Auto-migration au chargement
export const autoMigrate = () => {
  // Vérifier si déjà migré
  const existingSimpleData = localStorage.getItem('data')
  if (existingSimpleData) {
    console.log('✅ Déjà migré vers système simple')
    return true
  }
  
  // Vérifier si il y a des données à migrer
  const hasOldData = localStorage.getItem('token') && 
                    (localStorage.getItem('user_data') || localStorage.getItem('animoplus_user_data'))
  
  if (hasOldData) {
    console.log('🔄 Migration automatique détectée...')
    return migrateToSimple()
  }
  
  console.log('ℹ️ Aucune donnée à migrer')
  return false
}

// Export global pour debug
if (typeof window !== 'undefined') {
  window.migrateToSimple = migrateToSimple
  window.autoMigrate = autoMigrate
}
