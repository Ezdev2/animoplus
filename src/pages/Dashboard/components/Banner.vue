<template>
  <div
    class="w-full px-16 py-6 bg-linear-line rounded-xl inline-flex flex-col justify-start items-start gap-6"
  >
    <div class="flex flex-col justify-center items-center gap-6">
      <div
        class="justify-start text-white text-2xl font-semibold font-['League_Spartan']"
      >
        Bienvenue {{ userName }} !
      </div>
    </div>
    <div
      class="justify-start text-white text-lg font-normal font-['League_Spartan']"
    >
      Gérez vos animaux, prenez des rendez-vous et accédez à vos informations en
      toute simplicité.
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'

const auth = useSimpleAuth()

// Nom de l'utilisateur avec fallback
const userName = computed(() => {
  const user = auth.getCurrentUser.value
  if (user?.name) {
    return user.name
  }
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  if (user?.firstName) {
    return user.firstName
  }
  return 'Utilisateur'
})
</script>

<style scoped></style>
