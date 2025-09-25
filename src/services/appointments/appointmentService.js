import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion des rendez-vous (appointments)
 * Basé sur la collection Postman Appointments_Collection
 */
export const appointmentService = {
  /**
   * Récupérer tous les rendez-vous avec pagination et filtres
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAllAppointments(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres
      if (options.status) params.append('status', options.status)
      if (options.date) params.append('date', options.date)
      if (options.client_id) params.append('client_id', options.client_id)
      if (options.service_id) params.append('service_id', options.service_id)
      if (options.animal_type) params.append('animal_type', options.animal_type)
      
      // Relations
      if (options.with_relations) params.append('with_relations', 'true')
      if (options.with_client) params.append('with_client', 'true')
      if (options.with_service) params.append('with_service', 'true')
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.APPOINTMENTS.LIST}?${queryString}` : API_ENDPOINTS.APPOINTMENTS.LIST
      
      console.log('🔍 Récupération des rendez-vous:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null
      }
    } catch (error) {
      console.error('❌ Erreur récupération rendez-vous:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des rendez-vous'
      }
    }
  },

  /**
   * Récupérer un rendez-vous par son ID
   * @param {string} id - ID du rendez-vous
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAppointmentById(id, options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Relations
      if (options.with_relations) params.append('with_relations', 'true')
      if (options.with_client) params.append('with_client', 'true')
      if (options.with_service) params.append('with_service', 'true')
      if (options.with_files) params.append('with_files', 'true')
      
      const queryString = params.toString()
      const url = queryString ? `/appointments/${id}?${queryString}` : `/appointments/${id}`
      
      console.log('🔍 Récupération du rendez-vous:', id)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur récupération rendez-vous:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération du rendez-vous'
      }
    }
  },

  /**
   * @param {Object} appointmentData - Données du rendez-vous
   * @returns {Promise<Object>} Réponse de l'API
   */
  async createAppointment(appointmentData) {
    try {
      // Validation des champs requis
      const requiredFields = ['date', 'start_time', 'end_time', 'service_id', 'client_id']
      for (const field of requiredFields) {
        if (!appointmentData[field]) {
          throw new Error(`Le champ ${field} est requis`)
        }
      }

      // Préparer les données pour l'API (payload avec animal_id)
      const data = {
        date: appointmentData.date,
        start_time: appointmentData.start_time,
        end_time: appointmentData.end_time,
        service_id: appointmentData.service_id,
        client_id: appointmentData.client_id,
        animal_id: appointmentData.animal_id || null, // Ajout de animal_id
        location_type: appointmentData.location_type || 'physical',
        address: appointmentData.address || null,
        online_meeting_url: appointmentData.online_meeting_url || null,
        notes: appointmentData.notes || null,
        emergency: appointmentData.emergency || false,
        status: appointmentData.status || 'pending'
      }

      console.log('📝 Création du rendez-vous:', data)
      const response = await apiClient.post(API_ENDPOINTS.APPOINTMENTS.CREATE, data)
      
      console.log('✅ Réponse API création:', response.data)
      
      // La réponse a la structure: { success: true, message: "...", data: {...} }
      return {
        success: response.data.success || true,
        message: response.data.message || 'Rendez-vous créé avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur création rendez-vous:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la création du rendez-vous'
      }
    }
  },

  /**
   * Mettre à jour un rendez-vous
   * @param {string} id - ID du rendez-vous
   * @param {Object} appointmentData - Nouvelles données du rendez-vous
   * @returns {Promise<Object>} Réponse de l'API
   */
  async updateAppointment(id, appointmentData) {
    try {
      // Préparer les données pour l'API (seulement les champs modifiables)
      const data = {}
      
      if (appointmentData.date !== undefined) data.date = appointmentData.date
      if (appointmentData.start_time !== undefined) data.start_time = appointmentData.start_time
      if (appointmentData.end_time !== undefined) data.end_time = appointmentData.end_time
      if (appointmentData.service_id !== undefined) data.service_id = appointmentData.service_id
      if (appointmentData.animal_id !== undefined) data.animal_id = appointmentData.animal_id
      if (appointmentData.message !== undefined) data.message = appointmentData.message
      if (appointmentData.location_type !== undefined) data.location_type = appointmentData.location_type
      if (appointmentData.address !== undefined) data.address = appointmentData.address
      if (appointmentData.online_meeting_url !== undefined) data.online_meeting_url = appointmentData.online_meeting_url
      if (appointmentData.notes !== undefined) data.notes = appointmentData.notes
      if (appointmentData.emergency !== undefined) data.emergency = appointmentData.emergency
      if (appointmentData.status !== undefined) data.status = appointmentData.status

      console.log('✏️ Mise à jour du rendez-vous:', id, data)
      const response = await apiClient.put(`/appointments/${id}`, data)
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour rendez-vous:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la mise à jour du rendez-vous'
      }
    }
  },

  /**
   * Supprimer un rendez-vous
   * @param {string} id - ID du rendez-vous
   * @returns {Promise<Object>} Réponse de l'API
   */
  async deleteAppointment(id) {
    try {
      console.log('🗑️ Suppression du rendez-vous:', id)
      const response = await apiClient.delete(`/appointments/${id}`)
      
      console.log('✅ Réponse API suppression:', response.data)
      
      // La réponse a la structure: { success: true, message: "...", data: {...} }
      return {
        success: response.data.success || true,
        message: response.data.message || 'Rendez-vous supprimé avec succès',
        data: response.data.data || { id }
      }
    } catch (error) {
      console.error('❌ Erreur suppression rendez-vous:', error)
      throw {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression du rendez-vous'
      }
    }
  },

  /**
   * Changer le statut d'un rendez-vous
   * @param {string} id - ID du rendez-vous
   * @param {string} status - Nouveau statut (pending, confirmed, cancelled, completed)
   * @returns {Promise<Object>} Réponse de l'API
   */
  async updateAppointmentStatus(id, status) {
    try {
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show']
      if (!validStatuses.includes(status)) {
        throw new Error(`Statut invalide: ${status}. Statuts valides: ${validStatuses.join(', ')}`)
      }

      console.log('🔄 Changement de statut du rendez-vous:', id, '→', status)
      const response = await apiClient.patch(`/appointments/${id}/status`, { status })
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur changement de statut:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors du changement de statut'
      }
    }
  },

  /**
   * Confirmer un rendez-vous
   * @param {string} id - ID du rendez-vous
   * @returns {Promise<Object>} Réponse de l'API
   */
  async confirmAppointment(id) {
    return this.updateAppointmentStatus(id, 'confirmed')
  },

  /**
   * Annuler un rendez-vous
   * @param {string} id - ID du rendez-vous
   * @param {string} reason - Raison de l'annulation (optionnel)
   * @returns {Promise<Object>} Réponse de l'API
   */
  async cancelAppointment(id, reason = null) {
    try {
      const data = { status: 'cancelled' }
      if (reason) data.cancellation_reason = reason

      console.log('❌ Annulation du rendez-vous:', id, reason ? `(${reason})` : '')
      const response = await apiClient.patch(`/appointments/${id}/cancel`, data)
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur annulation rendez-vous:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'annulation du rendez-vous'
      }
    }
  },

  /**
   * Marquer un rendez-vous comme terminé
   * @param {string} id - ID du rendez-vous
   * @returns {Promise<Object>} Réponse de l'API
   */
  async completeAppointment(id) {
    return this.updateAppointmentStatus(id, 'completed')
  },

  /**
   * Récupérer les rendez-vous d'un client
   * @param {string} clientId - ID du client
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getClientAppointments(clientId, options = {}) {
    return this.getAllAppointments({
      ...options,
      client_id: clientId,
      with_service: true
    })
  },

  /**
   * Récupérer les rendez-vous d'un professionnel
   * @param {string} professionalId - ID du professionnel
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getProfessionalAppointments(professionalId, options = {}) {
    return this.getAllAppointments({
      ...options,
      professional_id: professionalId,
      with_client: true,
      with_service: true
    })
  },

  /**
   * Récupérer les créneaux disponibles pour un service
   * @param {string} serviceId - ID du service
   * @param {string} date - Date au format YYYY-MM-DD
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAvailableSlots(serviceId, date) {
    try {
      console.log('📅 Récupération des créneaux disponibles:', serviceId, date)
      const response = await apiClient.get(`/appointments/available-slots`, {
        params: { service_id: serviceId, date }
      })
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur récupération créneaux:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des créneaux'
      }
    }
  },

  /**
   * Récupérer les statistiques des rendez-vous
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAppointmentStats(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.period) params.append('period', options.period) // day, week, month, year
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      if (options.professional_id) params.append('professional_id', options.professional_id)
      
      const queryString = params.toString()
      const url = queryString ? `/appointments/stats?${queryString}` : '/appointments/stats'
      
      console.log('📊 Récupération des statistiques:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques'
      }
    }
  }
}

export default appointmentService
