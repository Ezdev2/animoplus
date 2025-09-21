<template>
    <section class="border border-neutral-200 rounded-[10px] p-8 flex flex-col gap-8">
        <TitleDashboard title="Gestion des Patients" :has-button="true" btn-title="+ Créer un dossier patient"
            @on-click-btn="showCreatePatient = true" />
        <hr />

        <PatientList :patients="filteredPatients" :search-query="searchQuery" :status-filter="statusFilter"
            @update:search-query="searchQuery = $event" @update:status-filter="statusFilter = $event"
            @select-patient="selectPatient" />

        <CreatePatientModal v-if="showCreatePatient" @close="showCreatePatient = false" @patient-created="handlePatientCreated" />

        <PatientDetailsModal v-if="selectedPatient" :patient="selectedPatient" @close="selectedPatient = null"
            @open-consultation-report="openConsultationReport" @update-patient="updatePatient"
            @remove-reminder="removeReminder" />

        <ConsultationReportModal v-if="showConsultationModal" :appointment="currentAppointment" @close="showConsultationModal = false"
            @save-report="saveConsultationReport" />
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TitleDashboard from '@/components/common/TitleDashboard.vue'
import PatientList from './components/PatientList.vue'
import PatientDetailsModal from './components/PatientDetailsModal.vue'
import CreatePatientModal from './components/CreatePatientModal.vue'
import ConsultationReportModal from './components/ConsultationReportModal.vue'
// import { useUsers } from '@/composables/useUsers.js'

// State
const patients = ref([])
const searchQuery = ref('')
const statusFilter = ref('all')
const selectedPatient = ref(null)
const showCreatePatient = ref(false)
const showConsultationModal = ref(false)
const currentAppointment = ref(null)

// Données initiales (déplacées ici)
const initialPatients = [
    {
        id: 1,
        status: 'active',
        owner: {
            firstName: 'Marie',
            lastName: 'Dubois',
            email: 'marie.dubois@email.com',
            phone: '06 12 34 56 78',
            address: '123 rue de la République, Lyon'
        },
        preferences: {
            smsNotifications: true,
            emailNotifications: true
        },
        animals: [
            {
                id: 1,
                name: 'Max',
                type: 'chien',
                breed: 'Berger Allemand',
                age: 3,
                gender: 'male',
                weight: 35
            },
            {
                id: 2,
                name: 'Luna',
                type: 'chat',
                breed: 'Siamois',
                age: 2,
                gender: 'female',
                weight: 4
            }
        ],
        appointments: [
            {
                id: 1,
                service: 'Consultation générale',
                animal: 'Max',
                date: '2024-01-15',
                time: '14:30',
                status: 'completed'
            },
            {
                id: 2,
                service: 'Vaccination',
                animal: 'Luna',
                date: '2024-01-20',
                time: '10:00',
                status: 'scheduled'
            }
        ],
        medicalReports: [
            {
                id: 1,
                title: 'Consultation générale - Max',
                animal: 'Max',
                date: '2024-01-15',
                documentNumber: '2024-01/15001',
                summary: 'Contrôle de routine, animal en bonne santé.',
                attachments: ['radio_thorax.pdf', 'analyses_sang.pdf']
            }
        ],
        reminders: [
            {
                id: 1,
                type: 'Vaccination',
                animal: 'Max',
                date: '2024-06-15',
                description: 'Rappel vaccin CHLRP'
            }
        ]
    },
    {
        id: 2,
        status: 'pending',
        owner: {
            firstName: 'Jean',
            lastName: 'Martin',
            email: 'jean.martin@email.com',
            phone: '06 98 76 54 32',
            address: '456 avenue des Champs, Lyon'
        },
        preferences: {
            smsNotifications: false,
            emailNotifications: true
        },
        animals: [
            {
                id: 3,
                name: 'Minou',
                type: 'chat',
                breed: 'Persan',
                age: 5,
                gender: 'male',
                weight: 6
            }
        ],
        appointments: [],
        medicalReports: [],
        reminders: []
    }
]

// Computed
const filteredPatients = computed(() => {
    let filtered = patients.value
    if (statusFilter.value !== 'all') {
        filtered = filtered.filter(p => p.status === statusFilter.value)
    }
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(p =>
            p.owner.firstName.toLowerCase().includes(query) ||
            p.owner.lastName.toLowerCase().includes(query) ||
            p.owner.email.toLowerCase().includes(query) ||
            p.animals.some(a => a.name.toLowerCase().includes(query))
        )
    }
    return filtered
})

// Methods
const selectPatient = (patient) => {
    selectedPatient.value = patient
}

const handlePatientCreated = (newPatient) => {
    patients.value.unshift(newPatient)
    showCreatePatient.value = false
    alert(`Dossier créé ! Un email d'activation a été envoyé à ${newPatient.owner.email}`)
}

const openConsultationReport = (appointment) => {
    currentAppointment.value = appointment
    showConsultationModal.value = true
}

const saveConsultationReport = (reportData) => {
    const report = {
        id: Date.now(),
        title: `${currentAppointment.value.service} - ${currentAppointment.value.animal}`,
        animal: currentAppointment.value.animal,
        date: currentAppointment.value.date,
        documentNumber: `2024-01/${Math.floor(Math.random() * 1000)}`,
        summary: reportData.summary || reportData.voiceTranscript,
        attachments: reportData.attachments.map(a => a.name),
        medicationsUsed: reportData.medicationsUsed,
        medicationsPrescribed: reportData.medicationsPrescribed
    }

    selectedPatient.value.medicalReports.unshift(report)

    const appointment = selectedPatient.value.appointments.find(a => a.id === currentAppointment.value.id)
    if (appointment) {
        appointment.status = 'completed'
    }

    showConsultationModal.value = false
    alert(`Compte-rendu sauvegardé (Document #${report.documentNumber})`)
}

const updatePatient = (updatedPatient) => {
    const index = patients.value.findIndex(p => p.id === updatedPatient.id)
    if (index !== -1) {
        patients.value[index] = updatedPatient
    }
}

const removeReminder = (reminderId) => {
    const index = selectedPatient.value.reminders.findIndex(r => r.id === reminderId)
    if (index !== -1) {
        selectedPatient.value.reminders.splice(index, 1)
        alert('Rappel supprimé')
    }
}

// Nouveau système avec API (en mode fallback pour éviter les erreurs)
// TODO: Activer quand l'API sera prête
// const { 
//   users, 
//   clientUsers, 
//   loading: usersLoading, 
//   error: usersError,
//   fetchUsers,
//   searchUsers 
// } = useUsers()

// Initialisation
onMounted(async () => {
  // Garder les données mock pour l'instant (pas de changement visuel)
  patients.value = [...initialPatients]
  
  // TODO: Récupérer les utilisateurs clients depuis l'API
  console.log('Page ManagePatient initialisée avec données mock')
})

// Fonction pour rechercher des clients (préparée pour l'API)
const searchClients = async (query) => {
  console.log('Recherche clients (API pas encore connectée):', query)
  // TODO: Implémenter la recherche API
}
</script>