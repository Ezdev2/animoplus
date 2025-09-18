<template>
  <section class="border border-neutral-200 rounded-[10px] p-8 flex flex-col gap-8">
    <TitleDashboard title="Gestion des services" :has-button="true" btn-title="+ Ajouter un service"
      @on-click-btn="showAddServiceForm = true" />
    <hr />

    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
      <h3 class="text-lg font-semibold text-gray-800">Gérer mes disponibilités</h3>
      <router-link to="/appointment"
        class="bg-blue-600 text-white px-5 py-2 rounded-lg text-base font-semibold hover:bg-blue-700 transition">
        Ouvrir l'agenda
      </router-link>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-[14px]">
        <thead>
          <tr class="border-b border-[#E5E7EB] bg-[#F9F9F9]">
            <th class="text-left p-4 text-black text-[16px] font-semibold">NOM</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">DESCRIPTION</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">PRIX</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">DURÉE</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">LIEU</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">CLIENTS SIMULTANÉS</th>
            <th class="text-left p-4 text-black text-[16px] font-semibold">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(service, index) in services" :key="index" class="border-b border-[#ddd]">
            <td class="p-4">{{ service.nom }}</td>
            <td class="p-4">{{ service.description }}</td>
            <td class="p-4">{{ service.prix }} €</td>
            <td class="p-4">{{ service.duree }} min</td>
            <td class="p-4">{{ service.lieu }}</td>
            <td class="p-4">{{ service.clientsSimultanes }}</td>
            <td class="p-4">
              <button
                class="bg-green-100 text-[#6CC447] font-medium rounded-md px-3 py-1 mr-2 text-sm cursor-pointer transition hover:bg-green-200"
                type="button">
                Modifier
              </button>
              <button
                class="bg-red-100 text-[#EF5350] font-medium rounded-md px-3 py-1 text-sm cursor-pointer transition hover:bg-red-200"
                type="button">
                Supprimer
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AddServiceForm v-if="showAddServiceForm" @close="showAddServiceForm = false" />

    <!-- <AvailabilityModal v-if="showAvailabilityModal" @close="showAvailabilityModal = false" /> -->
  </section>
</template>

<script setup>
import TitleDashboard from '@/components/common/TitleDashboard.vue';
import AddServiceForm from './components/AddServiceForm.vue';
// import AvailabilityModal from './components/AvailabilityModal.vue';
import { ref } from 'vue';

const showAddServiceForm = ref(false);
// const showAvailabilityModal = ref(false);

const services = [
  {
    nom: 'Consultation vaccinale',
    description: 'Vaccination annuelle',
    prix: '40',
    duree: '30',
    lieu: 'En clinique',
    clientsSimultanes: 1,
  },
  {
    nom: 'Soins dentaires',
    description: 'Détartrage et polissage',
    prix: '120',
    duree: '60',
    lieu: 'À domicile',
    clientsSimultanes: 1,
  },
  {
    nom: 'Consultation générale',
    description: 'Bilan de santé annuel',
    prix: '50',
    duree: '45',
    lieu: 'En clinique et à domicile',
    clientsSimultanes: 2,
  },
];
</script>

<style scoped>
</style>