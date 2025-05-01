import { i18n } from '@/i18n'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useInteractionsStore } from '@/modules/global/stores/interactions.store'
import {
  type OnDisconnectedArgs,
  type OnGroupDataMessageArgs,
  type OnServerDataMessageArgs,
  WebPubSubClient,
} from '@azure/web-pubsub-client'
import type { AuthPubSubResponse, PubSubEvent } from '@taskchain/types'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const MAX_RETRIES = 5

export function usePubSub() {
  const router = useRouter()
  const { showNotification } = useInteractionsStore()
  const authStore = useAuthStore()
  const isConnected = ref(false)
  const groups: Record<string, (d: PubSubEvent) => void> = {}
  const serverHandlers: Array<(d: PubSubEvent) => void> = []
  let retries = 0
  const client = new WebPubSubClient({
    getClientAccessUrl: async () => useStorage('pubsub-token', {} as AuthPubSubResponse).value.url,
  })
  let connecting = false

  /* exposed API */
  return {
    isConnected,
    connect,
    disconnect,
    listenGroupMessage,
    listenServerMessage,
  }

  function listenServerMessage(cb: (d: PubSubEvent) => void) {
    serverHandlers.push(cb)
  }

  function listenGroupMessage(group: string, cb: (d: PubSubEvent) => void) {
    client.joinGroup(group)
    groups[group] = cb
  }

  async function disconnect() {
    await Promise.all(Object.keys(groups).map((g) => client.leaveGroup(g)))
    client.off('server-message', handleServerMsg)
    client.off('group-message', handleGroupMsg)
    client.off('disconnected', onDisconnected)
    client.stop()
    isConnected.value = false
  }

  async function connect() {
    if (isConnected.value || connecting) return
    connecting = true

    client.on('server-message', handleServerMsg)
    client.on('group-message', handleGroupMsg)
    client.on('disconnected', onDisconnected)

    try {
      await client.start()
      isConnected.value = true
      retries = 0
    } catch {
      connecting = false
      if (retries++ < MAX_RETRIES) {
        setTimeout(connect, 5_000)
      } else {
        showNotification({
          message: i18n.global.t('an_error_occurred_while_connecting_to_the_update_server'),
          title: i18n.global.t('error'),
          status: 'error',
        })
      }
    } finally {
      connecting = false
    }
  }

  function handleServerMsg({ message }: OnServerDataMessageArgs) {
    console.log('Received message from server:', message, serverHandlers)
    dispatchHandlers(serverHandlers, message)
  }

  function handleGroupMsg({ message }: OnGroupDataMessageArgs) {
    const cb = groups[message.group]
    if (cb) dispatchHandlers([cb], message.data)
  }

  async function onDisconnected(e: OnDisconnectedArgs) {
    const forced = e.message?.message === 'Application server closed the connection. Reason: force'
    if (forced) {
      await authStore.signOut()
      router.push({ name: 'Auth' })
      showNotification({
        message: i18n.global.t('you_was_disconnected_by_another_device'),
        title: i18n.global.t('disconnected'),
        status: 'warning',
      })
    }
    isConnected.value = false
  }

  function dispatchHandlers(cbs: ((d: PubSubEvent) => void)[], raw: unknown) {
    if (isEvent(raw)) cbs.forEach((cb) => cb(raw))
  }

  function isEvent(val: unknown): val is PubSubEvent {
    return typeof val === 'object' && val !== null && 'event' in val && 'data' in val
  }
}
