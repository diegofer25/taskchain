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
import { useRive } from '@/modules/global/composables/use-rive'
import PromptInput from '@/modules/tasks/components/PromptInput.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const goalInput = ref<string>('')
const canvasRef = ref<HTMLCanvasElement | null>(null)
useRive({
  canvasRef,
  src: new URL('@/assets/animations/form_button.riv', import.meta.url).href,
  onLoad: (rive) => rive.setTextRunValue('label', t('generate')),
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
