<template>
  <div class="professionnel-page font-sans bg-white text-gray-800">

    <section class="benefits-section py-16 px-4 md:px-8">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-12">3 BÉNÉFICES POUR VOTRE QUOTIDIEN</h2>
      <div class="flex flex-col md:flex-row justify-center items-center gap-8">
        <div class="benefit-card w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg text-center border-2 border-gray-200">
          <div class="icon-placeholder w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8m-4-1h.01M7 16h.01M7 12h.01M7 8h.01"></path></svg>
          </div>
          <h3 class="text-xl font-bold mb-2">AUGMENTEZ LES REVENUS</h3>
          <hr class="w-1/2 mx-auto border-yellow-400 border-t-2 mb-2">
          <p class="text-sm">Optimisez votre activité pour améliorer vos revenus.</p>
        </div>
        <div class="benefit-card w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg text-center border-2 border-gray-200">
          <div class="icon-placeholder w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
          </div>
          <h3 class="text-xl font-bold mb-2">RÉDUCTION DE VOTRE GESTION QUOTIDIENNE</h3>
          <hr class="w-1/2 mx-auto border-yellow-400 border-t-2 mb-2">
          <p class="text-sm">Simplifiez vos processus grâce à nos outils numériques.</p>
        </div>
        <div class="benefit-card w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg text-center border-2 border-gray-200">
          <div class="icon-placeholder w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13a4.75 4.75 0 010 9.5m0-9.5A4.75 4.75 0 0017.753 9.5m-5.5 0a4.75 4.75 0 01-5.253 4.75M12 19.253a4.75 4.75 0 010-9.5m0 9.5a4.75 4.75 0 00-5.253-4.75m5.253 4.75A4.75 4.75 0 0117.753 19.253"></path></svg>
          </div>
          <h3 class="text-xl font-bold mb-2">AMÉLIOREZ LA RELATION AVEC VOS PATIENTS</h3>
          <hr class="w-1/2 mx-auto border-yellow-400 border-t-2 mb-2">
          <p class="text-sm">Renforcez la satisfaction de vos patients.</p>
        </div>
      </div>
    </section>

    <section class="solutions-section py-16 px-4 md:px-8 bg-white">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-12">À L'AIDE DE NOS SOLUTIONS</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div class="solution-card bg-green-100 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-2">DÉVELOPPEMENT CLIENTÈLE</h3>
          <ul class="text-sm space-y-2">
            <li><span class="text-green-500 mr-2">›</span> Soyez plus visible auprès des propriétaires d'animaux.</li>
            <li><span class="text-green-500 mr-2">›</span> Simplifiez la prise de rendez-vous.</li>
            <li><span class="text-green-500 mr-2">›</span> Moins de gestion, plus de patients !</li>
          </ul>
          <div class="mt-4 border-2 border-gray-300 rounded-md overflow-hidden">
            <img src="https://via.placeholder.com/400x200" alt="Capture d'écran de l'interface" class="w-full">
          </div>
        </div>
        <div class="solution-card bg-green-100 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-2">SECRÉTARIAT NUMÉRIQUE</h3>
          <ul class="text-sm space-y-2">
            <li><span class="text-green-500 mr-2">›</span> Simplifier la gestion des rendez-vous.</li>
            <li><span class="text-green-500 mr-2">›</span> Facilitez la communication avec vos clients.</li>
            <li><span class="text-green-500 mr-2">›</span> Optimisez votre temps avec notre gestionnaire des tâches.</li>
          </ul>
          <div class="mt-4 border-2 border-gray-300 rounded-md overflow-hidden">
            <img src="https://via.placeholder.com/400x200" alt="Capture d'écran de l'interface" class="w-full">
          </div>
        </div>
        <div class="solution-card bg-green-100 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-2">SUIVI PATIENT COMPLET</h3>
          <ul class="text-sm space-y-2">
            <li><span class="text-green-500 mr-2">›</span> Accédez facilement aux dossiers patients et suivez leur historique médical.</li>
            <li><span class="text-green-500 mr-2">›</span> Importez et gérez les dossiers.</li>
            <li><span class="text-green-500 mr-2">›</span> Échangez avec vos clients via la messagerie intégrée.</li>
          </ul>
          <div class="mt-4 border-2 border-gray-300 rounded-md overflow-hidden">
            <img src="https://via.placeholder.com/400x200" alt="Capture d'écran de l'interface" class="w-full">
          </div>
        </div>
        <div class="solution-card bg-green-100 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-2">GESTION FINANCIÈRE ET LOGISTIQUE AVANCÉ</h3>
          <ul class="text-sm space-y-2">
            <li><span class="text-green-500 mr-2">›</span> Suivi comptable simplifié.</li>
            <li><span class="text-green-500 mr-2">›</span> Gestion automatisée des stocks.</li>
            <li><span class="text-green-500 mr-2">›</span> Pilotez vos services et prestations avec une organisation claire.</li>
          </ul>
          <div class="mt-4 border-2 border-gray-300 rounded-md overflow-hidden">
            <img src="https://via.placeholder.com/400x200" alt="Capture d'écran de l'interface" class="w-full">
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-12">
        <button class="bg-yellow-400 text-gray-800 font-bold py-4 px-12 rounded-lg text-lg hover:bg-yellow-500 transition-colors">
          VOIR NOS OFFRES
        </button>
      </div>
    </section>

    <section class="simulator-section py-16 px-4 md:px-8 bg-gray-100">
      <h2 class="text-3xl md:text-4xl font-bold text-center text-green-700 mb-12">DÉCOUVREZ NOTRE SIMULATEUR DE RENTABILITÉ</h2>
      <div class="flex flex-col md:flex-row max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-12">
        <div class="w-full md:w-1/2 pr-0 md:pr-8 mb-8 md:mb-0">
          <h3 class="text-xl font-bold mb-4">Calculez votre rentabilité</h3>
          <p class="text-sm text-gray-600 mb-6">Découvrez le gain de temps et les revenus additionnels que Animo+ peut vous apporter.</p>
          <form class="space-y-6">
            <div>
              <label for="profession" class="block text-sm font-medium text-gray-700">Quelle profession exercez-vous ?</label>
              <select id="profession" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                <option>Vétérinaire Chirurgien</option>
                <option>Vétérinaire</option>
              </select>
            </div>
            <div>
              <span class="block text-sm font-medium text-gray-700">Souhaitez-vous accueillir de nouveaux patients ?</span>
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
              <label class="block text-sm font-medium text-gray-700">Quel est le tarif moyen d'une consultation (€) ?</label>
              <input type="range" class="w-full mt-2" min="0" max="200" value="50">
              <div class="flex justify-between text-sm mt-1"><span>50</span></div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre de rendez-vous non honorés par mois</label>
              <input type="range" class="w-full mt-2" min="0" max="50" value="5">
              <div class="flex justify-between text-sm mt-1"><span>5 rendez-vous non honorés/mois</span></div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre de consultations réalisées par semaine</label>
              <input type="range" class="w-full mt-2" min="0" max="100" value="20">
              <div class="flex justify-between text-sm mt-1"><span>20</span></div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Heures passées sur l'administratif par mois</label>
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
              <p class="bg-gray-200 rounded-md p-2 mt-2">+300.00€ grâce à l'optimisation de votre temps administratif</p>
              <p class="bg-gray-200 rounded-md p-2 mt-2">-53% de rendez-vous non honorés</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="serenity-section py-16 px-4 md:px-8 bg-green-700 text-white">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">Testez en toute sérénité !</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div class="serenity-card bg-white text-gray-800 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-2">Installation</h3>
          <p class="text-sm">Profitez de formations simples et vidéos explicatives pour démarrer facilement.</p>
        </div>
        <div class="serenity-card bg-white text-gray-800 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-2">Service Client</h3>
          <p class="text-sm">Nos experts sont disponibles pour répondre à toutes vos questions et vous accompagner.</p>
        </div>
        <div class="serenity-card bg-white text-gray-800 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-2">Tarifs</h3>
          <p class="text-sm">Des prix transparents sans frais cachés pour une utilisation optimale.</p>
        </div>
        <div class="serenity-card bg-white text-gray-800 p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-bold mb-2">Sécurité</h3>
          <p class="text-sm">Données hébergées dans des serveurs conformes RGPD pour une sécurité maximale.</p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
// No specific script logic is required for this static layout,
// but you would add logic for the profitability calculator here.
</script>

<style scoped>
/* Any custom styles not handled by Tailwind can go here */
/* For example, for a custom background shape on a section */
.serenity-section {
  position: relative;
  overflow: hidden;
}
.serenity-section::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background-color: #E2E8F0; /* a light gray/blue color */
  border-bottom-left-radius: 50%;
  transform: translateY(-50%) translateX(50%);
  z-index: 0;
}
</style>