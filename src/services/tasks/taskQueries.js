import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { taskService } from './taskService.js'
import { useToast } from '@/composables/useToast.js'

// Clés de requête pour les tâches
export const TASK_QUERY_KEYS = {
  all: ['tasks'],
  lists: () => [...TASK_QUERY_KEYS.all, 'list'],
  list: (filters) => [...TASK_QUERY_KEYS.lists(), { filters }],
  details: () => [...TASK_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...TASK_QUERY_KEYS.details(), id],
  myTasks: () => [...TASK_QUERY_KEYS.all, 'my-tasks'],
  assigned: () => [...TASK_QUERY_KEYS.all, 'assigned'],
  overdue: () => [...TASK_QUERY_KEYS.all, 'overdue'],
  completed: () => [...TASK_QUERY_KEYS.all, 'completed'],
  priority: () => [...TASK_QUERY_KEYS.all, 'priority'],
  stats: () => [...TASK_QUERY_KEYS.all, 'stats'],
  summary: () => [...TASK_QUERY_KEYS.all, 'summary']
}

/**
 * Hook pour récupérer la liste des tâches
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useTasksQuery = (options = {}) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.list(options),
    queryFn: () => taskService.getAllTasks(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer une tâche par ID
 * @param {string} taskId - ID de la tâche
 * @returns {Object} Query result
 */
export const useTaskQuery = (taskId) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.detail(taskId),
    queryFn: () => taskService.getTaskById(taskId),
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer mes tâches
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useMyTasksQuery = (options = {}) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.myTasks(),
    queryFn: () => taskService.getMyTasks(options),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les tâches assignées
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useAssignedTasksQuery = (options = {}) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.assigned(),
    queryFn: () => taskService.getAssignedTasks(options),
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les tâches en retard
 * @returns {Object} Query result
 */
export const useOverdueTasksQuery = () => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.overdue(),
    queryFn: () => taskService.getOverdueTasks(),
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refresh toutes les 5 minutes
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les tâches terminées
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useCompletedTasksQuery = (options = {}) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.completed(),
    queryFn: () => taskService.getCompletedTasks(options),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les tâches prioritaires
 * @returns {Object} Query result
 */
export const usePriorityTasksQuery = () => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.priority(),
    queryFn: () => taskService.getPriorityTasks(),
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer les statistiques des tâches
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useTaskStatsQuery = (options = {}) => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.stats(),
    queryFn: () => taskService.getTaskStats(options),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour récupérer le résumé des tâches
 * @returns {Object} Query result
 */
export const useTaskSummaryQuery = () => {
  return useQuery({
    queryKey: TASK_QUERY_KEYS.summary(),
    queryFn: () => taskService.getTaskSummary(),
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    select: (data) => {
      if (!data.success) {
        throw new Error(data.error)
      }
      return data
    }
  })
}

/**
 * Hook pour créer une tâche
 * @returns {Object} Mutation result
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (taskData) => taskService.createTask(taskData),
    onSuccess: (data) => {
      console.log('✅ Tâche créée avec succès:', data)
      
      // Mettre à jour le cache des queries avec la nouvelle tâche
      if (data.success && data.data) {
        // Mettre à jour le cache de la liste des tâches
        queryClient.setQueryData(TASK_QUERY_KEYS.lists(), (oldData) => {
          if (!oldData || !oldData.data) return oldData
          
          // Ajouter la nouvelle tâche au début de la liste
          const newTask = data.data
          const updatedData = {
            ...oldData,
            data: [newTask, ...oldData.data]
          }
          
          console.log('📝 Cache TanStack Query mis à jour avec nouvelle tâche:', newTask)
          return updatedData
        })
      }
      
      // Invalider les autres caches
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.myTasks() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.stats() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.summary() })
      
      // Toast de succès
      showToast({
        type: 'success',
        message: data.message || 'Tâche créée avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur création tâche:', error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la création de la tâche'
      })
    }
  })
}

/**
 * Hook pour mettre à jour une tâche
 * @returns {Object} Mutation result
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ id, taskData }) => taskService.updateTask(id, taskData),
    onSuccess: (data, { id }) => {
      console.log('✅ Tâche modifiée avec succès:', data)
      
      // Mettre à jour le cache avec la tâche modifiée
      if (data.success && data.data) {
        queryClient.setQueryData(TASK_QUERY_KEYS.lists(), (oldData) => {
          if (!oldData || !oldData.data) return oldData
          
          const updatedTasks = oldData.data.map(task => 
            task.id === id ? { ...task, ...data.data } : task
          )
          
          return { ...oldData, data: updatedTasks }
        })
      }
      
      showToast({
        type: 'success',
        message: data.message || 'Tâche modifiée avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur modification tâche:', error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la modification'
      })
    }
  })
}

/**
 * Hook pour supprimer une tâche
 * @returns {Object} Mutation result
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (taskId) => taskService.deleteTask(taskId),
    onSuccess: (data, taskId) => {
      console.log('✅ Tâche supprimée avec succès:', data)
      
      // Mettre à jour le cache en supprimant la tâche
      if (data.success) {
        queryClient.setQueryData(TASK_QUERY_KEYS.lists(), (oldData) => {
          if (!oldData || !oldData.data) return oldData
          
          const filteredTasks = oldData.data.filter(task => task.id !== taskId)
          
          return { ...oldData, data: filteredTasks }
        })
      }
      
      showToast({
        type: 'success',
        message: data.message || 'Tâche supprimée avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur suppression tâche:', error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la suppression'
      })
    }
  })
}

/**
 * Hook pour marquer une tâche comme terminée
 * @returns {Object} Mutation result
 */
export const useCompleteTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (taskId) => taskService.completeTask(taskId),
    onMutate: async (taskId) => {
      // Optimistic update
      queryClient.setQueriesData(
        { queryKey: TASK_QUERY_KEYS.lists() },
        (oldData) => {
          if (!oldData?.data?.data || !Array.isArray(oldData.data.data)) return oldData
          
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.map(task => 
                task.id === taskId ? { ...task, is_completed: true } : task
              )
            }
          }
        }
      )
    },
    onSuccess: (data, taskId) => {
      console.log('✅ Tâche marquée comme terminée:', data)
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.completed() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.stats() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.summary() })
      
      showToast({
        type: 'success',
        message: data.message || 'Tâche marquée comme terminée'
      })
    },
    onError: (error, taskId) => {
      console.error('❌ Erreur completion tâche:', error)
      
      // Invalider pour rollback
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() })
      
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la completion de la tâche'
      })
    }
  })
}

/**
 * Hook pour marquer une tâche comme non terminée
 * @returns {Object} Mutation result
 */
export const useUncompleteTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (taskId) => taskService.uncompleteTask(taskId),
    onMutate: async (taskId) => {
      // Optimistic update
      queryClient.setQueriesData(
        { queryKey: TASK_QUERY_KEYS.lists() },
        (oldData) => {
          if (!oldData?.data?.data || !Array.isArray(oldData.data.data)) return oldData
          
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.map(task => 
                task.id === taskId ? { ...task, is_completed: false } : task
              )
            }
          }
        }
      )
    },
    onSuccess: (data, taskId) => {
      console.log('✅ Tâche marquée comme non terminée:', data)
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.completed() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.stats() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.summary() })
      
      showToast({
        type: 'success',
        message: data.message || 'Tâche marquée comme non terminée'
      })
    },
    onError: (error, taskId) => {
      console.error('❌ Erreur uncompletion tâche:', error)
      
      // Invalider pour rollback
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() })
      
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de l\'uncompletion de la tâche'
      })
    }
  })
}

/**
 * Hook pour assigner une tâche
 * @returns {Object} Mutation result
 */
export const useAssignTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ taskId, userId }) => taskService.assignTask(taskId, userId),
    onSuccess: (data, { taskId }) => {
      console.log('✅ Tâche assignée avec succès:', data)
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.assigned() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.stats() })
      
      showToast({
        type: 'success',
        message: data.message || 'Tâche assignée avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur assignation tâche:', error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de l\'assignation de la tâche'
      })
    }
  })
}

/**
 * Hook pour désassigner une tâche
 * @returns {Object} Mutation result
 */
export const useUnassignTask = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (taskId) => taskService.unassignTask(taskId),
    onSuccess: (data, taskId) => {
      console.log('✅ Tâche désassignée avec succès:', data)
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.detail(taskId) })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.assigned() })
      queryClient.invalidateQueries({ queryKey: TASK_QUERY_KEYS.stats() })
      
      showToast({
        type: 'success',
        message: data.message || 'Tâche désassignée avec succès'
      })
    },
    onError: (error) => {
      console.error('❌ Erreur désassignation tâche:', error)
      showToast({
        type: 'error',
        message: error.error || error.message || 'Erreur lors de la désassignation de la tâche'
      })
    }
  })
}
