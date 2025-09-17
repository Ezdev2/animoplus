/**
 * Token Management Service
 * Handles storage, retrieval, and validation of authentication tokens
 */

const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data'
}

export class TokenService {
  /**
   * Store authentication tokens
   * @param {string} accessToken - JWT access token
   * @param {string} refreshToken - JWT refresh token
   * @param {Object} userData - User data object
   */
  static setTokens(accessToken, refreshToken, userData = null) {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, refreshToken)
    
    if (userData) {
      localStorage.setItem(TOKEN_KEYS.USER_DATA, JSON.stringify(userData))
    }
  }

  /**
   * Get access token
   * @returns {string|null} Access token or null if not found
   */
  static getAccessToken() {
    return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN)
  }

  /**
   * Get refresh token
   * @returns {string|null} Refresh token or null if not found
   */
  static getRefreshToken() {
    return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN)
  }

  /**
   * Get stored user data
   * @returns {Object|null} User data object or null if not found
   */
  static getUserData() {
    const userData = localStorage.getItem(TOKEN_KEYS.USER_DATA)
    return userData ? JSON.parse(userData) : null
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} True if access token exists
   */
  static isAuthenticated() {
    return !!this.getAccessToken()
  }

  /**
   * Check if token is expired (basic check)
   * @param {string} token - JWT token to check
   * @returns {boolean} True if token appears expired
   */
  static isTokenExpired(token) {
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      return true
    }
  }

  /**
   * Clear all authentication data
   */
  static clearTokens() {
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(TOKEN_KEYS.USER_DATA)
  }

  /**
   * Get authorization header for API requests
   * @returns {Object|null} Authorization header object or null
   */
  static getAuthHeader() {
    const token = this.getAccessToken()
    return token ? { Authorization: `Bearer ${token}` } : null
  }

  /**
   * Check if refresh token is available and valid
   * @returns {boolean} True if refresh token exists and appears valid
   */
  static canRefreshToken() {
    const refreshToken = this.getRefreshToken()
    return refreshToken && !this.isTokenExpired(refreshToken)
  }
}
