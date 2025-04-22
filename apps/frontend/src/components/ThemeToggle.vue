<template>
  <canvas
    ref="riveCanvas"
    class="absolute top-0 right-0 p-2 w-24 z-50 cursor-pointer transition-all duration-1000 ease-in-out"
    @click="onClick"
  ></canvas>
</template>

<script lang="ts" setup>
import { useRive } from '@/composables/use-rive'
import { useGlobalStore } from '@/stores/global.store'
import { ref } from 'vue'

const globalStore = useGlobalStore()
const riveCanvas = ref<HTMLCanvasElement | null>(null)
const animationSrc = new URL('@/assets/animations/theme_toggle.riv', import.meta.url).href
useRive({
  canvasRef: riveCanvas,
  src: animationSrc,
  onStateChange: (state) => {
    const data = state.data
    console.log('State changed:', data)
  },
})

function onClick() {
  globalStore.toggleTheme()
}
</script>
