import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { appointmentService } from './appointmentService.js'

/**
 * Clés de cache pour les requêtes d'appointments
 * Organisation hiérarchique pour une invalidation précise
 */
export const APPOINTMENT_QUERY_KEYS = {
  all: ['appointments'],
  lists: () => [...APPOINTMENT_QUERY_KEYS.all, 'list'],
  list: (filters) => [...APPOINTMENT_QUERY_KEYS.lists(), filters],
  details: () => [...APPOINTMENT_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...APPOINTMENT_QUERY_KEYS.details(), id],
  clientAppointments: (clientId) => [...APPOINTMENT_QUERY_KEYS.all, 'client', clientId],
  professionalAppointments: (professionalId) => [...APPOINTMENT_QUERY_KEYS.all, 'professional', professionalId],
  availableSlots: (serviceId, date) => [...APPOINTMENT_QUERY_KEYS.all, 'slots', serviceId, date],
  stats: (filters) => [...APPOINTMENT_QUERY_KEYS.all, 'stats', filters]
}

/**
 * Hook pour récupérer la liste des rendez-vous avec filtres
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useAppointments(options = {}) {
  return useQuery({
    queryKey: APPOINTMENT_QUERY_KEYS.list(options),
    queryFn: () => appointmentService.getAllAppointments(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: true,
    keepPreviousData: false, // Permet de voir l'état de chargement
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  })
}

/**
 * Hook pour récupérer un rendez-vous par son ID
 * @param {string} id - ID du rendez-vous
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useAppointment(id, options = {}) {
  return useQuery({
    queryKey: APPOINTMENT_QUERY_KEYS.detail(id),
    queryFn: () => appointmentService.getAppointmentById(id, options),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id,
    refetchOnWindowFocus: false
  })
}

/**
 * Hook pour récupérer les rendez-vous d'un client
 * @param {string} clientId - ID du client
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useClientAppointments(clientId, options = {}) {
  return useQuery({
    queryKey: APPOINTMENT_QUERY_KEYS.clientAppointments(clientId),
    queryFn: () => appointmentService.getClientAppointments(clientId, options),
    staleTime: 3 * 60 * 1000, // 3 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!clientId,
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })
}

/**
 * Hook pour récupérer les rendez-vous d'un professionnel
 * @param {string} professionalId - ID du professionnel
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useProfessionalAppointments(professionalId, options = {}) {
  return useQuery({
    queryKey: APPOINTMENT_QUERY_KEYS.professionalAppointments(professionalId),
    queryFn: () => appointmentService.getProfessionalAppointments(professionalId, options),
    staleTime: 3 * 60 * 1000, // 3 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!professionalId,
    keepPreviousData: true,
    refetchOnWindowFocus: false
  })
}

/**
 * Hook pour récupérer les créneaux disponibles
 * @param {string} serviceId - ID du service
 * @param {string} date - Date au format YYYY-MM-DD
 * @returns {Object} Query TanStack Query
 */
export function useAvailableSlots(serviceId, date) {
  return useQuery({
    queryKey: APPOINTMENT_QUERY_KEYS.availableSlots(serviceId, date),
    queryFn: () => appointmentService.getAvailableSlots(serviceId, date),
    staleTime: 1 * 60 * 1000, // 1 minute (données très volatiles)
    cacheTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!(serviceId && date),
    refetchOnWindowFocus: true // Refetch au focus pour les créneaux
  })
}

/**
 * Hook pour récupérer les statistiques des rendez-vous
 * @param {Object} options - Options de requête
 * @returns {Object} Query TanStack Query
 */
export function useAppointmentStats(options = {}) {
  return useQuery({
    queryKey: APPOINTMENT_QUERY_KEYS.stats(options),
    queryFn: () => appointmentService.getAppointmentStats(options),
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false
  })
}

/**
 * Hook pour créer un nouveau rendez-vous
 * @param {Object} options - Options de mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useCreateAppointment(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (appointmentData) => appointmentService.createAppointment(appointmentData),
    
    onSuccess: (data, variables) => {
      console.log('✅ Rendez-vous créé avec succès:', data)
      
      // Invalider et refetch les listes d'appointments
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      // Invalider les appointments du client
      if (variables.client_id) {
        queryClient.invalidateQueries({ 
          queryKey: APPOINTMENT_QUERY_KEYS.clientAppointments(variables.client_id),
          refetchType: 'active'
        })
      }
      
      // Invalider les créneaux disponibles pour le service
      if (variables.service_id && variables.date) {
        queryClient.invalidateQueries({ 
          queryKey: APPOINTMENT_QUERY_KEYS.availableSlots(variables.service_id, variables.date),
          refetchType: 'active'
        })
      }
      
      // Invalider les statistiques
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.stats(),
        refetchType: 'active'
      })
    },
    
    onError: (error, variables) => {
      console.error('❌ Erreur création rendez-vous:', error)
    },
    
    ...options
  })
}

/**
 * Hook pour mettre à jour un rendez-vous
 * @param {Object} options - Options de mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useUpdateAppointment(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => appointmentService.updateAppointment(id, data),
    
    // Optimistic Update
    onMutate: async ({ id, data }) => {
      // Annuler les requêtes en cours pour ce rendez-vous
      await queryClient.cancelQueries({ queryKey: APPOINTMENT_QUERY_KEYS.detail(id) })
      
      // Sauvegarder les données précédentes
      const previousAppointment = queryClient.getQueryData(APPOINTMENT_QUERY_KEYS.detail(id))
      
      // Mettre à jour optimistiquement
      if (previousAppointment?.data) {
        queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), {
          ...previousAppointment,
          data: { ...previousAppointment.data, ...data }
        })
      }
      
      return { previousAppointment }
    },
    
    onSuccess: (data, { id }) => {
      console.log('✅ Rendez-vous modifié avec succès:', data)
      
      // Mettre à jour le cache avec les vraies données
      queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      // Invalider les statistiques
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.stats(),
        refetchType: 'active'
      })
    },
    
    onError: (error, { id }, context) => {
      console.error('❌ Erreur modification rendez-vous:', error)
      
      // Restaurer les données précédentes en cas d'erreur
      if (context?.previousAppointment) {
        queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), context.previousAppointment)
      }
    },
    
    ...options
  })
}

/**
 * Hook pour mettre à jour les heures d'un rendez-vous (PATCH)
 * @param {Object} options - Options de mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useUpdateAppointmentTime(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, timeData }) => appointmentService.updateAppointmentTime(id, timeData),
    
    // Optimistic Update
    onMutate: async ({ id, timeData }) => {
      // Annuler les requêtes en cours pour ce rendez-vous
      await queryClient.cancelQueries({ queryKey: APPOINTMENT_QUERY_KEYS.detail(id) })
      
      // Sauvegarder les données précédentes
      const previousAppointment = queryClient.getQueryData(APPOINTMENT_QUERY_KEYS.detail(id))
      
      // Mettre à jour optimistiquement les heures
      if (previousAppointment?.data) {
        queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), {
          ...previousAppointment,
          data: { 
            ...previousAppointment.data, 
            start_time: timeData.start_time || previousAppointment.data.start_time,
            end_time: timeData.end_time || previousAppointment.data.end_time
          }
        })
      }
      
      return { previousAppointment }
    },
    
    onSuccess: (data, { id }) => {
      console.log('✅ Heures du rendez-vous modifiées avec succès:', data)
      
      // Mettre à jour le cache avec les vraies données
      queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes pour refléter les changements
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      // Invalider les créneaux disponibles
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.availableSlots(),
        refetchType: 'active'
      })
      
      // Appeler le callback de succès si fourni
      if (options.onSuccess) {
        options.onSuccess(data, { id })
      }
    },
    
    onError: (error, { id }, context) => {
      console.error('❌ Erreur mise à jour heures rendez-vous:', error)
      
      // Rollback en cas d'erreur
      if (context?.previousAppointment) {
        queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), context.previousAppointment)
      }
      
      // Appeler le callback d'erreur si fourni
      if (options.onError) {
        options.onError(error, { id }, context)
      }
    },
    
    // Options par défaut
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options
  })
}

/**
 * Hook pour supprimer un rendez-vous
 * @param {Object} options - Options de mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useDeleteAppointment(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => appointmentService.deleteAppointment(id),
    
    // Optimistic Update
    onMutate: async (id) => {
      // Annuler les requêtes en cours
      await queryClient.cancelQueries({ queryKey: APPOINTMENT_QUERY_KEYS.detail(id) })
      await queryClient.cancelQueries({ queryKey: APPOINTMENT_QUERY_KEYS.lists() })
      
      // Sauvegarder les données précédentes
      const previousAppointment = queryClient.getQueryData(APPOINTMENT_QUERY_KEYS.detail(id))
      
      // Supprimer optimistiquement des listes
      queryClient.setQueriesData(
        { queryKey: APPOINTMENT_QUERY_KEYS.lists() },
        (oldData) => {
          if (!oldData?.data?.data || !Array.isArray(oldData.data.data)) return oldData
          
          return {
            ...oldData,
            data: {
              ...oldData.data,
              data: oldData.data.data.filter(appointment => appointment.id !== id)
            }
          }
        }
      )
      
      return { previousAppointment }
    },
    
    onSuccess: (data, id) => {
      console.log('✅ Rendez-vous supprimé avec succès:', id)
      
      // Supprimer du cache
      queryClient.removeQueries({ queryKey: APPOINTMENT_QUERY_KEYS.detail(id) })
      
      // Invalider les listes pour être sûr
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      // Invalider les statistiques
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.stats(),
        refetchType: 'active'
      })
    },
    
    onError: (error, id, context) => {
      console.error('❌ Erreur suppression rendez-vous:', error)
      
      // Restaurer les données en cas d'erreur
      if (context?.previousAppointment) {
        queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), context.previousAppointment)
      }
      
      // Invalider les listes pour restaurer l'état correct
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
    },
    
    ...options
  })
}

/**
 * Hook pour changer le statut d'un rendez-vous
 * @param {Object} options - Options de mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useUpdateAppointmentStatus(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }) => appointmentService.updateAppointmentStatus(id, status),
    
    // Optimistic Update
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: APPOINTMENT_QUERY_KEYS.detail(id) })
      
      const previousAppointment = queryClient.getQueryData(APPOINTMENT_QUERY_KEYS.detail(id))
      
      if (previousAppointment?.data) {
        queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), {
          ...previousAppointment,
          data: { ...previousAppointment.data, status }
        })
      }
      
      return { previousAppointment }
    },
    
    onSuccess: (data, { id, status }) => {
      console.log('✅ Statut du rendez-vous modifié:', id, '→', status)
      
      // Mettre à jour avec les vraies données
      queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      // Invalider les statistiques
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.stats(),
        refetchType: 'active'
      })
    },
    
    onError: (error, { id }, context) => {
      console.error('❌ Erreur changement de statut:', error)
      
      if (context?.previousAppointment) {
        queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), context.previousAppointment)
      }
    },
    
    ...options
  })
}

/**
 * Hook pour confirmer un rendez-vous
 * @param {Object} options - Options de mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useConfirmAppointment(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => appointmentService.confirmAppointment(id),
    
    onSuccess: (data, id) => {
      console.log('✅ Rendez-vous confirmé:', id)
      
      // Mettre à jour le cache
      queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
    },
    
    ...options
  })
}

/**
 * Hook pour annuler un rendez-vous
 * @param {Object} options - Options de mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useCancelAppointment(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }) => appointmentService.cancelAppointment(id, reason),
    
    onSuccess: (data, { id }) => {
      console.log('✅ Rendez-vous annulé:', id)
      
      // Mettre à jour le cache
      queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      // Invalider les créneaux disponibles (libère le créneau)
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.availableSlots(),
        refetchType: 'active'
      })
    },
    
    ...options
  })
}

/**
 * Hook pour marquer un rendez-vous comme terminé
 * @param {Object} options - Options de mutation
 * @returns {Object} Mutation TanStack Query
 */
export function useCompleteAppointment(options = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => appointmentService.completeAppointment(id),
    
    onSuccess: (data, id) => {
      console.log('✅ Rendez-vous terminé:', id)
      
      // Mettre à jour le cache
      queryClient.setQueryData(APPOINTMENT_QUERY_KEYS.detail(id), data)
      
      // Invalider les listes
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.lists(),
        refetchType: 'active'
      })
      
      // Invalider les statistiques
      queryClient.invalidateQueries({ 
        queryKey: APPOINTMENT_QUERY_KEYS.stats(),
        refetchType: 'active'
      })
    },
    
    ...options
  })
}
