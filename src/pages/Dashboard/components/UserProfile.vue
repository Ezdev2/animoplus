<template>
    <CardLayout title="Mon profil" link="/profil">
        <div class="self-stretch inline-flex flex-col justify-start items-start gap-6">
            <div class="self-stretch inline-flex justify-start items-start gap-6">
                <img class="w-20 h-20 rounded-full object-cover" :src="userAvatar" :alt="userName" />
                <div class="flex-1 inline-flex flex-col justify-start items-start gap-4">
                    <div class="self-stretch justify-start text-gray-600 text-xl font-medium font-['League_Spartan']">
                        {{ userName }}
                    </div>
                    <div
                        class="self-stretch opacity-50 justify-start text-gray-600 text-base font-normal font-['League_Spartan']">
                        {{ userEmail }}
                    </div>
                </div>
            </div>
            <div class="self-stretch inline-flex justify-between items-start">
                <div class="flex justify-center items-start gap-2">
                    <img :src="phone" alt="icon" />
                    <div class="justify-start text-black text-xs font-normal font-['League_Spartan']">
                        {{ userPhone }}
                    </div>
                </div>
                <div class="flex justify-center items-start gap-2">
                    <img :src="marker" alt="icon" />
                    <div class="justify-start text-black text-xs font-normal font-['League_Spartan']">
                        {{ userAddress }}
                    </div>
                </div>
                <div class="flex justify-center items-start gap-2">
                    <img :src="date" alt="icon" />
                    <div class="justify-start text-black text-xs font-normal font-['League_Spartan']">
                        {{ userBirthDate }}
                    </div>
                </div>
            </div>
            <div class="inline-flex justify-start items-center gap-4">
                <img :src="animalIcon" alt="icon" />
                <div class="justify-start text-black text-base font-bold font-['League_Spartan']">
                    {{ animalCount }} Animal(aux) enregistré(s)
                </div>
            </div>
        </div>
    </CardLayout>
</template>

<script setup>
import { computed } from 'vue'
import CardLayout from "./CardLayout.vue"
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { getUserAvatar } from '@/utils/avatarUtils.js'

import date from '@/assets/icons/small-calendar.svg'
import marker from '@/assets/icons/small-marker.svg'
import phone from '@/assets/icons/small-phone.svg'
import animalIcon from '@/assets/icons/animalGreen.svg'

const auth = useSimpleAuth()

// Données utilisateur avec fallbacks
const userData = computed(() => auth.getCurrentUser.value)

const userName = computed(() => {
  const user = userData.value
  if (user?.name) return user.name
  if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`
  if (user?.firstName) return user.firstName
  return 'Utilisateur'
})

const userEmail = computed(() => userData.value?.email || 'email@exemple.com')

const userPhone = computed(() => userData.value?.phone || '+261 00 000 00 00')

const userAddress = computed(() => {
  const user = userData.value
  if (user?.address) return user.address
  if (user?.clinic_address) return user.clinic_address
  return 'Adresse inconnue'
})

const userBirthDate = computed(() => {
  if (userData.value?.birth_date) {
    return new Date(userData.value.birth_date).toLocaleDateString('fr-FR')
  }
  return '19/01/2002'
})

const userAvatar = computed(() => getUserAvatar(userData.value, 80))

// Nombre d'animaux (à implémenter plus tard avec l'API des animaux)
const animalCount = computed(() => {
  // TODO: Récupérer le nombre réel d'animaux de l'utilisateur
  return userData.value?.animals_count || 0
})
</script>
