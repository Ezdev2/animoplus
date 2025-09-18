<template>
  <BaseModal
    :title="`Dossier de ${patient.owner.firstName} ${patient.owner.lastName}`"
    :footer="false"
    @close="$emit('close')"
  >
    <div class="p-6">
      <div class="border-b border-gray-200 mb-6">
        <nav class="flex space-x-8">
          <button v-for="tab in patientTabs" :key="tab.id" @click="activeTab = tab.id" :class="[
            'py-2 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]">
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div v-if="activeTab === 'info'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <h3 class="text-lg font-semibold">👤 Propriétaire</h3>
            <div class="space-y-2">
              <p><strong>Nom:</strong> {{ patient.owner.firstName }} {{ patient.owner.lastName }}</p>
              <p><strong>Email:</strong> {{ patient.owner.email }}</p>
              <div>
                <button v-if="!isEditingEmail" @click.stop="startEditingEmail"
                  class="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                  ✏️ Mail de rappel
                </button>
                <div v-else class="flex items-center gap-2">
                  <input v-model="editedEmail" type="email" class="border rounded-lg px-2 py-1 text-sm" />
                  <button @click.stop="saveEmail" class="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    ✅ Edit
                  </button>
                  <button @click.stop="cancelEdit" class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                    ❌
                  </button>
                </div>
              </div>
              <p><strong>Téléphone:</strong> {{ patient.owner.phone }}</p>
              <p><strong>Adresse:</strong> {{ patient.owner.address }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'appointments'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">📅 Historique des rendez-vous</h3>
          <router-link to="/appointment" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors">
            + Nouveau rendez-vous
          </router-link>
        </div>
        <div class="space-y-4">
          <div v-for="appointment in patient.appointments" :key="appointment.id" class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold">{{ appointment.service }}</h4>
                <p class="text-gray-600">{{ appointment.animal }} - {{ formatDate(appointment.date) }}</p>
                <p class="text-sm text-gray-500 mt-1">{{ appointment.time }}</p>
              </div>
              <span :class="['px-3 py-1 rounded-full text-sm font-medium',
                appointment.status === 'completed' ? 'bg-primary-100 text-green-800' :
                appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800']">
                {{ getStatusLabel(appointment.status) }}
              </span>
            </div>
            <button v-if="appointment.status === 'scheduled'" @click="$emit('open-consultation-report', appointment)" class="mt-3 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors">
              📝 Compte-rendu
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'reports'" class="space-y-4">
        <h3 class="text-lg font-semibold">📝 Comptes-rendus médicaux</h3>
        <div class="space-y-4">
          <div v-for="report in patient.medicalReports" :key="report.id" class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="font-semibold">{{ report.title }}</h4>
                <p class="text-gray-600">{{ report.animal }} - {{ formatDate(report.date) }}</p>
              </div>
              <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">#{{ report.documentNumber }}</span>
            </div>
            <p class="text-gray-700 mb-3">{{ report.summary }}</p>
            <button @click="toggleReportDetails(report.id)" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors">
              {{ expandedReportId === report.id ? '➖ Masquer les détails' : '👁️ Voir les détails' }}
            </button>

            <div v-if="expandedReportId === report.id" class="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
                <h4 class="font-bold mb-2">Détails</h4>
                <p class="text-sm text-gray-700 whitespace-pre-wrap">{{ report.summary }}</p>
                <div v-if="report.medicationsPrescribed && report.medicationsPrescribed.length > 0" class="mt-4">
                    <h5 class="font-semibold mb-2">Médicaments prescrits:</h5>
                    <ul>
                        <li v-for="med in report.medicationsPrescribed" :key="med.name" class="text-sm text-gray-600">
                            - **{{ med.name }}**: {{ med.dosage }}
                        </li>
                    </ul>
                </div>
                <div v-if="report.attachments && report.attachments.length > 0" class="mt-4">
                    <h5 class="font-semibold mb-2">Pièces jointes:</h5>
                    <div class="flex flex-wrap gap-2">
                        <span v-for="attachment in report.attachments" :key="attachment" class="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                            {{ attachment }}
                        </span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'reminders'" class="space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold">🔔 Rappels programmés</h3>
          <button @click="showReminderForm = !showReminderForm"
            class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-500 transition-colors">
            {{ showReminderForm ? '➖ Annuler' : '+ Programmer un rappel' }}
          </button>
        </div>

        <div v-if="showReminderForm" class="p-4 border border-blue-200 rounded-lg bg-blue-50 space-y-4">
            <h4 class="font-semibold">Nouveau rappel</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Type de rappel</label>
                    <select v-model="newReminder.type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="">Sélectionner...</option>
                        <option value="vaccination">💉 Vaccination</option>
                        <option value="controle">🩺 Contrôle</option>
                        <option value="vermifuge">💊 Vermifuge</option>
                        <option value="antiparasitaire">🦟 Antiparasitaire</option>
                        <option value="autre">🔔 Autre</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date du rappel</label>
                    <input type="date" v-model="newReminder.date" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>
            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input type="text" v-model="newReminder.description" placeholder="Ex: Rappel vaccin CHLRP" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex justify-end">
                <button @click="addReminder" :disabled="!newReminder.type || !newReminder.date"
                    class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
                    ✅ Créer
                </button>
            </div>
        </div>

        <div class="space-y-4">
          <div v-for="reminder in patient.reminders" :key="reminder.id" class="border border-gray-200 rounded-lg p-4">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="font-semibold">{{ reminder.type }}</h4>
                <p class="text-gray-600">{{ reminder.animal }} - {{ formatDate(reminder.date) }}</p>
                <p class="text-sm text-gray-500">{{ reminder.description }}</p>
              </div>
              <button @click="$emit('remove-reminder', reminder.id)" class="text-red-600 hover:text-red-700 text-sm">🗑️ Supprimer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'

const props = defineProps({
  patient: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'open-consultation-report', 'update-patient', 'remove-reminder'])

const activeTab = ref('info')
const expandedReportId = ref(null)
const showReminderForm = ref(false)
const newReminder = ref({ type: '', date: '', description: '' })
const patientTabs = [
  { id: 'info', label: '👤 Informations' },
  { id: 'appointments', label: '📅 Rendez-vous' },
  { id: 'reports', label: '📝 Comptes-rendus' },
  { id: 'reminders', label: '🔔 Rappels' }
]

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR')
const getStatusLabel = (status) => {
  const labels = { completed: '✅ Terminé', scheduled: '📅 Programmé', cancelled: '❌ Annulé' }
  return labels[status] || status
}

const toggleReportDetails = (reportId) => {
  expandedReportId.value = expandedReportId.value === reportId ? null : reportId
}

const addReminder = () => {
    if (!newReminder.value.type || !newReminder.value.date) return
    const reminder = {
        id: Date.now(),
        type: newReminder.value.type,
        animal: props.patient.animals[0]?.name || 'Inconnu',
        date: newReminder.value.date,
        description: newReminder.value.description || `Rappel ${newReminder.value.type}`
    }
    props.patient.reminders.push(reminder)
    showReminderForm.value = false
    alert('Rappel programmé avec succès !')
}

// email editing
const isEditingEmail = ref(false)
const editedEmail = ref("")
const startEditingEmail = () => {
  editedEmail.value = props.patient.owner.email
  isEditingEmail.value = true
}
const saveEmail = () => {
  if (editedEmail.value && editedEmail.value !== props.patient.owner.email) {
    const updatedPatient = { ...props.patient }
    updatedPatient.owner.email = editedEmail.value
    emit('update-patient', updatedPatient)
    alert("Email de rappel modifié avec succès ✅")
  }
  isEditingEmail.value = false
}
const cancelEdit = () => {
  isEditingEmail.value = false
  editedEmail.value = ""
}
</script>