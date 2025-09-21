// Utilitaire pour nettoyer le localStorage corrompu

export const cleanStorage = {
  
  // Nettoyer toutes les données corrompues
  cleanAll() {
    console.log('🧹 Nettoyage complet du localStorage...')
    
    const keysToCheck = [
      'animoplus_user_data',
      'user_data', 
      'animoplus_user'
    ]
    
    let cleanedCount = 0
    
    keysToCheck.forEach(key => {
      const data = localStorage.getItem(key)
      if (data && this.isCorrupted(data)) {
        console.warn(`⚠️ Données corrompues détectées dans ${key}`)
        
        const cleaned = this.cleanData(data)
        if (cleaned) {
          localStorage.setItem(key, cleaned)
          console.log(`✅ ${key} nettoyé`)
          cleanedCount++
        } else {
          localStorage.removeItem(key)
          console.log(`🗑️ ${key} supprimé (non récupérable)`)
        }
      }
    })
    
    console.log(`📊 Nettoyage terminé: ${cleanedCount} clés nettoyées`)
    return cleanedCount
  },
  
  // Vérifier si les données sont corrompues
  isCorrupted(data) {
    if (!data) return false
    
    // Vérifier les signes de corruption
    return data.includes('}}}}') || 
           data.includes('success":true') ||
           data.includes('"message":"Profile updated')
  },
  
  // Nettoyer les données corrompues
  cleanData(corruptedData) {
    try {
      // Si c'est une réponse API, extraire les données
      if (corruptedData.includes('"success":true') && corruptedData.includes('"data":')) {
        const dataMatch = corruptedData.match(/"data":(\{.*?\})/s)
        if (dataMatch) {
          const extractedData = dataMatch[1]
          // Vérifier que c'est du JSON valide
          JSON.parse(extractedData)
          return extractedData
        }
      }
      
      // Essayer de nettoyer les accolades supplémentaires
      if (corruptedData.includes('}}}}')) {
        let cleaned = corruptedData
        
        // Trouver le premier objet JSON valide
        const start = cleaned.indexOf('{')
        if (start !== -1) {
          let braceCount = 0
          let end = -1
          
          for (let i = start; i < cleaned.length; i++) {
            if (cleaned[i] === '{') braceCount++
            if (cleaned[i] === '}') braceCount--
            
            if (braceCount === 0) {
              end = i
              break
            }
          }
          
          if (end !== -1) {
            const extracted = cleaned.substring(start, end + 1)
            // Vérifier que c'est du JSON valide
            JSON.parse(extracted)
            return extracted
          }
        }
      }
      
      return null
    } catch (error) {
      console.error('❌ Impossible de nettoyer les données:', error)
      return null
    }
  },
  
  // Restaurer depuis une source propre
  restoreFromCleanSource() {
    console.log('🔄 Restauration depuis source propre...')
    
    // Essayer de restaurer depuis user_data vers animoplus_user_data
    const userData = localStorage.getItem('user_data')
    if (userData && !this.isCorrupted(userData)) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed && parsed.id) {
          localStorage.setItem('animoplus_user_data', userData)
          console.log('✅ Restauré depuis user_data')
          return true
        }
      } catch (error) {
        console.error('❌ user_data aussi corrompu')
      }
    }
    
    // Essayer depuis animoplus_user
    const animoplusUser = localStorage.getItem('animoplus_user')
    if (animoplusUser && !this.isCorrupted(animoplusUser)) {
      try {
        const parsed = JSON.parse(animoplusUser)
        if (parsed && parsed.id) {
          localStorage.setItem('animoplus_user_data', animoplusUser)
          localStorage.setItem('user_data', animoplusUser)
          console.log('✅ Restauré depuis animoplus_user')
          return true
        }
      } catch (error) {
        console.error('❌ animoplus_user aussi corrompu')
      }
    }
    
    console.log('⚠️ Aucune source propre trouvée')
    return false
  },
  
  // Diagnostic complet
  diagnose() {
    console.log('🔍 Diagnostic du localStorage...')
    
    const keys = ['token', 'refresh_token', 'user_data', 'animoplus_user_data', 'animoplus_user']
    const report = {}
    
    keys.forEach(key => {
      const data = localStorage.getItem(key)
      report[key] = {
        exists: !!data,
        size: data ? data.length : 0,
        corrupted: data ? this.isCorrupted(data) : false,
        preview: data ? data.substring(0, 50) + '...' : null
      }
    })
    
    console.table(report)
    return report
  }
}

// Fonction d'urgence globale
export const emergencyClean = () => {
  console.log('🚨 NETTOYAGE D\'URGENCE')
  
  const diagnosis = cleanStorage.diagnose()
  const cleaned = cleanStorage.cleanAll()
  const restored = cleanStorage.restoreFromCleanSource()
  
  return {
    diagnosis,
    cleaned,
    restored
  }
}

// Export global
if (typeof window !== 'undefined') {
  window.cleanStorage = cleanStorage
  window.emergencyClean = emergencyClean
}
