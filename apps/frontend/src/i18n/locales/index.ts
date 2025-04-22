import enUS from '@/i18n/locales/en-US.json'
import es from '@/i18n/locales/es.json'
import ptBr from '@/i18n/locales/pt-BR.json'

export const i18nLocales = {
  'en-US': enUS,
  'pt-BR': ptBr,
  es: es,
} as const

export type I18nLocale = keyof typeof i18nLocales
export type I18nLocaleMessages = (typeof i18nLocales)[I18nLocale]
