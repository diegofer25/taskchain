<template>
  <AppHeader />
  <div class="flex flex-col items-center container mx-auto px-2 md:px-4 pb-8 gap-4">
    <RiveAnimation
      @loaded="onLoadedAnimation"
      :src="TASKCHAIN_ANIMATION_URL"
      class="mx-auto w-80"
    ></RiveAnimation>
    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import AppHeader from '@/modules/global/components/app-header/AppHeader.vue'
import RiveAnimation from '@/modules/global/components/RiveAnimation.vue'
import type { RiveInstance } from '@/modules/global/composables/use-rive'

const TASKCHAIN_ANIMATION_URL = new URL('@/assets/animations/taskchain.riv', import.meta.url).href

function onLoadedAnimation(instance: RiveInstance) {
  const rive = instance.getInstance()
  const vmi = rive?.viewModelInstance

  console.log('vmi', vmi, rive)
}
</script>
