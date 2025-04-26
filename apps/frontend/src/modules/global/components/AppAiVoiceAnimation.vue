<template>
  <canvas ref="canvasRef"> </canvas>
</template>

<script lang="ts" setup>
import { useRive } from '@/modules/global/composables/use-rive'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { StateMachineInputType } from '@rive-app/webgl'
import { computed, ref, watch } from 'vue'

const globalStore = useGlobalStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const rgbColor = computed(() => (globalStore.theme === 'dark' ? [150, 255, 123] : [14, 165, 233]))
const { getInput, getInstance } = useRive({
  canvasRef,
  src: new URL('@/assets/animations/ai_speaker.riv', import.meta.url).href,
  autoBind: true,
  inputs: [
    {
      name: 'state',
      type: StateMachineInputType.Number,
      defaultValue: globalStore.aiVoiceState,
    },
  ] as const,
  onLoad: (rive) => {
    const vmi = rive.viewModelInstance
    const colorProperty = vmi?.color('fill')
    const [r, g, b] = rgbColor.value
    colorProperty?.rgb(r, g, b)
  },
})

watch(
  () => globalStore.theme,
  () => {
    const vmi = getInstance()?.viewModelInstance
    const colorProperty = vmi?.color('fill')
    const [r, g, b] = rgbColor.value
    colorProperty?.rgb(r, g, b)
  },
)

watch(
  () => globalStore.aiVoiceState,
  async () => {
    const stateInput = await getInput('state')
    if (stateInput) {
      stateInput.value = globalStore.aiVoiceState
    }
  },
)
</script>
