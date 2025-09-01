<script setup>
import gsap from "gsap";
import { ref, watchEffect } from "vue";
import { VueLenis } from "lenis/vue";
import { ScrollTrigger, Observer } from "gsap/all";

import Hero from "./components/ui/Hero/index.js";
import Navbar from "./components/ui/Navbar/index.js";

gsap.registerPlugin(ScrollTrigger, Observer);

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
</script>

<template>
  <div class="h-screen w-screen bg-primary overflow-hidden">
    <Navbar />
    <VueLenis root ref="lenisRef" :options="{ autoRaf: false }" />
    <Hero />
  </div>
</template>
