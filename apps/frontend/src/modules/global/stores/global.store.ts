import { AiVoiceState } from '@/modules/global/types/ai-voice.types'
import { breakpointsTailwind, useBreakpoints, useMediaQuery, useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  const isPreferredDark = useMediaQuery('(prefers-color-scheme: dark)')
  const userDefaultTheme = isPreferredDark.value ? 'dark' : 'light'
  const aiVoiceState = ref(AiVoiceState.IDLE)

  const savedTheme = useStorage<'light' | 'dark'>('theme', userDefaultTheme)

  const theme = ref<'light' | 'dark'>(savedTheme.value)
  const isDark = computed(() => theme.value === 'dark')
  const breakpoints = useBreakpoints(breakpointsTailwind).current()

  applyTheme()

  return { theme, breakpoints, isDark, aiVoiceState, toggleTheme }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    savedTheme.value = theme.value
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    document.documentElement.classList.toggle('light', theme.value === 'light')
    document.documentElement.setAttribute('data-theme', theme.value)
    document.documentElement.setAttribute('data-color-mode', theme.value)
  }
})
