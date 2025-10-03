import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { comptaService } from './comptaService.js'
import { useComptaStore } from '@/stores/compta.js'
import { useToast } from '@/composables/useToast.js'

// Clés de requête pour la comptabilité
export const COMPTA_QUERY_KEYS = {
  all: ['compta'],
  stats: (options) => [...COMPTA_QUERY_KEYS.all, 'stats', options],
  trends: (options) => [...COMPTA_QUERY_KEYS.all, 'trends', options],
  comparisons: (options) => [...COMPTA_QUERY_KEYS.all, 'comparisons', options],
  reports: (options) => [...COMPTA_QUERY_KEYS.all, 'reports', options],
  analysis: (options) => [...COMPTA_QUERY_KEYS.all, 'analysis', options],
  forecasts: (options) => [...COMPTA_QUERY_KEYS.all, 'forecasts', options]
}

/**
 * Hook pour récupérer les statistiques comptables
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useComptaStatsQuery = (options = {}) => {
  return useQuery({
    queryKey: COMPTA_QUERY_KEYS.stats(options),
    queryFn: () => comptaService.getStats(options),
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
 * Hook pour récupérer les tendances comptables
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useComptaTrendsQuery = (options = {}) => {
  return useQuery({
    queryKey: COMPTA_QUERY_KEYS.trends(options),
    queryFn: () => comptaService.getTrends(options),
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
 * Hook pour récupérer les comparaisons comptables
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useComptaComparisonsQuery = (options = {}) => {
  return useQuery({
    queryKey: COMPTA_QUERY_KEYS.comparisons(options),
    queryFn: () => comptaService.getComparison(options),
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
 * Hook pour récupérer les rapports comptables
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useComptaReportsQuery = (options = {}) => {
  return useQuery({
    queryKey: COMPTA_QUERY_KEYS.reports(options),
    queryFn: () => comptaService.getReports(options),
    staleTime: 2 * 60 * 1000, // 2 minutes (rapports plus dynamiques)
    cacheTime: 5 * 60 * 1000, // 5 minutes
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
 * Hook pour récupérer les analyses comptables
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useComptaAnalysisQuery = (options = {}) => {
  return useQuery({
    queryKey: COMPTA_QUERY_KEYS.analysis(options),
    queryFn: () => comptaService.getAnalysis(options),
    staleTime: 10 * 60 * 1000, // 10 minutes (analyses moins fréquentes)
    cacheTime: 20 * 60 * 1000, // 20 minutes
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
 * Hook pour récupérer les prévisions comptables
 * @param {Object} options - Options de requête
 * @returns {Object} Query result
 */
export const useComptaForecastsQuery = (options = {}) => {
  return useQuery({
    queryKey: COMPTA_QUERY_KEYS.forecasts(options),
    queryFn: () => comptaService.getForecasts(options),
    staleTime: 15 * 60 * 1000, // 15 minutes (prévisions moins fréquentes)
    cacheTime: 30 * 60 * 1000, // 30 minutes
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
 * Hook pour rafraîchir toutes les données comptables
 * @returns {Object} Mutation result
 */
export const useRefreshComptaData = () => {
  const queryClient = useQueryClient()
  const comptaStore = useComptaStore()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (options = {}) => {
      // Invalider toutes les requêtes comptables
      await queryClient.invalidateQueries({ queryKey: COMPTA_QUERY_KEYS.all })
      
      // Recharger les données dans le store
      return await comptaStore.loadAllData(options)
    },
    onSuccess: () => {
      console.log('✅ Données comptables rafraîchies')
      showToast('Données comptables mises à jour', 'success')
    },
    onError: (error) => {
      console.error('❌ Erreur rafraîchissement données comptables:', error)
      showToast('Erreur lors du rafraîchissement des données comptables', 'error')
    }
  })
}

/**
 * Hook pour générer un rapport personnalisé
 * @returns {Object} Mutation result
 */
export const useGenerateComptaReport = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (reportOptions) => comptaService.getReports(reportOptions),
    onSuccess: (data, variables) => {
      console.log('✅ Rapport comptable généré:', data)
      
      // Invalider les requêtes de rapports
      queryClient.invalidateQueries({ 
        queryKey: COMPTA_QUERY_KEYS.reports(variables) 
      })
      
      showToast('Rapport généré avec succès', 'success')
    },
    onError: (error) => {
      console.error('❌ Erreur génération rapport comptable:', error)
      showToast('Erreur lors de la génération du rapport', 'error')
    }
  })
}

/**
 * Hook pour exporter des données comptables
 * @returns {Object} Mutation result
 */
export const useExportComptaData = () => {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (exportOptions) => {
      // Selon le type d'export, appeler le bon service
      switch (exportOptions.type) {
        case 'stats':
          return await comptaService.getStats({ ...exportOptions, format: exportOptions.format })
        case 'trends':
          return await comptaService.getTrends({ ...exportOptions, format: exportOptions.format })
        case 'reports':
          return await comptaService.getReports({ ...exportOptions, format: exportOptions.format })
        default:
          throw new Error('Type d\'export non supporté')
      }
    },
    onSuccess: (data, variables) => {
      console.log('✅ Export comptable terminé:', data)
      
      // Si c'est un fichier, déclencher le téléchargement
      if (variables.format === 'pdf' || variables.format === 'excel') {
        // Logique de téléchargement de fichier
        const blob = new Blob([data.data], { 
          type: variables.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `compta_${variables.type}_${new Date().toISOString().split('T')[0]}.${variables.format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
      
      showToast('Export terminé avec succès', 'success')
    },
    onError: (error) => {
      console.error('❌ Erreur export comptable:', error)
      showToast('Erreur lors de l\'export', 'error')
    }
  })
}

/**
 * Hook combiné pour charger toutes les données comptables d'un dashboard
 * @param {Object} options - Options globales
 * @returns {Object} Queries combinées
 */
export const useComptaDashboard = (options = {}) => {
  const statsQuery = useComptaStatsQuery(options)
  const trendsQuery = useComptaTrendsQuery(options)
  const comparisonsQuery = useComptaComparisonsQuery(options)
  
  const isLoading = computed(() => 
    statsQuery.isLoading.value || 
    trendsQuery.isLoading.value || 
    comparisonsQuery.isLoading.value
  )
  
  const hasError = computed(() => 
    statsQuery.isError.value || 
    trendsQuery.isError.value || 
    comparisonsQuery.isError.value
  )
  
  const errors = computed(() => {
    const errorList = []
    if (statsQuery.error.value) errorList.push(statsQuery.error.value)
    if (trendsQuery.error.value) errorList.push(trendsQuery.error.value)
    if (comparisonsQuery.error.value) errorList.push(comparisonsQuery.error.value)
    return errorList
  })
  
  return {
    // Queries individuelles
    statsQuery,
    trendsQuery,
    comparisonsQuery,
    
    // États combinés
    isLoading,
    hasError,
    errors,
    
    // Données
    stats: computed(() => statsQuery.data.value?.data),
    trends: computed(() => trendsQuery.data.value?.data),
    comparisons: computed(() => comparisonsQuery.data.value?.data),
    
    // Actions
    refetch: () => {
      statsQuery.refetch()
      trendsQuery.refetch()
      comparisonsQuery.refetch()
    }
  }
}
