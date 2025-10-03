import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { revenueService } from './revenueService.js'
import { useRevenuesStore } from '@/stores/revenues.js'
import { useToast } from '@/composables/useToast.js'

// Clés de requête pour les revenus
export const REVENUE_QUERY_KEYS = {
  all: ['revenues'],
  lists: () => [...REVENUE_QUERY_KEYS.all, 'list'],
  list: (filters) => [...REVENUE_QUERY_KEYS.lists(), { filters }],
  details: () => [...REVENUE_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...REVENUE_QUERY_KEYS.details(), id],
  search: (searchTerm, options) => [...REVENUE_QUERY_KEYS.all, 'search', searchTerm, options],
  stats: (options) => [...REVENUE_QUERY_KEYS.all, 'stats', options],
  categories: () => [...REVENUE_QUERY_KEYS.all, 'categories']
}

/**
 * Hook pour récupérer la liste des revenus
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useRevenuesQuery = (options = {}) => {
  return useQuery({
    queryKey: REVENUE_QUERY_KEYS.list(options),
    queryFn: () => revenueService.getAllRevenues(options),
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
 * Hook pour récupérer un revenu par ID
 * @param {string} revenueId - ID du revenu
 * @param {Object} options - Options d'inclusion
 * @returns {Object} Query result
 */
export const useRevenueQuery = (revenueId, options = {}) => {
  return useQuery({
    queryKey: REVENUE_QUERY_KEYS.detail(revenueId),
    queryFn: () => revenueService.getRevenueById(revenueId, options),
    enabled: !!revenueId,
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
 * Hook pour rechercher des revenus
 * @param {string} searchTerm - Terme de recherche
 * @param {Object} options - Options de recherche
 * @returns {Object} Query result
 */
export const useSearchRevenuesQuery = (searchTerm, options = {}) => {
  return useQuery({
    queryKey: REVENUE_QUERY_KEYS.search(searchTerm, options),
    queryFn: () => revenueService.searchRevenues(searchTerm, options),
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
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
 * Hook pour récupérer les statistiques des revenus
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useRevenueStatsQuery = (options = {}) => {
  return useQuery({
    queryKey: REVENUE_QUERY_KEYS.stats(options),
    queryFn: () => revenueService.getRevenueStats(options),
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
 * Hook pour récupérer les catégories de revenus
 * @returns {Object} Query result
 */
export const useRevenueCategoriesQuery = () => {
  return useQuery({
    queryKey: REVENUE_QUERY_KEYS.categories(),
    queryFn: () => revenueService.getRevenueCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes (catégories changent rarement)
    cacheTime: 60 * 60 * 1000, // 1 heure
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
 * Hook pour créer un revenu
 * @returns {Object} Mutation result
 */
export const useCreateRevenue = () => {
  const queryClient = useQueryClient()
  const revenuesStore = useRevenuesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (revenueData) => revenueService.createRevenue(revenueData),
    onMutate: async (newRevenue) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: REVENUE_QUERY_KEYS.lists() })
      
      const previousRevenues = queryClient.getQueryData(REVENUE_QUERY_KEYS.lists())
      
      // Ajouter optimistiquement le nouveau revenu
      if (previousRevenues) {
        queryClient.setQueryData(REVENUE_QUERY_KEYS.lists(), (old) => ({
          ...old,
          data: [{ ...newRevenue, id: 'temp-' + Date.now(), status: 'draft' }, ...old.data]
        }))
      }
      
      return { previousRevenues }
    },
    onSuccess: (data) => {
      console.log('✅ Revenu créé avec succès:', data)
      
      // Invalider et refetch les listes
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.stats() })
      
      // Mettre à jour le store
      revenuesStore.createRevenue(data.data)
      
      showToast(data.message || 'Revenu créé avec succès', 'success')
    },
    onError: (error, newRevenue, context) => {
      console.error('❌ Erreur création revenu:', error)
      
      // Rollback optimistic update
      if (context?.previousRevenues) {
        queryClient.setQueryData(REVENUE_QUERY_KEYS.lists(), context.previousRevenues)
      }
      
      showToast('Erreur lors de la création du revenu', 'error')
    }
  })
}

/**
 * Hook pour mettre à jour un revenu
 * @returns {Object} Mutation result
 */
export const useUpdateRevenue = () => {
  const queryClient = useQueryClient()
  const revenuesStore = useRevenuesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ revenueId, revenueData }) => revenueService.updateRevenue(revenueId, revenueData),
    onMutate: async ({ revenueId, revenueData }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: REVENUE_QUERY_KEYS.detail(revenueId) })
      await queryClient.cancelQueries({ queryKey: REVENUE_QUERY_KEYS.lists() })
      
      const previousRevenue = queryClient.getQueryData(REVENUE_QUERY_KEYS.detail(revenueId))
      const previousRevenues = queryClient.getQueryData(REVENUE_QUERY_KEYS.lists())
      
      // Mettre à jour optimistiquement
      if (previousRevenue) {
        queryClient.setQueryData(REVENUE_QUERY_KEYS.detail(revenueId), (old) => ({
          ...old,
          data: { ...old.data, ...revenueData }
        }))
      }
      
      if (previousRevenues) {
        queryClient.setQueryData(REVENUE_QUERY_KEYS.lists(), (old) => ({
          ...old,
          data: old.data.map(revenue => 
            revenue.id === revenueId 
              ? { ...revenue, ...revenueData }
              : revenue
          )
        }))
      }
      
      return { previousRevenue, previousRevenues }
    },
    onSuccess: (data, { revenueId }) => {
      console.log('✅ Revenu mis à jour avec succès:', data)
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.detail(revenueId) })
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.stats() })
      
      // Mettre à jour le store
      revenuesStore.updateRevenue(revenueId, data.data)
      
      showToast(data.message || 'Revenu mis à jour avec succès', 'success')
    },
    onError: (error, { revenueId }, context) => {
      console.error('❌ Erreur mise à jour revenu:', error)
      
      // Rollback optimistic updates
      if (context?.previousRevenue) {
        queryClient.setQueryData(REVENUE_QUERY_KEYS.detail(revenueId), context.previousRevenue)
      }
      if (context?.previousRevenues) {
        queryClient.setQueryData(REVENUE_QUERY_KEYS.lists(), context.previousRevenues)
      }
      
      showToast('Erreur lors de la mise à jour du revenu', 'error')
    }
  })
}

/**
 * Hook pour supprimer un revenu
 * @returns {Object} Mutation result
 */
export const useDeleteRevenue = () => {
  const queryClient = useQueryClient()
  const revenuesStore = useRevenuesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (revenueId) => revenueService.deleteRevenue(revenueId),
    onMutate: async (revenueId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: REVENUE_QUERY_KEYS.lists() })
      
      const previousRevenues = queryClient.getQueryData(REVENUE_QUERY_KEYS.lists())
      
      // Supprimer optimistiquement
      if (previousRevenues) {
        queryClient.setQueryData(REVENUE_QUERY_KEYS.lists(), (old) => ({
          ...old,
          data: old.data.filter(revenue => revenue.id !== revenueId)
        }))
      }
      
      return { previousRevenues }
    },
    onSuccess: (data, revenueId) => {
      console.log('✅ Revenu supprimé avec succès:', data)
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.stats() })
      queryClient.removeQueries({ queryKey: REVENUE_QUERY_KEYS.detail(revenueId) })
      
      // Mettre à jour le store
      revenuesStore.deleteRevenue(revenueId)
      
      showToast(data.message || 'Revenu supprimé avec succès', 'success')
    },
    onError: (error, revenueId, context) => {
      console.error('❌ Erreur suppression revenu:', error)
      
      // Rollback optimistic update
      if (context?.previousRevenues) {
        queryClient.setQueryData(REVENUE_QUERY_KEYS.lists(), context.previousRevenues)
      }
      
      showToast('Erreur lors de la suppression du revenu', 'error')
    }
  })
}

/**
 * Hook pour valider un revenu
 * @returns {Object} Mutation result
 */
export const useValidateRevenue = () => {
  const queryClient = useQueryClient()
  const revenuesStore = useRevenuesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (revenueId) => revenueService.validateRevenue(revenueId),
    onSuccess: (data, revenueId) => {
      console.log('✅ Revenu validé avec succès:', data)
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.detail(revenueId) })
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.stats() })
      
      // Mettre à jour le store
      revenuesStore.validateRevenue(revenueId)
      
      showToast(data.message || 'Revenu validé avec succès', 'success')
    },
    onError: (error) => {
      console.error('❌ Erreur validation revenu:', error)
      showToast('Erreur lors de la validation du revenu', 'error')
    }
  })
}

/**
 * Hook pour approuver un revenu
 * @returns {Object} Mutation result
 */
export const useApproveRevenue = () => {
  const queryClient = useQueryClient()
  const revenuesStore = useRevenuesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (revenueId) => revenueService.approveRevenue(revenueId),
    onSuccess: (data, revenueId) => {
      console.log('✅ Revenu approuvé avec succès:', data)
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.detail(revenueId) })
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.stats() })
      
      // Mettre à jour le store
      revenuesStore.approveRevenue(revenueId)
      
      showToast(data.message || 'Revenu approuvé avec succès', 'success')
    },
    onError: (error) => {
      console.error('❌ Erreur approbation revenu:', error)
      showToast('Erreur lors de l\'approbation du revenu', 'error')
    }
  })
}

/**
 * Hook pour rejeter un revenu
 * @returns {Object} Mutation result
 */
export const useRejectRevenue = () => {
  const queryClient = useQueryClient()
  const revenuesStore = useRevenuesStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ revenueId, data }) => revenueService.rejectRevenue(revenueId, data),
    onSuccess: (data, { revenueId }) => {
      console.log('✅ Revenu rejeté avec succès:', data)
      
      // Invalider les caches
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.detail(revenueId) })
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: REVENUE_QUERY_KEYS.stats() })
      
      // Mettre à jour le store
      revenuesStore.rejectRevenue(revenueId, data.data)
      
      showToast(data.message || 'Revenu rejeté avec succès', 'success')
    },
    onError: (error) => {
      console.error('❌ Erreur rejet revenu:', error)
      showToast('Erreur lors du rejet du revenu', 'error')
    }
  })
}

/**
 * Hook pour exporter des revenus
 * @returns {Object} Mutation result
 */
export const useExportRevenues = () => {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (exportOptions) => revenueService.exportRevenues(exportOptions),
    onSuccess: (data, variables) => {
      console.log('✅ Export revenus terminé:', data)
      
      // Si c'est un fichier, déclencher le téléchargement
      if (variables.format === 'pdf' || variables.format === 'excel' || variables.format === 'csv') {
        const blob = new Blob([data.data], { 
          type: variables.format === 'pdf' ? 'application/pdf' : 
                variables.format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                'text/csv'
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `revenus_${new Date().toISOString().split('T')[0]}.${variables.format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
      
      showToast('Export terminé avec succès', 'success')
    },
    onError: (error) => {
      console.error('❌ Erreur export revenus:', error)
      showToast('Erreur lors de l\'export', 'error')
    }
  })
}
