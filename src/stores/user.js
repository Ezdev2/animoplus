import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth/authService.js'

export const useUserStore = defineStore('user', () => {
  // État
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isClient = computed(() => user.value?.user_type === 'client')
  const isPro = computed(() => user.value?.user_type === 'veterinarian')
  const isVeterinarian = computed(() => user.value?.user_type === 'veterinarian')
  const fullName = computed(() => {
    if (!user.value) return ''
    return user.value.name || `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim()
  })
  const avatar = computed(() => user.value?.avatar || null)
  const email = computed(() => user.value?.email || '')

  // Actions
  const setUser = (userData) => {
    user.value = userData
    error.value = null
  }

  const clearUser = () => {
    user.value = null
    error.value = null
  }

  const updateUser = (updates) => {
    if (user.value) {
      user.value = { ...user.value, ...updates }
    }
  }

  const fetchCurrentUser = async () => {
    loading.value = true
    error.value = null

    try {
      const result = await authService.getCurrentUser()
      
      if (result.success) {
        setUser(result.data)
        return result.data
      } else {
        error.value = result.error
        return null
      }
    } catch (err) {
      error.value = 'Erreur lors de la récupération du profil utilisateur'
      console.error('Erreur fetchCurrentUser:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    error.value = null

    try {
      // TODO: Implémenter l'appel API pour mettre à jour le profil
      // const result = await userService.updateProfile(profileData)
      
      // Pour l'instant, mise à jour locale
      updateUser(profileData)
      
      return { success: true }
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour du profil'
      console.error('Erreur updateProfile:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const uploadAvatar = async (file) => {
    loading.value = true
    error.value = null

    try {
      // TODO: Implémenter l'upload d'avatar
      // const result = await userService.uploadAvatar(file)
      
      // Pour l'instant, simulation
      console.log('Upload avatar:', file)
      
      return { success: true }
    } catch (err) {
      error.value = 'Erreur lors de l\'upload de l\'avatar'
      console.error('Erreur uploadAvatar:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Méthodes utilitaires
  const hasRole = (role) => {
    if (!user.value) return false
    if (Array.isArray(role)) {
      return role.includes(user.value.user_type)
    }
    return user.value.user_type === role
  }

  const hasPermission = (permission) => {
    if (!user.value || !user.value.permissions) return false
    return user.value.permissions.includes(permission)
  }

  return {
    // État
    user,
    loading,
    error,
    
    // Getters
    isClient,
    isPro,
    isVeterinarian,
    fullName,
    avatar,
    email,
    
    // Actions
    setUser,
    clearUser,
    updateUser,
    fetchCurrentUser,
    updateProfile,
    uploadAvatar,
    hasRole,
    hasPermission
  }
})
