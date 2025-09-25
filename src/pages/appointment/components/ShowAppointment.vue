<template>
  <BaseModal title="Rendez-vous" @close="emit('close')" :footer="false">
    <!-- Recap Card -->
    <div class="border border-gray-200 rounded-lg p-4 bg-white flex flex-col gap-2">
      <div class="flex items-center gap-3">
        <img :src="calendarIcon" class="w-8 h-8" />
        <div class="flex flex-col">
          <span class="text-sm font-bold text-primary-600">
            {{ formattedDate }}, <span>{{ appointmentTitle }}</span>
          </span>
          <span class="text-sm text-gray-500 flex items-center gap-2">
            <div :class="['w-2.5 h-2.5 rounded-full', ellipseColorClass]"></div>
            Avec {{ serviceName }}
          </span>
        </div>
      </div>
      <div class="flex justify-center items-center gap-5">
        <div class="text-base font-semibold text-gray-800">
          {{ startTime }}<br />{{ getTimePeriod(startTime) }}
        </div>
        <div class="w-6 h-6 relative">
          <div class="w-1.5 h-1.5 absolute left-[15.49px] top-[14.99px] border border-gray-300"></div>
          <div class="w-4 h-0 absolute left-[3.5px] top-[14.99px] border border-gray-300"></div>
          <div class="w-1.5 h-1.5 absolute left-[3.5px] top-[3.99px] border border-gray-300"></div>
          <div class="w-4 h-0 absolute left-[3.5px] top-[9.01px] border border-gray-300"></div>
        </div>
        <div class="text-base font-semibold text-gray-800">
          {{ endTime }}<br />{{ getTimePeriod(endTime) }}
        </div>
      </div>
      <div v-if="appointment?.isOnline" class="mt-3 flex">
        <a :href="appointment.meetLink" target="_blank" class="flex items-center justify-center gap-2 border border-gray-200 rounded-md px-4 py-2 text-sm text-gray-600 font-medium cursor-pointer w-full">
          <img :src="googleMeetIcon" alt="meet" class="w-6 h-6" />
          Go to meet link
        </a>
      </div>
    </div>

    <!-- Infos animal/adresse/service -->
    <div class="flex flex-col gap-2 mt-5">
      <div class="flex flex-col gap-1 text-gray-600">
        <div class="text-sm">Animal</div>
        <div class="bg-gray-100 rounded-md px-3 py-2 text-base font-medium text-gray-900">
          {{ animalName }}
        </div>
      </div>
      <div class="flex flex-col gap-1 text-gray-600">
        <div class="text-sm">Adresse</div>
        <div class="bg-gray-100 rounded-md px-3 py-2 text-base font-bold text-gray-900">
          {{ appointmentAddress }}
        </div>
      </div>
      <div class="flex flex-col gap-1 text-gray-600">
        <div class="text-sm">Service</div>
        <div class="bg-gray-100 rounded-md px-3 py-2 text-base font-medium text-gray-900">
          {{ serviceDescription }}
        </div>
      </div>
    </div>

    <!-- Service Card -->
    <div class="border border-gray-200 rounded-lg p-4 mt-4 bg-white flex flex-col gap-1">
      <div class="text-green-600 font-bold text-base">
        {{ appointment?.pro?.name || 'Dr. inconnu(e)' }}
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <img :src="locationsIcon" class="w-4 h-4" />
        <span>{{ appointment?.pro?.address || 'Adresse inconnue' }}</span>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <img :src="phoneIcon" class="w-4 h-4" />
        <span>{{ appointment?.pro?.phone || 'Téléphone inconnu' }}</span>
      </div>
      <div class="flex items-center gap-2 text-sm text-gray-500">
        <img :src="clockIcon" class="w-4 h-4" />
        <span>Ouvert 24h/24</span>
      </div>
      <div class="mt-2">
        <span class="inline-block px-3 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded">
          OUVERT
        </span>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
      <button 
        @click="emit('close')" 
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Fermer
      </button>
      <button 
        @click="confirmDelete" 
        :disabled="isDeleting"
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="isDeleting">Suppression...</span>
        <span v-else>Supprimer</span>
      </button>
    </div>
  </BaseModal>
</template>

<script setup>
import { computed } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';
import { useDeleteAppointment } from '@/services/appointments/appointmentQueries';
import { useToast } from '@/composables/useToast';

import calendarIcon from '@/assets/icons/small-calendar.svg';
import googleMeetIcon from '@/assets/icons/google-meet.svg';
import phoneIcon from '@/assets/icons/phone.svg';
import locationsIcon from '@/assets/icons/location.svg';
import clockIcon from '@/assets/icons/clock.svg';

const props = defineProps({
  appointment: Object,
});

const emit = defineEmits(['close', 'deleted']);

const { success: showSuccess, error: showError } = useToast();

// Hook de suppression
const { mutate: deleteAppointment, isPending: isDeleting } = useDeleteAppointment({
  onSuccess: (data) => {
    console.log('✅ Rendez-vous supprimé:', data);
    showSuccess(data.message || 'Rendez-vous supprimé avec succès !');
    emit('deleted', props.appointment.id);
    emit('close');
  },
  onError: (error) => {
    console.error('❌ Erreur suppression:', error);
    showError(error.error || error.message || 'Erreur lors de la suppression du rendez-vous');
  }
});

// Fonction de confirmation de suppression
const confirmDelete = () => {
  if (!props.appointment?.id) {
    showError('Impossible de supprimer : ID du rendez-vous manquant');
    return;
  }

  const confirmed = window.confirm(
    `Êtes-vous sûr de vouloir supprimer ce rendez-vous ?\n\n` +
    `${appointmentTitle.value}\n` +
    `${formattedDate.value} à ${startTime.value}\n\n` +
    `Cette action est irréversible.`
  );

  if (confirmed) {
    console.log('🗑️ Suppression du rendez-vous:', props.appointment.id);
    deleteAppointment(props.appointment.id);
  }
};

// Formatage de la date
const formattedDate = computed(() => {
  if (!props.appointment?.date) return 'Date inconnue';
  
  // Format API : "2025-09-25T00:00:00.000000Z"
  if (props.appointment.date.includes('T')) {
    const date = new Date(props.appointment.date);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  // Format mock : "17 Juin 2025"
  return props.appointment.date;
});

// Titre du rendez-vous
const appointmentTitle = computed(() => {
  // Format mock
  if (props.appointment?.titre) {
    return props.appointment.titre;
  }
  
  // Format API
  if (props.appointment?.service?.name && props.appointment?.animal?.nom) {
    return `${props.appointment.service.name} - ${props.appointment.animal.nom}`;
  }
  
  return 'Consultation vétérinaire';
});

// Nom du service
const serviceName = computed(() => {
  // Format API
  if (props.appointment?.service?.name) {
    return props.appointment.service.name;
  }
  
  // Format mock
  return props.appointment?.service || 'Professionnel';
});

// Description du service
const serviceDescription = computed(() => {
  // Format API
  if (props.appointment?.service?.description) {
    return `${props.appointment.service.name} - ${props.appointment.service.description}`;
  }
  
  // Format mock
  return props.appointment?.service || 'Service inconnu';
});

// Nom de l'animal
const animalName = computed(() => {
  // Format API
  if (props.appointment?.animal?.nom) {
    return props.appointment.animal.nom;
  }
  
  // Format mock
  return props.appointment?.animal || 'Inconnu';
});

// Adresse du rendez-vous
const appointmentAddress = computed(() => {
  // Format API - pas d'adresse dans la structure actuelle
  if (props.appointment?.user?.address) {
    return props.appointment.user.address;
  }
  
  // Format mock
  return props.appointment?.address || 'Non précisé';
});

// Heure de début
const startTime = computed(() => {
  return props.appointment?.start_time || props.appointment?.heureDebut || '09:00';
});

// Heure de fin
const endTime = computed(() => {
  return props.appointment?.end_time || props.appointment?.heureFin || '10:00';
});

// Fonction pour déterminer AM/PM
const getTimePeriod = (time) => {
  if (!time) return 'AM';
  const [hours] = time.split(':');
  return parseInt(hours) < 12 ? 'AM' : 'PM';
};

// Couleur de l'ellipse
const ellipseColorClass = computed(() => {
  const type = props.appointment?.eventType;
  switch (type) {
    case 'red': return 'bg-red-600';
    case 'blue': return 'bg-blue-600';
    case 'orange': return 'bg-orange-600';
    case 'green':
    default:
      return 'bg-green-600';
  }
});
</script>
