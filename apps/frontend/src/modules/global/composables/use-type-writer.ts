import { useTimeoutFn } from '@vueuse/core'
import { onMounted, type Ref, ref } from 'vue'

export function useTypeWriter({ phrases, typeSpeed, eraseSpeed, holdDelay }: UseTypeWriterOptions) {
  const TYPE_SPEED = typeSpeed ?? 60
  const ERASE_SPEED = eraseSpeed ?? 20
  const HOLD_DELAY = holdDelay ?? 2000
  const visibleText = ref('')
  let index = 0
  let isErasing = false

  onMounted(loop)

  return { text: visibleText }

  function loop() {
    const current = phrases.value[index]

    if (!isErasing) {
      visibleText.value = current.slice(0, visibleText.value.length + 1)

      if (visibleText.value.length === current.length) {
        isErasing = true
        useTimeoutFn(loop, HOLD_DELAY)
      } else {
        useTimeoutFn(loop, TYPE_SPEED)
      }
    } else {
      visibleText.value = current.slice(0, visibleText.value.length - 1)

      if (visibleText.value.length === 0) {
        isErasing = false
        index = (index + 1) % phrases.value.length
        useTimeoutFn(loop, TYPE_SPEED)
      } else {
        useTimeoutFn(loop, ERASE_SPEED)
      }
    }
  }
}

//region Types

interface UseTypeWriterOptions {
  phrases: Ref<string[]>
  typeSpeed?: number
  eraseSpeed?: number
  holdDelay?: number
}
