<template>
  <AppHeader />
  <div
    class="flex flex-col items-center justify-center container mx-auto px-2 md:px-4 pb-8 gap-4 min-h-screen"
  >
    <canvas ref="canvasRef" class="mx-auto w-80"></canvas>
    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import AppHeader from '@/modules/global/components/app-header/AppHeader.vue'
import { useRive } from '@/modules/global/composables/use-rive'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { ref, watch } from 'vue'

const globalStore = useGlobalStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const colors = globalStore.theme === 'dark' ? [150, 255, 123] : [14, 165, 233]
const { getInstance } = useRive({
  canvasRef,
  src: new URL('@/assets/animations/taskchain.riv', import.meta.url).href,
  onLoad: (rive) => {
    const vmi = rive.viewModelInstance
    const colorProperty = vmi?.color('fill')
    const [r, g, b] = colors
    colorProperty?.rgb(r, g, b)
  },
})

watch(
  () => globalStore.theme,
  () => {
    const vmi = getInstance()?.viewModelInstance
    const colorProperty = vmi?.color('fill')
    const [r, g, b] = colors
    colorProperty?.rgb(r, g, b)
  },
)
</script>
