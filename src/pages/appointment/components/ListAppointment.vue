<template>
  <div class="flex flex-col gap-4 mt-4">
    <!-- Header avec loading state -->
    <div class="flex items-center font-bold gap-4">
      <h3>Liste des rendez-vous</h3>
      <div v-if="isLoading || isFetching" class="text-sm text-gray-500">
        {{ isLoading ? 'Chargement initial...' : 'Actualisation...' }}
      </div>
      <div v-if="error" class="text-sm text-red-500">
        Erreur: {{ error.message || 'Erreur de chargement' }}
      </div>
    </div>

    <hr />

    <!-- Message si aucun RDV -->
    <div v-if="!isLoading && !isFetching && appointments.length === 0" class="text-center py-8 text-gray-500">
      Aucun rendez-vous trouvé
    </div>

    <!-- Liste des RDV -->
    <div
      v-for="(rdv, idx) in appointments"
      :key="rdv.id || idx"
      class="flex items-center bg-white border border-[#ededed] rounded-[14px] px-4 py-2 min-h-[56px] w-full hover:shadow-md transition-shadow relative"
    >
      <!-- Zone cliquable pour voir le détail (toute la ligne sauf l'icône edit) -->
      <div 
        class="flex items-center flex-1 cursor-pointer"
        @click="$emit('showAppointmentDetail', rdv)"
      >
        <!-- Colonne gauche : icône calendrier -->
        <div class="flex flex-col items-center min-w-[40px] mr-3">
          <img :src="calendarIcon" alt="calendar" class="w-7 h-7" />
        </div>

        <!-- Partie centrale (titre + sous-titre) -->
        <div class="flex flex-col flex-1">
          <span class="text-[15px] font-semibold text-[#43A047] flex items-center gap-1">
            {{ formatAppointmentDate(rdv) }}, {{ rdv.location_type === 'online' ? 'En ligne' : 'Sur place' }}
          </span>
          <div class="flex items-center text-[13px] text-[#6B7280] gap-1 mt-0.5">
            <div :class="['w-2.5 h-2.5 rounded-full', getColorClass(rdv.eventType || 'blue')]"></div>
            {{ formatAppointmentTitle(rdv) }}
          </div>
        </div>
      </div>

      <!-- Colonne droite : heure + bouton meet -->
      <div class="flex items-center justify-center min-w-[170px] w-[650px]">
        <!-- Heure -->
        <div class="self-stretch inline-flex justify-center items-center gap-5">
          <div class="justify-center text-neutral-800 text-base font-semibold leading-normal">
            {{ rdv.start_time || rdv.heureDebut }} <br />{{ getTimePeriod(rdv.start_time || rdv.heureDebut) }}
          </div>
          <div class="w-6 h-6 relative">
            <div class="w-[5.01px] h-[5.02px] left-[15.49px] top-[14.99px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100"></div>
            <div class="w-4 h-0 left-[3.50px] top-[14.99px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100"></div>
            <div class="w-[5.01px] h-[5.02px] left-[3.50px] top-[3.99px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100"></div>
            <div class="w-4 h-0 left-[3.50px] top-[9.01px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100"></div>
            <div class="w-6 h-6 left-[24px] top-[24px] absolute origin-top-left -rotate-180 opacity-0"></div>
          </div>
          <div class="justify-center text-neutral-800 text-base font-semibold leading-normal">
            {{ rdv.end_time || rdv.heureFin }} <br />{{ getTimePeriod(rdv.end_time || rdv.heureFin) }}
          </div>
        </div>
        <!-- Bouton Meet -->
        <template v-if="(rdv.location_type === 'online' || rdv.enLigne) && (rdv.online_meeting_url || rdv.meetLink)">
          <span 
            class="flex items-center justify-center bg-[#FFF] border border-[#ededed] rounded-[9px] px-[11px] h-10 text-[13px] font-medium text-[#965C2A] gap-2 cursor-pointer ml-30 min-w-[250px] hover:bg-gray-50"
            @click.stop="openMeetLink(rdv.online_meeting_url || rdv.meetLink)"
          >
            <img :src="googleMeetIcon" alt="meet" class="w-[30px] h-[30px]" />
            Go to meet link
          </span>
        </template>
      </div>

      <!-- Icône de modification -->
      <div 
        class="flex items-center justify-center w-10 h-10 ml-3 cursor-pointer hover:bg-gray-100 rounded-full transition-colors"
        @click.stop="$emit('editAppointment', rdv)"
        title="Modifier le rendez-vous"
      >
        <img :src="editIcon" alt="edit" class="w-5 h-5 text-gray-600" />
      </div>
    </div>
  </div>
</template>

<script setup>
import calendarIcon from '@/assets/icons/calendar.svg'
import googleMeetIcon from '@/assets/icons/google-meet.svg'
import editIcon from '@/assets/icons/edit.svg'
import { computed, onMounted, watch } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import { useAppointments } from '@/services/appointments/appointmentQueries'

const emit = defineEmits(['showAppointmentDetail', 'editAppointment'])

// Store et queries
const appointmentsStore = useAppointmentsStore()
const { data: appointmentsData, isLoading, error, refetch, isFetching } = useAppointments()

// Computed pour les appointments avec fallback vers le store
const appointments = computed(() => {
  // Priorité : données API > store > tableau vide
  // L'API retourne une structure paginée : { data: { data: [...], current_page: 1, ... } }
  if (appointmentsData.value?.data?.data) {
    console.log('📋 Utilisation des données API:', appointmentsData.value.data.data.length, 'rendez-vous')
    return appointmentsData.value.data.data
  }
  console.log('📋 Utilisation du store:', appointmentsStore.appointments?.length || 0, 'rendez-vous')
  return appointmentsStore.appointments || []
})

// Charger les appointments au montage
onMounted(() => {
  console.log('📋 Chargement des rendez-vous...')
  console.log('📊 États actuels:', {
    isLoading: isLoading.value,
    isFetching: isFetching.value,
    error: error.value,
    hasData: !!appointmentsData.value,
    appointmentsCount: appointments.value.length
  })
  
  // Forcer un refetch complet
  refetch({ throwOnError: false, cancelRefetch: true })
})

// Watcher pour débugger les changements d'état
watch([isLoading, error, appointmentsData], ([loading, err, data]) => {
  console.log('📊 Changement d\'état:', {
    isLoading: loading,
    isFetching: isFetching.value,
    error: err,
    hasData: !!data,
    hasDataData: !!data?.data,
    appointmentsCount: data?.data?.data?.length || 0,
    dataStructure: data ? Object.keys(data) : 'no data'
  })
}, { immediate: true })

// Fonctions utilitaires
const getColorClass = (type) => {
  switch (type) {
    case 'red': return 'bg-red-600'
    case 'blue': return 'bg-blue-600'
    case 'orange': return 'bg-orange-600'
    case 'green':
    default:
      return 'bg-green-600'
  }
}

const getTimePeriod = (time) => {
  if (!time) return ''
  const [hours] = time.split(':')
  return parseInt(hours) < 12 ? 'AM' : 'PM'
}

const openMeetLink = (meetLink) => {
  window.open(meetLink, '_blank')
}

// Formatage des données API vs mock
const formatAppointmentDate = (rdv) => {
  if (rdv.date && rdv.jour) {
    // Format mock : "Lundi le 17 Juin 2025"
    return `${rdv.jour} le ${rdv.date}`
  } else if (rdv.date) {
    // Format API : "2025-09-24T00:00:00.000000Z"
    const date = new Date(rdv.date)
    const dayName = date.toLocaleDateString('fr-FR', { weekday: 'long' })
    const formattedDate = date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
    return `${dayName} le ${formattedDate}`
  }
  return 'Date non disponible'
}

const formatAppointmentTitle = (rdv) => {
  if (rdv.titre) {
    // Format mock
    return rdv.titre
  } else if (rdv.service?.name) {
    // Format API avec service
    const animalName = rdv.animal?.nom || 'Animal'
    return `${rdv.service.name} - ${animalName}`
  }
  return 'Consultation vétérinaire'
}
</script>

<style scoped>

</style>