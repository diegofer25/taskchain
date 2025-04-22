<template>
  <form @submit.prevent class="flex flex-col min-w-80 w-full">
    <PromptInput v-model="goalInput" />

    <canvas
      ref="canvasRef"
      class="self-end w-56"
      style="transform: translate(42px, -15px)"
    ></canvas>
  </form>
</template>

<script lang="ts" setup>
import PromptInput from '@/components/PromptInput.vue'
import { useRive } from '@/composables/use-rive'
import { ref } from 'vue'

const goalInput = ref<string>('')
const canvasRef = ref<HTMLCanvasElement | null>(null)
useRive({
  canvasRef,
  src: new URL('@/assets/animations/generate_button.riv', import.meta.url).href,
  onStateChange: (state) => {
    const data = state.data
    if (data && Array.isArray(data) && typeof data[0] === 'string') {
      if (data[0] === 'CLICK') {
        console.log('Button clicked!')
      } else if (data[0].includes('HOVER')) {
        document.body.style.cursor = 'pointer'
      } else if (data[0] === 'IDLE') {
        document.body.style.cursor = 'default'
      }
    }
  },
})
</script>
