<template>
  <BaseModal title="Ajouter un service" footerBtn="Créer la prestation" @close="$emit('close')">
    <div class="p-6">
      <div v-if="errorMessage" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
        <p>{{ errorMessage }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <p class="text-sm text-gray-500 italic">* Champ obligatoire</p>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nom du service *
            </label>
            <input type="text" v-model="form.nom" required placeholder="Ex: Soins dentaires"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Durée (en min) *
            </label>
            <input type="number" v-model="form.duree" required placeholder="Ex: 60"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Prix (€) *
            </label>
            <input type="number" v-model="form.prix" required placeholder="Ex: 60"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Couleur de la prestation
            </label>
            <input type="color" v-model="form.couleur"
              class="w-full px-4 py-1 h-[48px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre de clients acceptés en simultané
          </label>
          <input type="number" v-model="form.clientsSimultanes" placeholder="Ex: 1" min="1"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea v-model="form.description" placeholder="Description du service..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Lieu de la prestation
          </label>
          <div class="flex gap-4">
            <label class="flex items-center">
              <input type="checkbox" v-model="form.lieu.clinique" class="rounded mr-2" />
              <span>En clinique</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="form.lieu.domicile" class="rounded mr-2" />
              <span>À domicile</span>
            </label>
          </div>
        </div>
        
        <div v-if="form.lieu.domicile" class="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 space-y-4">
          <h4 class="font-semibold text-sm">Options pour les rendez-vous à domicile</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Rayon maximal d'intervention (km)
            </label>
            <input type="number" v-model="form.rayonMax" placeholder="Ex: 15"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Frais de déplacement
            </label>
            <select v-model="form.fraisDeplacement.mode" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="libre">Champ libre</option>
              <option value="fixe">Tarif fixe</option>
              <option value="km">Tarif au km</option>
            </select>
          </div>
          <div v-if="form.fraisDeplacement.mode !== 'libre'">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ form.fraisDeplacement.mode === 'fixe' ? 'Tarif (€)' : 'Tarif (€ / km)' }}
            </label>
            <input type="number" v-model="form.fraisDeplacement.valeur"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div class="space-y-4">
          <h4 class="text-sm font-semibold">Critères de l'animal</h4>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Espèce(s) acceptée(s)</label>
            <select multiple v-model="form.criteres.especes" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]">
              <option v-for="espece in especes" :key="espece" :value="espece">{{ espece }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Poil(s) accepté(s)</label>
            <div class="flex flex-wrap gap-4">
              <label v-for="poil in poils" :key="poil" class="flex items-center">
                <input type="checkbox" :value="poil" v-model="form.criteres.poils" class="rounded mr-2" />
                <span>{{ poil }}</span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Taille(s) acceptée(s)</label>
            <div class="flex items-center gap-4 mb-2">
              <label class="flex items-center">
                <input type="radio" value="simplifie" v-model="modeTaille" class="mr-2" />
                Mode simplifié
              </label>
              <label class="flex items-center">
                <input type="radio" value="precis" v-model="modeTaille" class="mr-2" />
                Mode précis
              </label>
            </div>
            <div v-if="modeTaille === 'simplifie'" class="flex flex-wrap gap-4">
              <label v-for="taille in tailles" :key="taille" class="flex items-center">
                <input type="checkbox" :value="taille" v-model="form.criteres.tailles" class="rounded mr-2" />
                <span>{{ taille }}</span>
              </label>
            </div>
            <div v-if="modeTaille === 'precis'">
              <p class="text-gray-500 text-sm italic">Entrez les critères de taille précis (ex: 2kg-5kg, 30cm)</p>
              <textarea v-model="form.criteres.taillesPrecis" rows="2" class="w-full px-4 py-3 border border-gray-300 rounded-lg"></textarea>
            </div>
          </div>
        </div>
        
        <div class="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
          <h4 class="text-sm font-semibold mb-2">
            💡 Personnalisez encore plus vos prestations en tenant compte du comportement de l'animal.
          </h4>
          <label class="flex items-center">
            <input type="checkbox" v-model="form.tempsSupplementaire.actif" class="rounded mr-2" />
            <span>Ajouter un temps supplémentaire en fonction du comportement</span>
          </label>
        </div>
        
        </form>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/common/BaseModal.vue';
import { ref } from 'vue';

const emit = defineEmits(['close']);

const form = ref({
  nom: '',
  description: '',
  prix: null,
  duree: null,
  couleur: '#589F2A',
  clientsSimultanes: 1,
  lieu: {
    clinique: true,
    domicile: false
  },
  rayonMax: null,
  fraisDeplacement: {
    mode: 'libre',
    valeur: null
  },
  criteres: {
    especes: [],
    poils: [],
    tailles: [],
    taillesPrecis: ''
  },
  tempsSupplementaire: {
    actif: false
  },
});

const modeTaille = ref('simplifie');
const errorMessage = ref('');

const especes = ['Chien', 'Chat', 'NAC', 'Cheval'];
const poils = ['Court', 'Mi-long', 'Long'];
const tailles = ['Toy', 'Petit', 'Moyen', 'Grand', 'Géant', 'Chats'];

const handleSubmit = () => {
  if (!form.value.nom || !form.value.prix || !form.value.duree) {
    errorMessage.value = "Le nom, le prix et la durée sont des champs obligatoires.";
    return;
  }
  
  console.log('Soumission du formulaire :', form.value);
  
  emit('close');
};
</script>