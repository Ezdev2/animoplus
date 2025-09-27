import { ref } from 'vue'
import { authService } from '@/services/auth/authService.js'
import { useToast } from '@/composables/useToast.js'

/**
 * Composable pour gérer la vérification d'email
 */
export const useEmailVerification = () => {
  const { showToast } = useToast()
  
  // États réactifs
  const isVerifying = ref(false)
  const isResending = ref(false)
  const isVerified = ref(false)
  const hasError = ref(false)
  const errorMessage = ref('')

  /**
   * Vérifier un email avec un token
   * @param {string} email - Adresse email
   * @param {string} token - Token de vérification
   */
  const verifyEmail = async (email, token) => {
    if (!email || !token) {
      hasError.value = true
      errorMessage.value = 'Email ou token manquant'
      return false
    }

    isVerifying.value = true
    hasError.value = false
    
    try {
      console.log('🔍 Vérification email:', { email, token: token.substring(0, 10) + '...' })
      
      const result = await authService.verifyEmail(email, token)
      
      if (result.success) {
        console.log('✅ Email vérifié avec succès:', result.data)
        isVerified.value = true
        showToast('Email vérifié avec succès ! Vous pouvez maintenant vous connecter.', 'success')
        return true
      } else {
        console.error('❌ Erreur vérification:', result.error)
        hasError.value = true
        errorMessage.value = result.error || 'Le lien de vérification est invalide ou expiré.'
        return false
      }
    } catch (error) {
      console.error('❌ Erreur réseau vérification:', error)
      hasError.value = true
      errorMessage.value = 'Erreur de connexion. Veuillez réessayer.'
      return false
    } finally {
      isVerifying.value = false
    }
  }

  /**
   * Renvoyer l'email de vérification
   * @param {string} email - Adresse email
   */
  const resendVerification = async (email) => {
    if (!email) {
      showToast('Adresse email manquante', 'error')
      return false
    }

    isResending.value = true
    
    try {
      console.log('📧 Renvoi email de vérification:', email)
      
      const result = await authService.resendVerification(email)
      
      if (result.success) {
        console.log('✅ Email de vérification renvoyé:', result.data)
        showToast('Email de vérification renvoyé ! Vérifiez votre boîte mail.', 'success')
        return true
      } else {
        console.error('❌ Erreur renvoi:', result.error)
        showToast(result.error || 'Erreur lors du renvoi de l\'email', 'error')
        return false
      }
    } catch (error) {
      console.error('❌ Erreur réseau renvoi:', error)
      showToast('Erreur de connexion. Veuillez réessayer.', 'error')
      return false
    } finally {
      isResending.value = false
    }
  }

  /**
   * Réinitialiser les états
   */
  const reset = () => {
    isVerifying.value = false
    isResending.value = false
    isVerified.value = false
    hasError.value = false
    errorMessage.value = ''
  }

  /**
   * Extraire les paramètres de vérification depuis une URL
   * @param {string} url - URL contenant les paramètres
   */
  const extractVerificationParams = (url) => {
    try {
      const urlObj = new URL(url)
      return {
        email: urlObj.searchParams.get('email'),
        token: urlObj.searchParams.get('token')
      }
    } catch (error) {
      console.error('❌ Erreur extraction paramètres URL:', error)
      return { email: null, token: null }
    }
  }

  return {
    // États
    isVerifying,
    isResending,
    isVerified,
    hasError,
    errorMessage,
    
    // Actions
    verifyEmail,
    resendVerification,
    reset,
    extractVerificationParams
  }
}

export default useEmailVerification
