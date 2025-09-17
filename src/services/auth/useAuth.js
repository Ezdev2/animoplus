import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { AuthService } from './authService.js'
import { TokenService } from './tokenService.js'
import { 
  useLogin, 
  useLogout, 
  useRegisterClient, 
  useRegisterVeterinarian,
  useProfile 
} from './authQueries.js'

/**
 * Authentication Composable
 * Provides reactive authentication state and methods
 */
export function useAuth() {
  const router = useRouter()
  
  // Reactive state - initialize as false to prevent flash
  const isAuthenticated = ref(false)
  const currentUser = ref(null)
  
  // TanStack Query hooks
  const loginMutation = useLogin()
  const logoutMutation = useLogout()
  const registerClientMutation = useRegisterClient()
  const registerVeterinarianMutation = useRegisterVeterinarian()
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile()
  
  // Computed properties
  const isLoading = computed(() => 
    loginMutation.isPending.value || 
    logoutMutation.isPending.value || 
    registerClientMutation.isPending.value || 
    registerVeterinarianMutation.isPending.value ||
    profileLoading.value
  )
  
  const user = computed(() => profile.value || currentUser.value)
  const userType = computed(() => user.value?.user_type || null)
  const isClient = computed(() => userType.value === 'client')
  const isVeterinarian = computed(() => userType.value === 'veterinarian')
  
  // Watch for authentication changes
  watch(
    () => TokenService.isAuthenticated(),
    (newValue) => {
      isAuthenticated.value = newValue
      currentUser.value = TokenService.getUserData()
    },
    { immediate: true }
  )
  
  // Authentication methods
  const login = async (credentials) => {
    try {
      const result = await loginMutation.mutateAsync(credentials)
      // Update state immediately and synchronously
      isAuthenticated.value = true
      currentUser.value = result.user
      
      return result
    } catch (error) {
      throw error
    }
  }
  
  const logout = async () => {
    try {
      // Clear state immediately before API call
      isAuthenticated.value = false
      currentUser.value = null
      
      await logoutMutation.mutateAsync()
      // Hard redirect to login with page reload
      window.location.href = '/login'
    } catch (error) {
      // State already cleared above
      // Hard redirect to login with page reload
      window.location.href = '/login'
      throw error
    }
  }
  
  const registerClient = async (userData) => {
    try {
      const result = await registerClientMutation.mutateAsync(userData)
      isAuthenticated.value = true
      currentUser.value = result.user
      return result
    } catch (error) {
      throw error
    }
  }
  
  const registerVeterinarian = async (userData) => {
    try {
      const result = await registerVeterinarianMutation.mutateAsync(userData)
      isAuthenticated.value = true
      currentUser.value = result.user
      return result
    } catch (error) {
      throw error
    }
  }
  
  const checkAuth = () => {
    const authenticated = AuthService.isAuthenticated()
    const userData = AuthService.getCurrentUser()
    
    // Update state synchronously
    isAuthenticated.value = authenticated
    currentUser.value = userData
    
    return authenticated
  }
  
  // Initialize authentication state immediately
  const initAuth = () => {
    checkAuth()
  }
  
  const requireAuth = (redirectTo = '/login') => {
    if (!isAuthenticated.value) {
      router.push(redirectTo)
      return false
    }
    return true
  }
  
  const requireRole = (requiredRole, redirectTo = '/') => {
    if (!isAuthenticated.value || userType.value !== requiredRole) {
      router.push(redirectTo)
      return false
    }
    return true
  }
  
  return {
    // State
    isAuthenticated,
    currentUser,
    user,
    userType,
    isClient,
    isVeterinarian,
    isLoading,
    
    // Profile data
    profile,
    profileLoading,
    profileError,
    
    // Methods
    login,
    logout,
    registerClient,
    registerVeterinarian,
    checkAuth,
    initAuth,
    requireAuth,
    requireRole,
    
    // Mutation states for fine-grained loading states
    loginState: {
      isLoading: loginMutation.isPending,
      error: loginMutation.error,
      isSuccess: loginMutation.isSuccess
    },
    logoutState: {
      isLoading: logoutMutation.isPending,
      error: logoutMutation.error,
      isSuccess: logoutMutation.isSuccess
    },
    registerClientState: {
      isLoading: registerClientMutation.isPending,
      error: registerClientMutation.error,
      isSuccess: registerClientMutation.isSuccess
    },
    registerVeterinarianState: {
      isLoading: registerVeterinarianMutation.isPending,
      error: registerVeterinarianMutation.error,
      isSuccess: registerVeterinarianMutation.isSuccess
    }
  }
}
