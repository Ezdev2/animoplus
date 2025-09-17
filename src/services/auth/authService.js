import { apiClient } from '../api/config.js'
import { TokenService } from './tokenService.js'

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
export class AuthService {
  /**
   * Register a new client
   * @param {Object} userData - Registration data
   * @param {string} userData.name - Full name
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} userData.password_confirmation - Password confirmation
   * @param {string} userData.phone - Phone number
   * @returns {Promise<Object>} Registration response
   */
  static async registerClient(userData) {
    const response = await apiClient.post('/api/auth/register', {
      ...userData,
      user_type: 'client'
    })
    
    if (response.data.access_token) {
      TokenService.setTokens(
        response.data.access_token,
        response.data.refresh_token,
        response.data.user
      )
    }
    
    return response.data
  }

  /**
   * Register a new veterinarian
   * @param {Object} userData - Registration data
   * @param {string} userData.name - Full name
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} userData.password_confirmation - Password confirmation
   * @param {string} userData.license_number - Veterinary license number
   * @param {string} userData.clinic_name - Clinic name
   * @param {string} userData.clinic_address - Clinic address
   * @param {string} userData.phone - Phone number
   * @returns {Promise<Object>} Registration response
   */
  static async registerVeterinarian(userData) {
    const response = await apiClient.post('/api/auth/register', {
      ...userData,
      user_type: 'veterinarian'
    })
    
    if (response.data.access_token) {
      TokenService.setTokens(
        response.data.access_token,
        response.data.refresh_token,
        response.data.user
      )
    }
    
    return response.data
  }

  /**
   * Login user (client or veterinarian)
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - Email address
   * @param {string} credentials.password - Password
   * @returns {Promise<Object>} Login response
   */
  static async login(credentials) {
    const response = await apiClient.post('/api/auth/login', credentials)
    
    if (response.data.access_token) {
      TokenService.setTokens(
        response.data.access_token,
        response.data.refresh_token,
        response.data.user
      )
    }
    
    return response.data
  }

  /**
   * Logout current user
   * @returns {Promise<Object>} Logout response
   */
  static async logout() {
    try {
      const response = await apiClient.post('/api/auth/logout')
      return response.data
    } finally {
      // Always clear tokens, even if API call fails
      TokenService.clearTokens()
    }
  }

  /**
   * Refresh access token
   * @returns {Promise<Object>} Refresh response
   */
  static async refreshToken() {
    const refreshToken = TokenService.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post('/api/auth/refresh', {
      refresh_token: refreshToken
    })
    
    if (response.data.access_token) {
      TokenService.setTokens(
        response.data.access_token,
        response.data.refresh_token,
        response.data.user
      )
    }
    
    return response.data
  }

  /**
   * Get current user profile
   * @returns {Promise<Object>} User profile data
   */
  static async getProfile() {
    const response = await apiClient.get('/api/auth/me')
    return response.data
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile update data
   * @returns {Promise<Object>} Updated profile data
   */
  static async updateProfile(profileData) {
    const response = await apiClient.put('/api/auth/profile', profileData)
    
    // Update stored user data
    if (response.data.user) {
      const currentTokens = {
        access: TokenService.getAccessToken(),
        refresh: TokenService.getRefreshToken()
      }
      
      if (currentTokens.access && currentTokens.refresh) {
        TokenService.setTokens(
          currentTokens.access,
          currentTokens.refresh,
          response.data.user
        )
      }
    }
    
    return response.data
  }

  /**
   * Send password reset email
   * @param {string} email - Email address
   * @returns {Promise<Object>} Reset response
   */
  static async forgotPassword(email) {
    const response = await apiClient.post('/api/auth/forgot-password', { email })
    return response.data
  }

  /**
   * Reset password with token
   * @param {Object} resetData - Reset data
   * @param {string} resetData.token - Reset token
   * @param {string} resetData.email - Email address
   * @param {string} resetData.password - New password
   * @param {string} resetData.password_confirmation - Password confirmation
   * @returns {Promise<Object>} Reset response
   */
  static async resetPassword(resetData) {
    const response = await apiClient.post('/api/auth/reset-password', resetData)
    return response.data
  }

  /**
   * Change password (authenticated user)
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.current_password - Current password
   * @param {string} passwordData.password - New password
   * @param {string} passwordData.password_confirmation - Password confirmation
   * @returns {Promise<Object>} Change response
   */
  static async changePassword(passwordData) {
    const response = await apiClient.post('/api/auth/change-password', passwordData)
    return response.data
  }

  /**
   * Verify email address
   * @param {Object} verificationData - Verification data
   * @param {string} verificationData.token - Verification token
   * @param {string} verificationData.email - Email address
   * @returns {Promise<Object>} Verification response
   */
  static async verifyEmail(verificationData) {
    const response = await apiClient.post('/api/auth/verify-email', verificationData)
    return response.data
  }

  /**
   * Resend email verification
   * @returns {Promise<Object>} Resend response
   */
  static async resendVerification() {
    const response = await apiClient.post('/api/auth/resend-verification')
    return response.data
  }

  /**
   * Check if current user is authenticated
   * @returns {boolean} Authentication status
   */
  static isAuthenticated() {
    return TokenService.isAuthenticated()
  }

  /**
   * Get current user data from storage
   * @returns {Object|null} User data or null
   */
  static getCurrentUser() {
    return TokenService.getUserData()
  }
}
