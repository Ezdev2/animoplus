import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskService } from '@/services/tasks/taskService.js'

export const useTasksStore = defineStore('tasks', () => {
  // État
  const tasks = ref([])
  const currentTask = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const filters = ref({
    search: '',
    priority: '',
    completed: null,
    assigned_to: '',
    due_before: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  })
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })

  // Stats et résumé
  const stats = ref({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    high_priority: 0
  })
  const summary = ref(null)

  // Getters
  const getTasks = computed(() => tasks.value)
  const getCurrentTask = computed(() => currentTask.value)
  const getIsLoading = computed(() => isLoading.value)
  const getError = computed(() => error.value)
  const getFilters = computed(() => filters.value)
  const getPagination = computed(() => pagination.value)
  const getStats = computed(() => stats.value)
  const getSummary = computed(() => summary.value)

  // Getters calculés
  const getTasksByPriority = computed(() => {
    const tasksByPriority = {
      urgent: [],
      high: [],
      medium: [],
      low: []
    }
    
    tasks.value.forEach(task => {
      if (tasksByPriority[task.priority]) {
        tasksByPriority[task.priority].push(task)
      }
    })
    
    return tasksByPriority
  })

  const getCompletedTasks = computed(() => {
    return tasks.value.filter(task => task.is_completed)
  })

  const getPendingTasks = computed(() => {
    return tasks.value.filter(task => !task.is_completed)
  })

  const getOverdueTasks = computed(() => {
    const now = new Date()
    return tasks.value.filter(task => {
      if (!task.due_date || task.is_completed) return false
      return new Date(task.due_date) < now
    })
  })

  const getMyTasks = computed(() => {
    // Supposons que l'utilisateur actuel est stocké quelque part
    // Pour l'instant, on retourne toutes les tâches
    return tasks.value
  })

  const getTaskById = computed(() => {
    return (id) => tasks.value.find(task => task.id === id)
  })

  // Actions
  const setTasks = (newTasks) => {
    tasks.value = newTasks
  }

  const addTask = (task) => {
    tasks.value.unshift(task)
    updateStats()
  }

  const updateTask = (updatedTask) => {
    const index = tasks.value.findIndex(task => task.id === updatedTask.id)
    if (index !== -1) {
      tasks.value[index] = { ...tasks.value[index], ...updatedTask }
      updateStats()
    }
  }

  const removeTask = (taskId) => {
    const index = tasks.value.findIndex(task => task.id === taskId)
    if (index !== -1) {
      tasks.value.splice(index, 1)
      updateStats()
    }
  }

  const setCurrentTask = (task) => {
    currentTask.value = task
  }

  const clearCurrentTask = () => {
    currentTask.value = null
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setError = (newError) => {
    error.value = newError
  }

  const clearError = () => {
    error.value = null
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      priority: '',
      completed: null,
      assigned_to: '',
      due_before: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    }
  }

  const setPagination = (newPagination) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  const setStats = (newStats) => {
    stats.value = { ...stats.value, ...newStats }
  }

  const setSummary = (newSummary) => {
    summary.value = newSummary
  }

  // Calculer les stats à partir des tâches actuelles
  const updateStats = () => {
    const total = tasks.value.length
    const completed = tasks.value.filter(task => task.is_completed).length
    const pending = total - completed
    const overdue = getOverdueTasks.value.length
    const high_priority = tasks.value.filter(task => 
      task.priority === 'high' || task.priority === 'urgent'
    ).length

    setStats({
      total,
      completed,
      pending,
      overdue,
      high_priority
    })
  }

  // Actions API
  const fetchTasks = async (options = {}) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await taskService.getAllTasks({
        ...filters.value,
        ...options
      })
      
      if (response.success) {
        // response.data contient déjà le tableau des tâches (traité par taskService)
        setTasks(response.data || [])
        if (response.pagination) {
          setPagination(response.pagination)
        }
        updateStats()
        console.log('✅ Tâches chargées dans le store:', response.data?.length || 0)
      } else {
        setError(response.error)
        console.error('❌ Erreur API tasks:', response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchTasks store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetchTaskById = async (id) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await taskService.getTaskById(id)
      
      if (response.success) {
        setCurrentTask(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchTaskById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await taskService.createTask(taskData)
      
      if (response.success) {
        addTask(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur createTask store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateTaskById = async (id, taskData) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await taskService.updateTask(id, taskData)
      
      if (response.success) {
        updateTask(response.data)
        if (currentTask.value?.id === id) {
          setCurrentTask(response.data)
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur updateTaskById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const deleteTaskById = async (id) => {
    try {
      setLoading(true)
      clearError()
      
      const response = await taskService.deleteTask(id)
      
      if (response.success) {
        removeTask(id)
        if (currentTask.value?.id === id) {
          clearCurrentTask()
        }
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur deleteTaskById store:', error)
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const completeTask = async (id) => {
    try {
      const response = await taskService.completeTask(id)
      
      if (response.success) {
        updateTask({ id, is_completed: true })
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur completeTask store:', error)
      setError(error.message)
      throw error
    }
  }

  const uncompleteTask = async (id) => {
    try {
      const response = await taskService.uncompleteTask(id)
      
      if (response.success) {
        updateTask({ id, is_completed: false })
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur uncompleteTask store:', error)
      setError(error.message)
      throw error
    }
  }

  const assignTask = async (id, userId) => {
    try {
      const response = await taskService.assignTask(id, userId)
      
      if (response.success) {
        updateTask({ id, assigned_to: userId })
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur assignTask store:', error)
      setError(error.message)
      throw error
    }
  }

  const unassignTask = async (id) => {
    try {
      const response = await taskService.unassignTask(id)
      
      if (response.success) {
        updateTask({ id, assigned_to: null })
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur unassignTask store:', error)
      setError(error.message)
      throw error
    }
  }

  const fetchStats = async (options = {}) => {
    try {
      const response = await taskService.getTaskStats(options)
      
      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchStats store:', error)
      setError(error.message)
      throw error
    }
  }

  const fetchSummary = async () => {
    try {
      const response = await taskService.getTaskSummary()
      
      if (response.success) {
        setSummary(response.data)
      } else {
        setError(response.error)
      }
      
      return response
    } catch (error) {
      console.error('❌ Erreur fetchSummary store:', error)
      setError(error.message)
      throw error
    }
  }

  // Utilitaires
  const searchTasks = (searchTerm) => {
    setFilters({ search: searchTerm })
    return fetchTasks()
  }

  const filterByPriority = (priority) => {
    setFilters({ priority })
    return fetchTasks()
  }

  const filterByStatus = (completed) => {
    setFilters({ completed })
    return fetchTasks()
  }

  const sortTasks = (sortBy, sortOrder = 'desc') => {
    setFilters({ sort_by: sortBy, sort_order: sortOrder })
    return fetchTasks()
  }

  const resetStore = () => {
    tasks.value = []
    currentTask.value = null
    isLoading.value = false
    error.value = null
    resetFilters()
    setPagination({
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    })
    setStats({
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      high_priority: 0
    })
    summary.value = null
  }

  return {
    // État
    tasks,
    currentTask,
    isLoading,
    error,
    filters,
    pagination,
    stats,
    summary,

    // Getters
    getTasks,
    getCurrentTask,
    getIsLoading,
    getError,
    getFilters,
    getPagination,
    getStats,
    getSummary,
    getTasksByPriority,
    getCompletedTasks,
    getPendingTasks,
    getOverdueTasks,
    getMyTasks,
    getTaskById,

    // Actions
    setTasks,
    addTask,
    updateTask,
    removeTask,
    setCurrentTask,
    clearCurrentTask,
    setLoading,
    setError,
    clearError,
    setFilters,
    resetFilters,
    setPagination,
    setStats,
    setSummary,
    updateStats,

    // Actions API
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTaskById,
    deleteTaskById,
    completeTask,
    uncompleteTask,
    assignTask,
    unassignTask,
    fetchStats,
    fetchSummary,

    // Utilitaires
    searchTasks,
    filterByPriority,
    filterByStatus,
    sortTasks,
    resetStore
  }
})
