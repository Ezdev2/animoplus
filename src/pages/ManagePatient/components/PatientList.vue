<template>
    <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex flex-wrap gap-4 items-center">
                <div class="relative flex-1 min-w-64">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                    <input type="text" placeholder="Rechercher un patient..." :value="searchQuery"
                        @input="$emit('update:searchQuery', $event.target.value)"
                        class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full" />
                </div>

                <select :value="statusFilter" @change="$emit('update:statusFilter', $event.target.value)"
                    class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="all">Tous les statuts</option>
                    <option value="active">Comptes activés</option>
                    <option value="pending">En attente d'activation</option>
                </select>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-900">Patients ({{ patients.length }})</h2>
            </div>
            <div class="divide-y divide-gray-200">
                <PatientCard v-for="patient in patients" :key="patient.id" :patient="patient"
                    @click="selectPatient(patient)" @send-reminder="sendActivationReminder" />
            </div>
        </div>
    </div>
</template>

<script setup>
import PatientCard from './PatientCard.vue'

const props = defineProps({
    patients: Array,
    searchQuery: String,
    statusFilter: String
})

const emit = defineEmits(['update:searchQuery', 'update:statusFilter', 'select-patient'])

const selectPatient = (patient) => {
    emit('select-patient', patient)
}

const sendActivationReminder = (patient) => {
    console.log(`Envoi rappel activation à ${patient.owner.email}`)
    alert(`Rappel d'activation envoyé à ${patient.owner.email}`)
}
</script>