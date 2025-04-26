import type { SpeechToken } from '@taskchain/types'
import { useFetch } from '@vueuse/core'

export async function fetchSpeechToken(fbToken: string) {
  const { data } = await useFetch('/api/auth/speech', {
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
    .json<SpeechToken>()

  return data.value
}
