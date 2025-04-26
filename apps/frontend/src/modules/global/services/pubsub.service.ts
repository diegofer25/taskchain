import { useInteractionsStore } from '@/modules/global/stores/interactions.store'
import type { AuthPubSubResponse } from '@taskchain/types'
import { useFetch } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

export async function fetchPubSubAuthToken(fbToken: string, isForce = false) {
  const { t } = useI18n()
  const { showNotification, confirm } = useInteractionsStore()
  const { data, statusCode } = await useFetch(`/api/auth/pubsub?force=${isForce}`, {
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
    const accepted = await confirm({
      title: t('you_already_connected_in_another_device'),
      description: t('want_to_disconnect'),
    })

    if (accepted) {
      return fetchPubSubAuthToken(fbToken, true)
    }

    showNotification({
      message: t('you_cannot_connect_until_you_disconnect_the_other_device'),
      title: t('error'),
      status: 'error',
    })
  }

  return data.value
}
