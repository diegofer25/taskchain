import type { AuthPubSubResponse } from '@taskchain/types'
import { useFetch } from '@vueuse/core'

export async function fetchPubSubAuthToken(fbToken: string) {
  const { data } = await useFetch('/api/auth/pubsub', {
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

  return data.value
}
