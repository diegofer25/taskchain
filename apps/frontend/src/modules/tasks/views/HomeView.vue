<template>
  <div class="flex flex-col items-center justify-center container mx-auto px-2 md:px-4 py-8 gap-8">
    <MainTaskInputForm />
  </div>
</template>

<script setup lang="ts">
import { useGlobalLoading } from '@/modules/global/composables/use-global-loading'
import { usePubSub } from '@/modules/global/composables/use-pubsub'
import MainTaskInputForm from '@/modules/tasks/components/MainTaskInputForm.vue'
import { onBeforeUnmount, onMounted } from 'vue'

const pubsub = usePubSub()
const { show, hide } = useGlobalLoading()

onMounted(async () => {
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
