<template>
  <section class="mt-[80px] grid gap-8 w-full" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr))">
    <div class="action-card flex flex-col gap-8">
      <div class="flex gap-2 items-center">
        <img :src="urgenceIcon" alt="Urgence" class="w-5" />
        <h3 class="uppercase text-black font-bold text-xl">
          URGENCE
        </h3>
      </div>
      <p class="text-[color:var(--color-neutral-600)] leading-[1.6] text-base">
        En cas d'urgence pour votre animal, chaque minute compte. Nos
        partenaires vétérinaires qualifiés sont là pour sauver la santé de vos
        compagnons.
      </p>
      <button class="bg-primary-600 text-white px-4 py-3 rounded-md text-sm hover:bg-primary-600">
        Contacter maintenant
      </button>
    </div>
    <div class="action-card flex flex-col gap-8">
      <div class="flex gap-2 items-center">
        <img :src="botIcon" alt="Conseil IA" class="w-6" />
        <h3 class="uppercase text-black font-bold text-xl">
          CONSEIL IA
        </h3>
      </div>
      <p class="text-[color:var(--color-neutral-600)] leading-[1.6] text-base">
        Vous avez un doute concernant votre animal et vous ne savez pas quoi
        faire ? Notre conseiller virtuel est là pour vous 7j/7 et 24h/24.
      </p>
      <button class="bg-primary-600 text-white px-4 py-3 rounded-md text-sm hover:bg-primary-600">
        Démarrer le chat
      </button>
    </div>
  </section>
</template>

<script setup>
import urgenceIcon from "@/assets/icons/urgence-icon.svg";
import botIcon from "@/assets/icons/chat-icon.svg";
</script>

<style scoped>
.action-card {
  background: #fff;
  border-radius: 24px;
  padding: 44px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-neutral-200);
  transition: all 0.3s ease;
}

.action-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-2);
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
</style>
