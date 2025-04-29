import { i18n } from '@/i18n'
import { useWaitTime } from '@/modules/global/composables/use-wait-time'
import { useGlobalStore } from '@/modules/global/stores/global.store'
import { AiVoiceState } from '@/modules/global/types/ai-voice.types'
import type { SpeechToken } from '@taskchain/types'
import { useStorage } from '@vueuse/core'
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'
import { SynthesisAdapterBase } from 'microsoft-cognitiveservices-speech-sdk/distrib/lib/src/common.speech/SynthesisAdapterBase'
import { computed, onBeforeUnmount, ref, watch } from 'vue'

interface UseTTSOptions {
  /** Audio output format */
  format?: sdk.SpeechSynthesisOutputFormat
  /** Callback for viseme (lip sync) events */
  onViseme?: (visemeId: number, audioOffset: number) => void
  /** Callback for speech synthesis events */
  onCancel?: (sender: sdk.SpeechSynthesizer, event: sdk.SpeechSynthesisEventArgs) => void
}

export function useSpeech({
  format = sdk.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3,
  onViseme,
  onCancel,
}: UseTTSOptions = {}) {
  const globalStore = useGlobalStore()
  const isSpeaking = ref(false)
  const lastError = ref<Error | null>(null)

  // Maintains a single instance of synthesizer while speaking
  let synthesizer: sdk.SpeechSynthesizer | null = null

  getSynth().then((s) => (synthesizer = s))

  watch(isSpeaking, () => {
    if (isSpeaking.value) {
      globalStore.aiVoiceState = AiVoiceState.SPEAKING
    } else {
      globalStore.aiVoiceState = AiVoiceState.IDLE
    }
  })

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

    // Optional: viseme events
    if (onViseme) {
      synthesizer.visemeReceived = (_, e) => onViseme(e.visemeId, Number(e.audioOffset))
    }

    // Optional: cancel events
    if (onCancel) {
      synthesizer.SynthesisCanceled = (_, e) => onCancel(synthesizer!, e)
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

  async function cancel() {
    if (synthesizer && isSpeaking.value) {
      const adapter = synthesizer['privAdapter']
      if (adapter && adapter instanceof SynthesisAdapterBase) {
        console.log('Canceling speech', adapter)
        await adapter.stopSpeaking()
        isSpeaking.value = false
      }

      console.log('Canceling speech', synthesizer)
      // synthesizer.stopSpeakingAsync(() => {
      //   isSpeaking.value = false
      // })
    }
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

  //Automatic cleanup when the component is destroyed
  onBeforeUnmount(() => {
    synthesizer?.close()
    synthesizer = null
  })

  return {
    // Methods
    speak,
    cancel,
    // State
    isSpeaking: computed(() => isSpeaking.value),
    lastError: computed(() => lastError.value),
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
