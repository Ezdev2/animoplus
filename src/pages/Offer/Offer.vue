<template>
    <div class="w-full px-40 py-6 mt-20 bg-white">
        <div class="max-w-7xl mx-auto space-y-20">
            <!-- Version d’essai gratuite -->
            <div v-if="!showOffer" class=" flex flex-col gap-6">
                <div class="text-center space-y-6">
                    <h1 class="text-green-600 text-5xl font-extrabold text-center uppercase">
                        Découvrez nos offres
                    </h1>

                    <p class="text-green-600 text-lg font-normal mx-auto text-center mt-4">
                        Découvrez l'ensemble des professionnels du secteur animalier référencés sur DoctoPet.
                    </p>
                </div>
                <!-- Trial Content -->
                <div class="grid md:grid-cols-2 gap-6">
                    <div class="bg-primary-300 p-8 rounded-lg">
                        <h2 class="text-2xl font-semibold text-gray-800 mb-2">
                            Version d'essai gratuite
                        </h2>
                        <p class="text-gray-600 leading-relaxed mb-4">
                            Familiarisez-vous avec notre solution avant de vous lancer.
                        </p>
                        <p class="text-lg my-5 text-gray-600">
                            Vous bénéficiez d'un
                            <strong class="font-semibold text-gray-800">
                                mois gratuit sans engagement
                            </strong>
                            pour tester notre logiciel et vous faire votre propre avis en ayant accès à l'ensemble de
                            nos
                            fonctionnalités.
                        </p>
                    </div>
                    <div class="bg-primary-300 p-8 rounded-lg flex flex-col justify-between gap-6">
                        <ul class="list-none space-y-3">
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Gestion et secretariat
                                nnumérique
                            </li>
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Développement de la
                                clientèle
                            </li>
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Contuinité des soins pour
                                vos
                                patients
                            </li>
                        </ul>
                        <button @click="goToRegister"
                            class="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm uppercase py-3 px-8 rounded-full w-full transition">
                            CRÉER MON COMPTE
                        </button>
                    </div>
                </div>

                <!-- Features Grid -->
                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Offre 1 -->
                    <div class="bg-primary-500 p-6 rounded-lg flex flex-col">
                        <h3 class="text-2xl font-extrabold text-gray-800 mb-4">OFFRE 1 – AGENDA ESSENTIEL</h3>
                        <p class="text-gray-800 text-lg leading-relaxed flex-grow mb-6">
                            Conservez vos habitudes avec la prise de rendez-vous en
                            ligne, tout en bénéficiant d’un service complémentaire
                            personnalisé.

                            Cette offre s’intègre comme une suite à votre logiciel actuel et
                            vous permet d’améliorer le suivi de vos patients.
                        </p>
                    </div>
                    <div class="bg-primary-500 p-6 rounded-lg flex flex-col justify-between gap-6">
                        <ul class="list-none space-y-3">
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Gestion et secretariat
                                nnumérique
                            </li>
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Développement de la
                                clientèle
                            </li>
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Contuinité des soins pour
                                vos
                                patients
                            </li>
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Contuinité des soins pour
                                vos
                                patients
                            </li>
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Contuinité des soins pour
                                vos
                                patients
                            </li>
                        </ul>
                        <button @click="selectOffer(1)"
                            class="bg-white hover:bg-green-700 text-primary-600 py-3 px-8 rounded-full font-semibold uppercase text-sm transition w-full">
                            VOIR LES FORMULES
                        </button>
                    </div>

                    <!-- Offre 2 -->
                    <div class="bg-primary-600 p-6 rounded-lg flex flex-col">
                        <h3 class="text-2xl font-extrabold text-gray-800 mb-4">OFFRE 2 – LOGICIEL COMPLET</h3>
                        <p class="text-gray-800 text-lg leading-relaxed flex-grow mb-6">
                            La solution la plus complète pour gérer et développer votre
                            activité. Elle regroupe l’agenda en ligne, la gestion des patients,
                            la messagerie, la facturation, la comptabilité et même le suivi
                            des stocks.

                            Grâce à son automatisation et à son interconnexion, chaque
                            action (prise de rendez-vous, paiement, commande de
                            matériel) est synchronisée en temps réel.
                        </p>
                    </div>
                    <div class="bg-primary-600 p-6 rounded-lg flex flex-col justify-between gap-6">
                        <ul class="list-none space-y-3">
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-500 text-xl font-bold mr-2">✓</span> Gestion et secretariat
                                nnumérique
                            </li>
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-500 text-xl font-bold mr-2">✓</span> Développement de la
                                clientèle
                            </li>
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-500 text-xl font-bold mr-2">✓</span> Contuinité des soins pour
                                vos
                                patients
                            </li>
                            <li class="text-lg text-gray-800 flex items-center">
                                <span class="text-primary-500 text-xl font-bold mr-2">✓</span> Contuinité des soins pour
                                vos
                                patients
                            </li>
                        </ul>
                        <button @click="selectOffer(2)"
                            class="bg-white hover:bg-green-700 text-primary-600 py-3 px-8 rounded-full font-semibold uppercase text-sm transition w-full">
                            VOIR LES FORMULES
                        </button>
                    </div>
                </div>

                <!-- Offre Clinique -->
                <div class="mt-16">
                    <h1 class="text-green-600 text-5xl font-extrabold text-center mb-8">
                        OFFRE CLINIQUE – GESTION CENTRALISÉE
                    </h1>

                    <div class="grid md:grid-cols-2 gap-6">
                        <div class="bg-gray-300 p-6 rounded-lg">
                            <h3 class="text-2xl font-extrabold text-gray-800 mb-3">
                                OFFRE CLINIQUE – LOGICIEL COLLECTIF
                            </h3>
                            <p class="text-lg text-gray-800 leading-relaxed mb-5">
                                La solution idéale pour les structures multi-praticiens : chaque
                                professionnel conserve son compte indépendant (prestations,
                                agenda, comptabilité) tout en étant relié à un compte clinique
                                centralisé. Un tableau de bord unifié permet aux ASV et/ou au
                                gestionnaire de simplifier l’organisation, fluidifier la coordination
                                et optimiser le suivi global de la clinique.
                            </p>
                        </div>

                        <div class="bg-gray-300 p-6 rounded-lg flex flex-col gap-6">
                            <ul class="list-none space-y-3">
                                <li class="text-lg text-gray-800 flex items-center">
                                    <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Agenda global de la
                                    clinique,
                                    filtrable par vétérinaire
                                </li>
                                <li class="text-lg text-gray-800 flex items-center">
                                    <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Gestion des
                                    disponibilités sans
                                    doublons
                                </li>
                                <li class="text-lg text-gray-800 flex items-center">
                                    <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Tableaux de bord
                                    centralisés
                                    pour
                                    ASV
                                </li>
                                <li class="text-lg text-gray-800 flex items-center">
                                    <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Comptabilité et
                                    statistiques au
                                    niveau clinique
                                </li>
                                <li class="text-lg text-gray-800 flex items-center">
                                    <span class="text-primary-600 text-xl font-bold mr-2">✓</span> Association flexible
                                    des
                                    vétérinaires
                                </li>
                            </ul>
                            <a href="mailto:contact@animoplus.fr"
                                class="block text-center bg-accent-500 hover:bg-[#6f5838] text-white py-4 px-6 rounded-full w-full text-base font-semibold transition">
                                Parler avec un conseiller
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Detail offer -->
            <section v-else class="flex flex-col items-center px-6 space-y-10">
                <h1 class="text-green-600 text-5xl font-extrabold text-center uppercase">
                    Choisir la formule
                </h1>
                <p class="text-green-600 text-lg font-normal mx-auto text-center mt-4">
                    Choisissez la formule adaptée à vos besoins
                </p>
                <button @click="backToOffers" class="text-green-600 font-semibold text-sm mb-5">
                    ← Retour
                </button>

                <div v-for="offer in selectedOffers" :key="offer.id" class="w-full bg-white space-y-8">
                    <div
                        class="bg-primary-500 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-8">
                        <div class="flex flex-col gap-8">
                            <h3 class="text-5xl font-bold text-gray-900 uppercase">
                                {{ offer.title }}
                            </h3>
                            <select v-model="selectedProfession"
                                class="border border-green-600 text-gray-700 rounded-full px-4 py-2 text-sm bg-white">
                                <option disabled value="">Choisir votre profession</option>
                                <option v-for="prof in professions" :key="prof" :value="prof">
                                    {{ prof }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <p class="text-gray-600 text-lg max-w-xl">
                                {{ offer.description }}
                            </p>
                        </div>
                    </div>

                    <button
                        class="w-full border border-2 border-green-600 text-priamry-600 font-medium text-sm px-4 py-2 rounded-full hover:bg-green-50 transition">
                        Ajouter une profession supplémentaire +
                    </button>

                    <!-- RÉSULTAT -->
                    <div>
                        <h4 class="text-5xl text-primary-600 font-bold uppercase mb-3">Le résultat</h4>
                        <p class="text-gray-500 text-sm mb-4">Pour le prix d’un café par jour</p>

                        <div class="space-y-3">
                            <div v-if="offer.results.length > 0" :class="[
                                'text-center text-black font-bold text-2xl py-6 rounded-xl',
                                offer.results[0].color,
                            ]">
                                <div class="text-6xl">{{ offer.results[0].value }}</div>
                                <p class="text-sm font-normal mt-1">
                                    {{ offer.results[0].label }}
                                </p>
                            </div>

                            <div v-if="offer.results.length > 1" class="grid grid-cols-2 gap-3">
                                <div v-for="(result, index) in offer.results.slice(1)" :key="index" :class="[
                                    'text-center text-black font-bold text-2xl py-6 rounded-xl',
                                    result.color,
                                ]">
                                    <div class="text-6xl">{{ result.value }}</div>
                                    <p class="text-lg font-normal mt-1">{{ result.label }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TARIF + BOUTON -->
                    <div>
                        <h4 class="text-5xl text-primary-600 font-bold uppercase mb-3">Le tarif</h4>
                        <p class="text-gray-500 text-lg mb-4">
                            Sans engagement, arrêtez quand vous voulez
                        </p>

                        <div
                            class="flex flex-col md:flex-row justify-between items-center border border-2 border-gray-900 rounded-xl p-6">
                            <div class="flex flex-col items-center gap-2">
                                <div class="text-black flex gap-4 items-start">
                                    <span class="text-5xl font-bold">139</span>
                                    <span class="text-base">€ TTC / mois / soignant</span>
                                </div>
                                <p class="text-gray-500 text-lg mt-2">
                                    (facturés une fois par an, ou 149 € en paiement mensuel)
                                </p>
                            </div>

                            <img src="../../assets/images/DocPicto.svg" alt="soignant"
                                class="w-32 h-auto mt-4 md:mt-0" />
                        </div>

                        <p class="text-gray-500 text-xs mt-2 text-center">
                            Chaque abonnement contribue à une association animale
                        </p>

                        <a href="mailto:contact@animoplus.fr"
                            class="block text-center bg-[#8B6F47] hover:bg-[#6f5838] text-white mt-8 py-4 px-6 rounded-full w-full text-base font-semibold transition">
                            Parler avec un conseiller
                        </a>
                    </div>
                </div>
            </section>

        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const showOffer = ref(false)
const currentOffer = ref(null)
const selectedProfession = ref('')
const professions = ['Vétérinaire', 'ASV', 'Ostéopathe animalier']

function selectOffer(offerNumber) {
    currentOffer.value = offerNumber
    showOffer.value = true
    window.scrollTo(0, 0)
}

function backToOffers() {
    showOffer.value = false
    currentOffer.value = null
    selectedProfession.value = ''
}

function goToRegister() {
    router.push('/register')
}

const selectedOffers = computed(() =>
    offers.filter((offer) => offer.id === currentOffer.value)
)

// Data
const offers = [
    {
        id: 1,
        title: 'Offre 1 – Agenda essentiel',
        description:
            'Conservez vos habitudes avec la prise de rendez-vous en ligne, tout en bénéficiant d’un service complémentaire personnalisé. Cette offre s’intègre comme une suite à votre logiciel actuel et vous permet d’améliorer le suivi de vos patients.',
        results: [
            {
                value: '99.3%',
                label: 'de taux de satisfaction des patients',
                color: 'bg-primary-500',
            },
            {
                value: 'x1.75',
                label: 'votre visibilité',
                color: 'bg-primary-300',
            },
            {
                value: '-53%',
                label: 'de rendez-vous non-honorées',
                color: 'bg-primary-600',
            },
        ],
    },
    {
        id: 2,
        title: 'Offre 2 – Logiciel complet',
        description:
            'La solution la plus complète pour gérer et développer votre activité. Elle regroupe l’agenda en ligne, la gestion des patients, la messagerie, la facturation, la comptabilité et même le suivi des stocks.',
        results: [
            {
                value: '+15.83%',
                label: 'sur vos revenus mensuels en moyenne',
                color: 'bg-primary-500',
            },
            {
                value: '/2',
                label: 'votre gestion quotidienne',
                color: 'bg-primary-300',
            },
            {
                value: '-53%',
                label: 'de rendez-vous non-honorées',
                color: 'bg-primary-600',
            },
        ],
    },
]
</script>
