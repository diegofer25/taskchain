import enUS from '@/i18n/locales/en-US.json'
import es from '@/i18n/locales/es.json'
import ptBr from '@/i18n/locales/pt-BR.json'
import { usePreferredLanguages, useStorage } from '@vueuse/core'
import { createI18n } from 'vue-i18n'

const languages = usePreferredLanguages()
export const i18nLocales = {
  'en-US': enUS,
  'pt-BR': ptBr,
  es: es,
} as const

export type I18nLocale = keyof typeof i18nLocales
export type I18nLocaleMessages = (typeof i18nLocales)[I18nLocale]

const messages = Object.entries(i18nLocales).reduce(
  (acc, [key, message]: [string, I18nLocaleMessages]) => {
    acc[key as I18nLocale] = message
    return acc
  },
  {} as Record<I18nLocale, I18nLocaleMessages>,
)

const storedLocale = useStorage('locale', getDefaultUserLanguage())

export const i18n = createI18n({
  locale: storedLocale.value,
  fallbackLocale: 'en-US',
  messages,
})

function getDefaultUserLanguage() {
  const locales = Object.keys(i18nLocales)
  return languages.value.find((lang) => locales.includes(lang)) || 'en-US'
}
