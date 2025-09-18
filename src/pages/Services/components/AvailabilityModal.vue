<template>
  <BaseModal title="Gérer mes disponibilités" footerBtn="Sauvegarder" @close="$emit('close')">
    <div class="p-6">
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Mode de gestion</h3>
        <div class="flex gap-4">
          <label class="flex items-center">
            <input type="radio" value="recurrent" v-model="modeDisponibilite" class="mr-2" />
            <span>Récurrent (hebdomadaire)</span>
          </label>
          <label class="flex items-center">
            <input type="radio" value="parSemaine" v-model="modeDisponibilite" class="mr-2" />
            <span>Par semaine</span>
          </label>
          <label class="flex items-center">
            <input type="radio" value="parMois" v-model="modeDisponibilite" class="mr-2" />
            <span>Par mois</span>
          </label>
        </div>
      </div>

      <div class="mt-6 border-t pt-6">
        <h3 class="text-lg font-semibold">Agenda</h3>
        <p class="text-sm text-gray-500 mt-2">
          Ici, un calendrier s'afficherait pour vous permettre de définir vos créneaux selon le mode choisi.
        </p>
        <div class="mt-4 p-8 bg-gray-100 rounded-lg border border-gray-200 text-gray-600 text-center">
          [ Calendrier ou interface de sélection des créneaux ]
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from '@/components/common/BaseModal.vue';
import { ref } from 'vue';

const modeDisponibilite = ref('recurrent');

defineEmits(['close']);
</script>