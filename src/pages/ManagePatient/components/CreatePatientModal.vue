<template>
    <BaseModal title="Créer un dossier patient" @close="$emit('close')" :footer="false">
        <form @submit.prevent="createPatient" class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                    <input type="text" v-model="newPatient.firstName"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input type="text" v-model="newPatient.lastName"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required />
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" v-model="newPatient.email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input type="tel" v-model="newPatient.phone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required />
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <textarea v-model="newPatient.address" rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div class="space-y-4">
                <h3 class="text-lg font-semibold">🐾 Animal(aux)</h3>
                <div v-for="(animal, index) in newPatient.animals" :key="index"
                    class="border border-gray-200 rounded-lg p-4 space-y-3">
                    <div class="flex justify-between items-center">
                        <h4 class="font-medium">Animal {{ index + 1 }}</h4>
                        <button v-if="newPatient.animals.length > 1" type="button" @click="removeAnimal(index)"
                            class="text-red-600 hover:text-red-700">🗑️</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                            <input type="text" v-model="animal.name"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select v-model="animal.type"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required>
                                <option value="chien">🐕 Chien</option>
                                <option value="chat">🐱 Chat</option>
                                <option value="oiseau">🐦 Oiseau</option>
                                <option value="lapin">🐰 Lapin</option>
                                <option value="autre">🐾 Autre</option>
                            </select>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Race</label>
                            <input type="text" v-model="animal.breed"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Âge</label>
                            <input type="number" v-model="animal.age"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
                            <select v-model="animal.gender"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="male">Mâle</option>
                                <option value="female">Femelle</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button type="button" @click="addAnimal"
                    class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                    + Ajouter un animal
                </button>
            </div>
            <hr />
            <div class="flex justify-end gap-4 pt-4">
                <button type="button" @click="$emit('close')"
                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Annuler
                </button>
                <button type="submit"
                    class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors font-medium">
                    Créer le dossier
                </button>
            </div>
        </form>
    </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '@/components/common/BaseModal.vue';

const emit = defineEmits(['close', 'patient-created']);

const newPatient = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    animals: [{ name: '', type: 'chien', breed: '', age: '', gender: 'male', weight: '' }]
});

const addAnimal = () => {
    newPatient.value.animals.push({
        name: '', type: 'chien', breed: '', age: '', gender: 'male', weight: ''
    });
};

const removeAnimal = (index) => {
    newPatient.value.animals.splice(index, 1);
};

const createPatient = () => {
    const patient = {
        id: Date.now(),
        status: 'pending',
        owner: { ...newPatient.value },
        preferences: { smsNotifications: true, emailNotifications: true },
        animals: newPatient.value.animals.map((animal, index) => ({ id: Date.now() + index, ...animal })),
        appointments: [], medicalReports: [], reminders: []
    };
    emit('patient-created', patient);
};
</script>