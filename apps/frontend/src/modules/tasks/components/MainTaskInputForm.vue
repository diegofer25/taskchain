<template>
  <form @submit.prevent class="flex flex-col min-w-80 w-full">
    <div class="flex flex-col text-center">
      <!-- <h1 class="text-lg sm:text-xl md:text-2xl text-light-text dark:text-dark-text mb-4">
        <span v-text="t('hello_name', { name: authStore.firstName })"></span>
        <br />
        {{ t('taskchain_home_main_title') }}
      </h1> -->

      <AppAiVoiceAnimation class="h-auto w-1/2 max-w-96 self-center" />
    </div>

    <PromptInput v-model="goalInput" />

    <canvas
      :aria-disabled="!goalInput"
      ref="buttonAnimationCanvasRef"
      class="self-end w-56"
      style="transform: translate(42px, -15px)"
      :class="{
        'pointer-events-none opacity-50': !goalInput,
        'cursor-pointer opacity-100': goalInput,
      }"
    ></canvas>
  </form>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import AppAiVoiceAnimation from '@/modules/global/components/AppAiVoiceAnimation.vue'
import { useRive } from '@/modules/global/composables/use-rive'
import { useSpeech } from '@/modules/global/composables/use-speech'
import PromptInput from '@/modules/tasks/components/PromptInput.vue'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const authStore = useAuthStore()
const { speak } = useSpeech()
const goalInput = ref<string>('')
const buttonAnimationCanvasRef = ref<HTMLCanvasElement | null>(null)
const startMessage = `${t('hello_name', { name: authStore.firstName })} ${t('taskchain_home_main_title')}`

watch(locale, () => getInstance()?.setTextRunValue('label', t('generate')))

onMounted(() => speak(startMessage))

const { getInstance } = useRive({
  canvasRef: buttonAnimationCanvasRef,
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
