/**
 * Authentication Services Index
 * Centralized exports for all authentication-related services
 */

// Core services
export { AuthService } from './authService.js'
export { TokenService } from './tokenService.js'

// TanStack Query hooks
export {
  useProfile,
  useLogin,
  useLogout,
  useRegisterClient,
  useRegisterVeterinarian,
  useUpdateProfile,
  useForgotPassword,
  useResetPassword,
  useChangePassword,
  useVerifyEmail,
  useResendVerification,
  useRefreshToken,
  AUTH_QUERY_KEYS
} from './authQueries.js'

// Vue composable
export { useAuth } from './useAuth.js'
