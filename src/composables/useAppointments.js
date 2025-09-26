import { ref, computed, watch } from 'vue'
import { 
  useAppointments as useAppointmentsQuery,
  useClientAppointments,
  useProfessionalAppointments,
  useAvailableSlots,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useUpdateAppointmentStatus,
  useConfirmAppointment,
  useCancelAppointment,
  useCompleteAppointment
} from '@/services/appointments/appointmentQueries.js'
import { useAppointmentsStore } from '@/stores/appointments.js'
import { useToast } from '@/composables/useToast.js'

/**
 * Composable pour la gestion des rendez-vous
 * Combine les hooks TanStack Query avec des utilitaires pratiques
 */
export function useAppointments(options = {}) {
  const toast = useToast()
  const store = useAppointmentsStore()

  // Configuration par défaut
  const config = {
    withRelations: true,
    autoRefresh: false,
    showToasts: true,
    ...options
  }

  // États locaux
  const isCreating = ref(false)
  const isUpdating = ref(false)
  const isDeleting = ref(false)

  // Query pour les appointments
  const appointmentsQuery = useAppointmentsQuery({
    with_relations: config.withRelations,
    ...store.currentFilters,
    page: store.currentPage,
    per_page: store.perPage
  })

  // Mutations
  const createMutation = useCreateAppointment({
    onMutate: () => {
      isCreating.value = true
    },
    onSuccess: (data) => {
      isCreating.value = false
      if (config.showToasts) {
        toast.success('Rendez-vous créé avec succès')
      }
    },
    onError: (error) => {
      isCreating.value = false
      if (config.showToasts) {
        toast.error('Erreur lors de la création du rendez-vous')
      }
    }
  })

  const updateMutation = useUpdateAppointment({
    onMutate: () => {
      isUpdating.value = true
    },
    onSuccess: (data) => {
      isUpdating.value = false
      if (config.showToasts) {
        toast.success('Rendez-vous modifié avec succès')
      }
    },
    onError: (error) => {
      isUpdating.value = false
      if (config.showToasts) {
        toast.error('Erreur lors de la modification du rendez-vous')
      }
    }
  })

  const deleteMutation = useDeleteAppointment({
    onMutate: () => {
      isDeleting.value = true
    },
    onSuccess: (data) => {
      isDeleting.value = false
      if (config.showToasts) {
        toast.success('Rendez-vous supprimé avec succès')
      }
    },
    onError: (error) => {
      isDeleting.value = false
      if (config.showToasts) {
        toast.error('Erreur lors de la suppression du rendez-vous')
      }
    }
  })

  const statusMutation = useUpdateAppointmentStatus({
    onSuccess: (data, { status }) => {
      if (config.showToasts) {
        const messages = {
          confirmed: 'Rendez-vous confirmé',
          cancelled: 'Rendez-vous annulé',
          completed: 'Rendez-vous terminé',
          pending: 'Rendez-vous remis en attente'
        }
        toast.success(messages[status] || 'Statut mis à jour')
      }
    },
    onError: (error) => {
      if (config.showToasts) {
        toast.error('Erreur lors du changement de statut')
      }
    }
  })

  const confirmMutation = useConfirmAppointment({
    onSuccess: () => {
      if (config.showToasts) {
        toast.success('Rendez-vous confirmé')
      }
    }
  })

  const cancelMutation = useCancelAppointment({
    onSuccess: () => {
      if (config.showToasts) {
        toast.success('Rendez-vous annulé')
      }
    }
  })

  const completeMutation = useCompleteAppointment({
    onSuccess: () => {
      if (config.showToasts) {
        toast.success('Rendez-vous terminé')
      }
    }
  })

  // Données computées
  const appointments = computed(() => appointmentsQuery.data?.value?.data || [])
  const isLoading = computed(() => appointmentsQuery.isLoading.value)
  const isError = computed(() => appointmentsQuery.isError.value)
  const error = computed(() => appointmentsQuery.error.value)

  // Statistiques
  const stats = computed(() => {
    const data = appointments.value
    return {
      total: data.length,
      pending: data.filter(apt => apt.status === 'pending').length,
      confirmed: data.filter(apt => apt.status === 'confirmed').length,
      cancelled: data.filter(apt => apt.status === 'cancelled').length,
      completed: data.filter(apt => apt.status === 'completed').length,
      today: data.filter(apt => {
        const today = new Date().toISOString().split('T')[0]
        return apt.date === today
      }).length
    }
  })

  // Actions
  async function createAppointment(appointmentData) {
    try {
      const result = await createMutation.mutateAsync(appointmentData)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  async function updateAppointment(id, appointmentData) {
    try {
      const result = await updateMutation.mutateAsync({ id, data: appointmentData })
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  async function deleteAppointment(id) {
    try {
      const result = await deleteMutation.mutateAsync(id)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  async function updateStatus(id, status) {
    try {
      const result = await statusMutation.mutateAsync({ id, status })
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  async function confirmAppointment(id) {
    try {
      const result = await confirmMutation.mutateAsync(id)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  async function cancelAppointment(id, reason = null) {
    try {
      const result = await cancelMutation.mutateAsync({ id, reason })
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  async function completeAppointment(id) {
    try {
      const result = await completeMutation.mutateAsync(id)
      return { success: true, data: result }
    } catch (error) {
      return { success: false, error }
    }
  }

  // Utilitaires
  function findById(id) {
    return appointments.value.find(apt => apt.id === id)
  }

  function filterByStatus(status) {
    return appointments.value.filter(apt => apt.status === status)
  }

  function filterByDate(date) {
    return appointments.value.filter(apt => apt.date === date)
  }

  function filterByClient(clientId) {
    return appointments.value.filter(apt => apt.client_id === clientId)
  }

  function filterByService(serviceId) {
    return appointments.value.filter(apt => apt.service_id === serviceId)
  }

  function getUpcoming() {
    const now = new Date()
    return appointments.value.filter(apt => {
      const aptDate = new Date(`${apt.date}T${apt.start_time}`)
      return aptDate > now && apt.status !== 'cancelled'
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.start_time}`)
      const dateB = new Date(`${b.date}T${b.start_time}`)
      return dateA - dateB
    })
  }

  function getToday() {
    const today = new Date().toISOString().split('T')[0]
    return appointments.value.filter(apt => apt.date === today)
  }

  function isConflicting(newAppointment) {
    const newStart = new Date(`${newAppointment.date}T${newAppointment.start_time}`)
    const newEnd = new Date(`${newAppointment.date}T${newAppointment.end_time}`)
    
    return appointments.value.some(apt => {
      if (apt.id === newAppointment.id) return false // Ignore self when updating
      if (apt.status === 'cancelled') return false
      
      const aptStart = new Date(`${apt.date}T${apt.start_time}`)
      const aptEnd = new Date(`${apt.date}T${apt.end_time}`)
      
      return (newStart < aptEnd && newEnd > aptStart)
    })
  }

  function formatTime(time) {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function getDuration(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const diffMs = end - start
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) {
      return `${diffMins} min`
    } else {
      const hours = Math.floor(diffMins / 60)
      const mins = diffMins % 60
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
    }
  }

  // Auto-refresh si activé
  if (config.autoRefresh) {
    const refreshInterval = setInterval(() => {
      appointmentsQuery.refetch()
    }, 30000) // 30 secondes

    // Nettoyer l'interval
    watch(() => config.autoRefresh, (newValue) => {
      if (!newValue) {
        clearInterval(refreshInterval)
      }
    })
  }

  return {
    // Données
    appointments,
    isLoading,
    isError,
    error,
    stats,
    
    // États des mutations
    isCreating,
    isUpdating,
    isDeleting,
    
    // Actions CRUD
    createAppointment,
    updateAppointment,
    deleteAppointment,
    
    // Actions de statut
    updateStatus,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
    
    // Utilitaires
    findById,
    filterByStatus,
    filterByDate,
    filterByClient,
    filterByService,
    getUpcoming,
    getToday,
    isConflicting,
    
    // Formatage
    formatTime,
    formatDate,
    getDuration,
    
    // Contrôle
    refetch: appointmentsQuery.refetch
  }
}

/**
 * Composable spécialisé pour les appointments d'un client
 */
export function useClientAppointments(clientId, options = {}) {
  const toast = useToast()
  
  const query = useClientAppointments(clientId, {
    with_service: true,
    ...options
  })

  const appointments = computed(() => query.data?.value?.data || [])
  const isLoading = computed(() => query.isLoading.value)
  const isError = computed(() => query.isError.value)

  const upcoming = computed(() => {
    const now = new Date()
    return appointments.value.filter(apt => {
      const aptDate = new Date(`${apt.date}T${apt.start_time}`)
      return aptDate > now && apt.status !== 'cancelled'
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.start_time}`)
      const dateB = new Date(`${b.date}T${b.start_time}`)
      return dateA - dateB
    })
  })

  const history = computed(() => {
    const now = new Date()
    return appointments.value.filter(apt => {
      const aptDate = new Date(`${apt.date}T${apt.start_time}`)
      return aptDate <= now || apt.status === 'completed'
    }).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.start_time}`)
      const dateB = new Date(`${b.date}T${b.start_time}`)
      return dateB - dateA // Plus récent en premier
    })
  })

  return {
    appointments,
    upcoming,
    history,
    isLoading,
    isError,
    refetch: query.refetch
  }
}

/**
 * Composable pour les créneaux disponibles
 */
export function useAvailableSlots(serviceId, date) {
  const query = useAvailableSlots(serviceId, date)
  
  const slots = computed(() => query.data?.value?.data || [])
  const isLoading = computed(() => query.isLoading.value)
  const isError = computed(() => query.isError.value)

  const morningSlots = computed(() => {
    return slots.value.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0])
      return hour < 12
    })
  })

  const afternoonSlots = computed(() => {
    return slots.value.filter(slot => {
      const hour = parseInt(slot.time.split(':')[0])
      return hour >= 12
    })
  })

  return {
    slots,
    morningSlots,
    afternoonSlots,
    isLoading,
    isError,
    refetch: query.refetch
  }
}

export default useAppointments
