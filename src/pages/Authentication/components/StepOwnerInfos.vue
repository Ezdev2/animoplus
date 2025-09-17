<template>
  <div class="flex flex-col gap-4">
    <p class="px-4 py-2 bg-blue-600 rounded-full text-center text-white cursor-pointer" @click="$emit('togglePro')">
      Vous êtes professionnel ? Cliquez ici
    </p>
    <div class="flex items-center gap-2">
      <label>
        <input type="radio" value="M" v-model="formData.gender" /> Masculin
      </label>
      <label>
        <input type="radio" value="F" v-model="formData.gender" /> Féminin
      </label>
    </div>

    <input v-model="formData.firstname" placeholder="Prénom" class="w-full h-12 px-4 border border-gray-300 rounded" />
    <input v-model="formData.lastname" placeholder="Nom" class="w-full h-12 px-4 border border-gray-300 rounded" />
    <input type="date" v-model="formData.birthdate" class="w-full h-12 px-4 border border-gray-300 rounded" />

    <!-- Photo -->
    <input type="file" @change="uploadPicture" class="w-full h-12 px-4 border border-gray-300 rounded" />

    <!-- CGU -->
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="formData.termsAccepted" />
      J’accepte les CGU
    </label>

    <button class="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-500"
      @click="$emit('next')">Continuer</button>
  </div>
</template>

<script setup>
const props = defineProps({
  formData: Object
})

function uploadPicture(e) {
  props.formData.profilePicture = e.target.files[0]
}
</script>

<style scoped></style>
