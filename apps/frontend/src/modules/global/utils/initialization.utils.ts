import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { fetchPubSubAuthToken } from '@/modules/global/services/pubsub.service'
import { fetchSpeechToken } from '@/modules/global/services/speech.service'
import { RuntimeLoader } from '@rive-app/webgl'
import { useStorage } from '@vueuse/core'
import FontFaceObserver from 'fontfaceobserver'

export async function loadAppDependencies({ riveUrl }: LoadAppDependenciesOptions = {}) {
  if (riveUrl) {
    RuntimeLoader.setWasmUrl(riveUrl)
  }
  try {
    await Promise.all([
      // Rive WASM
      RuntimeLoader.awaitInstance(),
      // Firebase, PubSub and Speech tokens
      requestTokensDependentsOnFbToken(),
      // Font loading
      new FontFaceObserver('Inter').load(),
    ])
  } catch {
    loadAppDependencies({ riveUrl: '/rive.wasm' })
  }
}

export async function requestTokensDependentsOnFbToken() {
  const { user } = useAuthStore()

  if (!user) {
    return
  }

  const fbToken = await user.getIdToken()

  const [pubSubToken, speechToken] = await Promise.all([
    fetchPubSubAuthToken(fbToken),
    fetchSpeechToken(fbToken),
  ])

  useStorage('pubsub-token', {}).value = pubSubToken
  useStorage('speech-token', {}).value = speechToken
}

interface LoadAppDependenciesOptions {
  riveUrl?: string
}
