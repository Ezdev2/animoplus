<template>
  <div class="appointment-page">
    <TitleDashboard 
      title="Mes rendez-vous professionnels" 
      :has-button="true" 
      btn-title="Ajouter un rendez-vous"
      :icon="smallCalendar" 
      @on-click-btn="openAddModal" 
    />

    <EventCalendar 
      :events="calendarEvents" 
      @slots-selected="onSlotsSelected"
      @event-click="onEventClick"
      :max-selection-hours="5"
    />


    <ListAppointment 
      @show-appointment-detail="showAppointmentDetail" 
      @edit-appointment="editAppointment"
    />

    <ShowAppointment 
      v-if="showModal" 
      :appointment="selectedAppointmentData" 
      @close="showModal = false" 
      @deleted="onAppointmentDeleted"
    />

    <EditAppointmentModal 
      v-if="editModal" 
      :appointment="selectedAppointmentForEdit" 
      @close="editModal = false" 
      @updated="onAppointmentUpdated"
    />
    
    <FindService 
      v-if="findServiceModal" 
      @close="findServiceModal = false"
      @service-selected="onServiceSelected"
    />

    <AddAppointmentModal 
      v-if="showAddEventModal" 
      :initial-date="formData.date"
      :initial-time="formData.startTime"
      :end-time="formData.endTime"
      :duration="formData.duration"
      @close="closeAddModal"
      @add-appointment="addAppointment"
      @refresh-data="handleRefreshData"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { auth } from '@/stores/auth'
import { useAppointmentsStore } from '@/stores/appointments'
import { useAppointments } from '@/services/appointments/appointmentQueries'

import TitleDashboard from '@/components/common/TitleDashboard.vue'
import EventCalendar from '@/components/EventCalendar.vue'
import AddAppointmentModal from './AddAppointmentModal.vue'
import EditAppointmentModal from './EditAppointmentModal.vue'
import ShowAppointment from './ShowAppointment.vue'
import FindService from './FindService.vue'
import ListAppointment from './ListAppointment.vue'

// Icons
import smallCalendar from '@/assets/icons/appointment.svg'

// Store et queries
const appointmentsStore = useAppointmentsStore()
const { data: appointmentsData, refetch } = useAppointments()

// State
const showAddEventModal = ref(false)
const showModal = ref(false)
const editModal = ref(false)
const findServiceModal = ref(false)
const selectedAppointmentData = ref(null)
const selectedAppointmentForEdit = ref(null)

const formData = ref({
  date: "",
  startTime: "",
  endTime: "",
  duration: 1,
  selectedService: null,
  animalType: "",
  address: ""
})

const rendezVousList = ref([
  {
    id: 1,
    jour: "Lundi",
    date: "17 Juin 2025",
    enLigne: true,
    titre: "Rendez-vous avec Vétérinaire urgence",
    heureDebut: "08:45",
    heureFin: "10:45",
    meetLink: "https://meet.google.com/abc-defg-hij",
    animal: "chien",
    eventType: "red",
    address: "Antananarivo, 101",
    service: "Consultation urgence"
  },
  {
    id: 2,
    jour: "Mercredi", 
    date: "12 Juillet 2025",
    enLigne: false,
    titre: "Consultation avec Dr. martine Vétérinaire",
    heureDebut: "08:45",
    heureFin: "10:45",
    animal: "chat",
    eventType: "blue",
    address: "Antananarivo, 101",
    service: "Consultation générale"
  },
  {
    id: 3,
    jour: "Mercredi",
    date: "12 Juillet 2025", 
    enLigne: false,
    titre: "Suivi avec Dr. martine Vétérinaire",
    heureDebut: "14:30",
    heureFin: "16:30",
    animal: "chien",
    eventType: "orange",
    address: "Antananarivo, 101",
    service: "Suivi post-opératoire"
  }
])

const calendarEvents = computed(() => {
  // Utiliser les données du store ou de l'API
  // L'API retourne une structure paginée : { data: { data: [...], current_page: 1, ... } }
  const appointments = appointmentsData.value?.data?.data || appointmentsStore.appointments || rendezVousList.value
  
  return appointments.map(rdv => {
    try {
      // Format API
      if (rdv.date && rdv.start_time && !rdv.jour) {
        const date = new Date(rdv.date)
        const [hours, minutes] = rdv.start_time.split(':')
        date.setHours(parseInt(hours), parseInt(minutes))
        
        return {
          id: rdv.id,
          title: rdv.service?.name || 'Consultation vétérinaire',
          date: date.toISOString()
        }
      }
      // Format mock
      else if (rdv.date && rdv.heureDebut && rdv.jour) {
        return {
          id: rdv.id,
          title: rdv.titre,
          date: convertToISODate(rdv.date, rdv.heureDebut)
        }
      }
      
      // Fallback
      return {
        id: rdv.id,
        title: rdv.titre || rdv.service?.name || 'RDV',
        date: new Date().toISOString()
      }
    } catch (error) {
      console.error("❌ Erreur conversion date pour RDV:", rdv, error)
      return {
        id: rdv.id,
        title: rdv.titre || rdv.service?.name || 'RDV',
        date: new Date().toISOString()
      }
    }
  })
})

const convertToISODate = (dateStr, timeStr) => {
  const months = {
    'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
    'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11,
    // Versions avec majuscules pour compatibilité
    'Janvier': 0, 'Février': 1, 'Mars': 2, 'Avril': 3, 'Mai': 4, 'Juin': 5,
    'Juillet': 6, 'Août': 7, 'Septembre': 8, 'Octobre': 9, 'Novembre': 10, 'Décembre': 11
  }
  
  try {
    const parts = dateStr.split(' ')
    const day = parseInt(parts[0])
    const monthName = parts[1]
    const year = parseInt(parts[2])
    
    // Vérifier si le mois existe (insensible à la casse)
    const month = months[monthName] !== undefined ? months[monthName] : months[monthName.toLowerCase()]
    
    if (month === undefined) {
      console.error("❌ Mois non reconnu:", monthName, "dans", dateStr)
      throw new Error(`Mois non reconnu: ${monthName}`)
    }
    
    const timeParts = timeStr.split(':')
    const hour = parseInt(timeParts[0])
    const minute = parseInt(timeParts[1])
    
    const date = new Date(year, month, day, hour, minute)
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      console.error("❌ Date invalide créée:", { year, month, day, hour, minute })
      throw new Error("Date invalide")
    }
    
    return date.toISOString()
  } catch (error) {
    console.error("❌ Erreur dans convertToISODate:", { dateStr, timeStr, error })
    // Retourner une date par défaut
    return new Date().toISOString()
  }
}

const getDayName = (date) => {
  return date.toLocaleDateString("fr-FR", { weekday: "long" })
}

const formatDate = (date) => {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long", 
    year: "numeric"
  })
}

// Charger les données au montage
onMounted(() => {
  console.log('📅 Chargement de la page appointments...')
  refetch()
})

// Gestion des événements
const openAddModal = () => {
  formData.value = {
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00", 
    duration: 1,
    selectedService: null,
    animalType: "",
    address: ""
  }
  showAddEventModal.value = true
}

const closeAddModal = () => {
  console.log('🚪 Fermeture du modal AddAppointment')
  showAddEventModal.value = false
}

const handleRefreshData = () => {
  console.log('🔄 Rafraîchissement des données demandé par le modal')
  refetch()
}

const onSlotsSelected = (selectionData) => {
  console.log("Données reçues dans AppointmentPage:", selectionData)
  
  // Remplir automatiquement le formulaire avec les créneaux sélectionnés
  formData.value = {
    date: selectionData.startDate.toISOString().split("T")[0],
    startTime: selectionData.startTime,
    endTime: selectionData.endTime,
    duration: selectionData.duration,
    selectedService: null,
    animalType: "",
    address: ""
  }
  
  console.log("FormData après mise à jour:", formData.value)
  showAddEventModal.value = true
}

const addAppointment = (newAppointment) => {
  try {
    console.log("📝 Données reçues pour ajout:", newAppointment)
    
    // Générer un nouvel ID
    const newId = Math.max(...rendezVousList.value.map(rdv => rdv.id)) + 1
    
    // Créer un objet Date valide
    const appointmentDate = new Date(newAppointment.date)
    
    // Vérifier si la date est valide
    if (isNaN(appointmentDate.getTime())) {
      console.error("❌ Date invalide:", newAppointment.date)
      return
    }
    
    const appointment = {
      id: newId,
      jour: getDayName(appointmentDate),
      date: formatDate(appointmentDate),
      titre: newAppointment.title || `Rendez-vous ${newAppointment.service || 'vétérinaire'}`,
      heureDebut: newAppointment.startTime,
      heureFin: newAppointment.endTime,
      animal: newAppointment.animalType || "Animal",
      address: newAppointment.address,
      service: newAppointment.service,
      enLigne: newAppointment.isOnline || false,
      eventType: newAppointment.eventType || "blue",
      meetLink: newAppointment.meetLink || ""
    }
    
    rendezVousList.value.push(appointment)
    console.log("✅ Nouveau rendez-vous ajouté:", appointment)
    
    // Rafraîchir les données de l'API pour synchroniser
    console.log("🔄 Rafraîchissement des données API...")
    refetch()
    
    // Fermer le modal après l'ajout réussi
    closeAddModal()
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout du rendez-vous:", error)
  }
}

const showAppointmentDetail = (appointment) => {
  selectedAppointmentData.value = appointment
  showModal.value = true
}

// Gestion du clic sur un événement dans le calendrier
const onEventClick = (calendarEvent) => {
  console.log('🎯 Clic sur événement calendrier:', calendarEvent)
  
  // Trouver le rendez-vous complet à partir de l'ID de l'événement
  const appointments = appointmentsData.value?.data?.data || appointmentsStore.appointments || rendezVousList.value
  const fullAppointment = appointments.find(rdv => rdv.id === calendarEvent.id)
  
  if (fullAppointment) {
    console.log('📋 Rendez-vous trouvé:', fullAppointment)
    showAppointmentDetail(fullAppointment)
  } else {
    console.warn('⚠️ Rendez-vous non trouvé pour l\'événement:', calendarEvent)
  }
}

// Gestion de la modification d'un rendez-vous
const editAppointment = (appointment) => {
  console.log('✏️ Modification du rendez-vous:', appointment)
  selectedAppointmentForEdit.value = appointment
  editModal.value = true
}

// Gestion de la mise à jour d'un rendez-vous
const onAppointmentUpdated = (updatedAppointment) => {
  console.log('✅ Rendez-vous mis à jour:', updatedAppointment)
  
  // TODO: Mettre à jour dans l'API et le store
  // Pour le moment, on simule la mise à jour locale
  
  // Fermer le modal
  editModal.value = false
  selectedAppointmentForEdit.value = null
  
  // Rafraîchir les données
  refetch()
}

// Gestion de la suppression d'un rendez-vous
const onAppointmentDeleted = (appointmentId) => {
  console.log('🗑️ Rendez-vous supprimé:', appointmentId)
  
  // Fermer le modal de détail
  showModal.value = false
  selectedAppointmentData.value = null
  
  // Rafraîchir les données pour mettre à jour la liste
  refetch()
}

const onServiceSelected = (service) => {
  formData.value.selectedService = service
  findServiceModal.value = false
  console.log("Service sélectionné :", service)
}
</script>

<style scoped>
.appointment-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
}

.appointments-list {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.list-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.appointment-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.appointment-item:last-child {
  border-bottom: none;
}

.date {
  color: #4b5563;
  font-weight: 500;
}

.title {
  flex: 1;
  margin-left: 16px;
  font-weight: 600;
}

.hour {
  color: #6b7280;
  font-size: 14px;
}
</style>