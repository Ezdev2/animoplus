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
      :max-selection-hours="5"
    />

    <ListAppointment 
      :appointment="rendezVousList" 
      @show-appointment-detail="showAppointmentDetail" 
    />

    <ShowAppointment 
      v-if="showModal" 
      :appointment="selectedAppointmentData" 
      @close="showModal = false" 
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
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { auth } from '@/stores/auth'

import TitleDashboard from '@/components/common/TitleDashboard.vue'
import EventCalendar from '@/components/EventCalendar.vue'
import AddAppointmentModal from './AddAppointmentModal.vue'
import ShowAppointment from './ShowAppointment.vue'
import FindService from './FindService.vue'
import ListAppointment from './ListAppointment.vue'

// Icons
import smallCalendar from '@/assets/icons/appointment.svg'

// State
const showAddEventModal = ref(false)
const showModal = ref(false)
const findServiceModal = ref(false)
const selectedAppointmentData = ref(null)

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
  return rendezVousList.value.map(rdv => ({
    id: rdv.id,
    title: rdv.titre,
    date: convertToISODate(rdv.date, rdv.heureDebut)
  }))
})

const convertToISODate = (dateStr, timeStr) => {
  const months = {
    'Janvier': 0, 'Février': 1, 'Mars': 2, 'Avril': 3, 'Mai': 4, 'Juin': 5,
    'Juillet': 6, 'Août': 7, 'Septembre': 8, 'Octobre': 9, 'Novembre': 10, 'Décembre': 11
  }
  
  const parts = dateStr.split(' ')
  const day = parseInt(parts[0])
  const month = months[parts[1]]
  const year = parseInt(parts[2])
  
  const timeParts = timeStr.split(':')
  const hour = parseInt(timeParts[0])
  const minute = parseInt(timeParts[1])
  
  return new Date(year, month, day, hour, minute).toISOString()
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

const onSlotsSelected = (selectionData) => {
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
  
  showAddEventModal.value = true
  console.log("Créneaux sélectionnés :", selectionData)
}

const closeAddModal = () => {
  showAddEventModal.value = false
  // Réinitialiser les données
  formData.value = {
    date: "",
    startTime: "",
    endTime: "",
    duration: 1,
    selectedService: null,
    animalType: "",
    address: ""
  }
}

const addAppointment = (newAppointment) => {
  // Générer un nouvel ID
  const newId = Math.max(...rendezVousList.value.map(rdv => rdv.id)) + 1
  
  const appointment = {
    id: newId,
    jour: getDayName(new Date(newAppointment.date)),
    date: formatDate(new Date(newAppointment.date)),
    titre: newAppointment.title || `Rendez-vous ${newAppointment.service || 'vétérinaire'}`,
    heureDebut: newAppointment.startTime,
    heureFin: newAppointment.endTime,
    animal: newAppointment.animalType,
    address: newAppointment.address,
    service: newAppointment.service,
    enLigne: newAppointment.isOnline || false,
    eventType: newAppointment.eventType || "blue",
    meetLink: newAppointment.meetLink || ""
  }
  
  rendezVousList.value.push(appointment)
  console.log("Nouveau rendez-vous ajouté :", appointment)
}

const showAppointmentDetail = (appointment) => {
  selectedAppointmentData.value = appointment
  showModal.value = true
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