import { apiClient } from '@/services/api/config.js'
import { API_ENDPOINTS } from '@/services/api/endpoints.js'

/**
 * Service pour la gestion des tâches (tasks)
 * Basé sur la collection Postman Tasks_Collection
 */
export const taskService = {
  /**
   * Récupérer toutes les tâches avec pagination et filtres
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAllTasks(options = {}) {
    try {
      const params = new URLSearchParams()
      
      // Pagination
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      // Filtres
      if (options.search) params.append('search', options.search)
      if (options.priority) params.append('priority', options.priority)
      if (options.completed !== undefined) params.append('completed', options.completed)
      if (options.due_before) params.append('due_before', options.due_before)
      if (options.assigned_to) params.append('assigned_to', options.assigned_to)
      
      // Tri
      if (options.sort_by) params.append('sort_by', options.sort_by)
      if (options.sort_order) params.append('sort_order', options.sort_order)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.TASKS.LIST}?${queryString}` : API_ENDPOINTS.TASKS.LIST
      
      console.log('🔍 Récupération des tâches:', url)
      const response = await apiClient.get(url)
      
      // La réponse API a cette structure : { success: true, data: { current_page, data: [...], ... } }
      const apiResponse = response.data
      
      return {
        success: true,
        data: apiResponse.data?.data || apiResponse.data || [],
        pagination: {
          current_page: apiResponse.data?.current_page || 1,
          last_page: apiResponse.data?.last_page || 1,
          per_page: apiResponse.data?.per_page || 15,
          total: apiResponse.data?.total || 0,
          from: apiResponse.data?.from || 0,
          to: apiResponse.data?.to || 0
        },
        message: apiResponse.message || 'Tâches récupérées'
      }
    } catch (error) {
      console.error('❌ Erreur récupération tâches:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des tâches'
      }
    }
  },

  /**
   * Récupérer une tâche par son ID
   * @param {string} id - ID de la tâche
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getTaskById(id) {
    try {
      console.log('🔍 Récupération de la tâche:', id)
      const response = await apiClient.get(API_ENDPOINTS.TASKS.DETAIL(id))
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur récupération tâche:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération de la tâche'
      }
    }
  },

  /**
   * Créer une nouvelle tâche
   * @param {Object} taskData - Données de la tâche
   * @returns {Promise<Object>} Réponse de l'API
   */
  async createTask(taskData) {
    try {
      // Validation des champs requis
      const requiredFields = ['name', 'priority']
      for (const field of requiredFields) {
        if (!taskData[field]) {
          throw new Error(`Le champ ${field} est requis`)
        }
      }

      // Préparer les données pour l'API
      const data = {
        name: taskData.name,
        description: taskData.description || null,
        priority: taskData.priority, // low, medium, high, urgent
        due_date: taskData.due_date || null,
        assigned_to: taskData.assigned_to || null,
        category: taskData.category || null,
        tags: taskData.tags || [],
        is_completed: taskData.is_completed || false
      }

      console.log('📝 Création de la tâche:', data)
      const response = await apiClient.post(API_ENDPOINTS.TASKS.CREATE, data)
      
      console.log('✅ Réponse API création:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Tâche créée avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur création tâche:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la création de la tâche'
      }
    }
  },

  /**
   * Mettre à jour une tâche
   * @param {string} id - ID de la tâche
   * @param {Object} taskData - Nouvelles données de la tâche
   * @returns {Promise<Object>} Réponse de l'API
   */
  async updateTask(id, taskData) {
    try {
      // Préparer les données pour l'API (seulement les champs modifiables)
      const data = {}
      
      if (taskData.name !== undefined) data.name = taskData.name
      if (taskData.description !== undefined) data.description = taskData.description
      if (taskData.priority !== undefined) data.priority = taskData.priority
      if (taskData.due_date !== undefined) data.due_date = taskData.due_date
      if (taskData.assigned_to !== undefined) data.assigned_to = taskData.assigned_to
      if (taskData.category !== undefined) data.category = taskData.category
      if (taskData.tags !== undefined) data.tags = taskData.tags
      if (taskData.is_completed !== undefined) data.is_completed = taskData.is_completed

      console.log('✏️ Mise à jour de la tâche:', id, data)
      const response = await apiClient.put(API_ENDPOINTS.TASKS.UPDATE(id), data)
      
      return {
        success: true,
        message: response.data.message || 'Tâche mise à jour avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour tâche:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la mise à jour de la tâche'
      }
    }
  },

  /**
   * Supprimer une tâche
   * @param {string} id - ID de la tâche
   * @returns {Promise<Object>} Réponse de l'API
   */
  async deleteTask(id) {
    try {
      console.log('🗑️ Suppression de la tâche:', id)
      const response = await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(id))
      
      console.log('✅ Réponse API suppression:', response.data)
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Tâche supprimée avec succès',
        data: response.data.data || { id }
      }
    } catch (error) {
      console.error('❌ Erreur suppression tâche:', error)
      throw {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la suppression de la tâche'
      }
    }
  },

  /**
   * Marquer une tâche comme terminée
   * @param {string} id - ID de la tâche
   * @returns {Promise<Object>} Réponse de l'API
   */
  async completeTask(id) {
    try {
      console.log('✅ Marquage tâche comme terminée:', id)
      const response = await apiClient.patch(API_ENDPOINTS.TASKS.COMPLETE(id))
      
      return {
        success: true,
        message: response.data.message || 'Tâche marquée comme terminée',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur completion tâche:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la completion de la tâche'
      }
    }
  },

  /**
   * Marquer une tâche comme non terminée
   * @param {string} id - ID de la tâche
   * @returns {Promise<Object>} Réponse de l'API
   */
  async uncompleteTask(id) {
    try {
      console.log('↩️ Marquage tâche comme non terminée:', id)
      const response = await apiClient.patch(API_ENDPOINTS.TASKS.UNCOMPLETE(id))
      
      return {
        success: true,
        message: response.data.message || 'Tâche marquée comme non terminée',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur uncompletion tâche:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'uncompletion de la tâche'
      }
    }
  },

  /**
   * Assigner une tâche à un utilisateur
   * @param {string} id - ID de la tâche
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Réponse de l'API
   */
  async assignTask(id, userId) {
    try {
      console.log('👤 Assignation de la tâche:', id, 'à l\'utilisateur:', userId)
      const response = await apiClient.patch(API_ENDPOINTS.TASKS.ASSIGN(id), {
        assigned_to: userId
      })
      
      return {
        success: true,
        message: response.data.message || 'Tâche assignée avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur assignation tâche:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'assignation de la tâche'
      }
    }
  },

  /**
   * Désassigner une tâche
   * @param {string} id - ID de la tâche
   * @returns {Promise<Object>} Réponse de l'API
   */
  async unassignTask(id) {
    try {
      console.log('🚫 Désassignation de la tâche:', id)
      const response = await apiClient.patch(API_ENDPOINTS.TASKS.UNASSIGN(id))
      
      return {
        success: true,
        message: response.data.message || 'Tâche désassignée avec succès',
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur désassignation tâche:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la désassignation de la tâche'
      }
    }
  },

  /**
   * Récupérer mes tâches
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getMyTasks(options = {}) {
    return this.getAllTasks({
      ...options,
      endpoint: API_ENDPOINTS.TASKS.MY_TASKS
    })
  },

  /**
   * Récupérer les tâches assignées
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getAssignedTasks(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.TASKS.ASSIGNED_TASKS}?${queryString}` : API_ENDPOINTS.TASKS.ASSIGNED_TASKS
      
      console.log('🔍 Récupération des tâches assignées:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null
      }
    } catch (error) {
      console.error('❌ Erreur récupération tâches assignées:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des tâches assignées'
      }
    }
  },

  /**
   * Récupérer les tâches en retard
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getOverdueTasks(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.TASKS.OVERDUE_TASKS}?${queryString}` : API_ENDPOINTS.TASKS.OVERDUE_TASKS
      
      console.log('🔍 Récupération des tâches en retard:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null
      }
    } catch (error) {
      console.error('❌ Erreur récupération tâches en retard:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des tâches en retard'
      }
    }
  },

  /**
   * Récupérer les tâches terminées
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getCompletedTasks(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.TASKS.COMPLETED_TASKS}?${queryString}` : API_ENDPOINTS.TASKS.COMPLETED_TASKS
      
      console.log('🔍 Récupération des tâches terminées:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null
      }
    } catch (error) {
      console.error('❌ Erreur récupération tâches terminées:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des tâches terminées'
      }
    }
  },

  /**
   * Récupérer les tâches prioritaires
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getPriorityTasks(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.page) params.append('page', options.page)
      if (options.per_page) params.append('per_page', options.per_page)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.TASKS.PRIORITY_TASKS}?${queryString}` : API_ENDPOINTS.TASKS.PRIORITY_TASKS
      
      console.log('🔍 Récupération des tâches prioritaires:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data,
        pagination: response.data.pagination || null
      }
    } catch (error) {
      console.error('❌ Erreur récupération tâches prioritaires:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des tâches prioritaires'
      }
    }
  },

  /**
   * Récupérer les statistiques des tâches
   * @param {Object} options - Options de requête
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getTaskStats(options = {}) {
    try {
      const params = new URLSearchParams()
      
      if (options.period) params.append('period', options.period) // day, week, month, year
      if (options.start_date) params.append('start_date', options.start_date)
      if (options.end_date) params.append('end_date', options.end_date)
      
      const queryString = params.toString()
      const url = queryString ? `${API_ENDPOINTS.TASKS.STATS}?${queryString}` : API_ENDPOINTS.TASKS.STATS
      
      console.log('📊 Récupération des statistiques des tâches:', url)
      const response = await apiClient.get(url)
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur récupération statistiques tâches:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération des statistiques'
      }
    }
  },

  /**
   * Récupérer le résumé des tâches
   * @returns {Promise<Object>} Réponse de l'API
   */
  async getTaskSummary() {
    try {
      console.log('📋 Récupération du résumé des tâches')
      const response = await apiClient.get(API_ENDPOINTS.TASKS.SUMMARY)
      
      return {
        success: true,
        data: response.data.data || response.data
      }
    } catch (error) {
      console.error('❌ Erreur récupération résumé tâches:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de la récupération du résumé'
      }
    }
  }
}

export default taskService
