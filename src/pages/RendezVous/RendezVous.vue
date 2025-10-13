<template>
  <div class="max-w-7xl mx-auto my-8 min-h-screen items-center">
    <div class="appointment-container bg-gray-100 p-8 w-full">
      <h1 class="text-2xl font-bold text-center mb-6 text-green-700">Prenez rendez-vous en ligne</h1>

      <div class="step-content">
        <!-- Step 1: Authentication -->
        <div v-if="currentStep === 1">
          <AuthPrompt @login="handleLogin" @register="handleRegister" />
        </div>

        <!-- Step 2: Animal Selection -->
        <div v-else-if="currentStep === 2">
          <AnimalSelection @select-animal="handleSelectAnimal" />
        </div>

        <!-- Step 3: Service Selection -->
        <div v-else-if="currentStep === 3">
          <ServiceSelection @select-service="handleSelectService" />
        </div>

        <!-- Step 4: City Selection -->
        <div v-else-if="currentStep === 4">
          <CitySelection @select-city="handleSelectCity" />
        </div>

        <!-- Step 5: Professional or Slot Selection -->
        <div v-else-if="currentStep === 5">
          <ProfessionnalSelection 
            v-if="isSearchingProfessional" 
            @select-professional="handleSelectProfessional"
          />
          <SlotSelection 
            v-else 
            :appointment-data="appointmentData" 
            @select-slot="handleSelectSlot" 
          />
        </div>

        <!-- Step 6: Professional Profile or Confirmation -->
        <div v-else-if="currentStep === 6">
          <ProfessionnalProfile 
            v-if="appointmentData.searchType === 'professional'"
            :professional="appointmentData.professional"
          />
          <ConfirmationScreen 
            v-else
            :appointment-data="appointmentData" 
            @confirm="handleConfirm" 
          />
        </div>

        <!-- Step 7: Pre-Confirm (only for professional search) -->
        <div v-else-if="currentStep === 7 && isSearchingProfessional">
          <PreConfirm @submit-reason="handleSubmitReason" />
        </div>

        <!-- Step 8: Final Confirmation (only for professional search) -->
        <div v-else-if="currentStep === 8 && isSearchingProfessional">
          <ConfirmationScreen 
            :appointment-data="appointmentData" 
            @confirm="handleConfirm" 
          />
        </div>

        <div class="navigation-buttons mt-6 flex justify-between">
          <button v-if="currentStep > 1" @click="prevStep" class="btn-secondary">Retour</button>
          <button 
            v-if="shouldShowNextButton" 
            @click="nextStep" 
            class="btn-primary"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ServiceSelection from './components/ServiceSelection.vue';
import AnimalSelection from './components/AnimalSelection.vue';
import PreConfirm from './components/PreConfirm.vue';
import SlotSelection from './components/SlotSelection.vue';
import AuthPrompt from './components/AuthPrompt.vue';
import ConfirmationScreen from './components/ConfirmationScreen.vue';
import CitySelection from './components/CitySelection.vue';
import ProfessionnalProfile from './components/ProfessionnalProfile.vue';
import ProfessionnalSelection from './components/ProfessionnalSelection.vue';

const currentStep = ref(1);
const appointmentData = ref({
  searchType: null,
});

const isSearchingProfessional = computed(() => {
  return appointmentData.value.searchType === 'professional';
});

const shouldShowNextButton = computed(() => {
  if (!isSearchingProfessional.value && currentStep.value === 6) return false;
  if (isSearchingProfessional.value && currentStep.value === 8) return false;
  
  // Show for all other steps except the last
  return currentStep.value < (isSearchingProfessional.value ? 8 : 6);
});

function nextStep() {
  // Skip step 7 and 8 if searching by service
  if (!isSearchingProfessional.value && currentStep.value === 6) {
    return;
  }
  currentStep.value++;
}

function prevStep() {
  currentStep.value--;
}

function handleSelectService(data) {
  
  if (data.searchType === 'service') {
    appointmentData.value.service = data;
    appointmentData.value.searchType = 'service';
  } 
  else if (data.searchType === 'professional') {
    appointmentData.value.service = null;
    appointmentData.value.searchType = 'professional';
  }
  
  nextStep();
}

function handleSelectAnimal(animal) {
  appointmentData.value.animal = animal;
  nextStep();
}

function handleSelectCity(city) {
  appointmentData.value.city = city;
  nextStep();
}

function handleSelectProfessional(professional) {
  appointmentData.value.professional = professional;
  appointmentData.value.searchType = 'professional';
  nextStep();
}

function handleSubmitReason(reason) {
  appointmentData.value.reason = reason;
  nextStep();
}

function handleSelectSlot(slot) {
  appointmentData.value.slot = slot;
  nextStep();
}

function handleLogin() {
  nextStep();
}

function handleRegister() {
  nextStep();
}

function handleConfirm() {
  console.log('Appointment Confirmed:', appointmentData.value);
}
</script>

<style scoped>
.btn-primary {
  background: #43a047;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.btn-primary:disabled {
  background: #a5a5a5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #374151;
  cursor: pointer;
}

.appointment-container {
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}
</style>