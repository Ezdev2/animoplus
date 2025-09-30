import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion des spécialités utilisateur
 * Basé sur la collection Postman User_Specialites_Collection
 */
export const userSpecialitiesService = {
  
  /**
   * Récupérer mes spécialités
   * GET /user/specialties
   */
  async getMySpecialities(options = {}) {
    try {
      console.log('📋 Récupération de mes spécialités:', options)
      
      // Construction des paramètres de requête
      const queryParams = new URLSearchParams()
      
      // Paramètres de pagination
      if (options.page) queryParams.append('page', options.page)
      if (options.per_page) queryParams.append('per_page', options.per_page)
      
      // Paramètres de filtrage
      if (options.search) queryParams.append('search', options.search)
      if (options.certification_level) queryParams.append('certification_level', options.certification_level)
      if (options.is_primary !== undefined) queryParams.append('is_primary', options.is_primary)
      
      // Paramètres de tri
      if (options.sort_by) queryParams.append('sort_by', options.sort_by)
      if (options.sort_order) queryParams.append('sort_order', options.sort_order)
      
      // Paramètres d'inclusion
      if (options.with_specialty) queryParams.append('with_specialty', 'true')
      
      const url = `${API_ENDPOINTS.USER_SPECIALITES.LIST}?${queryParams.toString()}`
      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API mes spécialités:', response.data)
      
      // Extraire les données selon le format de réponse
      let specialitiesData = []
      if (response.data.data) {
        specialitiesData = response.data.data
      } else if (response.data.specialties) {
        specialitiesData = response.data.specialties
      } else if (response.data.services) {
        specialitiesData = response.data.services
      } else if (Array.isArray(response.data)) {
        specialitiesData = response.data
      }
      
      console.log('📋 Données spécialités extraites:', specialitiesData)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Spécialités récupérées avec succès',
        data: specialitiesData,
        pagination: response.data.pagination || null
      }
    } catch (error) {
      console.error('❌ Erreur récupération mes spécialités:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des spécialités'
      }
    }
  },

  /**
   * Ajouter une spécialité à l'utilisateur
   * POST /user/specialties
   */
  async addSpeciality(specialityData) {

    console.log('➕ Ajout d\'une spécialité: COTE SOTE', specialityData)
    try {
      
      // Validation des données requises
      console.log('Validation des données de la spécialité: COTE SOTE', specialityData.specialite_id)
      if (!specialityData.specialite_id) {
        throw new Error('L\'ID de la spécialité est requis')
      }
      
      const response = await apiClient.post(API_ENDPOINTS.USER_SPECIALITES.CREATE, specialityData)
      console.log('✅ Réponse API ajout spécialité:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Spécialité ajoutée avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur ajout spécialité:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'ajout de la spécialité'
      }
    }
  },

  /**
   * Modifier une spécialité utilisateur
   * PUT /user/specialties/{id}
   */
  async updateSpeciality(id, specialityData) {
    try {
      console.log('✏️ Modification spécialité utilisateur:', id, specialityData)
      
      const response = await apiClient.put(API_ENDPOINTS.USER_SPECIALITES.UPDATE(id), specialityData)
      console.log('✅ Réponse API modification spécialité:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Spécialité modifiée avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur modification spécialité:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la modification de la spécialité'
      }
    }
  },

  /**
   * Supprimer une spécialité utilisateur
   * DELETE /user/specialties/{id}
   */
  async removeSpeciality(id) {
    try {
      console.log('🗑️ Suppression spécialité utilisateur:', id)
      
      const response = await apiClient.delete(API_ENDPOINTS.USER_SPECIALITES.DELETE(id))
      console.log('✅ Réponse API suppression spécialité:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Spécialité supprimée avec succès',
        data: response.data.data || { id }
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
   * Récupérer une spécialité utilisateur par ID
   * GET /user/specialties/{id}
   */
  async getSpecialityById(id, options = {}) {
    try {
      console.log('🔍 Récupération spécialité utilisateur par ID:', id, options)
      
      // Construction des paramètres de requête
      const queryParams = new URLSearchParams()
      
      // Paramètres d'inclusion
      if (options.with_specialty) queryParams.append('with_specialty', 'true')
      
      const url = `${API_ENDPOINTS.USER_SPECIALITES.DETAIL(id)}?${queryParams.toString()}`
      const response = await apiClient.get(url)
      
      console.log('✅ Réponse API spécialité par ID:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Spécialité récupérée avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur récupération spécialité par ID:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération de la spécialité'
      }
    }
  },

  /**
   * Définir une spécialité comme principale
   * PUT /user/specialties/{id} avec is_primary: true
   */
  async setPrimarySpeciality(id) {
    try {
      console.log('⭐ Définition spécialité principale:', id)
      
      const response = await apiClient.put(API_ENDPOINTS.USER_SPECIALITES.UPDATE(id), {
        is_primary: true
      })
      
      console.log('✅ Réponse API spécialité principale:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Spécialité définie comme principale',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur définition spécialité principale:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la définition de la spécialité principale'
      }
    }
  },

  /**
   * Valider les données d'une spécialité utilisateur
   */
  validateSpecialityData(data) {
    const errors = {}

    console.log('Validation des données de la spécialité:', data)
    
    // Validation specialite_id (requis pour ajout)
    if (!data.specialite_id) {
      console.log('La spécialité est requise COTE SOTE')
      errors.specialite_id = 'La spécialité est requise'
    }
    
    // Validation certification_level (optionnel mais doit être valide)
    const validCertificationLevels = ['junior', 'senior', 'expert']
    if (data.certification_level && !validCertificationLevels.includes(data.certification_level)) {
      console.log('Le niveau de certification est invalide COTE SOTE')
      errors.certification_level = 'Niveau de certification invalide'
    }
    
    // Validation is_primary (doit être boolean)
    if (data.is_primary !== undefined && typeof data.is_primary !== 'boolean') {
      console.log('Le statut principal est invalide COTE SOTE')
      errors.is_primary = 'Le statut principal doit être un booléen'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  /**
   * Formater les données pour l'affichage
   */
  formatSpecialityForDisplay(speciality) {
    return {
      id: speciality.id,
      name: speciality.specialty?.name || speciality.name,
      description: speciality.specialty?.description || speciality.description,
      certificationLevel: speciality.certification_level,
      certificationLevelLabel: this.getCertificationLevelLabel(speciality.certification_level),
      isPrimary: speciality.is_primary,
      isPrimaryLabel: speciality.is_primary ? 'Principale' : 'Secondaire',
      specialty: speciality.specialty || null
    }
  },

  /**
   * Obtenir le label du niveau de certification
   */
  getCertificationLevelLabel(level) {
    const labels = {
      'junior': 'Junior',
      'senior': 'Senior',
      'expert': 'Expert'
    }
    return labels[level] || level
  },

  /**
   * Obtenir la couleur du niveau de certification
   */
  getCertificationLevelColor(level) {
    const colors = {
      'junior': '#10B981',       // green-500
      'senior': '#3B82F6',       // blue-500
      'expert': '#F59E0B'        // amber-500
    }
    return colors[level] || '#6B7280' // gray-500
  },

  /**
   * Obtenir l'icône du niveau de certification
   */
  getCertificationLevelIcon(level) {
    const icons = {
      'junior': '🌱',
      'senior': '🎯',
      'expert': '⭐'
    }
    return icons[level] || '📋'
  }
}
