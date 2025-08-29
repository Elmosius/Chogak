<script setup>
import gsap from "gsap";
import { onMounted, ref, watchEffect } from "vue";
import { VueLenis } from "lenis/vue";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Hero from "./components/ui/Hero/index.js";
import Navbar from "./components/ui/Navbar/index.js";

const lenisRef = ref();

watchEffect((onInvalidate) => {
  if (!lenisRef.value?.lenis) return;

  lenisRef.value.lenis.on("scroll", ScrollTrigger.update);

  function update(time) {
    lenisRef.value.lenis.raf(time * 1000);
  }
  gsap.ticker.add(update);

  gsap.ticker.lagSmoothing(0);

  onInvalidate(() => {
    gsap.ticker.remove(update);
  });
});

onMounted(() => {
  gsap.registerPlugin(ScrollTrigger);
});
</script>

<template>
  <div class="h-screen bg-primary">
    <Navbar />
    <VueLenis root ref="lenisRef" :options="{ autoRaf: false }" />
    <Hero />
  </div>
</template>
