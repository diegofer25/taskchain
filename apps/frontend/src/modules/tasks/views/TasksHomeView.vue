<template>
  <div class="flex flex-col items-center justify-center container mx-auto px-2 md:px-4 py-8 gap-8">
    <MainTaskInputForm />
  </div>
</template>

<script setup lang="ts">
import { useGlobalLoading } from '@/modules/global/composables/use-global-loading'
import { usePubSub } from '@/modules/global/composables/use-pubsub'
import { useSpeech } from '@/modules/global/composables/use-speech'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { AiVoiceState } from '@/modules/global/types/ai-voice.types'
import MainTaskInputForm from '@/modules/tasks/components/MainTaskInputForm.vue'
import { onBeforeUnmount, onMounted } from 'vue'

const pubsub = usePubSub()
const globalStore = useGlobalStore()
const { show, hide } = useGlobalLoading()
const { speak } = useSpeech()

onMounted(async () => {
  pubsub.listenServerMessage((message) => {
    console.log('Received message from server:', message)
    const data = message.data
    if (
      data &&
      typeof data === 'object' &&
      'questions' in data &&
      typeof data.questions === 'object' &&
      data.questions &&
      'context' in data.questions &&
      typeof data.questions.context === 'string'
    ) {
      globalStore.aiVoiceState = AiVoiceState.SPEAKING
      speak(data.questions.context)
    }
  })

  show()
  await pubsub.connect()
  hide()
})

onBeforeUnmount(() => {
  pubsub.disconnect()
})

window.addEventListener('beforeunload', () => {
  pubsub.disconnect()
})
window.addEventListener('unload', () => {
  pubsub.disconnect()
})
</script>

<style scoped lang="scss"></style>
