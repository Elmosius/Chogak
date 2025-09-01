<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import gsap from "gsap";
import { Observer } from "gsap/all";

const gallery = ref<HTMLElement | null>(null);
const center = ref<HTMLElement | null>(null);
const number = ref(1);

watch(number, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    gsap.to(".number", {
      duration: 0.2,
      y: -10,
      opacity: 0,
      onComplete: () => {
        gsap.fromTo(
          ".number",
          { y: 10, opacity: 0 },
          {
            duration: 0.05,
            y: 0,
            opacity: 1,
            ease: "power2.out",
          },
        );
      },
    });
  }
});

onMounted(() => {
  if (!gallery.value) return;

  const imgs = gsap.utils.toArray("img");

  let xPos = 0;
  let objShift = 50;
  const clampObj = gsap.utils.clamp(0, 100);
  const speed = 4;
  const parallax = 0.025;

  const centerX = center.value.getBoundingClientRect().x;

  Observer.create({
    target: window,
    type: "wheel",
    onChange(self) {
      const dx = self.deltaY * speed;

      xPos += dx;
      gsap.to(gallery.value, {
        x: xPos,
      });

      objShift -= dx * parallax;
      objShift = clampObj(objShift);

      imgs.forEach((img) => {
        let left = img.getBoundingClientRect().left;
        let right = img.getBoundingClientRect().right;

        if (centerX > left && centerX < right) {
          const newNumber = Number(img.alt);
          if (number.value !== newNumber) {
            number.value = newNumber;
          }
        }

        gsap.to(img, {
          objectPosition: `${objShift}% 50%`,
          ease: "sine",
        });
      });
    },
    wheelSpeed: 0.3,
  });
});
</script>

<template>
  <section id="hero" class="relative h-screen overflow-hidden">
    <div class="absolute inset-0 flex justify-center items-center">
      <p class="p-1" ref="center"></p>
    </div>
    <div
      ref="gallery"
      class="absolute left-[70%] gap-5 flex justify-center items-center h-screen w-screen select-none"
    >
      <img
        v-for="i in 8"
        :key="i"
        :src="`/images/${i}.jpg`"
        :alt="i"
        draggable="false"
      />
    </div>
  </section>

  <section class="relative">
    <div class="absolute container mx-auto inset-0 flex items-end">
      <p class="text-white text-xl pb-25 ms-10 number">{{ number }}</p>
      <span class="text-white text-xl pb-25">&nbsp;\ 8</span>
    </div>
  </section>
</template>
