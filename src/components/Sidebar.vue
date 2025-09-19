<template>
    <div class="w-90 h-full p-6 bg-primary-600 flex flex-col justify-between">
        <!-- Logo + Menu -->
        <div class="flex flex-col gap-8">
            <img class="w-28 h-9" src="../assets/animoplus_header.png" />

            <!-- Menu principal -->
            <nav class="flex flex-col gap-4">
                <RouterLink v-for="item in filteredMenuItems" :key="item.label" :to="item.link"
                    class="flex items-center gap-4 text-base hover:text-accent-400 transition"
                    :class="route.path === item.link ? 'text-accent-400 font-bold' : 'text-white'">
                    <component :is="item.icon"
                        :class="route.path === item.link ? 'text-accent-400 font-bold' : 'text-white'" />
                    <span>{{ item.label }}</span>
                </RouterLink>
            </nav>
        </div>

        <!-- Bouton déconnexion -->
        <div>
            <button @click="handleLogout"
                class="px-4 py-2 bg-white rounded-xl shadow outline outline-1 outline-gray-200 flex items-center gap-2 hover:bg-gray-50 transition">
                <span class="text-red-500 text-base font-['League_Spartan']">Déconnexion</span>
                <img :src="logoutIcon" alt="log out" class="feature-icon w-6">
            </button>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth.js'

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
const { role, logout } = useAuth()

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
];

const filteredMenuItems = menuItems.filter(item => {
    // Adapter pour les nouveaux user_type
    const userRole = role.value === 'veterinarian' ? 'pro' : role.value;
    return item.user === "" || item.user === userRole || (Array.isArray(item.user) && item.user.includes(userRole));
});

async function handleLogout() {
  await logout()
}

</script>
