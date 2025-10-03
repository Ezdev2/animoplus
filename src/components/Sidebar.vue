<template>
    <div class="w-90 h-full bg-primary-600 flex flex-col">
        <!-- Logo fixe -->
        <div class="flex-shrink-0 p-6 pb-4">
            <img class="w-28 h-9" src="../assets/animoplus_header.png" />
        </div>

        <!-- Menu principal scrollable -->
        <div class="flex-1 overflow-y-auto px-6 pb-4">
            <nav class="flex flex-col gap-6">
                <template v-for="item in filteredMenuItems" :key="item.label">
                    <!-- Séparateur Pro -->
                    <div v-if="item.isProSeparator" class="border-t border-white border-opacity-30 pt-4 mt-2">
                        <div class="flex items-center gap-2 text-yellow-300 text-sm font-semibold">
                            <span class="text-lg">⭐</span>
                            <span>FONCTIONNALITÉS PRO</span>
                        </div>
                    </div>
                    
                    <!-- Élément de menu normal -->
                    <RouterLink v-else :to="item.link"
                        class="flex items-center gap-4 text-base hover:text-accent-400 transition"
                        :class="[
                            route.path === item.link ? 'text-accent-400 font-bold' : 'text-white',
                            item.isPro ? 'pl-4 border-l-2 border-yellow-400 border-opacity-50' : ''
                        ]">
                        <component v-if="item.icon" :is="item.icon"
                            :class="route.path === item.link ? 'text-accent-400 font-bold' : 'text-white'" />
                        <span :class="item.isPro ? 'text-yellow-100' : ''">{{ item.label }}</span>
                        <span v-if="item.isPro" class="ml-auto text-yellow-400 text-xs">PRO</span>
                    </RouterLink>
                </template>
            </nav>
        </div>

        <!-- Bouton déconnexion fixe -->
        <div class="flex-shrink-0 p-6 pt-4">
            <button @click="handleLogout"
                class="w-full px-4 py-2 bg-white rounded-xl shadow outline outline-1 outline-gray-200 flex items-center gap-2 hover:bg-gray-50 transition">
                <span class="text-red-500 text-base font-['League_Spartan']">Déconnexion</span>
                <img :src="logoutIcon" alt="log out" class="feature-icon w-6">
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useSimpleAuth } from '@/composables/useSimpleAuth.js'
import { useUserRole } from '@/composables/useUserRole.js'
import { computed } from 'vue'

import dashboardIcon from '@/assets/icons/sidebar/DasboardIcon.vue';
import animalIcon from '@/assets/icons/sidebar/AnimalIcon.vue';
import appointmentIcon from '@/assets/icons/sidebar/AppointmentIcon.vue';
import chatIcon from '@/assets/icons/sidebar/ChatIcon.vue';
import documentIcon from '@/assets/icons/sidebar/DocumentIcon.vue';
import searchSpecial from '@/assets/icons/sidebar/SearchSpecial.vue';
import stockIcon from '@/assets/icons/sidebar/StockIcon.vue';
import sheetIcon from '@/assets/icons/sidebar/SheetIcon.vue';
import taskIcon from '@/assets/icons/sidebar/TaskIcon.vue';
import userIcon from '@/assets/icons/sidebar/UserIcon.vue';
import lostAnimalIcon from '@/assets/icons/sidebar/LostAnimalIcon.vue';

import logoutIcon from '@/assets/icons/logout.svg';

const route = useRoute();
const auth = useSimpleAuth()
const { userRole, isClient, isVeterinarian, isVeterinarianPro, isAnyVeterinarian } = useUserRole()

// Récupérer le rôle depuis les données utilisateur (pour compatibilité)
const role = computed(() => userRole.value)

// Fonction de déconnexion
const logout = () => {
  auth.logout()
  window.location.href = '/login'
}

const props = defineProps({
    user: {
        type: String,
        default: "",
    },
});

const menuItems = [
    {
        label: "Tableau de bord",
        icon: dashboardIcon,
        user: ["client", "pro"],
        link: "/dashboard"
    },
    {
        label: "Agenda",
        icon: appointmentIcon,
        user: "pro",
        link: "/appointment"
    },
    {
        label: "Messagerie des patients",
        icon: chatIcon,
        user: "pro",
        link: "/message"
    },
    {
        label: "Mes animaux",
        icon: animalIcon,
        user: "client",
        link: "/animals"
    },
    {
        label: "Prise de rendez-vous",
        icon: appointmentIcon,
        user: "client",
        link: "/appointment"
    },
    {
        label: "Messagerie",
        icon: chatIcon,
        user: "client",
        link: "/message"
    },
    {
        label: "Gestion des patients",
        icon: userIcon,
        user: "pro",
        link: "/manage-patient"
    },
    {
        label: "Gestion des services",
        icon: animalIcon,
        user: "pro",
        link: "/services"
    },
    {
        label: "Comptabilité",
        icon: sheetIcon,
        user: "pro",
        link: "/accounting"
    },
    {
        label: "Tâches",
        icon: taskIcon,
        user: "pro",
        link: "/tasks"
    },
    {
        label: "Coopération",
        icon: lostAnimalIcon,
        user: "pro",
        link: "/lost-animal"
    },
    {
        label: "Mes documents",
        icon: documentIcon,
        user: "client",
        link: "/documents"
    },
    {
        label: "Mes documents",
        icon: documentIcon,
        user: "pro",
        link: "/documents"
    },
    {
        label: "Recherche par spécialité",
        icon: searchSpecial,
        user: "client",
        link: "/speciality"
    },
    {
        label: "Gestion de stock",
        icon: stockIcon,
        user: "pro",
        link: "/stockManagement"
    },
    {
        label: "Mon profil",
        icon: userIcon,
        user: ["client", "pro"],
        link: "/profil"
    },
    {
        label: "Animaux perdus",
        icon: lostAnimalIcon,
        user: "client",
        link: "/lost-animal"
    },
    // Séparateur Pro
    {
        label: "--- FONCTIONNALITÉS PRO ---",
        icon: null,
        user: "pro_separator",
        link: "#",
        isProSeparator: true
    },
    {
        label: "📊 Analytics Pro",
        icon: sheetIcon,
        user: "veterinarian_pro",
        link: "/pro-analytics",
        isPro: true
    },
    {
        label: "📋 Rapports Pro",
        icon: documentIcon,
        user: "veterinarian_pro", 
        link: "/pro-reports",
        isPro: true
    },
    {
        label: "Administration",
        icon: userIcon,
        user: "admin",
        link: "/admin"
    },
];

const filteredMenuItems = computed(() => {
    return menuItems.filter(item => {
        // Gestion du séparateur Pro
        if (item.user === "pro_separator") {
            return isVeterinarianPro.value
        }
        
        // Gestion des éléments spécifiques aux utilisateurs Pro
        if (item.user === "veterinarian_pro") {
            return isVeterinarianPro.value
        }
        
        // Gestion des éléments pour vétérinaires (normaux et Pro)
        if (item.user === "pro") {
            return isAnyVeterinarian.value
        }
        
        // Gestion des éléments pour clients
        if (item.user === "client") {
            return isClient.value
        }
        
        // Gestion des éléments pour plusieurs rôles
        if (Array.isArray(item.user)) {
            // Adapter les rôles pour la compatibilité
            const adaptedRoles = item.user.map(u => {
                if (u === 'pro') return isAnyVeterinarian.value
                if (u === 'client') return isClient.value
                if (u === 'veterinarian_pro') return isVeterinarianPro.value
                return false
            })
            return adaptedRoles.some(Boolean)
        }
        
        // Éléments sans restriction
        return item.user === ""
    })
})

async function handleLogout() {
  await logout()
}

</script>

<style scoped>
/* Scrollbar personnalisée pour la sidebar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* Smooth scrolling */
.overflow-y-auto {
  scroll-behavior: smooth;
}

/* Assurer que les éléments Pro ne se chevauchent pas */
nav {
  min-height: fit-content;
}
</style>
