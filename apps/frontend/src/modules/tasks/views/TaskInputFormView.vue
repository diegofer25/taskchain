<template>
  <form @submit.prevent class="flex flex-col min-w-80 w-full mt-16">
    <PromptInput v-model="goalInput" @key-enter="processUserGoal" />

    <canvas
      :aria-disabled="!isGoalInputValid || isFetching"
      ref="buttonAnimationCanvasRef"
      class="self-end w-56"
      style="transform: translate(42px, -15px)"
      :class="{
        'pointer-events-none opacity-50': !isGoalInputValid || isFetching,
        'cursor-pointer opacity-100': isGoalInputValid || isFetching,
      }"
    ></canvas>
  </form>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useApiFetch } from '@/modules/global/composables/use-api-fetch'
import { useRive } from '@/modules/global/composables/use-rive'
import { useSpeech } from '@/modules/global/composables/use-speech'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { AiVoiceState } from '@/modules/global/types/ai-voice.types'
import PromptInput from '@/modules/tasks/components/PromptInput.vue'
import type { GenerateQuestionsResponse } from '@taskchain/types'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()
const { speak } = useSpeech()
const globalStore = useGlobalStore()
const { isFetching, post, execute, data } = useApiFetch('/tasks', { immediate: false })
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
  post({
    message: goalInput.value,
    language: locale.value,
  })
  await execute()
  const { processId } = JSON.parse(data.value as string) as GenerateQuestionsResponse

  router.push(`/questions/${processId}`)
}
</script>
