import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useInteractionsStore } from '@/modules/global/stores/interactions.store'
import {
  type OnDisconnectedArgs,
  type OnGroupDataMessageArgs,
  type OnServerDataMessageArgs,
  WebPubSubClient,
} from '@azure/web-pubsub-client'
import type { AuthPubSubResponse } from '@taskchain/types'
import { useStorage } from '@vueuse/core'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

/** Generic pub-sub payload */
export interface PubSubEvent<T = unknown> {
  event: string
  data: T
}

const MAX_RETRIES = 5

export function usePubSub() {
  const router = useRouter()
  const { t } = useI18n()
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

  /** ---------- public helpers ---------- */
  function listenServerMessage(cb: (d: PubSubEvent) => void) {
    serverHandlers.push(cb)
  }

  function listenGroupMessage(group: string, cb: (d: PubSubEvent) => void) {
    client.joinGroup(group)
    groups[group] = cb
  }

  function disconnect() {
    Object.keys(groups).forEach((g) => client.leaveGroup(g))
    client.stop()
  }

  /** ---------- internal plumbing ---------- */
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
          message: t('an_error_occurred_while_connecting_to_the_update_server'),
          title: t('error'),
          status: 'error',
        })
      }
    } finally {
      connecting = false
    }
  }

  /** ---------- event handlers ---------- */
  function handleServerMsg({ message }: OnServerDataMessageArgs) {
    dispatchHandlers(serverHandlers, message.data)
  }

  function handleGroupMsg({ message }: OnGroupDataMessageArgs) {
    const cb = groups[message.group]
    if (cb) dispatchHandlers([cb], message.data)
  }

  function onDisconnected(e: OnDisconnectedArgs) {
    const forced = e.message?.message === 'Application server closed the connection. Reason: force' // Azure sends this reason :contentReference[oaicite:3]{index=3}
    if (forced) {
      showNotification({
        message: t('you_was_disconnected_by_another_device'),
        title: t('disconnected'),
        status: 'warning',
      })
      authStore.signOut()
      router.push({ name: 'Auth' })
    }
    isConnected.value = false
  }

  /** ---------- utilities ---------- */
  function dispatchHandlers(cbs: ((d: PubSubEvent) => void)[], raw: unknown) {
    if (isEvent(raw)) cbs.forEach((cb) => cb(raw))
  }

  function isEvent(val: unknown): val is PubSubEvent {
    return typeof val === 'object' && val !== null && 'event' in val && 'data' in val
  }
}
