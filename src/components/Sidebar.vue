<template>
    <div class="w-90 h-full p-6 bg-primary-600 flex flex-col justify-between">
        <!-- Logo + Menu -->
        <div class="flex flex-col gap-24">
            <img class="w-28 h-9" src="../assets/animoplus_header.png" />

            <!-- Menu principal -->
            <nav class="flex flex-col gap-8">
                <RouterLink v-for="item in filteredMenuItems" :key="item.label" :to="item.link"
                    class="flex items-center gap-4 text-base hover:text-accent-400 transition"
                    :class="route.path === item.link ? 'text-accent-400 font-bold' : 'text-white'"
                    >
                    <component :is="item.icon" :class="route.path === item.link ? 'text-accent-400 font-bold' : 'text-white'"/>
                    <span>{{ item.label }}</span>
                </RouterLink>
            </nav>
        </div>

        <!-- Espace client -->
        <div>
            <RouterLink to="/profil"
                :class="route.name === 'profil' ? 'text-accent-400 font-bold' : 'text-white'"
                class="flex items-center gap-4 text-white font-medium text-base hover:text-accent-400 transition">
                <img :src="userIconWhite" alt="user profil" class="feature-icon w-6">
                <span>Espace client</span>
            </RouterLink>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/services'

import dashboardIcon from '@/assets/icons/sidebar/DasboardIcon.vue';
import animalIcon from '@/assets/icons/sidebar/AnimalIcon.vue';
import appointmentIcon from '@/assets/icons/sidebar/AppointmentIcon.vue';
import chatIcon from '@/assets/icons/sidebar/ChatIcon.vue';
import documentIcon from '@/assets/icons/sidebar/DocumentIcon.vue';
import searchSpecial from '@/assets/icons/sidebar/SearchSpecial.vue';
import stockIcon from '@/assets/icons/sidebar/StockIcon.vue';
import sheetIcon from '@/assets/icons/sidebar/SheetIcon.vue';
import taskIcon from '@/assets/icons/sidebar/TaskIcon.vue';

import userIconWhite from '@/assets/icons/user-profil-white.svg';

const route = useRoute();
const { userType } = useAuth();

// Map API user_type to sidebar role
const userRole = computed(() => {
    if (userType.value === 'veterinarian') return 'pro';
    if (userType.value === 'client') return 'client';
    return '';
});

const props = defineProps({
    role: {
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
        label: "Gestion des services",
        icon: animalIcon,
        user: "pro",
        link: "/services"
    },
    {
        label: "Tâches",
        icon: taskIcon,
        user: "pro",
        link: "/tasks"
    },
    {
        label: "Comptabilité",
        icon: sheetIcon,
        user: "pro",
        link: "/accounting"
    },
    {
        label: "Mes documents",
        icon: documentIcon,
        user: "client",
        link: "/documents"
    },
    {
        label: "Documents professionnels",
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
];

const filteredMenuItems = computed(() => {
    return menuItems.filter(item => {
        return item.user === "" || item.user === userRole.value || (Array.isArray(item.user) && item.user.includes(userRole.value));
    });
});

</script>
