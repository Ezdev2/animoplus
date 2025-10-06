<template>
  <div class="flex flex-col space-y-8 overflow-x-hidden relative">
    <div class="background">
      <BubbleGreen class="bubble bubble-1" />
      <BubbleYellow class="bubble bubble-2" />
      <BubbleBrown class="bubble bubble-3" />
      <BubbleGray class="bubble bubble-5" />
      <BubbleGreenTwo class="bubble bubble-6" />

      <HeroSection />
    </div>

    <div class="w-full mt-24 px-40 flex flex-col gap-[80px] items-center justify-center background-body">
      <h2 class="text-primary-600 text-center text-6xl font-extrabold uppercase">3 BÉNÉFICES POUR VOTRE QUOTIDIEN
      </h2>
      <div
        class="w-full grid grid-cols-3 gap-2 mt-2 md:gap-12 md:flex-row md:justify-between md:items-start items-stretch">
        <div v-for="(item, index) in features" :key="index"
          class="flex flex-col items-center text-center gap-4 mt-8 relative border rounded-2xl shadow-lg p-8 h-full">
          <img :src="item.icon" :alt="item.alt" />
          <h3 class="text-[20px] flex flex-col items-center font-bold text-gray-900 uppercase">
            {{ item.title }}
            <span class="">
              <img :src="lineGreen" alt="layer green" />
            </span>
          </h3>
          <p class="text-lg uppercase text-gray-600">
            {{ item.description }}
          </p>
        </div>
      </div>

      <div class="w-full mt-24 flex flex-col gap-[80px]">
        <h2 class="text-primary-600 text-center text-6xl font-extrabold uppercase">À L'AIDE DE NOS SOLUTIONS</h2>

        <div class=" mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div v-for="(card, index) in cards" :key="index"
            class="flex flex-col gap-6 card rounded-3xl overflow-hidden shadow-2xl relative bg-primary-500 p-12 min-h-[400px]">
            <h2 class="text-4xl font-bold text-white uppercase">{{ card.title }}</h2>

            <div class="flex flex-col lg:flex-row items-center">
              <ul class="list-none flex flex-col lg:w-1/2 space-y-4 text-white font-medium text-lg pr-4">
                <li v-for="(line, i) in card.items" :key="i" class="flex items-center gap-4">
                  <img :src="pointerIcon" alt="pointeur" />
                  <span v-html="line"></span>
                </li>
              </ul>

              <div class="lg:w-1/2 relative">
                <div
                  class="relative z-20 w-full rounded-xl overflow-hidden transform hover:scale-[1.02] transition duration-300">
                  <img :src="dashboardImg" :alt="card.alt" class="w-full h-auto object-cover" />
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="flex justify-center mt-12">
          <button
            class="bg-yellow-400 text-gray-800 font-bold py-4 px-12 rounded-lg text-lg hover:bg-yellow-500 transition-colors">
            VOIR NOS OFFRES
          </button>
        </div>
      </div>

      <div class="w-full py-16 px-4 md:px-8 bg-green-700 text-white rounded-xl z-1">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Testez en toute sérénité !</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mx-auto">
          <div v-for="(card, index) in serenityCards" :key="index"
            class="serenity-card bg-white text-center text-gray-800 p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold mb-2">{{ card.title }}</h3>
            <p class="text-sm">{{ card.description }}</p>
          </div>
        </div>
      </div>

      <div class="w-full mt-24 flex flex-col gap-[80px] z-1">
        <h2 class="text-primary-600 text-center text-6xl font-extrabold uppercase">DÉCOUVREZ NOTRE SIMULATEUR DE
          RENTABILITÉ</h2>
        <div class="flex flex-col md:flex-row p-16 md:px-8 bg-gray-100 rounded-lg shadow-lg">
          <div class="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0 bg-white p-8">
            <h3 class="text-xl font-bold mb-4">Calculez votre rentabilité</h3>
            <p class="text-sm text-gray-600 mb-6">Découvrez le gain de temps et les revenus additionnels que Animo+ peut
              vous apporter.</p>
            <form class="space-y-6">
              <div>
                <label for="profession" class="block text-sm font-medium text-gray-700">Quelle profession exercez-vous
                  ?</label>
                <select id="profession"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                  <option>Vétérinaire Chirurgien</option>
                  <option>Vétérinaire</option>
                </select>
              </div>
              <div>
                <span class="block text-sm font-medium text-gray-700">Souhaitez-vous accueillir de nouveaux patients
                  ?</span>
                <div class="mt-2 flex space-x-4">
                  <label class="inline-flex items-center">
                    <input type="radio" name="new_patients" class="form-radio text-green-500" value="oui">
                    <span class="ml-2">Oui</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input type="radio" name="new_patients" class="form-radio text-green-500" value="non" checked>
                    <span class="ml-2">Non</span>
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Combien de nouveaux clients par mois ?</label>
                <input type="range" class="w-full mt-2" min="0" max="100" value="10">
                <div class="flex justify-between text-sm mt-1"><span>10 nouveaux clients/mois</span></div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Quel est le tarif moyen d'une consultation (€)
                  ?</label>
                <input type="range" class="w-full mt-2" min="0" max="200" value="50">
                <div class="flex justify-between text-sm mt-1"><span>50</span></div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre de rendez-vous non honorés par
                  mois</label>
                <input type="range" class="w-full mt-2" min="0" max="50" value="5">
                <div class="flex justify-between text-sm mt-1"><span>5 rendez-vous non honorés/mois</span></div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre de consultations réalisées par
                  semaine</label>
                <input type="range" class="w-full mt-2" min="0" max="100" value="20">
                <div class="flex justify-between text-sm mt-1"><span>20</span></div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Heures passées sur l'administratif par
                  mois</label>
                <input type="range" class="w-full mt-2" min="0" max="40" value="10">
                <div class="flex justify-between text-sm mt-1"><span>10</span></div>
              </div>
            </form>
          </div>
          <div class="w-full md:w-1/2 p-6 md:p-8 text-center bg-gray-50 rounded-lg">
            <h3 class="text-xl font-bold text-green-700 mb-4">Résultats estimés :</h3>
            <div class="space-y-6">
              <div>
                <p class="text-4xl font-bold text-green-600">+800€</p>
                <p class="text-sm text-gray-600">de revenus supplémentaires par mois</p>
              </div>
              <div>
                <p class="text-4xl font-bold text-green-600">+3h</p>
                <p class="text-sm text-gray-600">par mois économisée(s)</p>
              </div>
              <div class="text-sm text-gray-600">
                <p class="bg-gray-200 rounded-md p-2">+500.00€ en accueillant 10 nouveau(x) client(s) par mois</p>
                <p class="bg-gray-200 rounded-md p-2 mt-2">+300.00€ grâce à l'optimisation de votre temps administratif
                </p>
                <p class="bg-gray-200 rounded-md p-2 mt-2">-53% de rendez-vous non honorés</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeroSection from './HeroSection.vue';
import BubbleGreen from '@/assets/bubbles/1_green.vue';
import BubbleYellow from '@/assets/bubbles/1_yellow.vue';
import BubbleBrown from '@/assets/bubbles/1_brown.vue';
import BubbleGreenTwo from '@/assets/bubbles/2_green.vue';
import BubbleGray from '@/assets/bubbles/1_gray.vue';
import careIcon from '@/assets/icons/care.svg'
import followupIcon from '@/assets/icons/followup.svg'
import certifiedIcon from '@/assets/icons/certified.svg'
import lineGreen from '@/assets/layers/line-green.svg'
import pointerIcon from "@/assets/layers/pointer.svg";
import dashboardImg from "@/assets/layers/dashboard-1.svg"

const features = [
  {
    icon: careIcon,
    alt: 'Soins',
    title: "AUGMENTEZ LES REVENUS",
    description:
      'Optimisez votre activité pour améliorer vos revenus.'
  },
  {
    icon: followupIcon,
    alt: 'Suivi',
    title: 'RÉDUCTION DE VOTRE GESTION QUOTIDIENNE',
    description:
      'Simplifiez vos processus grâce à nos outils numériques.'
  },
  {
    icon: certifiedIcon,
    alt: 'Certifiés',
    title: 'AMÉLIOREZ LA RELATION AVEC VOS PATIENTS',
    description:
      'Renforcez la satisfaction de vos patients.'
  }
]

const cards = [
  {
    title: "DÉVELOPPEMENT CLIENTÈLE",
    notification: 7,
    items: [
      "Soyez plus <strong>visible</strong> auprès des propriétaires d'animaux",
      "Simplifiez la prise de <strong>rendez-vous</strong>",
      "Moins de <strong>gestion</strong>, plus de <strong>patients</strong>!"
    ],
    image: "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Mockup+RDV",
    alt: "Planning des Rendez-vous Mockup"
  },
  {
    title: "SECRÉTARIAT NUMÉRIQUE",
    items: [
      "Simplifier la <strong>gestion des rendez-vous</strong>",
      "Facilitez la <strong>communication</strong> avec vos clients",
      "Optimiser votre temps avec notre <strong>gestionnaire des tâches</strong>"
    ],
    image: "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Mockup+Tableau+de+Bord",
    alt: "Tableau de Bord Mockup"
  },
  {
    title: "SUIVI PATIENT COMPLET",
    items: [
      "Accédez facilement aux <strong>dossiers patients</strong> et suivez leur <strong>historique médical</strong>",
      "<strong>Importez et gérez les dossiers</strong>",
      "Échangez avec vos clients via la <strong>messagerie intégrée</strong>"
    ],
    image: "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Mockup+Messagerie",
    alt: "Messagerie intégrée Mockup"
  },
  {
    title: "GESTION FINANCIÈRE ET LOGISTIQUE AVANCÉ",
    items: [
      "<strong>Suivi comptable</strong> simplifié",
      "<strong>Gestion automatisée des stocks</strong>",
      "Pilotez vos services et prestations avec une <strong>organisation claire</strong>"
    ],
    image: "https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Mockup+Gestion+Stocks",
    alt: "Gestion des Stocks Mockup"
  }
]

const serenityCards = [
  {
    title: "Installation",
    description:
      "Profitez de formations simples et vidéos explicatives pour démarrer facilement.",
  },
  {
    title: "Service Client",
    description:
      "Nos experts sont disponibles pour répondre à toutes vos questions et vous accompagner.",
  },
  {
    title: "Tarifs",
    description:
      "Des prix transparents sans frais cachés pour une utilisation optimale.",
  },
  {
    title: "Sécurité",
    description:
      "Données hébergées dans des serveurs conformes RGPD pour une sécurité maximale.",
  },
];

</script>

<style scoped>
.background {
  width: 100vw;
  height: 70vh;
  background-color: #43a047;
}

.bubble {
  position: absolute;
  opacity: 1;
}

.bubble-1 {
  top: 12%;
  left: 10px;
}

.bubble-3 {
  top: 12%;
  right: -50px;
}

.bubble-2 {
  opacity: 1;
  bottom: 1000px;
  left: 10px;
}

.bubble-5 {
  opacity: 1;
  bottom: 1200px;
  right: -100px;
}

.bubble-6 {
  opacity: 1;
  bottom: 10px;
  transform: translate(-50%, -50%);
}

.bg-custom-green-dark {
  background-color: #2e7d32;
}

.text-custom-green-accent {
  color: #4caf50;
}

.notification-dot {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 1.5rem;
  height: 1.5rem;
  background-color: #ef5350;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
  z-index: 50;
}

/* Forme de fond verte */
.shape-blob {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #4caf50;
  z-index: 10;
  border-radius: 50% 50% 0 0 / 50% 50% 0 0;
  transform: skewY(-10deg) translateY(-20%);
  overflow: hidden;
}

/* Variantes de forme */
.blob-variant-1 {
  background-color: #558b2f;
  transform: skewY(10deg) translateY(-20%) translateX(-20%);
}

.blob-variant-2 {
  background-color: #689f38;
  transform: skewY(15deg) translateY(-20%) translateX(10%);
}
</style>