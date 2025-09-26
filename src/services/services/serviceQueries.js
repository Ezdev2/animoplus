import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { serviceService } from './serviceService.js'

// Clés de requête pour les services
export const SERVICE_QUERY_KEYS = {
  all: ['services'],
  lists: () => [...SERVICE_QUERY_KEYS.all, 'list'],
  list: (filters) => [...SERVICE_QUERY_KEYS.lists(), filters],
  details: () => [...SERVICE_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...SERVICE_QUERY_KEYS.details(), id],
  userServices: (userId) => [...SERVICE_QUERY_KEYS.all, 'user', userId],
  serviceTypes: () => [...SERVICE_QUERY_KEYS.all, 'types'],
  search: (searchTerm, options) => [...SERVICE_QUERY_KEYS.all, 'search', searchTerm, options]
}

/**
 * Hook pour récupérer tous les services avec filtres
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useServices(options = {}) {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.list(options),
    queryFn: () => serviceService.getAllServices(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: true
  })
}

/**
 * Hook pour rechercher des services
 * @param {string} searchTerm - Terme de recherche
 * @param {Object} options - Options de recherche
 * @returns {Object} Query TanStack Query
 */
export function useSearchServices(searchTerm, options = {}) {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.search(searchTerm, options),
    queryFn: () => {
      // S'assurer que searchTerm est une string
      const searchString = typeof searchTerm === 'object' && searchTerm.value 
        ? String(searchTerm.value).trim() 
        : String(searchTerm || '').trim()
      
      console.log('🔍 useSearchServices - searchTerm:', searchTerm, typeof searchTerm)
      console.log('🔍 useSearchServices - searchString:', searchString, typeof searchString)
      
      return serviceService.getAllServices({
        search: searchString,
        ...options
      })
    },
    enabled: !!searchTerm && (
      typeof searchTerm === 'object' && searchTerm.value 
        ? searchTerm.value.length >= 2 
        : String(searchTerm).length >= 2
    ),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000,  // 5 minutes
  })
}

/**
 * Hook pour récupérer les types de services
 * @returns {Object} Query TanStack Query
 */
export function useServiceTypes() {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.serviceTypes(),
    queryFn: () => serviceService.getServiceTypes(),
    staleTime: 10 * 60 * 1000, // 10 minutes (les types changent rarement)
    cacheTime: 30 * 60 * 1000, // 30 minutes
    select: (data) => data?.data || []
  })
}

/**
 * Hook pour récupérer les services d'un utilisateur spécifique
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useUserServices(userId, options = {}) {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.userServices(userId),
    queryFn: () => serviceService.getUserServices(userId, options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId // Seulement si userId est fourni
  })
}

/**
 * Hook pour récupérer un service par son ID
 * @param {string} serviceId - ID du service
 * @param {Object} options - Options d'inclusion
 * @returns {Object} Query TanStack Query
 */
export function useService(serviceId, options = {}) {
  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.detail(serviceId),
    queryFn: () => serviceService.getServiceById(serviceId, options),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!serviceId
  })
}

/**
 * Hook pour créer un nouveau service
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useCreateService(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (serviceData) => serviceService.createService(serviceData),
    onSuccess: (data, variables) => {
      // Invalider les listes de services
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: SERVICE_QUERY_KEYS.all })
      
      // Si on a l'ID utilisateur, invalider ses services
      if (variables.user_id) {
        queryClient.invalidateQueries({ 
          queryKey: SERVICE_QUERY_KEYS.userServices(variables.user_id) 
        })
      }
    },
    ...options
  })
}

/**
 * Hook pour mettre à jour un service
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useUpdateService(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => serviceService.updateService(id, data),
    onSuccess: (data, variables) => {
      const { id } = variables
      
      // Mettre à jour le cache du service spécifique
      queryClient.setQueryData(SERVICE_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_QUERY_KEYS.all,
        refetchType: 'active'
      })
      
      // Invalider les services utilisateur si on a l'info
      if (data?.data?.user_id) {
        queryClient.invalidateQueries({ 
          queryKey: SERVICE_QUERY_KEYS.userServices(data.data.user_id),
          refetchType: 'active'
        })
      }
    },
    ...options
  })
}

/**
 * Hook pour supprimer un service avec Optimistic Update
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useDeleteService(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => serviceService.deleteService(id),
    
    // Optimistic Update - Suppression immédiate de l'UI
    onMutate: async (serviceId) => {
      console.log('🚀 Optimistic Update - Suppression immédiate du service:', serviceId)
      
      // Annuler les requêtes en cours pour éviter les conflits
      await queryClient.cancelQueries({ queryKey: SERVICE_QUERY_KEYS.all })
      
      // Sauvegarder l'état précédent pour pouvoir restaurer en cas d'erreur
      const previousServices = {}
      
      // Récupérer et sauvegarder toutes les listes de services
      const allQueries = queryClient.getQueriesData({ queryKey: SERVICE_QUERY_KEYS.lists() })
      allQueries.forEach(([queryKey, data]) => {
        if (data?.data) {
          previousServices[JSON.stringify(queryKey)] = data
        }
      })
      
      // Récupérer et sauvegarder les services utilisateur
      const userQueries = queryClient.getQueriesData({ queryKey: [...SERVICE_QUERY_KEYS.all, 'user'] })
      userQueries.forEach(([queryKey, data]) => {
        if (data?.data) {
          previousServices[JSON.stringify(queryKey)] = data
        }
      })
      
      // Supprimer optimistiquement le service de toutes les listes
      allQueries.forEach(([queryKey, data]) => {
        if (data?.data) {
          const updatedData = {
            ...data,
            data: data.data.filter(service => service.id !== serviceId)
          }
          queryClient.setQueryData(queryKey, updatedData)
        }
      })
      
      userQueries.forEach(([queryKey, data]) => {
        if (data?.data) {
          const updatedData = {
            ...data,
            data: data.data.filter(service => service.id !== serviceId)
          }
          queryClient.setQueryData(queryKey, updatedData)
        }
      })
      
      // Supprimer le service du cache détaillé
      queryClient.removeQueries({ queryKey: SERVICE_QUERY_KEYS.detail(serviceId) })
      
      console.log('✅ Service supprimé optimistiquement de l\'UI')
      
      // Retourner le contexte pour pouvoir restaurer en cas d'erreur
      return { previousServices, serviceId }
    },
    
    // Succès - Confirmation silencieuse
    onSuccess: (data, serviceId, context) => {
      console.log('✅ Suppression confirmée par le serveur, ID:', serviceId)
      
      // Pas besoin de mettre à jour l'UI, c'est déjà fait optimistiquement
      // Juste invalider pour s'assurer que les données sont fraîches
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_QUERY_KEYS.all,
        refetchType: 'none' // Pas de refetch immédiat
      })
      
      // Appeler le callback de succès si fourni
      if (options.onSuccess) {
        options.onSuccess(data, serviceId, context)
      }
    },
    
    // Erreur - Restaurer l'état précédent + Toast
    onError: (error, serviceId, context) => {
      console.error('❌ Erreur suppression service, restauration...', error)
      
      // Restaurer l'état précédent
      if (context?.previousServices) {
        Object.entries(context.previousServices).forEach(([queryKeyStr, data]) => {
          const queryKey = JSON.parse(queryKeyStr)
          queryClient.setQueryData(queryKey, data)
        })
        console.log('🔄 État précédent restauré')
      }
      
      // Appeler le callback d'erreur si fourni
      if (options.onError) {
        options.onError(error, serviceId, context)
      }
    },
    
    // Toujours exécuté - Nettoyage
    onSettled: (data, error, serviceId, context) => {
      console.log('🏁 Mutation terminée pour le service:', serviceId)
      
      if (options.onSettled) {
        options.onSettled(data, error, serviceId, context)
      }
    }
  })
}

/**
 * Hook pour activer/désactiver un service
 * @param {Object} options - Options de la mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useToggleServiceStatus(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, enabled }) => serviceService.toggleServiceStatus(id, enabled),
    onSuccess: (data, variables) => {
      const { id } = variables
      
      // Mettre à jour le cache du service spécifique
      queryClient.setQueryData(SERVICE_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: SERVICE_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      // Invalider les services utilisateur
      if (data?.data?.user_id) {
        queryClient.invalidateQueries({ 
          queryKey: SERVICE_QUERY_KEYS.userServices(data.data.user_id),
          refetchType: 'active'
        })
      }
    },
    ...options
  })
}


/**
 * Hook pour récupérer les services par type
 * @param {string} serviceTypeId - ID du type de service
 * @param {Object} options - Options supplémentaires
 * @returns {Object} Query TanStack Query
 */
export function useServicesByType(serviceTypeId, options = {}) {
  const typeOptions = {
    services_types_id: serviceTypeId,
    with_user: true,
    with_service_type: true,
    enabled_only: true,
    ...options
  }

  return useQuery({
    queryKey: SERVICE_QUERY_KEYS.list(typeOptions),
    queryFn: () => serviceService.getAllServices(typeOptions),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    enabled: !!serviceTypeId
  })
}
