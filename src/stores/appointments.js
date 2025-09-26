import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  useAppointments, 
  useClientAppointments, 
  useProfessionalAppointments,
  useAppointmentStats 
} from '@/services/appointments/appointmentQueries.js'

/**
 * Store Pinia pour la gestion des rendez-vous
 * Utilise les hooks TanStack Query pour la logique de cache
 */
export const useAppointmentsStore = defineStore('appointments', () => {
  // État local du store
  const selectedAppointment = ref(null)
  const currentFilters = ref({
    status: null,
    date: null,
    client_id: null,
    service_id: null,
    animal_type: null
  })
  const currentPage = ref(1)
  const perPage = ref(10)

  // Utiliser les hooks de requête
  const appointmentsQuery = useAppointments(computed(() => ({
    ...currentFilters.value,
    page: currentPage.value,
    per_page: perPage.value,
    with_relations: true
  })))

  // Getters computés
  const appointments = computed(() => appointmentsQuery.data?.value?.data || [])
  const isLoading = computed(() => appointmentsQuery.isLoading.value)
  const isError = computed(() => appointmentsQuery.isError.value)
  const error = computed(() => appointmentsQuery.error.value)

  const filteredAppointments = computed(() => {
    let filtered = appointments.value
    
    // Filtres locaux supplémentaires si nécessaire
    if (currentFilters.value.status) {
      filtered = filtered.filter(apt => apt.status === currentFilters.value.status)
    }
    
    return filtered
  })

  const appointmentsByStatus = computed(() => {
    const grouped = {
      pending: [],
      confirmed: [],
      cancelled: [],
      completed: [],
      no_show: []
    }
    
    appointments.value.forEach(appointment => {
      if (grouped[appointment.status]) {
        grouped[appointment.status].push(appointment)
      }
    })
    
    return grouped
  })

  const todayAppointments = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return appointments.value.filter(apt => apt.date === today)
  })

  const upcomingAppointments = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return appointments.value.filter(apt => apt.date > today && apt.status !== 'cancelled')
  })

  // Actions
  function setSelectedAppointment(appointment) {
    selectedAppointment.value = appointment
  }

  function clearSelectedAppointment() {
    selectedAppointment.value = null
  }

  function setFilters(filters) {
    currentFilters.value = { ...currentFilters.value, ...filters }
  }

  function clearFilters() {
    currentFilters.value = {
      status: null,
      date: null,
      client_id: null,
      service_id: null,
      animal_type: null
    }
  }

  function setPage(page) {
    currentPage.value = page
  }

  function setPerPage(count) {
    perPage.value = count
  }

  // Utilitaires
  function findAppointmentById(id) {
    return appointments.value.find(apt => apt.id === id)
  }

  function getAppointmentsByDate(date) {
    return appointments.value.filter(apt => apt.date === date)
  }

  function getAppointmentsByClient(clientId) {
    return appointments.value.filter(apt => apt.client_id === clientId)
  }

  function getAppointmentsByService(serviceId) {
    return appointments.value.filter(apt => apt.service_id === serviceId)
  }

  // Statistiques
  const stats = computed(() => ({
    total: appointments.value.length,
    pending: appointmentsByStatus.value.pending.length,
    confirmed: appointmentsByStatus.value.confirmed.length,
    cancelled: appointmentsByStatus.value.cancelled.length,
    completed: appointmentsByStatus.value.completed.length,
    today: todayAppointments.value.length,
    upcoming: upcomingAppointments.value.length
  }))

  return {
    // État
    selectedAppointment,
    currentFilters,
    currentPage,
    perPage,
    
    // Données
    appointments,
    filteredAppointments,
    appointmentsByStatus,
    todayAppointments,
    upcomingAppointments,
    
    // État de chargement
    isLoading,
    isError,
    error,
    stats,
    
    // Actions
    setSelectedAppointment,
    clearSelectedAppointment,
    setFilters,
    clearFilters,
    setPage,
    setPerPage,
    
    // Utilitaires
    findAppointmentById,
    getAppointmentsByDate,
    getAppointmentsByClient,
    getAppointmentsByService,
    
    // Query pour refetch manuel
    refetch: appointmentsQuery.refetch
  }
})

export default useAppointmentsStore
