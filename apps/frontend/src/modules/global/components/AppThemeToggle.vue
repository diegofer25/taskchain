<template>
  <canvas
    ref="riveCanvas"
    class="w-24 cursor-pointer transition-all duration-1000 ease-in-out"
    @click="onClick"
  ></canvas>
</template>

<script lang="ts" setup>
import { useRive } from '@/modules/global/composables/use-rive'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { StateMachineInputType } from '@rive-app/webgl'
import { ref } from 'vue'

const globalStore = useGlobalStore()
const riveCanvas = ref<HTMLCanvasElement | null>(null)
const animationSrc = new URL('@/assets/animations/theme_toggle.riv', import.meta.url).href
useRive({
  canvasRef: riveCanvas,
  src: animationSrc,
  inputs: [
    {
      name: 'IsPressed',
      type: StateMachineInputType.Boolean,
      defaultValue: globalStore.isDark,
    },
  ],
})

function onClick() {
  globalStore.toggleTheme()
}
</script>
