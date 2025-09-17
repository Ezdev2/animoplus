<template>
    <div class="w-full flex items-center justify-center my-16">
        <div class="background absolute inset-0 bg-cover bg-center bg-no-repeat z-0"></div>

        <div class="w-[620px] z-10 px-10 py-8 bg-white shadow-lg rounded-xl flex flex-col gap-6">
            <h1 class="text-primary-600 text-3xl font-bold text-center">
                Inscription {{ isPro ? 'professionnel' : 'propriétaire' }}
            </h1>

            <!-- Étapes -->
            <component :is="currentStepComponent" :formData="formData" @next="goNext" @prev="goPrev"
                @togglePro="togglePro" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Import des sous-étapes
import StepOwnerInfos from './components/StepOwnerInfos.vue'
import StepProInfos from './components/StepProInfos.vue'
import StepCompanionInfos from './components/StepCompanionInfos.vue'

const step = ref(1)
const isPro = ref(false)

const formData = ref({
  // Données communes
  email: '',
  password: '',
  gender: '',
  firstname: '',
  lastname: '',
  birthdate: '',
  profilePicture: null,
  termsAccepted: false,

  // Compagnon
  species: null,
  race: null,
  weight: '',
  
  // Pro
  newsletter: false,
  cgv: false,
  cgu: false,
  mentions: false,
  contrat: false
})

const currentStepComponent = computed(() => {
  if (isPro.value) return StepProInfos
  if (step.value === 1) return StepOwnerInfos
  if (step.value === 2) return StepCompanionInfos
  return StepOwnerInfos
})

function goNext() {
  step.value++
}
function goPrev() {
  if (step.value > 1) step.value--
}
function togglePro() {
  isPro.value = true
  step.value = 1
}
</script>

<style scoped>
.background {
    background-image: url("../../assets/images/bg-login.svg");
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 55vh;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    z-index: -1;
}
</style>