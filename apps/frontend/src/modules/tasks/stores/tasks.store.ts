import { usePubSub } from '@/modules/global/composables/use-pubsub'
import { defineStore } from 'pinia'

export const useTasksStore = defineStore('tasks', () => {
  // const { speak } = useSpeech()
  const pubsub = usePubSub()
  // const globalStore = useGlobalStore()

  return {
    startListeningAndConnect,
    stopListeningAndDisconnect,
  }

  function startListeningAndConnect() {
    window.addEventListener('beforeunload', stopListeningAndDisconnect)

    pubsub.listenGroupMessage('tasks', (message) => {
      console.log('Received message from group:', message)
    })
    pubsub.listenServerMessage((message) => {
      console.log('Received message from server:', message)
    })

    return pubsub.connect()
  }

  function stopListeningAndDisconnect(e?: BeforeUnloadEvent) {
    if (e) {
      e.preventDefault()
      window.removeEventListener('beforeunload', stopListeningAndDisconnect)
    }
    return pubsub.disconnect()
  }
})
