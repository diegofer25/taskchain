<template>
  <div class="flex flex-col items-center justify-center container mx-auto px-2 md:px-4 pb-8 gap-4">
    <div class="flex flex-col text-center">
      <AppAiVoiceAnimation class="h-auto w-1/2 max-w-96 self-center" />
    </div>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import AppAiVoiceAnimation from '@/modules/global/components/AppAiVoiceAnimation.vue'
import { useGlobalLoading } from '@/modules/global/composables/use-global-loading'
import { useTasksStore } from '@/modules/tasks/stores/tasks.store'
import { onMounted } from 'vue'

const { show, hide } = useGlobalLoading()
const tasksStore = useTasksStore()

onMounted(async () => {
  show()
  await tasksStore.startListeningAndConnect()
  hide()
})
</script>

<style scoped lang="scss"></style>
