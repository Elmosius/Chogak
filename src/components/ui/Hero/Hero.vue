<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import gsap from 'gsap';
import useMouseScroll from '../../../utils/useMouseScroll';
import { images } from '../../../contants';

const gallery = ref<HTMLElement | null>(null);
const center = ref<HTMLElement | null>(null);
const scrollY = useMouseScroll();
const number = ref(1);

onMounted(() => {
  if (!gallery.value) return;

  const imgs = gsap.utils.toArray(gallery.value.children);
  const maxScroll = gallery.value.getBoundingClientRect().width + window.innerWidth / 2;

  if (typeof scrollY.setBounds === 'function') scrollY.setBounds(0, maxScroll);

  const toY = gsap.quickTo(gallery.value, 'x', { duration: 0.5, ease: 'back.out' });

  watch(scrollY, (newVal) => {
    const clamped = Math.max(0, Math.min(maxScroll, newVal));
    toY(-clamped);
  });
});

onUnmounted(() => {
  gsap.killTweensOf(gallery.value);
});
</script>

<template>
  <section id="hero" class="relative h-screen overflow-hidden">
    <div class="absolute inset-0 flex justify-center items-center z-10">
      <p class="p-0.5 bg-secondary rounded-full" ref="center"></p>
    </div>
    <div ref="gallery" class="absolute left-[80%] gap-5 flex justify-center items-center h-screen w-screen select-none">
      <img v-for="i in images" :key="i" :src="`${i}`" :alt="`${i}`" draggable="false" />
    </div>
  </section>

  <section class="relative">
    <div class="absolute container mx-auto inset-0 flex items-end">
      <!-- <p class="text-white text-xl pb-25 ms-10 number">{{ number }}</p> -->
      <!-- <span class="text-white text-xl pb-25">&nbsp;\ 8</span> -->
      <span class="text-white text-xl pb-25">{{ scrollY }}</span>
    </div>
  </section>
</template>
