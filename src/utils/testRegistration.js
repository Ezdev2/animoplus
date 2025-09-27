/**
 * Utilitaire de test pour vérifier la configuration d'inscription
 */

import { authService } from '@/services/auth/authService.js'
import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

export const testRegistrationConfig = () => {
  console.log('🔍 TEST CONFIGURATION INSCRIPTION')
  console.log('================================')
  
  // 1. Vérifier la configuration API
  console.log('📡 Configuration API:')
  console.log('- Base URL:', apiClient.defaults.baseURL)
  console.log('- Timeout:', apiClient.defaults.timeout)
  console.log('- Headers:', apiClient.defaults.headers)
  
  // 2. Vérifier les endpoints
  console.log('\n🎯 Endpoints:')
  console.log('- Register:', API_ENDPOINTS.AUTH.REGISTER)
  console.log('- Verify Email:', API_ENDPOINTS.AUTH.VERIFY_EMAIL)
  console.log('- Resend Verification:', API_ENDPOINTS.AUTH.RESEND_VERIFICATION)
  
  // 3. Vérifier l'URL complète
  const fullRegisterUrl = `${apiClient.defaults.baseURL}${API_ENDPOINTS.AUTH.REGISTER}`
  console.log('\n🌐 URL complète d\'inscription:', fullRegisterUrl)
  
  // 4. Vérifier les variables d'environnement
  console.log('\n🔧 Variables d\'environnement:')
  console.log('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
  console.log('- Mode:', import.meta.env.MODE)
  console.log('- Dev:', import.meta.env.DEV)
  
  // 5. Test de payload
  const testPayload = {
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    password_confirmation: "password123",
    user_type: "client",
    phone: "0123456789"
  }
  
  console.log('\n📝 Exemple de payload:')
  console.log(JSON.stringify(testPayload, null, 2))
  
  console.log('\n✅ Configuration vérifiée - Prêt pour les tests!')
}

export const testRegistrationAPI = async (testData) => {
  console.log('🧪 TEST API INSCRIPTION')
  console.log('=======================')
  
  try {
    console.log('📤 Envoi des données de test...')
    const result = await authService.register(testData)
    
    console.log('📥 Résultat:', result)
    
    if (result.success) {
      console.log('✅ Test réussi!')
      return true
    } else {
      console.log('❌ Test échoué:', result.error)
      return false
    }
  } catch (error) {
    console.error('💥 Erreur pendant le test:', error)
    return false
  }
}

// Fonction pour tester depuis la console du navigateur
window.testRegistration = {
  config: testRegistrationConfig,
  api: testRegistrationAPI
}

export default {
  testRegistrationConfig,
  testRegistrationAPI
}
