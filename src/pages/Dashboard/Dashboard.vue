<template>
  <div class="space-y-6">
    <Banner />
    
    <!-- Section Pro (visible seulement pour les utilisateurs Pro) -->
    <ProFeature :required-roles="['veterinarian_pro']" :show-upgrade-prompt="true">
      <ProDashboardWidget />
    </ProFeature>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Colonne principale -->
      <div class="lg:col-span-2 space-y-6">
        <Appointments />
        <Messages />
      </div>

      <!-- Colonne latérale -->
      <div class="space-y-6">
        <Documents />
        <UserProfile />
      </div>
    </div>
  </div>
</template>

<script setup>
import Banner from './components/Banner.vue'
import Appointments from './components/Appointments.vue'
import Messages from './components/Messages.vue'
import Documents from './components/Documents.vue'
import UserProfile from './components/UserProfile.vue'
import ProFeature from '@/components/common/ProFeature.vue'
import ProDashboardWidget from './components/ProDashboardWidget.vue'
</script>