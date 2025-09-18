<template>
    <div class="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span class="text-xl">👤</span>
                </div>
                <div>
                    <h3 class="text-lg font-medium text-gray-900">{{ patient.owner.firstName }} {{ patient.owner.lastName }}</h3>
                    <p class="text-gray-600">{{ patient.owner.email }}</p>
                    <div class="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>📞 {{ patient.owner.phone }}</span>
                        <span>🐾 {{ patient.animals.length }} animal(aux)</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <span :class="['px-3 py-1 rounded-full text-sm font-medium',
                    patient.status === 'active' ? 'bg-primary-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                    {{ patient.status === 'active' ? '✅ Activé' : '⏳ En attente' }}
                </span>
                <button @click.stop="$emit('send-reminder', patient)" v-if="patient.status === 'pending'"
                    class="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-primary-500 transition-colors text-sm">
                    📧 Rappel
                </button>
            </div>
        </div>

        <div v-if="patient.animals.length > 0" class="mt-4 pl-16">
            <div class="flex flex-wrap gap-2">
                <div v-for="animal in patient.animals" :key="animal.id"
                    class="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-sm">
                    <span class="text-lg mr-2">{{ getAnimalIcon(animal.type) }}</span>
                    <span class="font-medium">{{ animal.name }}</span>
                    <span class="text-gray-600 ml-2">{{ animal.breed }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    patient: {
        type: Object,
        required: true
    }
})

const getAnimalIcon = (type) => {
    const icons = { chien: '🐕', chat: '🐱', oiseau: '🐦', lapin: '🐰', autre: '🐾' }
    return icons[type] || '🐾'
}
</script>