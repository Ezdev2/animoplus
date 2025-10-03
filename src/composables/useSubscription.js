import { ref, computed } from 'vue'
import { subscriptionService } from '@/services/subscription/subscriptionService.js'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { useToast } from '@/composables/useToast.js'

/**
 * Composable pour gérer les abonnements et upgrades Pro
 */
export function useSubscription() {
  // États réactifs
  const isUpgrading = ref(false)
  const isCheckingStatus = ref(false)
  const upgradeError = ref(null)
  
  // Accès à l'auth et aux toasts
  const auth = useSimpleAuth()
  const { showToast } = useToast()
  
  // Computed pour vérifier si l'utilisateur est Pro
  const isUserPro = computed(() => {
    const user = auth.getCurrentUser.value
    if (!user) return false
    
    // Vérifier différents indicateurs de statut Pro
    return user.user_type === 'veterinarian_pro' || 
           user.subscription_type === 'pro' ||
           user.is_pro === true
  })
  
  // Computed pour vérifier si l'utilisateur peut upgrader
  const canUpgrade = computed(() => {
    const user = auth.getCurrentUser.value
    if (!user) return false
    
    // Seuls les vétérinaires peuvent upgrader vers Pro
    return user.user_type === 'veterinarian' && !isUserPro.value
  })
  
  /**
   * Upgrade vers un compte Pro
   * @param {boolean} useSimulation - Utiliser la simulation ou l'API réelle
   * @returns {Promise<Object>} Résultat de l'upgrade
   */
  const upgradeToPro = async (useSimulation = false) => {
    if (isUpgrading.value) {
      console.warn('⚠️ Upgrade déjà en cours...')
      return { success: false, message: 'Upgrade déjà en cours' }
    }
    
    isUpgrading.value = true
    upgradeError.value = null
    
    try {
      console.log('⭐ Début upgrade vers Pro...', { useSimulation })
      
      let result
      
      if (useSimulation) {
        // Utiliser la simulation pour les tests
        console.log('🎭 Mode SIMULATION activé')
        result = await subscriptionService.simulateUpgradeToPro()
      } else {
        // Utiliser l'API réelle
        console.log('🌐 Mode API RÉELLE activé - Appel vers le backend')
        result = await subscriptionService.upgradeToProAccount()
      }
      
      if (result.success) {
        console.log('✅ Upgrade Pro réussi:', result)
        
        // IMPORTANT: Mettre à jour les données utilisateur SEULEMENT si l'API confirme le succès
        if (result.user || result.data) {
          const updatedUser = result.user || result.data
          
          // Vérifier que l'utilisateur a bien été mis à niveau vers Pro
          const isNowPro = updatedUser.user_type === 'veterinarian_pro' || 
                          updatedUser.subscription_type === 'pro' ||
                          updatedUser.is_pro === true
          
          if (isNowPro) {
            console.log('🎯 Confirmation API: Utilisateur est maintenant Pro')
            await auth.updateUserData(updatedUser)
            console.log('🔄 Données utilisateur mises à jour:', updatedUser)
          } else {
            console.warn('⚠️ API a répondu succès mais utilisateur pas Pro:', updatedUser)
          }
        }
        
        // Afficher un toast de succès
        showToast({
          type: 'success',
          title: 'Félicitations ! 🎉',
          message: result.message || 'Votre compte est maintenant Pro !',
          duration: 5000
        })
        
        return result
      } else {
        console.error('❌ Échec upgrade Pro:', result)
        upgradeError.value = result.error || result.message
        
        // Afficher un toast d'erreur
        showToast({
          type: 'error',
          title: 'Erreur upgrade Pro',
          message: result.message || 'Impossible de mettre à niveau votre compte',
          duration: 5000
        })
        
        return result
      }
    } catch (error) {
      console.error('❌ Erreur upgrade Pro:', error)
      upgradeError.value = error.message
      
      showToast({
        type: 'error',
        title: 'Erreur technique',
        message: 'Une erreur technique est survenue. Veuillez réessayer.',
        duration: 5000
      })
      
      return {
        success: false,
        message: 'Erreur technique lors de l\'upgrade',
        error: error.message
      }
    } finally {
      isUpgrading.value = false
    }
  }
  
  /**
   * Vérifier le statut Pro de l'utilisateur
   * @returns {Promise<boolean>} True si l'utilisateur est Pro
   */
  const checkProStatus = async () => {
    if (isCheckingStatus.value) return isUserPro.value
    
    isCheckingStatus.value = true
    
    try {
      const result = await subscriptionService.checkProStatus()
      
      if (result.success && result.user) {
        // Mettre à jour les données utilisateur
        await auth.updateUserData(result.user)
      }
      
      return result.isPro || false
    } catch (error) {
      console.error('❌ Erreur vérification statut Pro:', error)
      return false
    } finally {
      isCheckingStatus.value = false
    }
  }
  
  /**
   * Réinitialiser les erreurs
   */
  const clearError = () => {
    upgradeError.value = null
  }
  
  return {
    // États
    isUpgrading: computed(() => isUpgrading.value),
    isCheckingStatus: computed(() => isCheckingStatus.value),
    upgradeError: computed(() => upgradeError.value),
    
    // Computed
    isUserPro,
    canUpgrade,
    
    // Actions
    upgradeToPro,
    checkProStatus,
    clearError
  }
}

export default useSubscription
