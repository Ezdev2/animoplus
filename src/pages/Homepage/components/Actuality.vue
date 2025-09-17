<template>
    <div
        class="w-full mx-4 my-8 px-12 py-20 bg-primary-500 text-white rounded-[2rem] shadow-2xl flex flex-col items-center justify-between relative overflow-hidden">
        <!-- Content section -->
        <div class="grid grid-cols-3 gap-16">
            <div class="flex flex-col gap-8">
                <h1 class="text-8xl font-bold mb-4 leading-tight uppercase">Animo+ <br>Actu</h1>
                <p class="">DÉCOUVREZ LES SERVICES, OFFRES SPÉCIALES ET NOUVEAUTÉS D ENOS PARTENAIRES SÉLECTIONNÉS PAR L'ÉQUIPE ANIMO+</p>
                <a href="#"
                    class="w-[fit-content] px-10 py-4 bg-accent-400 text-white font-bold rounded-full shadow-lg hover:bg-primary-500 transition-colors duration-300">
                    VOIR LES ARTICLES</a>
            </div>
            <div class="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="(item, index) in actualities" :key="index"
                    class="rounded-4xl p-8 bg-white flex flex-col justify-between gap-6">
                    <div class="h-40 w-full overflow-hidden rounded-2xl">
                        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
                    </div>
                    <h2 class="text-neutral-900 text-3xl font-bold">
                        {{ item.title }}
                    </h2>

                    <div>
                        <p class="text-neutral-600 line-clamp-2">
                            {{ item.description }}
                        </p>
                        <a href="#" class="text-primary-600 text-sm hover:underline">Lire plus</a>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import horse from "@/assets/images/horse.svg"
import cat from "@/assets/images/cat.svg"
import dog from "@/assets/images/dog.svg"
import bird from "@/assets/images/bird.svg"
const actualities = [
    {
        image: horse,
        title: "J'AI PERDU MON ANIMAL",
        description:
            "VOUS AVEZ PERDU VOTRE COMPAGNON ? CRÉEZ UNE ALERTE EN QUELQUES SECONDES ET DIFFUSEZ-LA AUTOMATIQUEMENT AUPRÈS DE LA COMMUNAUTÉ ANIMO+ ET DE VOS PROCHES."
    },
    {
        image: cat,
        title: "J'AI TROUVÉ UN ANIMAL",
        description:
            "VOUS AVEZ TROUVÉ UN ANIMAL ERRANT, SIGNALEZ-LE ET CONTRIBUEZ À RÉUNIR UNE FAMILLE EN PERMETTANT AU PROPRIÉTAIRE DE LE RETROUVER RAPIDEMENT."
    },
    {
        image: dog,
        title: "J'AI PERDU MON ANIMAL",
        description:
            "VOUS AVEZ PERDU VOTRE COMPAGNON ? CRÉEZ UNE ALERTE EN QUELQUES SECONDES ET DIFFUSEZ-LA AUTOMATIQUEMENT AUPRÈS DE LA COMMUNAUTÉ ANIMO+ ET DE VOS PROCHES."
    },
    {
        image: bird,
        title: "J'AI TROUVÉ UN ANIMAL",
        description:
            "VOUS AVEZ TROUVÉ UN ANIMAL ERRANT, SIGNALEZ-LE ET CONTRIBUEZ À RÉUNIR UNE FAMILLE EN PERMETTANT AU PROPRIÉTAIRE DE LE RETROUVER RAPIDEMENT."
    }
];
</script>
<style>
.ellipsis {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>