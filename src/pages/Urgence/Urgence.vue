<template>
  <div class="urgence-container font-sans text-gray-800 bg-gray-50 min-h-screen">
    
    <div class="symptom-section pt-8 pb-12">
      <h1 class="text-2xl md:text-3xl font-bold text-center mb-10 text-green-800">QUELS SONT LES SYMPTÔMES D'URGENCES ?</h1>
      
      <div class="symptom-card-dog bg-green-200 p-6 md:p-8 rounded-2xl shadow-lg mb-8 mx-auto max-w-2xl border-l-8 border-green-500">
        <div class="flex flex-col md:flex-row items-center md:items-start">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
            <img src="https://via.placeholder.com/150" alt="Chien" class="w-full h-full object-cover">
          </div>
          <div>
            <h2 class="text-2xl font-bold text-green-800 mb-2">MON CHIEN</h2>
            <p class="text-sm italic mb-4">
              Si votre chien a un de ces symptômes listés ci-dessous, cela peut-être considéré comme une urgence :
            </p>
            <ul class="list-none space-y-2 text-base">
              <li v-for="symptom in dogSymptoms" :key="symptom" class="flex items-center">
                <span class="text-yellow-500 text-lg mr-2">➜</span>
                <span>{{ symptom }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="symptom-card-cat bg-green-200 p-6 md:p-8 rounded-2xl shadow-lg mx-auto max-w-2xl border-l-8 border-green-500">
        <div class="flex flex-col md:flex-row items-center md:items-start">
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6">
            <img src="https://via.placeholder.com/150" alt="Chat" class="w-full h-full object-cover">
          </div>
          <div>
            <h2 class="text-2xl font-bold text-green-800 mb-2">MON CHAT</h2>
            <p class="text-sm italic mb-4">
              Si votre chat a un de ces symptômes listés ci-dessous, cela peut-être considéré comme une urgence :
            </p>
            <ul class="list-none space-y-2 text-base">
              <li v-for="symptom in catSymptoms" :key="symptom" class="flex items-center">
                <span class="text-yellow-500 text-lg mr-2">➜</span>
                <span>{{ symptom }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="contact-section bg-green-500 p-8 md:p-12 mt-10 text-white flex flex-col md:flex-row items-center justify-between rounded-t-3xl shadow-lg">
      <div class="text-center md:text-left mb-6 md:mb-0 md:mr-10">
        <h2 class="text-3xl md:text-4xl font-bold mb-2">DES QUESTIONS ?</h2>
        <p class="text-lg italic text-green-100">Contactez-nous via notre assistant virtuel</p>
      </div>
      
      <button class="bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-8 rounded-full text-lg shadow-xl transition-colors">
        DÉMARRER LA DISCUSSION
      </button>
      
      <div class="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden absolute right-4 md:right-10 top-1/2 -translate-y-1/2 hidden lg:block">
        <img src="https://via.placeholder.com/200" alt="Assistante virtuelle" class="w-full h-full object-cover">
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const dogSymptoms = ref([
  "Mon chien est blessé.",
  "Mon chien a les muqueuses pâles.",
  "Mon chien a mal à l'œil et/ou à l'œil fermé.",
  "Mon chien urine du sang.",
  "Mon chien tousse ou a du mal à respirer.",
  "Mon chien vomit ou a la diarrhée.",
  "Mon chien a de la fièvre."
]);

const catSymptoms = ref([
  "Mon chat bave.",
  "Mon chat urine du sang.",
  "Mon chat tousse ou a du mal à respirer.",
  "Mon chat vomit ou a la diarrhée.",
  "Mon chat a de la fièvre."
]);
</script>

<style scoped>
/*
  The Tailwind classes are quite self-descriptive and sufficient for the layout.
  You can add custom styles here if needed, but for the provided images,
  Tailwind's utility-first approach handles it well.
*/
.urgence-container {
  /* Using a dark green for the title to match the image */
  background-color: #f7fafc; /* A light gray to match the background */
}

.symptom-card-dog, .symptom-card-cat {
  /* This is to match the rounded-rectangle shape with a rounded border on the left */
  position: relative;
}

.symptom-card-dog::before, .symptom-card-cat::before {
  /* A subtle colored bar on the side, like in the image */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 12px;
  background-color: #10B981; /* A shade of green */
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.contact-section {
  /* Customizing the contact banner as per the image */
  background-color: #4CAF50; /* A shade of green */
  position: relative;
  overflow: hidden;
  clip-path: polygon(0 0, 100% 10%, 100% 100%, 0 90%); /* This creates the slanted effect */
}
</style>