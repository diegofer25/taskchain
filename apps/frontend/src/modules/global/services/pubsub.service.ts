import { i18n } from '@/i18n'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useConfirmation } from '@/modules/global/composables/use-confirmation'
import { useInteractionsStore } from '@/modules/global/stores/interactions.store'
import router from '@/router'
import type { AuthPubSubResponse } from '@taskchain/types'
import { useFetch } from '@vueuse/core'

export async function fetchPubSubAuthToken(fbToken: string, isForce = false) {
  const authStore = useAuthStore()
  const confirmation = useConfirmation()
  const { showNotification } = useInteractionsStore()
  const { data, statusCode } = await useFetch(`/api/v1/auth/pubsub?force=${isForce}`, {
    async beforeFetch({ options }) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${fbToken}`,
      }

      return {
        options,
      }
    },
  })
    .get()
    .json<AuthPubSubResponse>()

  if (statusCode.value === 409) {
    const accepted = await confirmation.confirm({
      title: i18n.global.t('you_already_connected_in_another_device'),
      description: i18n.global.t('want_to_disconnect'),
    })

    if (accepted) {
      return fetchPubSubAuthToken(fbToken, true)
    } else {
      await authStore.signOut()
      router.push({ name: 'Auth' })
    }

    showNotification({
      message: i18n.global.t('you_cannot_connect_until_you_disconnect_the_other_device'),
      title: i18n.global.t('error'),
      status: 'error',
    })
  }

  return data.value
}
