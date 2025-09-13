<template>
    <div class="
        w-full flex justify-between items-center py-4 px-[44px] bg-primary-600">
        <router-link to="/">
            <img class="w-28 h-9" src="../assets/animoplus_header.png" />
        </router-link>

        <div v-if="!isLoginPage" class="flex justify-start items-center gap-10">
            <div class="flex justify-start items-center gap-10">
                <a href="#" class="text-white text-lg font-medium">Téléconseil</a>
                <a href="#" class="text-white text-lg font-medium">Vous êtes un pro</a>
                <a href="animoplus.fr" class="text-white text-lg font-medium">Animo + X</a>
            </div>
            <div class="flex justify-start items-center gap-6">
                <router-link to="/login"
                    class="px-6 py-3 rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-2.5">
                    <span class="text-white text-lg">S’inscrire</span>
                </router-link>

                <router-link to="/login"
                    class="px-6 py-3 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-2.5">
                    <span class="text-primary-600 text-lg">Se connecter</span>

                    <div class="w-4 h-4 relative overflow-hidden">
                        <div
                            class="w-1 h-3 left-[10px] top-[2px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-emerald-600" />
                        <div
                            class="w-[3.33px] h-1.5 left-[6.67px] top-[4.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-emerald-600" />
                        <div
                            class="w-2 h-0 left-[2px] top-[8px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-emerald-600" />
                    </div>
                </router-link>
            </div>
        </div>

        <router-link v-else-if="isResgisterPage" to="/login"
            class="px-6 py-3 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-2.5">
            <span class="text-primary-600 text-lg">S'inscrire</span>

            <div class="w-4 h-4 relative overflow-hidden">
                <div
                    class="w-1 h-3 left-[10px] top-[2px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-emerald-600" />
                <div
                    class="w-[3.33px] h-1.5 left-[6.67px] top-[4.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-emerald-600" />
                <div
                    class="w-2 h-0 left-[2px] top-[8px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-emerald-600" />
            </div>
        </router-link>

        <router-link v-else to="/login"
            class="px-6 py-3 bg-white rounded-xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-2.5">
            <span class="text-primary-600 text-lg">S'inscrire</span>

            <div class="w-4 h-4 relative overflow-hidden">
                <div
                    class="w-1 h-3 left-[10px] top-[2px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-emerald-600" />
                <div
                    class="w-[3.33px] h-1.5 left-[6.67px] top-[4.67px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-emerald-600" />
                <div
                    class="w-2 h-0 left-[2px] top-[8px] absolute outline outline-[1.33px] outline-offset-[-0.67px] outline-emerald-600" />
            </div>
        </router-link>



    </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
const isResgisterPage = computed(() => route.path === '/register')
</script>