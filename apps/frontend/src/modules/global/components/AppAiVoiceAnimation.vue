<template>
  <RiveAnimation
    :src="AI_VOICE_ANIMATION_URL"
    :inputs="ANIMATION_INPUTS"
    auto-bind
    @loaded="onLoad"
  />
</template>

<script lang="ts" setup>
import RiveAnimation from '@/modules/global/components/RiveAnimation.vue'
import type { RiveInstance } from '@/modules/global/composables/use-rive'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { StateMachineInputType } from '@rive-app/webgl'
import { computed, watch } from 'vue'

const globalStore = useGlobalStore()
const rgbColor = computed(() => (globalStore.theme === 'dark' ? [150, 255, 123] : [14, 165, 233]))
const AI_VOICE_ANIMATION_URL = new URL('@/assets/animations/ai_speaker.riv', import.meta.url).href
const ANIMATION_INPUTS = [
  {
    name: 'state',
    type: StateMachineInputType.Number,
    defaultValue: globalStore.aiVoiceState,
  },
] as const
let riveInstance: RiveInstance | null = null
let shouldPlay = false

watch(() => globalStore.theme, fillColor)

watch(
  () => globalStore.aiVoiceState,
  async () => {
    if (!riveInstance && !shouldPlay) {
      shouldPlay = true
      return
    }

    playCurrentAiVoiceState()
  },
)

async function onLoad(_riveInstance: RiveInstance) {
  riveInstance = _riveInstance

  if (shouldPlay) {
    playCurrentAiVoiceState()
    shouldPlay = false
  }

  fillColor()
}

async function playCurrentAiVoiceState() {
  const stateInput = await riveInstance?.getInput('state')

  if (stateInput) {
    stateInput.value = globalStore.aiVoiceState
  }
}

function fillColor() {
  const vmi = riveInstance?.getInstance()?.viewModelInstance
  const colorProperty = vmi?.color('fill')
  const [r, g, b] = rgbColor.value
  colorProperty?.rgb(r, g, b)
}
</script>
