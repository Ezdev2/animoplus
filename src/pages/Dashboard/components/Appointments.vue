<template>
    <CardLayout title="Mes rendez-vous" link="/appointment">
        <!-- État de chargement avec skeleton -->
        <SkeletonLoader 
            v-if="isLoadingAppointments"
            type="appointment"
            :count="1"
            :animated="true"
        />
        
        <!-- Prochain rendez-vous -->
        <div v-else-if="nextAppointment" class="self-stretch flex flex-col justify-start items-start gap-2">
            <div class="self-stretch inline-flex justify-center items-center gap-5">
                <img :src="calendarIcon" class="text-primary-600" alt="appointment" />
                <div class="flex-1 inline-flex flex-col justify-start items-start gap-2">
                    <div
                        class="self-stretch justify-center text-color-gray-100 text-xs font-medium font-['League_Spartan'] leading-none">
                        Prochain rendez-vous
                    </div>
                    <div class="self-stretch inline-flex justify-start items-center gap-2">
                        <div class="w-2.5 h-2.5 rounded-full" :class="statusColor"></div>
                        <div
                            class="flex-1 justify-center text-color-gray-100 text-xs font-medium font-['League_Spartan'] leading-none">
                            {{ appointmentTitle }}
                        </div>
                    </div>
                </div>
            </div>

            <hr />
            
            <div class="self-stretch inline-flex justify-center items-center gap-5">
                <div
                    class="justify-center text-neutral-800 text-base font-semibold font-['League_Spartan'] leading-normal">
                    {{ formattedTime.start }}
                </div>
                <div class="w-6 h-6 relative">
                    <div
                        class="w-[5.01px] h-[5.02px] left-[15.49px] top-[14.99px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100">
                    </div>
                    <div
                        class="w-4 h-0 left-[3.50px] top-[14.99px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100">
                    </div>
                    <div
                        class="w-[5.01px] h-[5.02px] left-[3.50px] top-[3.99px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100">
                    </div>
                    <div
                        class="w-4 h-0 left-[3.50px] top-[9.01px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-color-gray-100">
                    </div>
                    <div class="w-6 h-6 left-[24px] top-[24px] absolute origin-top-left -rotate-180 opacity-0"></div>
                </div>
                <div
                    class="justify-center text-neutral-800 text-base font-semibold font-['League_Spartan'] leading-normal">
                    {{ formattedTime.end }}
                </div>
            </div>
            <div v-if="isOnline"
                class="self-stretch px-4 py-1 bg-color-gray-10 rounded-xl outline outline-1 outline-offset-[-1px] outline-stone-300/50 inline-flex justify-center items-center gap-2">
                <img :src="googleMeetIcon" alt="meeting icon" />
                <div
                    class="justify-center text-color-gray-80 text-sm font-normal font-['League_Spartan'] leading-tight">
                    Voir le lien
                </div>
            </div>
            <div v-else
                class="self-stretch px-4 py-1 bg-color-gray-10 rounded-xl outline outline-1 outline-offset-[-1px] outline-stone-300/50 inline-flex justify-center items-center gap-2">
                <div
                    class="justify-center text-color-gray-80 text-sm font-normal font-['League_Spartan'] leading-tight">
                    📍 Consultation sur place
                </div>
            </div>
        </div>
        
        <!-- État vide quand aucun rendez-vous -->
        <div v-else class="self-stretch flex flex-col justify-center items-center gap-4 py-8">
            <img :src="calendarIcon" class="text-primary-600 opacity-50" alt="appointment" />
            <div class="text-center">
                <div class="text-color-gray-100 text-sm font-medium font-['League_Spartan'] leading-none mb-2">
                    Aucun rendez-vous à venir
                </div>
                <div class="text-color-gray-80 text-xs font-normal font-['League_Spartan'] leading-tight">
                    Planifiez votre prochain rendez-vous
                </div>
            </div>
        </div>

    </CardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { auth } from '@/stores/auth'
import { useAppointmentsStore } from '@/stores/appointments'
import { useAppointments } from '@/services/appointments/appointmentQueries'

import CardLayout from "./CardLayout.vue";
import LoadingState from "@/components/LoadingState.vue";
import SkeletonLoader from "@/components/SkeletonLoaderSimple.vue";
import calendarIcon from "@/assets/icons/calendar.svg";
import googleMeetIcon from "@/assets/icons/google-meet.svg";

// Store et queries
const appointmentsStore = useAppointmentsStore()
const appointmentsQuery = useAppointments()
const appointmentsData = appointmentsQuery?.data || ref(null)
const isLoadingAppointments = appointmentsQuery?.isLoading || ref(false)
const refetch = appointmentsQuery?.refetch || (() => console.log('Refetch non disponible'))

// Computed pour récupérer le rendez-vous le plus proche
const nextAppointment = computed(() => {
  try {
    // Récupérer les données de l'API avec la bonne structure
    let appointments = []
    
    // Structure de la réponse API: { success: true, data: { data: [...] } }
    if (appointmentsData.value?.data?.data) {
      appointments = appointmentsData.value.data.data
    } else if (appointmentsStore.appointments) {
      appointments = appointmentsStore.appointments
    }
    
    console.log('📊 Données appointments récupérées:', appointments)
    
    if (!Array.isArray(appointments) || appointments.length === 0) {
      console.log('📊 Aucun rendez-vous trouvé ou format incorrect')
      return null
    }

    const now = new Date()
    
    // Filtrer et trier les rendez-vous à venir
    const upcomingAppointments = appointments
      .map(rdv => {
        try {
          // Format API uniquement
          if (rdv.date && rdv.start_time) {
            const appointmentDate = new Date(`${rdv.date.split('T')[0]}T${rdv.start_time}`)
            return {
              ...rdv,
              appointmentDate
            }
          }
          return null
        } catch (error) {
          console.error('Erreur parsing date:', error, rdv)
          return null
        }
      })
      .filter(rdv => rdv && rdv.appointmentDate && rdv.appointmentDate > now)
      .sort((a, b) => a.appointmentDate - b.appointmentDate)

    console.log('📊 Rendez-vous à venir:', upcomingAppointments)
    return upcomingAppointments.length > 0 ? upcomingAppointments[0] : null
    
  } catch (error) {
    console.error('Erreur dans nextAppointment computed:', error)
    return null
  }
})

// Computed pour formater l'heure d'affichage
const formattedTime = computed(() => {
  try {
    if (!nextAppointment.value) return { start: '00:00', end: '00:00' }
    
    const appointment = nextAppointment.value
    
    // Format API uniquement
    if (appointment.start_time) {
      const startTime = appointment.start_time.substring(0, 5) // "09:00:00" -> "09:00"
      const endTime = appointment.end_time ? appointment.end_time.substring(0, 5) : startTime
      return { start: startTime, end: endTime }
    }
    
    return { start: '00:00', end: '00:00' }
  } catch (error) {
    console.error('Erreur formattage heure:', error)
    return { start: '00:00', end: '00:00' }
  }
})

// Computed pour la couleur du point d'état
const statusColor = computed(() => {
  try {
    if (!nextAppointment.value) return 'bg-gray-400'
    
    const appointment = nextAppointment.value
    
    // Basé sur le nom du service (format API)
    if (appointment.service?.name) {
      const serviceName = appointment.service.name.toLowerCase()
      if (serviceName.includes('urgence')) {
        return 'bg-red-700'
      } else if (serviceName.includes('suivi') || serviceName.includes('contrôle')) {
        return 'bg-orange-500'
      }
    }
    
    // Couleur par défaut
    return 'bg-blue-500'
  } catch (error) {
    console.error('Erreur couleur statut:', error)
    return 'bg-gray-400'
  }
})

// Computed pour le titre du rendez-vous
const appointmentTitle = computed(() => {
  try {
    if (!nextAppointment.value) return 'Aucun rendez-vous à venir'
    
    const appointment = nextAppointment.value
    
    // Format API uniquement
    if (appointment.service?.name) {
      return appointment.service.name
    }
    
    return 'Rendez-vous'
  } catch (error) {
    console.error('Erreur titre rendez-vous:', error)
    return 'Rendez-vous'
  }
})

// Computed pour savoir si c'est en ligne
const isOnline = computed(() => {
  try {
    if (!nextAppointment.value) return false
    
    const appointment = nextAppointment.value
    // Format API uniquement
    return appointment.location_type === 'online'
  } catch (error) {
    console.error('Erreur type consultation:', error)
    return false
  }
})

// Initialisation
onMounted(() => {
  // Charger les données comme dans AppointmentPage
  console.log('📅 Chargement des rendez-vous pour le dashboard...')
  refetch()
})
</script>
