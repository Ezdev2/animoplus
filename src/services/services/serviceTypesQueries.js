import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { serviceTypesService } from './serviceTypesService.js'

// Clés de requête pour les types de services
export const SERVICE_TYPES_QUERY_KEYS = {
  all: ['service-types'],
  lists: () => [...SERVICE_TYPES_QUERY_KEYS.all, 'list'],
  list: (filters) => [...SERVICE_TYPES_QUERY_KEYS.lists(), filters],
  details: () => [...SERVICE_TYPES_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...SERVICE_TYPES_QUERY_KEYS.details(), id],
  stats: () => [...SERVICE_TYPES_QUERY_KEYS.all, 'stats'],
  cached: () => [...SERVICE_TYPES_QUERY_KEYS.all, 'cached']
}

/**
 * Hook pour récupérer tous les types de services avec filtres
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useServiceTypes(options = {}) {
  return useQuery({
    queryKey: SERVICE_TYPES_QUERY_KEYS.list(options),
    queryFn: () => serviceTypesService.getAllServiceTypes(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: true,
    select: (data) => data?.data || []
  })
}

/**
 * Hook pour récupérer un type de service par ID
 * @param {string} id - ID du type de service
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useServiceType(id, options = {}) {
  return useQuery({
    queryKey: SERVICE_TYPES_QUERY_KEYS.detail(id),
    queryFn: () => serviceTypesService.getServiceTypeById(id, options),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    select: (data) => data?.data || null
  })
}

/**
 * Hook pour récupérer les statistiques des types de services
 * @returns {Object} Query TanStack Query
 */
export function useServiceTypesStats() {
  return useQuery({
    queryKey: SERVICE_TYPES_QUERY_KEYS.stats(),
    queryFn: () => serviceTypesService.getServiceTypesStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => data?.data || {}
  })
}

/**
 * Hook pour créer un type de service
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useCreateServiceType(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serviceTypeData) => serviceTypesService.createServiceType(serviceTypeData),
    onSuccess: (data) => {
      console.log('✅ Type de service créé avec succès:', data)
      
      // Invalider et refetch toutes les listes
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_TYPES_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_TYPES_QUERY_KEYS.all,
        refetchType: 'active'
      })
      
      // Invalider les stats
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_TYPES_QUERY_KEYS.stats(),
        refetchType: 'active'
      })
      
      console.log('✅ Cache invalidé, les listes vont se mettre à jour')
    },
    ...options
  })
}

/**
 * Hook pour mettre à jour un type de service
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useUpdateServiceType(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => serviceTypesService.updateServiceType(id, data),
    onSuccess: (data, { id }) => {
      console.log('✅ Type de service mis à jour avec succès, ID:', id)
      
      // Mettre à jour le cache du type de service spécifique
      queryClient.setQueryData(SERVICE_TYPES_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_TYPES_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      console.log('✅ Cache mis à jour')
    },
    ...options
  })
}

/**
 * Hook pour supprimer un type de service avec Optimistic Update
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useDeleteServiceType(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => serviceTypesService.deleteServiceType(id),
    
    // Optimistic Update - Suppression immédiate de l'UI
    onMutate: async (serviceTypeId) => {
      console.log('🚀 Optimistic Update - Suppression immédiate du type de service:', serviceTypeId)
      
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: SERVICE_TYPES_QUERY_KEYS.all })
      
      // Sauvegarder l'état précédent pour pouvoir restaurer en cas d'erreur
      const previousServiceTypes = {}
      
      // Récupérer et sauvegarder toutes les listes de types de services
      const allQueries = queryClient.getQueriesData({ queryKey: SERVICE_TYPES_QUERY_KEYS.lists() })
      allQueries.forEach(([queryKey, data]) => {
        if (data?.data) {
          previousServiceTypes[JSON.stringify(queryKey)] = data
        }
      })
      
      // Supprimer optimistiquement le type de service de toutes les listes
      allQueries.forEach(([queryKey, data]) => {
        if (data?.data) {
          const updatedData = {
            ...data,
            data: data.data.filter(serviceType => serviceType.id !== serviceTypeId)
          }
          queryClient.setQueryData(queryKey, updatedData)
        }
      })
      
      // Supprimer le type de service du cache détaillé
      queryClient.removeQueries({ queryKey: SERVICE_TYPES_QUERY_KEYS.detail(serviceTypeId) })
      
      console.log('✅ Type de service supprimé optimistiquement de l\'UI')
      
      // Retourner le contexte pour pouvoir restaurer en cas d'erreur
      return { previousServiceTypes, serviceTypeId }
    },
    
    // Succès - Confirmation silencieuse
    onSuccess: (data, serviceTypeId, context) => {
      console.log('✅ Suppression confirmée par le serveur, ID:', serviceTypeId)
      
      // Pas besoin de mettre à jour l'UI, c'est déjà fait optimistiquement
      // Juste invalider pour s'assurer que les données sont fraîches
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_TYPES_QUERY_KEYS.all,
        refetchType: 'none' // Pas de refetch immédiat
      })
      
      // Invalider les stats
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_TYPES_QUERY_KEYS.stats(),
        refetchType: 'none'
      })
      
      // Appeler le callback de succès si fourni
      if (options.onSuccess) {
        options.onSuccess(data, serviceTypeId, context)
      }
    },
    
    // Erreur - Restaurer l'état précédent + Toast
    onError: (error, serviceTypeId, context) => {
      console.error('❌ Erreur suppression type de service, restauration...', error)
      
      // Restaurer l'état précédent
      if (context?.previousServiceTypes) {
        Object.entries(context.previousServiceTypes).forEach(([queryKeyStr, data]) => {
          const queryKey = JSON.parse(queryKeyStr)
          queryClient.setQueryData(queryKey, data)
        })
        console.log('🔄 État précédent restauré')
      }
      
      // Appeler le callback d'erreur si fourni
      if (options.onError) {
        options.onError(error, serviceTypeId, context)
      }
    },
    
    // Toujours exécuté - Nettoyage
    onSettled: (data, error, serviceTypeId, context) => {
      console.log('🏁 Mutation terminée pour le type de service:', serviceTypeId)
      
      if (options.onSettled) {
        options.onSettled(data, error, serviceTypeId, context)
      }
    }
  })
}

/**
 * Hook pour activer/désactiver un type de service
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useToggleServiceTypeStatus(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, isActive }) => serviceTypesService.toggleServiceTypeStatus(id, isActive),
    onSuccess: (data, { id }) => {
      console.log('✅ Statut du type de service modifié avec succès, ID:', id)
      
      // Mettre à jour le cache du type de service spécifique
      queryClient.setQueryData(SERVICE_TYPES_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_TYPES_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      console.log('✅ Cache mis à jour')
    },
    ...options
  })
}
