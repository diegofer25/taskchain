import { i18n } from '@/i18n'
import { useWaitTime } from '@/modules/global/composables/use-wait-time'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { AiVoiceState } from '@/modules/global/types/ai-voice.types'
import type { SpeechToken } from '@taskchain/types'
import { useStorage } from '@vueuse/core'
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface UseTTSOptions {
  format?: sdk.SpeechSynthesisOutputFormat
  onViseme?: (visemeId: number, audioOffset: number) => void
}

// Maintains a single instance of synthesizer while speaking
let synthesizer: sdk.SpeechSynthesizer | null = null
const onVisemeCallbacks: ((visemeId: number, audioOffset: number) => void)[] = []
const isSpeaking = ref(false)
const lastError = ref<Error | null>(null)

export function useSpeech({
  format = sdk.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3,
  onViseme,
}: UseTTSOptions = {}) {
  const globalStore = useGlobalStore()

  if (onViseme) {
    onVisemeCallbacks.push(onViseme)
  }

  getSynth().then((s) => (synthesizer = s))

  watch(isSpeaking, () => {
    if (isSpeaking.value) {
      globalStore.aiVoiceState = AiVoiceState.SPEAKING
    } else {
      globalStore.aiVoiceState = AiVoiceState.IDLE
    }
  })

  //Automatic cleanup when the component is destroyed
  onBeforeUnmount(() => {
    synthesizer?.close()
    synthesizer = null
  })

  return {
    // Methods
    speak,
    disconnect,
    // State
    isSpeaking: computed(() => isSpeaking.value),
    lastError: computed(() => lastError.value),
  }

  // SpeechSynthesizer factory
  async function getSynth(): Promise<sdk.SpeechSynthesizer> {
    if (synthesizer) return synthesizer

    const speechToken = useStorage('speech-token', {} as SpeechToken | null).value

    if (!speechToken) {
      throw new Error('Speech token not found')
    }
    const { token, region } = speechToken
    const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region)
    speechConfig.speechSynthesisOutputFormat = format

    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput()
    synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)

    synthesizer.visemeReceived = (_, e) => {
      onVisemeCallbacks.forEach((callback) => {
        callback(e.visemeId, Number(e.audioOffset))
      })
    }

    return synthesizer
  }

  // Public API
  async function speak(text: string) {
    lastError.value = null
    const synth = await getSynth()
    isSpeaking.value = true

    return await new Promise(async (resolve, reject) => {
      try {
        const ssml = buildSsml(text)
        const results = await new Promise<sdk.SpeechSynthesisResult>((_resolve, _reject) => {
          synth.speakSsmlAsync(
            ssml,
            (e) => _resolve(e),
            (err) => _reject(err),
          )
        })

        const durationInMilliseconds = results.audioDuration / 10000
        await useWaitTime(durationInMilliseconds)

        resolve(results)
      } catch (err: unknown) {
        if (err instanceof Error) {
          lastError.value = err
        }
        throw reject(err)
      } finally {
        isSpeaking.value = false
      }
    })
  }

  function buildSsml(text: string) {
    const voice = getDefaultVoice()
    const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${i18n.global.locale}'>
        <voice name='${voice}'>
          <prosody rate='0%' pitch='0%'>
            <s>${text}</s>
          </prosody>
        </voice>
      </speak>`
    return ssml
  }

  function disconnect() {
    if (synthesizer) {
      synthesizer.close()
      synthesizer = null
    }
  }
}

function getDefaultVoice() {
  if (i18n.global.locale === 'pt-BR') {
    return 'pt-BR-ThalitaMultilingualNeural'
  } else if (i18n.global.locale === 'es') {
    return 'es-ES-XimenaMultilingualNeural'
  } else {
    return 'en-US-CoraMultilingualNeural'
  }
}
