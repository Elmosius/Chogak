import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { onMounted, onUnmounted, ref } from 'vue';
import type { Ref } from 'vue';
gsap.registerPlugin(Observer);

type ScrollRef = Ref<number> & { setBounds?: (min: number, max: number) => void };

const useMouseScroll = (): ScrollRef => {
  const scrollY = ref(0) as ScrollRef;
  let min = -Infinity;
  let max = Infinity;

  // allow consumers to set bounds (e.g. 0 .. maxScroll)
  scrollY.setBounds = (newMin: number, newMax: number) => {
    min = newMin;
    max = newMax;
    if (scrollY.value < min) scrollY.value = min;
    if (scrollY.value > max) scrollY.value = max;
  };

  onMounted(() => {
    Observer.create({
      type: 'wheel,touch,pointer',
      preventDefault: true,
      onWheel: (e) => {
        const next = scrollY.value + e.deltaY;
        const clamped = Math.max(min, Math.min(max, next));
        scrollY.value = clamped;
      },
      wheelSpeed: 0.3,
    });
  });

  onUnmounted(() => {
    Observer.getAll().forEach((observer) => observer.kill());
  });

  return scrollY;
};

export default useMouseScroll;
