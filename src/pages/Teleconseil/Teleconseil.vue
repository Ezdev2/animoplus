<template>
  <div class="max-w-7xl mx-auto my-8 min-h-screen  items-center">
    <div class="appointment-container bg-gray-100 p-8 w-full">
      <h1 class="text-2xl font-bold text-center mb-6 text-green-700">Prenez rendez-vous en ligne</h1>

      <div class="progress-bar-container mb-8">
      </div>

      <div class="step-content">
        <div v-if="currentStep === 1">
          <AuthPrompt @login="handleLogin" @register="handleRegister" />
        </div>

        <div v-else-if="currentStep === 2">
          <AnimalSelection @select-animal="handleSelectAnimal" />
        </div>

        <div v-else-if="currentStep === 3">
          <ServiceSelection @select-service="handleSelectService" />
        </div>

        <div v-else-if="currentStep === 4">
          <SlotSelection :appointment-data="appointmentData" @select-slot="handleSelectSlot" />
        </div>

        <div v-else-if="currentStep === 5">
          <ReasonInput @submit-reason="handleSubmitReason" />
        </div>

        <div v-else-if="currentStep === 6">
          <ConfirmationScreen :appointment-data="appointmentData" @confirm="handleConfirm" />
        </div>

        <div class="navigation-buttons mt-6 flex justify-between">
          <button v-if="currentStep > 1" @click="prevStep" class="btn-secondary">Retour</button>
          <button v-if="currentStep < 6" @click="nextStep" class="btn-primary">Suivant</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ServiceSelection from './components/ServiceSelection.vue';
import AnimalSelection from './components/AnimalSelection.vue';
import ReasonInput from './components/ReasonInput.vue';
import SlotSelection from './components/SlotSelection.vue';
import AuthPrompt from './components/AuthPrompt.vue';
import ConfirmationScreen from './components/ConfirmationScreen.vue';

const currentStep = ref(1);
const appointmentData = ref({});

function nextStep() {
  currentStep.value++;
}

function prevStep() {
  currentStep.value--;
}

function handleSelectService(service) {
  appointmentData.value.service = service;
  nextStep();
}

function handleSelectAnimal(animal) {
  appointmentData.value.animal = animal;
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
  // Logic for user login
  nextStep();
}

function handleRegister() {
  // Logic for user registration
  nextStep();
}

function handleConfirm() {
  // Logic to finalize the appointment and proceed to payment
  console.log('Appointment Confirmed:', appointmentData.value);
}
</script>

<style scoped>
/* Base styles for buttons and containers */
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
  /* max-width: 800px; */
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}
</style>