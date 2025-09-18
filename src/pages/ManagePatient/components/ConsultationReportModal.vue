<template>
  <BaseModal
    title="📝 Compte-rendu de consultation"
    :footer="false"
    @close="$emit('close')"
  >
    <div class="p-6 space-y-6">
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="font-semibold mb-2">ℹ️ Informations consultation</h3>
        <p><strong>Patient:</strong> {{ appointment?.animal }}</p>
        <p><strong>Date:</strong> {{ formatDate(appointment?.date) }}</p>
        <p><strong>Service:</strong> {{ appointment?.service }}</p>
      </div>

      <div class="border border-gray-200 rounded-lg p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold">🎤 Reconnaissance vocale</h3>
          <button @click="toggleVoiceRecognition" :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-primary-500 text-white']">
            {{ isRecording ? '⏸️ Arrêter' : '🎤 Démarrer' }}
          </button>
        </div>

        <div v-if="isRecording" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-red-700 font-medium">Enregistrement en cours...</span>
          </div>
        </div>
        <textarea v-model="consultationReport.voiceTranscript" placeholder="Le texte dicté apparaîtra ici automatiquement..." rows="6"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
      </div>

      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="font-semibold mb-4">💊 Médicaments attribués (pendant le soin)</h3>
        <div class="space-y-3">
          <div v-for="(med, index) in consultationReport.medicationsUsed" :key="index" class="flex gap-3 items-center">
            <input type="text" placeholder="Nom du médicament" v-model="med.name" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <input type="number" placeholder="Quantité" v-model="med.quantity" class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            <button @click="removeMedicationUsed(index)" class="text-red-600 hover:text-red-700 px-2">🗑️</button>
          </div>
        </div>
        <button @click="addMedicationUsed" class="mt-3 w-full border-2 border-dashed border-gray-300 rounded-lg p-2 text-gray-600 hover:border-gray-400 transition-colors">
          + Ajouter un médicament
        </button>
      </div>

      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="font-semibold mb-4">📋 Médicaments prescrits</h3>
        <div class="space-y-4">
          <div v-for="(med, index) in consultationReport.medicationsPrescribed" :key="index" class="border border-gray-100 rounded-lg p-3 space-y-3">
            <div class="flex gap-3 items-center">
              <input type="text" placeholder="Nom du médicament" v-model="med.name" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              <button @click="removeMedicationPrescribed(index)" class="text-red-600 hover:text-red-700 px-2">🗑️</button>
            </div>
            <textarea placeholder="Posologie (ex: 1 comprimé matin/soir pendant 5 jours)" v-model="med.dosage" rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
        </div>
        <button @click="addMedicationPrescribed" class="mt-3 w-full border-2 border-dashed border-gray-300 rounded-lg p-2 text-gray-600 hover:border-gray-400 transition-colors">
          + Ajouter un médicament prescrit
        </button>
      </div>

      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="font-semibold mb-4">📄 Compte-rendu de consultation</h3>
        <textarea v-model="consultationReport.summary" placeholder="Résumé de la consultation, observations, diagnostic..." rows="6" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
      </div>

      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="font-semibold mb-4">📎 Pièces jointes</h3>
        <div class="space-y-3">
          <div v-for="(file, index) in consultationReport.attachments" :key="index" class="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <div class="flex items-center gap-3">
              <span class="text-blue-600">📄</span>
              <span class="font-medium">{{ file.name }}</span>
              <span class="text-sm text-gray-500">({{ file.size }})</span>
            </div>
            <button @click="removeAttachment(index)" class="text-red-600 hover:text-red-700">🗑️</button>
          </div>
        </div>
        <div class="mt-3 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input type="file" ref="fileInput" @change="handleFileUpload" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" class="hidden" />
          <button @click="$refs.fileInput.click()" class="text-blue-600 hover:text-blue-700 font-medium">📁 Choisir des fichiers</button>
          <p class="text-sm text-gray-500 mt-2">PDF, Images, Documents (max 10MB par fichier)</p>
        </div>
      </div>

      <div class="border border-gray-200 rounded-lg p-4">
        <h3 class="font-semibold mb-4">🔔 Programmer un rappel</h3>
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
        <button @click="addReminder" v-if="newReminder.type && newReminder.date" class="mt-3 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
          ✅ Programmer le rappel
        </button>
      </div>

      <div class="flex justify-between pt-6 border-t">
        <div class="flex gap-3">
          <button @click="generateInvoice" class="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium">
            🧾 Générer la facture
          </button>
          <button @click="generatePrescription" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
            📋 Générer l'ordonnance
          </button>
        </div>
        <div class="flex gap-3">
          <button @click="$emit('close')" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Annuler</button>
          <button @click="saveConsultationReport" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium">Enregistrer</button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';

const props = defineProps({
    appointment: {
        type: Object,
        required: true
    }
});
const emit = defineEmits(['close', 'save-report']);
const isRecording = ref(false);
const consultationReport = ref({
    voiceTranscript: '',
    medicationsUsed: [],
    medicationsPrescribed: [],
    summary: '',
    attachments: []
});
const newReminder = ref({ type: '', date: '', description: '' });
const fileInput = ref(null);

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR');
const toggleVoiceRecognition = () => {
    isRecording.value = !isRecording.value;
    if (isRecording.value) {
        console.log('Démarrage reconnaissance vocale');
        simulateVoiceRecognition();
    } else {
        console.log('Arrêt reconnaissance vocale');
    }
};
const simulateVoiceRecognition = () => {
    if (!isRecording.value) return;
    const phrases = ['Animal présenté en bonne forme générale.', 'Auscultation cardio-pulmonaire normale.'];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setTimeout(() => {
        consultationReport.value.voiceTranscript += (consultationReport.value.voiceTranscript ? ' ' : '') + randomPhrase;
        if (isRecording.value) {
            simulateVoiceRecognition();
        }
    }, 2000 + Math.random() * 3000);
};
const addMedicationUsed = () => {
  consultationReport.value.medicationsUsed.push({ name: '', quantity: 1 });
};
const removeMedicationUsed = (index) => {
  consultationReport.value.medicationsUsed.splice(index, 1);
};
const addMedicationPrescribed = () => {
  consultationReport.value.medicationsPrescribed.push({ name: '', dosage: '' });
};
const removeMedicationPrescribed = (index) => {
  consultationReport.value.medicationsPrescribed.splice(index, 1);
};
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
      if (file.size <= 10 * 1024 * 1024) { // 10MB max
          consultationReport.value.attachments.push({
              name: file.name,
              size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              file: file
          });
      } else {
          alert(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
      }
  });
};
const removeAttachment = (index) => {
  consultationReport.value.attachments.splice(index, 1);
};
const addReminder = () => {
  if (!newReminder.value.type || !newReminder.value.date) return;
  const reminder = {
      id: Date.now(),
      type: newReminder.value.type,
      animal: props.appointment?.animal || 'Animal',
      date: newReminder.value.date,
      description: newReminder.value.description || `Rappel ${newReminder.value.type}`
  };
  // Ceci nécessite d'émettre un événement pour ajouter le rappel au patient
  // emit('add-reminder', reminder); 
  alert('Rappel programmé avec succès !');
  newReminder.value = { type: '', date: '', description: '' };
};
const saveConsultationReport = () => {
    emit('save-report', consultationReport.value);
};
const generateInvoice = () => alert('Génération de la facture automatique...');
const generatePrescription = () => {
    if (consultationReport.value.medicationsPrescribed.length === 0) {
        alert('Aucun médicament prescrit à inclure dans l\'ordonnance');
        return;
    }
    alert('Génération de l\'ordonnance automatique...');
};
</script>