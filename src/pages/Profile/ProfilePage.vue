<template>
    <div>
        <UserProfile 
            v-if="!isEditprofile"
            :is-client="isClient"
            @edit-profile="isEditprofile = true"
        />
        <EditProfile v-if="isEditprofile" @back-to-list="isEditprofile = false" @profile-updated="handleProfileUpdated" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import UserProfile from './components/UserProfile.vue'
import EditProfile from './components/EditProfile.vue'
import { useUserRole } from '@/composables/useUserRole.js'

const { isClient } = useUserRole()
const isEditprofile = ref(false)

// Fonction pour sauvegarder le profil (préparée pour l'API)
const handleSaveProfile = async (profileData) => {
  try {
    console.log('Sauvegarde profil (API pas encore connectée):', profileData)
    // TODO: await updateProfileMutation.mutateAsync(profileData)
    isEditprofile.value = false
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil:', error)
  }
}

// Gérer la mise à jour du profil depuis EditProfile
const handleProfileUpdated = (updatedData) => {
  console.log('Profil mis à jour:', updatedData)
  // Le UserProfile se mettra à jour automatiquement grâce à la réactivité
}
</script>