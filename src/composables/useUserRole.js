import { computed } from 'vue'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

/**
 * Composable pour gérer les rôles et permissions utilisateur
 */
export function useUserRole() {
  const auth = useSimpleAuth()
  
  // Computed pour récupérer l'utilisateur actuel
  const currentUser = computed(() => auth.getCurrentUser.value)
  
  // Computed pour le rôle de base
  const userRole = computed(() => {
    const user = currentUser.value
    return user?.user_type || user?.role || 'client'
  })
  
  // Computed pour vérifier si l'utilisateur est un client
  const isClient = computed(() => {
    return userRole.value === 'client'
  })
  
  // Computed pour vérifier si l'utilisateur est un vétérinaire (normal)
  const isVeterinarian = computed(() => {
    return userRole.value === 'veterinarian'
  })
  
  // Computed pour vérifier si l'utilisateur est un vétérinaire Pro
  const isVeterinarianPro = computed(() => {
    return userRole.value === 'veterinarian_pro'
  })
  
  // Computed pour vérifier si l'utilisateur est un vétérinaire (normal ou Pro)
  const isAnyVeterinarian = computed(() => {
    return isVeterinarian.value || isVeterinarianPro.value
  })
  
  // Computed pour vérifier si l'utilisateur a des fonctionnalités Pro
  const hasProFeatures = computed(() => {
    const user = currentUser.value
    return isVeterinarianPro.value || 
           user?.subscription_type === 'pro' || 
           user?.is_pro === true
  })
  
  // Fonction pour vérifier si l'utilisateur a accès à une fonctionnalité
  const hasAccess = (requiredRoles) => {
    if (!requiredRoles || requiredRoles.length === 0) return true
    
    const role = userRole.value
    
    // Si l'utilisateur est Pro, il a accès aux fonctionnalités des vétérinaires normaux
    if (role === 'veterinarian_pro' && requiredRoles.includes('veterinarian')) {
      return true
    }
    
    return requiredRoles.includes(role)
  }
  
  // Fonction pour vérifier si l'utilisateur peut accéder aux fonctionnalités Pro
  const canAccessProFeatures = () => {
    return hasProFeatures.value
  }
  
  // Fonction pour obtenir le label du rôle
  const getRoleLabel = () => {
    switch (userRole.value) {
      case 'client':
        return 'Client'
      case 'veterinarian':
        return 'Vétérinaire'
      case 'veterinarian_pro':
        return 'Vétérinaire Pro'
      default:
        return 'Utilisateur'
    }
  }
  
  // Fonction pour obtenir les fonctionnalités disponibles selon le rôle
  const getAvailableFeatures = () => {
    const features = []
    
    if (isClient.value) {
      features.push(
        'animals', 'appointments', 'documents', 'messages', 'speciality'
      )
    }
    
    if (isAnyVeterinarian.value) {
      features.push(
        'dashboard', 'appointments', 'documents', 'messages', 
        'manage-patient', 'services', 'tasks', 'accounting', 'stockManagement'
      )
    }
    
    if (isVeterinarianPro.value) {
      features.push(
        'pro-dashboard', 'pro-analytics', 'pro-reports', 
        'advanced-accounting', 'multi-clinic', 'priority-support'
      )
    }
    
    return features
  }
  
  return {
    // États
    currentUser,
    userRole,
    
    // Vérifications de rôle
    isClient,
    isVeterinarian,
    isVeterinarianPro,
    isAnyVeterinarian,
    hasProFeatures,
    
    // Fonctions utilitaires
    hasAccess,
    canAccessProFeatures,
    getRoleLabel,
    getAvailableFeatures
  }
}

export default useUserRole
