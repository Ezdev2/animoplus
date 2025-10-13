<template>
    <div class="city-selection">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Sélectionnez votre ville</h2>

        <div class="flex flex-col gap-6 mb-6">
            <input v-model="searchQuery" type="text" placeholder="Rechercher une ville..."
                class="w-full p-4 border border-2 border-primary-600 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500" />
            <div class="flex gap-4 justify-between w-full p-4 border border-2 border-accent-400 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500">
                <label><input @click="selectCity(city)" type="radio" name="place"> Chez le professionnel</label>
                <label><input @click="selectCity(city)" type="radio" name="place"> À domicile</label>
                <label><input @click="selectCity(city)" type="radio" name="place"> Les deux</label>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['select-city']);

const searchQuery = ref('');
const selectedCity = ref(null);


function selectCity(city) {
    selectedCity.value = city;
    emit('select-city', city);
}
</script>

<style scoped>
.city-selection {
    max-width: 800px;
    margin: 0 auto;
}

</style>