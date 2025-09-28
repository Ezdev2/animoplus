import { computed, ref } from 'vue'
import { useTasksStore } from '@/stores/tasks.js'
import { 
  useTasksQuery,
  useTaskQuery,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useCompleteTask,
  useUncompleteTask
} from '@/services/tasks/taskQueries.js'

/**
 * Composable pour la gestion des tâches
 * Combine le store Pinia et les hooks TanStack Query
 */
export const useTasks = () => {
  const store = useTasksStore()

  // État local pour les options de requête
  const queryOptions = ref({
    page: 1,
    per_page: 10,
    search: '',
    priority: '',
    completed: null,
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  // Getters du store - essentiels seulement
  const tasks = computed(() => store.getTasks)
  const currentTask = computed(() => store.getCurrentTask)
  const isLoading = computed(() => store.getIsLoading)
  const error = computed(() => store.getError)
  const filters = computed(() => store.getFilters)
  const pagination = computed(() => store.getPagination)

  // Pas de getters calculés supplémentaires pour le moment

  // Hooks TanStack Query - seulement les essentiels
  const tasksQuery = useTasksQuery(queryOptions)

  // Mutations essentielles
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()
  const completeTaskMutation = useCompleteTask()
  const uncompleteTaskMutation = useUncompleteTask()

  // Actions du store - seulement les essentielles
  const {
    fetchTasks,
    fetchTaskById,
    setFilters,
    resetFilters,
    resetStore
  } = store

  // Fonctions utilitaires
  const getTaskById = (id) => {
    return store.getTaskById(id)
  }

  const refreshTasks = () => {
    return tasksQuery.refetch()
  }

  // Actions combinées (store + mutations)
  const createTask = async (taskData) => {
    try {
      const result = await createTaskMutation.mutateAsync(taskData)
      
      // Mettre à jour le store Pinia avec la nouvelle tâche
      if (result.success && result.data) {
        console.log('📝 Ajout de la nouvelle tâche au store Pinia:', result.data)
        store.addTask(result.data)
      }
      
      return result
    } catch (error) {
      console.error('❌ Erreur création tâche:', error)
      throw error
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      const result = await updateTaskMutation.mutateAsync({ id, taskData })
      
      // Mettre à jour le store Pinia avec la tâche modifiée
      if (result.success && result.data) {
        console.log('📝 Mise à jour de la tâche dans le store Pinia:', result.data)
        store.updateTask(result.data)
      }
      
      return result
    } catch (error) {
      console.error('❌ Erreur mise à jour tâche:', error)
      throw error
    }
  }

  const deleteTask = async (id) => {
    try {
      const result = await deleteTaskMutation.mutateAsync(id)
      
      // Supprimer la tâche du store Pinia
      if (result.success) {
        console.log('🗑️ Suppression de la tâche du store Pinia:', id)
        store.removeTask(id)
      }
      
      return result
    } catch (error) {
      console.error('❌ Erreur suppression tâche:', error)
      throw error
    }
  }

  const completeTask = async (id) => {
    try {
      const result = await completeTaskMutation.mutateAsync(id)
      
      // Mettre à jour le store Pinia avec la tâche complétée
      if (result.success && result.data) {
        console.log('✅ Tâche marquée comme complétée dans le store Pinia:', result.data)
        store.updateTask(result.data)
      }
      
      return result
    } catch (error) {
      console.error('❌ Erreur completion tâche:', error)
      throw error
    }
  }

  const uncompleteTask = async (id) => {
    try {
      const result = await uncompleteTaskMutation.mutateAsync(id)
      
      // Mettre à jour le store Pinia avec la tâche non complétée
      if (result.success && result.data) {
        console.log('🔄 Tâche marquée comme non complétée dans le store Pinia:', result.data)
        store.updateTask(result.data)
      }
      
      return result
    } catch (error) {
      console.error('❌ Erreur uncompletion tâche:', error)
      throw error
    }
  }

  const assignTask = async (taskId, userId) => {
    try {
      const result = await assignTaskMutation.mutateAsync({ taskId, userId })
      return result
    } catch (error) {
      console.error('❌ Erreur assignation tâche:', error)
      throw error
    }
  }

  const unassignTask = async (id) => {
    try {
      const result = await unassignTaskMutation.mutateAsync(id)
      return result
    } catch (error) {
      console.error('❌ Erreur désassignation tâche:', error)
      throw error
    }
  }

  // Fonctions de filtrage et tri
  const updateQueryOptions = (newOptions) => {
    queryOptions.value = { ...queryOptions.value, ...newOptions }
  }

  const search = (searchTerm) => {
    updateQueryOptions({ search: searchTerm })
    setFilters({ search: searchTerm })
  }

  const filterPriority = (priority) => {
    updateQueryOptions({ priority })
    setFilters({ priority })
  }

  const filterStatus = (completed) => {
    updateQueryOptions({ completed })
    setFilters({ completed })
  }

  const sort = (sortBy, sortOrder = 'desc') => {
    updateQueryOptions({ sort_by: sortBy, sort_order: sortOrder })
    setFilters({ sort_by: sortBy, sort_order: sortOrder })
  }

  const changePage = (page) => {
    updateQueryOptions({ page })
  }

  const changePerPage = (perPage) => {
    updateQueryOptions({ per_page: perPage, page: 1 })
  }

  // Utilitaires de validation
  const validateTaskData = (taskData) => {
    const errors = []
    
    if (!taskData.name || taskData.name.trim() === '') {
      errors.push('Le nom de la tâche est requis')
    }
    
    if (!taskData.priority || !['low', 'medium', 'high', 'urgent'].includes(taskData.priority)) {
      errors.push('La priorité doit être: low, medium, high ou urgent')
    }
    
    if (taskData.due_date && new Date(taskData.due_date) < new Date()) {
      errors.push('La date d\'échéance ne peut pas être dans le passé')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Utilitaires de formatage
  const formatPriority = (priority) => {
    const priorityLabels = {
      low: 'Faible',
      medium: 'Moyenne',
      high: 'Élevée',
      urgent: 'Urgente'
    }
    return priorityLabels[priority] || priority
  }

  const formatStatus = (isCompleted) => {
    return isCompleted ? 'Terminée' : 'En cours'
  }

  const formatDueDate = (dueDate) => {
    if (!dueDate) return 'Aucune échéance'
    
    const date = new Date(dueDate)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return `En retard de ${Math.abs(diffDays)} jour(s)`
    } else if (diffDays === 0) {
      return 'Échéance aujourd\'hui'
    } else if (diffDays === 1) {
      return 'Échéance demain'
    } else {
      return `Dans ${diffDays} jour(s)`
    }
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-orange-600 bg-orange-100',
      urgent: 'text-red-600 bg-red-100'
    }
    return colors[priority] || 'text-gray-600 bg-gray-100'
  }

  const getStatusColor = (isCompleted) => {
    return isCompleted 
      ? 'text-green-600 bg-green-100' 
      : 'text-blue-600 bg-blue-100'
  }

  // Statistiques calculées
  const getCompletionRate = computed(() => {
    if (stats.value.total === 0) return 0
    return Math.round((stats.value.completed / stats.value.total) * 100)
  })

  const getOverdueRate = computed(() => {
    if (stats.value.total === 0) return 0
    return Math.round((stats.value.overdue / stats.value.total) * 100)
  })

  const getPriorityDistribution = computed(() => {
    const distribution = {
      urgent: 0,
      high: 0,
      medium: 0,
      low: 0
    }
    
    tasks.value.forEach(task => {
      if (distribution.hasOwnProperty(task.priority)) {
        distribution[task.priority]++
      }
    })
    
    return distribution
  })

  // Hook pour une tâche spécifique
  const useTask = (taskId) => {
    const taskQuery = useTaskQuery(taskId)
    
    return {
      task: computed(() => taskQuery.data?.value?.data),
      isLoading: computed(() => taskQuery.isLoading?.value),
      error: computed(() => taskQuery.error?.value),
      refetch: taskQuery.refetch
    }
  }

  return {
    // État essentiel
    tasks,
    currentTask,
    isLoading,
    error,
    filters,
    pagination,

    // Query principale
    tasksQuery,

    // Mutations essentielles
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    completeTaskMutation,
    uncompleteTaskMutation,

    // Actions principales
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    uncompleteTask,
    fetchTasks,
    fetchTaskById,
    refreshTasks,

    // Utilitaires de base
    getTaskById,
    validateTaskData,
    formatPriority,
    getPriorityColor,
    setFilters,
    resetFilters,
    resetStore
  }
}

export default useTasks
