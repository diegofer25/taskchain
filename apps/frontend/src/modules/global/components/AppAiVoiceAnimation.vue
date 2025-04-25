<template>
  <canvas ref="canvasRef"> </canvas>
</template>

<script lang="ts" setup>
import { useRive } from '@/modules/global/composables/use-rive'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { StateMachineInputType } from '@rive-app/webgl'
import { ref, watch } from 'vue'

const globalStore = useGlobalStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { getInput } = useRive({
  canvasRef,
  src: new URL('@/assets/animations/ai_speaker.riv', import.meta.url).href,
  inputs: [
    {
      name: 'state',
      type: StateMachineInputType.Number,
      defaultValue: globalStore.aiVoiceState,
    },
  ] as const,
})

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
