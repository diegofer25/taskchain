<template>
  <template v-if="loaded">
    <RouterView />
  </template>
  <AppInteractions />
</template>

<script setup lang="ts">
import AppInteractions from '@/modules/global/components/app-interactions/AppInteractions.vue'
import { useGlobalLoading } from '@/modules/global/composables/use-global-loading'
import { loadAppDependencies } from '@/modules/global/utils/initialization.utils'
import { useTasksStore } from '@/modules/tasks/stores/tasks.store'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'

const { show, hide } = useGlobalLoading()
const tasksStore = useTasksStore()
const loaded = ref(false)

onMounted(async () => {
  show()
  try {
    console.log('Loading app dependencies...')
    await loadAppDependencies({
      // For production I prefer to use the CDN version of the Rive WASM because it could be already cached on the user's browser
      // and it is faster to load. But for development I prefer to use the local version of the Rive WASM
      riveUrl: import.meta.env.DEV ? '/rive.wasm' : undefined,
    })
    loaded.value = true
    console.log('App dependencies loaded successfully.')
  } catch (error) {
    console.error('Error loading app dependencies:', error)
  } finally {
    hide()
  }
})

onBeforeUnmount(() => {
  tasksStore.stopListeningAndDisconnect()
})
</script>
