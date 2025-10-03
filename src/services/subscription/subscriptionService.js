import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour gérer les abonnements et upgrades Pro
 */
export const subscriptionService = {
  /**
   * Upgrade vers un compte Pro
   * @returns {Promise<Object>} Réponse de l'API
   */
  async upgradeToProAccount() {
    try {
      console.log('⭐ Demande upgrade vers compte Pro...')
      console.log('🌐 URL endpoint:', API_ENDPOINTS.USERS.UPGRADE_TO_PRO)
      console.log('🔗 Appel API POST en cours...')
      
      const response = await apiClient.post(API_ENDPOINTS.USERS.UPGRADE_TO_PRO)
      
      console.log('📦 Réponse API upgrade Pro:', response.data)
      console.log('📊 Status code:', response.status)
      console.log('📋 Headers:', response.headers)
      
      // Vérifier la structure de la réponse
      if (response.data && response.data.success) {
        return {
          success: true,
          message: response.data.message || 'Compte mis à niveau vers Pro avec succès',
          data: response.data.data || response.data.user,
          user: response.data.user || response.data.data
        }
      } else {
        console.warn('⚠️ Réponse API inattendue:', response.data)
        return {
          success: false,
          message: response.data?.message || 'Erreur lors de la mise à niveau',
          error: response.data?.error || 'Réponse API inattendue'
        }
      }
    } catch (error) {
      console.error('❌ Erreur upgrade Pro:', error)
      
      // Gestion des erreurs spécifiques
      if (error.response?.status === 400) {
        return {
          success: false,
          message: 'Votre compte est déjà Pro ou ne peut pas être mis à niveau',
          error: error.response.data?.message || 'Requête invalide'
        }
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          message: 'Vous n\'avez pas les permissions pour effectuer cette action',
          error: 'Accès refusé'
        }
      }
      
      if (error.response?.status === 409) {
        return {
          success: false,
          message: 'Votre compte est déjà Pro',
          error: 'Compte déjà Pro'
        }
      }
      
      return {
        success: false,
        message: 'Erreur lors de la mise à niveau vers Pro. Veuillez réessayer.',
        error: error.response?.data?.message || error.message || 'Erreur réseau'
      }
    }
  },

  /**
   * Vérifier le statut Pro d'un utilisateur
   * @returns {Promise<Object>} Statut Pro de l'utilisateur
   */
  async checkProStatus() {
    try {
      console.log('🔍 Vérification statut Pro...')
      
      const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE)
      
      if (response.data && response.data.success) {
        const user = response.data.data || response.data.user
        
        return {
          success: true,
          isPro: user?.user_type === 'veterinarian_pro' || user?.subscription_type === 'pro',
          user: user
        }
      }
      
      return {
        success: false,
        isPro: false,
        error: 'Impossible de vérifier le statut Pro'
      }
    } catch (error) {
      console.error('❌ Erreur vérification statut Pro:', error)
      return {
        success: false,
        isPro: false,
        error: error.message
      }
    }
  },

  /**
   * Simuler un upgrade Pro (pour les tests)
   * @returns {Promise<Object>} Réponse simulée
   */
  async simulateUpgradeToPro() {
    console.log('🎭 Simulation upgrade Pro...')
    
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simuler une réponse réussie
    return {
      success: true,
      message: 'Compte mis à niveau vers Pro avec succès (simulation)',
      data: {
        id: 'user-123',
        user_type: 'veterinarian_pro',
        subscription_type: 'pro',
        subscription_start_date: new Date().toISOString(),
        pro_features: [
          'advanced_accounting',
          'stock_management',
          'detailed_reports',
          'multi_clinic_support',
          'priority_support'
        ]
      }
    }
  }
}

export default subscriptionService
