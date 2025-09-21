<template>
    <div>
        <UserProfile 
            v-if="!isEditprofile"
            :is-client="auth.role == 'client' ? true : false"
            @edit-profile="isEditprofile = true"
        />
        <EditProfile v-if="isEditprofile" @back-to-list="isEditprofile = false" @profile-updated="handleProfileUpdated" />
    </div>

    <!-- PROFIL PRO -->
    <!-- <div v-if="auth.role === 'pro'">
        <UserProfilePro v-if="!isEditprofile" @edit-profile="isEditprofile = true"/>
        <EditProfilePro v-if="isEditprofile" @back-to-list="isEditprofile = false"/>
    </div> -->
</template>

<script setup>
import UserProfile from './components/UserProfile.vue'
import EditProfile from './components/EditProfile.vue'

// import UserProfilePro from './components/UserProfilePro.vue'
// import EditProfilePro from './components/EditProfilePro.vue'

import { auth } from '@/stores/auth.js'
import { useAuth } from '@/composables/useAuth.js'
// import { useProfile, useUpdateProfile } from '@/services/users/userQueries.js'
import { ref } from 'vue'

const isEditprofile = ref(false)

// Nouveau système avec API (en mode fallback pour éviter les erreurs)
const { role } = useAuth()

// TODO: Activer quand l'API sera prête
// const { data: profileData, isLoading: profileLoading, error: profileError } = useProfile()
// const updateProfileMutation = useUpdateProfile()

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