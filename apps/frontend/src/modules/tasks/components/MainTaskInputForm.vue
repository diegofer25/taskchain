<template>
  <form @submit.prevent class="flex flex-col min-w-80 w-full">
    <div class="flex flex-col text-center">
      <AppAiVoiceAnimation class="h-auto w-1/2 max-w-96 self-center" />
    </div>

    <PromptInput v-model="goalInput" @key-enter="processUserGoal" />

    <canvas
      :aria-disabled="!isGoalInputValid || apiFetch.isFetching.value"
      ref="buttonAnimationCanvasRef"
      class="self-end w-56"
      style="transform: translate(42px, -15px)"
      :class="{
        'pointer-events-none opacity-50': !isGoalInputValid || apiFetch.isFetching.value,
        'cursor-pointer opacity-100': isGoalInputValid || apiFetch.isFetching.value,
      }"
    ></canvas>
  </form>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import AppAiVoiceAnimation from '@/modules/global/components/AppAiVoiceAnimation.vue'
import { useApiFetch } from '@/modules/global/composables/use-api-fetch'
import { useRive } from '@/modules/global/composables/use-rive'
import { useSpeech } from '@/modules/global/composables/use-speech'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { AiVoiceState } from '@/modules/global/types/ai-voice.types'
import PromptInput from '@/modules/tasks/components/PromptInput.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const authStore = useAuthStore()
const { speak } = useSpeech()
const globalStore = useGlobalStore()
const apiFetch = useApiFetch('/tasks', { immediate: false })
const goalInput = ref<string>('')
const buttonAnimationCanvasRef = ref<HTMLCanvasElement | null>(null)
const startMessage = `${t('hello_name', { name: authStore.firstName })} ${t('taskchain_home_main_title')}`
const isGoalInputValid = computed(() => goalInput.value.trim().split(' ').length > 1)

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
        processUserGoal()
      } else if (data[0].includes('HOVER')) {
        document.body.style.cursor = 'pointer'
      } else if (data[0] === 'IDLE') {
        document.body.style.cursor = 'default'
      }
    }
  },
})

async function processUserGoal() {
  console.log('Processing user goal:', goalInput.value)
  globalStore.aiVoiceState = AiVoiceState.THINKING
  const response = await apiFetch
    .post({
      message: goalInput.value,
      language: locale.value,
    })
    .json()
    .execute()

  console.log('Response:', response)
}
</script>
