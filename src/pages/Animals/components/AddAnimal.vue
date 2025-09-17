<template>
  <BaseModal 
    title="Information sur l’animal" 
    @close="showModal = false" 
    :footer="false"
  >
    <!-- Étape 1 -->
    <form v-if="step === 1" class="form-content">
      <label>
        Nom
        <input type="text" placeholder="Entrer le nom" v-model="formData.name" />
      </label>

      <label>
        Espèce
        <select v-model="formData.species">
          <option disabled value="">Sélectionner une espèce</option>
          <option>Chien</option>
          <option>Chat</option>
          <option>NAC</option>
        </select>
      </label>

      <label>
        Race
        <select v-model="formData.race">
          <option disabled value="">Sélectionner une race</option>
        </select>
      </label>

      <div class="medical-history">
        <img :src="DocMedical" class="icon" alt="historique" />
        <span>🩺 Historique médical</span>
      </div>

      <textarea v-model="formData.medical" placeholder="Écrire ici ..."></textarea>

      <label>
        Poids (kg)
        <input type="number" placeholder="Poids en kg" v-model="formData.weight" />
      </label>

      <label>
        Taille (cm)
        <input type="number" placeholder="Taille en cm" v-model="formData.height" />
      </label>

      <label>
        Date de naissance
        <div class="custom-date-input" @click="hiddenDate.click()">
          <img :src="calendarIcon" class="icon" alt="date" />
          <input type="text" v-model="birthDate" placeholder="19 January 2025" />
        </div>
      </label>

      <input
        type="date"
        ref="hiddenDate"
        class="hidden-date-input"
        @input="updateFormattedDate"
      />

      <div class="actions">
        <button type="button" class="btn-primary" @click="nextStep">Suivant</button>
      </div>
    </form>

    <!-- Étape 2 -->
    <div v-else-if="step === 2" class="form-content">
      <h3 class="font-semibold text-gray-700">Profil comportemental</h3>

      <Question
        label="Comment votre animal se comporte-t-il lors des promenades ?"
        :options="[
          'Il est calme et marche bien en laisse',
          'Il tire beaucoup ou s’excite facilement',
          'Il est craintif ou réactif (aboie, grogne, etc.)',
          'Non concerné'
        ]"
        v-model="formData.walks"
      />

      <Question
        label="Votre animal est-il sociable avec les autres animaux ?"
        :options="[
          'Oui, il joue volontiers avec eux',
          'Oui, mais il préfère les animaux calmes',
          'Non, il est réactif ou craintif',
          'Je ne sais pas / rarement en contact'
        ]"
        v-model="formData.sociability"
      />

      <Question
        label="Comment réagit-il face aux inconnus ?"
        :options="[
          'Il est à l’aise et sociable',
          'Il est méfiant au début, puis se détend',
          'Il grogne, aboie ou fuit',
          'Je ne sais pas'
        ]"
        v-model="formData.strangers"
      />

      <Question
        label="Votre animal supporte-t-il bien les manipulations (vétérinaire, toilettage, soins, etc.) ?"
        :options="[
          'Oui, sans souci',
          'Il est stressé mais coopératif',
          'Il se débat ou peut mordre / griffer',
          'Jamais testé'
        ]"
        v-model="formData.handling"
      />

      <Question
        label="Votre animal est-il propre et calme à la maison ?"
        :options="[
          'Oui, totalement',
          'Il a parfois des accidents ou vocalise',
          'Il détruit, fugue ou a des troubles du comportement',
          'Non applicable'
        ]"
        v-model="formData.home"
      />

      <Question
        label="Peut-il rester seul sans problème ?"
        :options="[
          'Oui, il reste calme',
          'Il pleure un peu, mais se calme',
          'Non, il est destructeur ou très anxieux',
          'Je ne l’ai jamais laissé seul'
        ]"
        v-model="formData.alone"
      />

      <Question
        label="Votre animal a-t-il des peurs ou sensibilités particulières ?"
        :options="[
          'Non, il est plutôt confiant',
          'Oui, il a peur des bruits forts ou des inconnus',
          'Oui, il est sensible à certaines manipulations',
          'Je ne sais pas'
        ]"
        v-model="formData.fears"
      />

      <label>
        Souhaitez-vous signaler un comportement spécifique ?
        <textarea v-model="formData.notes" placeholder="Réponse facultative..."></textarea>
      </label>

      <div class="actions">
        <button type="button" class="btn-secondary" @click="prevStep">Retour</button>
        <button type="submit" class="btn-primary">Valider</button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import Question from '@/components/common/Question.vue'
import calendarIcon from '@/assets/icons/small-calendar.svg'
import DocMedical from '@/assets/icons/DocMedical.svg'

const step = ref(1)
const birthDate = ref('')
const hiddenDate = ref(null)

const formData = ref({
  name: '',
  species: '',
  race: '',
  medical: '',
  weight: '',
  height: '',
  birthDate: '',

  walks: '',
  sociability: '',
  strangers: '',
  handling: '',
  home: '',
  alone: '',
  fears: '',
  notes: ''
})

function updateFormattedDate(e) {
  const date = new Date(e.target.value)
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  birthDate.value = date.toLocaleDateString('fr-FR', options)
  formData.value.birthDate = e.target.value
}

function nextStep() {
  step.value = 2
}
function prevStep() {
  step.value = 1
}
</script>

<style scoped>
/* même style que toi */
.form-content {
  margin-top: 12px;
  font-size: medium;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: scroll;
}

label {
  color: #4B5563;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

input,
select,
textarea {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 8px;
}

textarea {
  resize: vertical;
  min-height: 60px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.btn-primary {
  background: #43a047;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  padding: 8px 16px;
  border-radius: 6px;
}
</style>
