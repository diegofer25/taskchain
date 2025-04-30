import { usePubSub } from '@/modules/global/composables/use-pubsub'
import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasks', () => {
  // const { speak } = useSpeech()
  const pubsub = usePubSub()
  // const globalStore = useGlobalStore()

  window.addEventListener('beforeunload', stopListeningAndDisconnect)
  window.addEventListener('unload', stopListeningAndDisconnect)

  return {
    startListeningAndConnect,
    stopListeningAndDisconnect,
  }

  function startListeningAndConnect() {
    pubsub.listenGroupMessage('tasks', (message) => {
      console.log('Received message from group:', message)
    })
    pubsub.listenServerMessage((message) => {
      console.log('Received message from server:', message)
    })

    return pubsub.connect()
  }

  function stopListeningAndDisconnect() {
    pubsub.disconnect()
  }
})
