import { defineStore } from 'pinia'
import { ref } from 'vue'

const USER_DEFAULT_THEME = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light'

export const useGlobalStore = defineStore('global', () => {
  console.log('useGlobalStore', localStorage.theme)
  const theme = ref<'light' | 'dark'>(localStorage.theme || USER_DEFAULT_THEME)
  applyTheme()

  return { theme, toggleTheme }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.theme = theme.value
    applyTheme()
  }

  function applyTheme() {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
    document.documentElement.classList.toggle('light', theme.value === 'light')
    document.documentElement.setAttribute('data-theme', theme.value)
    document.documentElement.setAttribute('data-color-mode', theme.value)
  }
})
