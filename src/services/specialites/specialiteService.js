import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion des spécialités vétérinaires
 * Basé sur la collection Postman Specialites_Collection
 */
export const specialiteService = {
  /**
   * Récupérer toutes les spécialités avec pagination et filtres
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAllSpecialites(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres
      if (options.search) params.append('search', options.search)
      if (options.is_active !== undefined) params.append('is_active', options.is_active)
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.SPECIALITES.LIST}?${queryString}` : API_ENDPOINTS.SPECIALITES.LIST
      
      console.log('🔍 Récupération des spécialités:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API spécialités:', response.data)
      
      // Gérer la structure de réponse API
      let specialitesData = []
      let paginationData = {}
      
      if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        // Structure: { success: true, data: { data: [...], current_page: 1, ... } }
        specialitesData = response.data.data.data
        paginationData = response.data.data
      } else if (response.data && Array.isArray(response.data.data)) {
        // Structure: { success: true, data: [...] }
        specialitesData = response.data.data
      } else if (response.data && Array.isArray(response.data)) {
        // Structure directe: [...]
        specialitesData = response.data
      }
      
      console.log('✅ Spécialités extraites:', specialitesData.length)
      
      return {
        success: true,
        data: specialitesData,
        pagination: {
          current_page: paginationData.current_page || 1,
          last_page: paginationData.last_page || 1,
          per_page: paginationData.per_page || 15,
          total: paginationData.total || specialitesData.length,
          from: paginationData.from || 1,
          to: paginationData.to || specialitesData.length
        },
        message: response.data.message || 'Spécialités récupérées avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des spécialités:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des spécialités'
      }
    }
  },

  /**
   * Récupérer une spécialité par son ID
   * @param {string} specialiteId - ID de la spécialité
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getSpecialiteById(specialiteId) {
    try {
      console.log('🔍 Récupération spécialité par ID:', specialiteId)
      
      const response = await apiClient.get(API_ENDPOINTS.SPECIALITES.DETAIL(specialiteId))
      
      console.log('✅ Réponse API spécialité:', response.data)
      
      return {
        success: response.data.success || true,
        data: response.data.data || response.data,
        message: response.data.message || 'Spécialité récupérée avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la spécialité:', error)
      return {
        success: false,
        data: null,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération de la spécialité'
      }
    }
  },

  /**
   * Créer une nouvelle spécialité
   * @param {Object} specialiteData - Données de la spécialité
   * @returns {Promise<Object>} Réponse API avec spécialité créée
   */
  async createSpecialite(specialiteData) {
    try {
      // Validation des champs requis
      const requiredFields = ['name']
      for (const field of requiredFields) {
        if (!specialiteData[field]) {
          throw new Error(`Le champ ${field} est requis`)
        }
      }

      // Préparer les données pour l'API
      const data = {
        name: specialiteData.name,
        description: specialiteData.description || null,
        is_active: specialiteData.is_active !== undefined ? specialiteData.is_active : true
      }

      console.log('📝 Création de la spécialité:', data)
      const response = await apiClient.post(API_ENDPOINTS.SPECIALITES.CREATE, data)
      
      console.log('✅ Réponse API création:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Spécialité créée avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur création spécialité:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la création de la spécialité'
      }
    }
  },

  /**
   * Mettre à jour une spécialité
   * @param {string} specialiteId - ID de la spécialité
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Promise<Object>} Réponse API avec spécialité mise à jour
   */
  async updateSpecialite(specialiteId, updateData) {
    try {
      console.log('✏️ Mise à jour partielle de la spécialité (PATCH):', specialiteId, updateData)
      
      // Utilisation de PATCH pour mise à jour partielle
      const response = await apiClient.patch(API_ENDPOINTS.SPECIALITES.UPDATE(specialiteId), updateData)
      
      console.log('✅ Réponse API modification PATCH:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Spécialité mise à jour avec succès',
        data: response.data.data || response.data
      }
      
    } catch (error) {
      console.error('❌ Erreur modification spécialité PATCH:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la mise à jour de la spécialité'
      }
    }
  },

  /**
   * Supprimer une spécialité
   * @param {string} specialiteId - ID de la spécialité
   * @returns {Promise<Object>} Réponse API de suppression
   */
  async deleteSpecialite(specialiteId) {
    try {
      console.log('🗑️ Suppression de la spécialité:', specialiteId)
      
      const response = await apiClient.delete(API_ENDPOINTS.SPECIALITES.DELETE(specialiteId))
      
      console.log('✅ Réponse API suppression:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Spécialité supprimée avec succès',
        data: response.data.data || { id: specialiteId }
      }
      
    } catch (error) {
      console.error('❌ Erreur suppression spécialité:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression de la spécialité'
      }
    }
  },

  /**
   * Rechercher des spécialités
   * @param {string} searchTerm - Terme de recherche
   * @param {Object} options - Options de recherche
   * @returns {Promise<Object>} Réponse API avec résultats de recherche
   */
  async searchSpecialites(searchTerm, options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (searchTerm) params.append('search', searchTerm)
      if (options.is_active !== undefined) params.append('is_active', options.is_active)
      if (options.per_page) params.append('per_page', options.per_page)
      if (options.page) params.append('page', options.page)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.SPECIALITES.SEARCH}?${queryString}` : API_ENDPOINTS.SPECIALITES.SEARCH
      
      console.log('🔍 Recherche de spécialités:', url)
      const response = await apiClient.get(url)
      
      // Utiliser la même logique d'extraction que getAllSpecialites
      let specialitesData = []
      let paginationData = {}
      
      if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        specialitesData = response.data.data.data
        paginationData = response.data.data
      } else if (response.data && Array.isArray(response.data.data)) {
        specialitesData = response.data.data
      } else if (response.data && Array.isArray(response.data)) {
        specialitesData = response.data
      }
      
      return {
        success: true,
        data: specialitesData,
        pagination: {
          current_page: paginationData.current_page || 1,
          last_page: paginationData.last_page || 1,
          per_page: paginationData.per_page || 15,
          total: paginationData.total || specialitesData.length,
          from: paginationData.from || 1,
          to: paginationData.to || specialitesData.length
        },
        message: response.data.message || 'Recherche effectuée avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la recherche de spécialités:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || error.message || 'Erreur lors de la recherche'
      }
    }
  },

  /**
   * Basculer le statut actif/inactif d'une spécialité
   * @param {string} specialiteId - ID de la spécialité
   * @returns {Promise<Object>} Réponse API avec spécialité mise à jour
   */
  async toggleSpecialiteStatus(specialiteId) {
    try {
      console.log('🔄 Basculement du statut de la spécialité:', specialiteId)
      
      const response = await apiClient.patch(API_ENDPOINTS.SPECIALITES.TOGGLE_STATUS(specialiteId))
      
      console.log('✅ Statut basculé avec succès:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Statut de la spécialité modifié avec succès',
        data: response.data.data || response.data
      }
      
    } catch (error) {
      console.error('❌ Erreur lors du basculement du statut:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du changement de statut'
      }
    }
  },

  /**
   * Récupérer les vétérinaires d'une spécialité
   * @param {string} specialiteId - ID de la spécialité
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse API avec liste des vétérinaires
   */
  async getSpecialiteVeterinarians(specialiteId, options = {}) {
    try {
      console.log('👨‍⚕️ Récupération des vétérinaires pour la spécialité:', specialiteId, options)
      
      const params = new URLSearchParams()
      
      // Filtres
      if (options.active_only !== undefined) params.append('active_only', options.active_only)
      if (options.search) params.append('search', options.search)
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      // Inclusions
      if (options.with_profile) params.append('with_profile', 'true')
      if (options.with_user) params.append('with_user', 'true')
      
      const queryString = params.toString()
      const url = queryString ? 
        `${API_ENDPOINTS.SPECIALITES.VETERINARIANS(specialiteId)}?${queryString}` : 
        API_ENDPOINTS.SPECIALITES.VETERINARIANS(specialiteId)
      
      console.log('🔍 URL récupération vétérinaires:', url)
      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API vétérinaires spécialité:', response.data)
      
      // Extraire les données selon le format de réponse
      let veterinariansData = []
      let paginationData = {}
      
      if (response.data && response.data.data && Array.isArray(response.data.data.veterinarians)) {
        // Structure: { success: true, data: { veterinarians: [...], pagination: {...} } }
        veterinariansData = response.data.data.veterinarians
        paginationData = response.data.data.pagination || {}
      } else if (response.data && Array.isArray(response.data.veterinarians)) {
        // Structure: { success: true, veterinarians: [...] }
        veterinariansData = response.data.veterinarians
        paginationData = response.data.pagination || {}
      } else if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
        // Structure: { success: true, data: { data: [...], current_page: 1, ... } }
        veterinariansData = response.data.data.data
        paginationData = response.data.data
      } else if (response.data && Array.isArray(response.data.data)) {
        // Structure: { success: true, data: [...] }
        veterinariansData = response.data.data
      } else if (response.data && Array.isArray(response.data)) {
        // Structure directe: [...]
        veterinariansData = response.data
      }
      
      console.log('✅ Vétérinaires extraits:', veterinariansData.length)
      
      return {
        success: true,
        data: veterinariansData,
        pagination: {
          current_page: paginationData.current_page || 1,
          last_page: paginationData.last_page || 1,
          per_page: paginationData.per_page || 15,
          total: paginationData.total || veterinariansData.length,
          from: paginationData.from || 1,
          to: paginationData.to || veterinariansData.length
        },
        message: response.data.message || 'Vétérinaires récupérés avec succès'
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des vétérinaires:', error)
      return {
        success: false,
        data: [],
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des vétérinaires'
      }
    }
  }
}

export default specialiteService
