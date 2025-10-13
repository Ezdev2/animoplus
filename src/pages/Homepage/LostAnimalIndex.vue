<template>
    <div class="w-full px-40 py-6 mt-20 bg-white">
        <div class="max-w-7xl mx-auto space-y-20">
            <!-- Step 1: Form -->
            <div v-if="currentStep === 1">
                <div class="text-center space-y-6 mb-8">
                    <h1 class="text-green-600 text-5xl font-extrabold text-center uppercase">
                        DÉCLARER UN ANIMAL PERDU
                    </h1>

                    <p class="text-green-600 text-lg font-normal mx-auto text-center mt-4">
                        REMPLISSEZ CE FORMULAIRE POUR PUBLIER UNE ANNONCE ET ALERTER LA
                        COMMUNAUTÉ.
                    </p>
                </div>

                <form @submit.prevent="nextStep" class="bg-green-200 rounded-lg p-8 space-y-6">
                    <!-- Le nom -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-800 mb-2">Le nom</label>
                        <input v-model="formData.name" type="text" placeholder="Saisissez votre texte..."
                            class="w-full px-4 py-3 rounded-full border-2 border-primary-500 focus:outline-none focus:border-green-500 placeholder-gray-400" />
                    </div>

                    <!-- L'espèce et Race Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-800 mb-2">L'espèce (chien,
                                chat...)</label>
                            <input v-model="formData.species" type="text" placeholder="Saisissez votre texte..."
                                class="w-full px-4 py-3 rounded-full border-2 border-primary-500 focus:outline-none focus:border-green-500 placeholder-gray-400" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-800 mb-2">La race (jack russel,
                                labrador...)</label>
                            <input v-model="formData.breed" type="text" placeholder="Saisissez votre texte..."
                                class="w-full px-4 py-3 rounded-full border-2 border-primary-500 focus:outline-none focus:border-green-500 placeholder-gray-400" />
                        </div>
                    </div>

                    <!-- Ville ou quartier -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-800 mb-2">Ville ou quartier où l'animal a
                            été vu pour la dernière fois</label>
                        <input v-model="formData.location" type="text" placeholder="Précisément..."
                            class="w-full px-4 py-3 rounded-full border-2 border-primary-500 focus:outline-none focus:border-green-500 placeholder-gray-400" />
                    </div>

                    <!-- Date et Contact Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label class="block text-sm font-semibold text-gray-800 mb-2">Date et heure de
                                disparition</label>
                            <input v-model="formData.dateTime" type="datetime-local"
                                class="w-full px-4 py-3 rounded-full border-2 border-primary-500 focus:outline-none focus:border-green-500 placeholder-gray-400" />
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-gray-800 mb-2">Contact à afficher</label>
                            <input v-model="formData.contact" type="text" placeholder="Téléphone ou mail"
                                class="w-full px-4 py-3 rounded-full border-2 border-primary-500 focus:outline-none focus:border-green-500 placeholder-gray-400" />
                        </div>
                    </div>

                    <!-- Photo -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-800 mb-2">Photo</label>
                        <div @click="triggerFileInput"
                            class="overflow-scroll w-full h-40 border-2 border-primary-500 rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-100 transition bg-white">
                            <div v-if="!formData.photo" class="text-center">
                                <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path
                                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                </svg>
                                <p class="text-gray-500 text-sm">Cliquez pour ajouter une photo</p>
                            </div>
                            <div v-else class="text-center">
                                <img :src="formData.photo" alt="Preview" class="h-full object-cover rounded" />
                            </div>
                        </div>
                        <input ref="fileInput" type="file" accept="image/*" class="hidden"
                            @change="handlePhotoUpload" />
                    </div>

                    <!-- Description libre -->
                    <div>
                        <label class="block text-sm font-semibold text-gray-800 mb-2">Description libre (particularités
                            physiques, collier, etc.)</label>
                        <textarea v-model="formData.description" placeholder="Saisissez votre texte..." rows="4"
                            class="w-full px-4 py-3 rounded-lg border-2 border-primary-500 focus:outline-none focus:border-green-500 placeholder-gray-400"></textarea>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit"
                        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition">
                        PARTAGER L'ANNONCE
                    </button>
                    <p class="text-xs text-gray-700 text-center">
                        En appuyant sur "Partager l'annonce", j'autorise Animo+ à diffuser cette annonce à ses
                        utilisateurs
                    </p>
                </form>
            </div>

            <!-- Step 2: Share -->
            <div v-else-if="currentStep === 2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Success Message -->
                    <div class="flex flex-col justify-center">
                        <h1 class="text-5xl font-bold text-green-600 mb-6 leading-tight">
                            ANNONCE<br />ENVOYÉE AVEC<br />SUCCÈS !
                        </h1>
                        <p class="text-gray-700 text-sm leading-relaxed">
                            NOUS AVONS IMMÉDIATEMENT DIFFUSÉ VOTRE ANNONCE À LA MAJORITÉ DE LA COMMUNAUTÉ. ELLE
                            APPARAÎTRA ÉGALEMENT DANS LA SECTION "VOIR LES ALERTES" SUR LA PAGE D'ACCUEIL.
                        </p>
                        <p class="text-gray-700 text-sm leading-relaxed mt-4">
                            POUR MULTIPLIER VOS CHANCES DE RETROUVER VOTRE COMPAGNON, PENSEZ À PARTAGER NOS VISUELS
                            PRÊTS À L'EMPLOI VIA VOS RÉSEAUX SOCIAUX QUOTIDIENNEMENT PAR MESSAGE.
                        </p>
                        <router-link to="/alert"
                            class="w-[fit-content] mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm uppercase py-3 px-8 rounded-xl transition">
                            Voir les annonces
                        </router-link>
                    </div>

                    <!-- Share Section -->
                    <div class="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                        <div class="mb-8">
                            <h2 class="text-gray-800 font-bold text-lg mb-4 flex items-center">
                                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M15 8a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path fill-rule="evenodd"
                                        d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633z"
                                        clip-rule="evenodd" />
                                </svg>
                                Partagez sur d'autre plateforme
                            </h2>
                            <p class="text-gray-600 text-sm mb-6">Partagez votre annonce sur les réseaux sociaux</p>

                            <div class="space-y-2 mb-6">
                                <button @click="copyLink"
                                    class="flex items-center text-blue-600 hover:text-blue-800 text-sm font-semibold">
                                    <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    {{ linkCopied ? 'Lien copié !' : 'Copier le lien' }}
                                </button>
                            </div>

                            <p class="text-gray-600 text-sm font-semibold mb-4">Partagez sur</p>
                            <div class="grid grid-cols-2 gap-3">
                                <button @click="shareOn('facebook')"
                                    class="flex items-center justify-center py-2 px-3 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition">
                                    <svg width="28px" height="28px" viewBox="0 0 0.56 0.56"
                                        xmlns="http://www.w3.org/2000/svg" fill="none">
                                        <path fill="#1877F2"
                                            d="M0.525 0.28a0.245 0.245 0 0 0 -0.245 -0.245 0.245 0.245 0 0 0 -0.038 0.487v-0.171H0.18V0.28h0.062V0.226c0 -0.061 0.037 -0.095 0.093 -0.095 0.027 0 0.055 0.005 0.055 0.005v0.06h-0.031c-0.03 0 -0.04 0.019 -0.04 0.038V0.28h0.068l-0.011 0.071H0.318v0.171A0.245 0.245 0 0 0 0.525 0.28" />
                                        <path fill="#ffffff"
                                            d="M0.375 0.351 0.386 0.28H0.318V0.234c0 -0.019 0.009 -0.038 0.04 -0.038h0.031V0.135s-0.028 -0.005 -0.055 -0.005c-0.056 0 -0.093 0.034 -0.093 0.095V0.28H0.18v0.071h0.062v0.171a0.245 0.245 0 0 0 0.077 0v-0.171z" />
                                    </svg>
                                    Facebook
                                </button>
                                <button @click="shareOn('twitter')"
                                    class="flex items-center justify-center py-2 px-3 rounded bg-blue-400 hover:bg-blue-500 text-white text-xs font-bold transition">
                                    <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path
                                            d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-7.029 3.75 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                    Twitter
                                </button>
                                <button @click="shareOn('whatsapp')"
                                    class="flex items-center justify-center py-2 px-3 rounded bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition">
                                    <svg width="28px" height="28px" viewBox="0 0 1.12 1.12" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M0.56 1.085c0.271 0 0.49 -0.219 0.49 -0.49S0.831 0.105 0.56 0.105 0.07 0.324 0.07 0.595c0 0.088 0.023 0.17 0.064 0.242L0.07 1.085l0.256 -0.059A0.488 0.488 0 0 0 0.56 1.085m0 -0.075c0.229 0 0.415 -0.186 0.415 -0.415 0 -0.229 -0.186 -0.415 -0.415 -0.415C0.331 0.18 0.145 0.366 0.145 0.595c0 0.088 0.028 0.17 0.075 0.238L0.183 0.972l0.142 -0.035a0.413 0.413 0 0 0 0.235 0.073"
                                            fill="#BFC8D0" />
                                        <path
                                            d="M0.98 0.56c0 0.232 -0.188 0.42 -0.42 0.42 -0.088 0 -0.171 -0.027 -0.238 -0.074L0.178 0.942l0.038 -0.141A0.418 0.418 0 0 1 0.14 0.56C0.14 0.328 0.328 0.14 0.56 0.14s0.42 0.188 0.42 0.42"
                                            fill="url(#paint0_linear_87_7264)" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M0.56 1.05c0.271 0 0.49 -0.219 0.49 -0.49S0.831 0.07 0.56 0.07 0.07 0.289 0.07 0.56c0 0.088 0.023 0.17 0.064 0.242L0.07 1.05l0.256 -0.059A0.488 0.488 0 0 0 0.56 1.05m0 -0.075c0.229 0 0.415 -0.186 0.415 -0.415 0 -0.229 -0.186 -0.415 -0.415 -0.415C0.331 0.145 0.145 0.331 0.145 0.56c0 0.088 0.028 0.17 0.075 0.238L0.183 0.937l0.142 -0.035a0.413 0.413 0 0 0 0.235 0.073"
                                            fill="white" />
                                        <path
                                            d="M0.438 0.333c-0.012 -0.023 -0.03 -0.021 -0.048 -0.021 -0.032 0 -0.083 0.039 -0.083 0.111 0 0.059 0.026 0.123 0.114 0.22 0.084 0.093 0.195 0.141 0.288 0.14s0.111 -0.081 0.111 -0.108c0 -0.012 -0.007 -0.018 -0.012 -0.019 -0.031 -0.015 -0.089 -0.043 -0.102 -0.048 -0.013 -0.005 -0.02 0.002 -0.024 0.006 -0.012 0.011 -0.036 0.045 -0.044 0.053s-0.02 0.004 -0.025 0.001c-0.019 -0.007 -0.069 -0.03 -0.109 -0.069 -0.05 -0.048 -0.052 -0.065 -0.062 -0.079 -0.007 -0.012 -0.002 -0.019 0.001 -0.022 0.011 -0.012 0.025 -0.031 0.032 -0.041s0.001 -0.024 -0.002 -0.033c-0.014 -0.038 -0.025 -0.071 -0.034 -0.089"
                                            fill="white" />
                                        <defs>
                                            <path id="paint0_linear_87_7264" x1="26.5" y1="7" x2="4" y2="28"
                                                gradientUnits="userSpaceOnUse" d="">
                                                <stop stop-color="#5BD066" />
                                                <stop offset="1" stop-color="#27B43E" />
                                            </path>
                                        </defs>
                                    </svg>
                                    WhatsApp
                                </button>
                                <button @click="shareOn('linkedin')"
                                    class="flex items-center justify-center py-2 px-3 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition">
                                    <svg width="28px" height="28px" viewBox="0 0 1.68 1.68" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path cx="24" cy="24" r="20" fill="#0077B5"
                                            d="M1.54 0.84A0.7 0.7 0 0 1 0.84 1.54A0.7 0.7 0 0 1 0.14 0.84A0.7 0.7 0 0 1 1.54 0.84z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M0.657 0.5c0 0.044 -0.033 0.079 -0.085 0.079 -0.05 0 -0.083 -0.035 -0.082 -0.079 -0.001 -0.046 0.032 -0.08 0.083 -0.08s0.083 0.034 0.084 0.08M0.494 1.149V0.641h0.158v0.508z"
                                            fill="white" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M0.778 0.803c0 -0.063 -0.002 -0.117 -0.004 -0.162h0.137l0.007 0.07h0.003c0.021 -0.032 0.073 -0.081 0.157 -0.081 0.104 0 0.182 0.068 0.182 0.218v0.301h-0.158v-0.281c0 -0.065 -0.023 -0.11 -0.08 -0.11 -0.044 0 -0.07 0.03 -0.08 0.059 -0.004 0.01 -0.006 0.025 -0.006 0.039v0.293h-0.158v-0.346z"
                                            fill="white" />
                                    </svg>
                                    LinkedIn
                                </button>
                                <button @click="shareOn('outlook')"
                                    class="flex items-center justify-center py-2 px-3 rounded bg-white hover:bg-blue-700 text-blue-600 border border-blue-600 text-xs font-bold transition col-span-2">
                                    <svg width="28px" height="28px" viewBox="0 0 1.12 1.12"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <title>file_type_outlook</title>
                                        <path
                                            d="M0.682 0.278v0.192l0.067 0.042a0.018 0.018 0 0 0 0.007 0l0.288 -0.194a0.041 0.041 0 0 0 -0.034 -0.039Z"
                                            style="fill:#0072c6" />
                                        <path
                                            d="m0.682 0.541 0.061 0.042a0.018 0.018 0 0 0 0.019 0c-0.011 0.006 0.283 -0.188 0.283 -0.188v0.352a0.049 0.049 0 0 1 -0.052 0.054h-0.311v-0.261Z"
                                            style="fill:#0072c6" />
                                        <path
                                            d="M0.365 0.453a0.056 0.056 0 0 0 -0.05 0.029 0.145 0.145 0 0 0 -0.018 0.078A0.142 0.142 0 0 0 0.316 0.637a0.056 0.056 0 0 0 0.097 0.001 0.14 0.14 0 0 0 0.018 -0.077 0.153 0.153 0 0 0 -0.018 -0.08 0.054 0.054 0 0 0 -0.048 -0.028"
                                            style="fill:#0072c6" />
                                        <path
                                            d="M0.075 0.18v0.75L0.646 1.05V0.07Zm0.382 0.502a0.113 0.113 0 0 1 -0.095 0.048 0.112 0.112 0 0 1 -0.092 -0.046A0.191 0.191 0 0 1 0.235 0.564a0.205 0.205 0 0 1 0.036 -0.127 0.114 0.114 0 0 1 0.096 -0.048 0.109 0.109 0 0 1 0.091 0.046 0.197 0.197 0 0 1 0.035 0.122 0.202 0.202 0 0 1 -0.036 0.126"
                                            style="fill:#0072c6" />
                                    </svg>
                                    Outlook
                                </button>
                            </div>
                        </div>

                        <div class="border-t pt-6">
                            <p class="text-gray-600 text-sm font-semibold mb-3">M'envoyer le lien par email</p>
                            <div class="flex gap-2">
                                <button @click="toggleEmailModal"
                                    class="flex-1 flex items-center justify-center py-2 px-3 rounded border-2 border-purple-500 text-purple-500 hover:bg-purple-50 text-sm font-bold transition">
                                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M12 6a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                    + Ajouter un adresse email
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Email Modal -->
                <div v-if="showEmailModal"
                    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div class="bg-white rounded-lg p-8 max-w-md w-full">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold text-gray-800">Add email address</h3>
                            <button @click="toggleEmailModal" class="text-gray-500 hover:text-gray-700">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <input v-model="emailToSend" type="email" placeholder="your.email@example.com"
                            class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 mb-4" />
                        <button @click="sendEmail"
                            class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition">
                            Send
                        </button>
                    </div>
                </div>

                <!-- Back Button -->
                <div class="mt-8 text-center">
                    <button @click="backToForm" class="text-green-600 hover:text-green-700 font-semibold text-sm">
                        ← Retour à la déclaration
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)
const linkCopied = ref(false)
const showEmailModal = ref(false)
const emailToSend = ref('')

const formData = ref({
  name: '',
  species: '',
  breed: '',
  location: '',
  dateTime: '',
  contact: '',
  photo: null,
  description: '',
})

const fileInput = ref(null)

function triggerFileInput() {
  fileInput.value?.click()
}

function handlePhotoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.photo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function nextStep() {
  if (!formData.value.name || !formData.value.species || !formData.value.location) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }
  currentStep.value = 2
  window.scrollTo(0, 0)
}

function backToForm() {
  currentStep.value = 1
  window.scrollTo(0, 0)
}

function copyLink() {
  const link = `${window.location.origin}/lost-animal/${Date.now()}`
  navigator.clipboard.writeText(link)
  linkCopied.value = true
  setTimeout(() => {
    linkCopied.value = false
  }, 2000)
}

function shareOn(platform) {
  const title = `Animal perdu: ${formData.value.name}`
  const description = formData.value.description
  const url = window.location.href

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    outlook: `https://outlook.live.com/owa/?path=/mail/action/compose&to=&subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}`,
  }

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400')
  }
}

function toggleEmailModal() {
  showEmailModal.value = !showEmailModal.value
}

function sendEmail() {
  if (!emailToSend.value) {
    alert('Veuillez entrer une adresse email')
    return
  }
  console.log('Email envoyé à:', emailToSend.value)
  alert('Annonce envoyée à ' + emailToSend.value)
  toggleEmailModal()
  emailToSend.value = ''
}
</script>
