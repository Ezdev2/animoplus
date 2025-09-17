import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { AuthService } from './authService.js'

/**
 * TanStack Query hooks for authentication
 * Provides caching, loading states, and error handling
 */

// Query keys for consistent caching
export const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'],
  user: ['auth', 'user']
}

/**
 * Get current user profile query
 * @returns {Object} Query object with data, loading, error states
 */
export function useProfile() {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: AuthService.getProfile,
    enabled: AuthService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 errors
      if (error.response?.status === 401) return false
      return failureCount < 3
    }
  })
}

/**
 * Login mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile })
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })
}

/**
 * Register client mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useRegisterClient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: AuthService.registerClient,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile })
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user)
    },
    onError: (error) => {
      console.error('Client registration failed:', error)
    }
  })
}

/**
 * Register veterinarian mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useRegisterVeterinarian() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: AuthService.registerVeterinarian,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile })
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user)
    },
    onError: (error) => {
      console.error('Veterinarian registration failed:', error)
    }
  })
}

/**
 * Logout mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useLogout() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear()
    },
    onError: (error) => {
      console.error('Logout failed:', error)
      // Still clear cache even if logout fails
      queryClient.clear()
    }
  })
}

/**
 * Update profile mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: AuthService.updateProfile,
    onSuccess: (data) => {
      // Update cached profile data
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user)
    },
    onError: (error) => {
      console.error('Profile update failed:', error)
    }
  })
}

/**
 * Forgot password mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: AuthService.forgotPassword,
    onError: (error) => {
      console.error('Forgot password failed:', error)
    }
  })
}

/**
 * Reset password mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: AuthService.resetPassword,
    onError: (error) => {
      console.error('Reset password failed:', error)
    }
  })
}

/**
 * Change password mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: AuthService.changePassword,
    onError: (error) => {
      console.error('Change password failed:', error)
    }
  })
}

/**
 * Verify email mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useVerifyEmail() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: AuthService.verifyEmail,
    onSuccess: () => {
      // Refetch profile to get updated verification status
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile })
    },
    onError: (error) => {
      console.error('Email verification failed:', error)
    }
  })
}

/**
 * Resend verification mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useResendVerification() {
  return useMutation({
    mutationFn: AuthService.resendVerification,
    onError: (error) => {
      console.error('Resend verification failed:', error)
    }
  })
}

/**
 * Refresh token mutation
 * @returns {Object} Mutation object with mutate function and states
 */
export function useRefreshToken() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: AuthService.refreshToken,
    onSuccess: (data) => {
      // Update cached user data
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data.user)
    },
    onError: (error) => {
      console.error('Token refresh failed:', error)
      // Clear cache and redirect to login
      queryClient.clear()
    }
  })
}
