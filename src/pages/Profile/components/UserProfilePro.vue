<template>
    <section class="border border-neutral-200 rounded-[10px] p-8 flex flex-col gap-8">

        <TitleDashboard title="Mon profil" :has-text-btn="true" btn-title="Mettre à jour" :icon="editIcon"
          @on-click-btn="$emit('edit-profile')" />

        <hr />

        <!-- Informations utilisateur -->
        <div class="flex justify-between items-start mb-4">
            <div class="flex gap-5">
                <img :src="ProfileImg" alt="photo de profil" class="w-[130px] h-[130px] rounded-full object-cover" />

                <div class="flex flex-col gap-2">
                    <h3 class="text-[20px] font-semibold text-neutral-700">Vétérinaire Urgence</h3>
                    <p class=" text-neutral-700">exemples@gmail.com</p>

                    <!-- Infos personnelles -->
                    <p class="flex items-start gap-2">
                        <img :src="phoneIcon" alt="Téléphone" class="w-[16px]" />
                    </p>
                    <p class="flex items-start gap-2">
                        <img :src="locationIcon" alt="Localisation" class="w-[16px]" />
                        Antananarivo 101
                    </p>
                    <p class="flex items-start gap-2">
                        <img :src="clockIcon" alt="heure" class="w-[16px]" />
                        24 / 24
                    </p>
                    
                    <!-- Bio utilisateur -->
                    <div v-if="userBio" class="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p class="text-sm text-gray-700 italic">
                            "{{ userBio }}"
                        </p>
                    </div>
                </div>
            </div>

            <!-- Bouton Ajouter un animal -->
            <button @click="addService"
                class="bg-accent-500 text-white px-4 py-3 rounded-[14px] shadow-md flex items-center gap-2">
                Ajouter un service
            </button>
        </div>

        <Alert :alert-img="alertIcon" alert-description="Information confidentielle">
            <div class="flex flex-col gap-4">
                <p class="text-[#222]">
                    Ces informations sont confidentielles et accessibles uniquement par vous et les spécialistes vétérinaires.
                </p>
            </div>
        </Alert>

    </section>
    <AddAnimal v-if="showModal" @close="showModal = false" />
</template>

<script setup>
import { computed } from 'vue'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

import ProfileImg from '@/assets/images/image1.svg'
import phoneIcon from '@/assets/icons/small-phone.svg'
import locationIcon from '@/assets/icons/small-marker.svg'
import clockIcon from '@/assets/icons/clock-black.svg'
import animalIcon from '@/assets/icons/animal.svg'
import alertIcon from '@/assets/icons/alertGreen.svg'
import editIcon from '@/assets/icons/edit-icon.svg'

import TitleDashboard from '@/components/common/TitleDashboard.vue'
import Alert from '@/components/common/Alert.vue'

const auth = useSimpleAuth()

// Données utilisateur avec fallbacks
const userData = computed(() => auth.getCurrentUser.value)

const userBio = computed(() => userData.value?.bio || userData.value?.description || '')

</script>