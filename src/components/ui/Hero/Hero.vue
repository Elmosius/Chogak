<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import gsap from 'gsap';
import useMouseScroll from '../../../utils/useMouseScroll';
import { images } from '../../../contants';

const gallery = ref<HTMLElement | null>(null);
const center = ref<HTMLElement | null>(null);
const scrollY = useMouseScroll();

onMounted(() => {
  if (!gallery.value) return;

  let pos = 50;
  const imgs = gsap.utils.toArray(gallery.value.children);
  const maxScroll = gallery.value.getBoundingClientRect().width + window.innerWidth / 2;

  if (typeof scrollY.setBounds === 'function') scrollY.setBounds(0, maxScroll);

  const toY = gsap.quickTo(gallery.value, 'x', { duration: 2.5, ease: 'back.out' });

  watch(scrollY, (newVal) => {
    const clamped = Math.max(0, Math.min(maxScroll, newVal));
    toY(-clamped);
    pos = clamped * 0.04;

    imgs.forEach((img) => {
      const image = img as HTMLImageElement;

      const objPos = gsap.quickTo(image, 'objectPosition', {
        duration: 2.5,
        ease: 'back.out',
      });
      objPos(pos);
    });
  });
});

onUnmounted(() => {
  gsap.killTweensOf(gallery.value);
});
</script>

<template>
  <section id="hero" class="relative h-screen overflow-hidden">
    <div ref="gallery" class="absolute left-[80%] gap-5 flex justify-center items-center h-screen w-screen select-none">
      <img v-for="i in images" :key="i" :src="`${i}`" :alt="`${i}`" draggable="false" />
    </div>
  </section>

  <section class="relative">
    <div class="absolute container mx-auto inset-0 flex items-end px-10 p-4">
      <span class="text-white text-xl pb-25 font-semibold">{{ Math.floor(scrollY) }}</span>
    </div>
  </section>
</template>
