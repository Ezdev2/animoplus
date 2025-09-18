<template>
  <section class="border border-neutral-200 rounded-[10px] p-8 flex flex-col gap-8">

    <TitleDashboard title="Gestion des services" :has-button="true" btn-title="+ Ajouter un service"
      @on-click-btn="showCreatePatient = true" />
    <hr />

    <!-- Tableau responsive -->
    <table class="w-full border-collapse text-[14px]">
      <thead>
        <tr class="border-b border-[#E5E7EB] bg-[#F9F9F9]">
          <th class="col-nom text-left p-4 text-black text-[16px] font-semibold">NOM</th>
          <th class="col-description text-left p-4 text-black text-[16px] font-semibold">DESCRIPTION</th>
          <th class="col-prix text-left p-4 text-black text-[16px] font-semibold">PRIX</th>
          <th class="col-horaires text-left p-4 text-black text-[16px] font-semibold">HORAIRES</th>
          <th class="col-actions text-left p-4 text-black text-[16px] font-semibold">ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(service, index) in services" :key="index" class="border-b border-[#ddd]">
          <td class="p-4">{{ service.nom }}</td>
          <td class="p-4">{{ service.description }}</td>
          <td class="p-4">{{ service.prix }}</td>
          <td class="p-4">{{ service.horaires }}</td>
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
    <AddServiceForm v-if="showCreatePatient" @close="showCreatePatient = false" />
  </section>
</template>


<script setup>
import TitleDashboard from '@/components/common/TitleDashboard.vue';
import AddServiceForm from './components/AddServiceForm.vue';
import { ref } from 'vue';

const showCreatePatient = ref(false);
const services = [
  {
    nom: 'Consultation',
    description: 'Consultation générale pour animaux domestiques',
    prix: '4000 €',
    horaires: 'Lun-Ven, 8h–12h',
  },
  {
    nom: 'Consultation',
    description: 'Consultation générale pour animaux domestiques',
    prix: '4000 €',
    horaires: 'Lun-Ven, 8h–12h',
  },
  {
    nom: 'Consultation',
    description: 'Consultation générale pour animaux domestiques',
    prix: '4000 €',
    horaires: 'Lun-Ven, 8h–12h',
  },
  {
    nom: 'Consultation',
    description: 'Consultation générale pour animaux domestiques',
    prix: '4000 €',
    horaires: 'Lun-Ven, 8h–12h',
  },
  {
    nom: 'Consultation',
    description: 'Consultation générale pour animaux domestiques',
    prix: '4000 €',
    horaires: 'Lun-Ven, 8h–12h',
  },
  {
    nom: 'Consultation',
    description: 'Consultation générale pour animaux domestiques',
    prix: '4000 €',
    horaires: 'Lun-Ven, 8h–12h',
  },
  {
    nom: 'Consultation',
    description: 'Consultation générale pour animaux domestiques',
    prix: '4000 €',
    horaires: 'Lun-Ven, 8h–12h',
  },
  {
    nom: 'Consultation',
    description: 'Consultation générale pour animaux domestiques',
    prix: '4000 €',
    horaires: 'Lun-Ven, 8h–12h',
  }
]
</script>

<style scoped>
.col-nom {
  width: 21%;
}

.col-description {
  width: 16%;
}

.col-prix {
  width: 24%;
}

.col-horaires {
  width: 23%;
}

.col-actions {
  width: 18%;
}
</style>
