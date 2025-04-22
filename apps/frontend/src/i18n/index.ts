import { i18nLocales, type I18nLocale, type I18nLocaleMessages } from '@/i18n/locales'
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  locale: 'en-US',
  fallbackLocale: 'en-US',
  messages: {
    ...Object.entries(i18nLocales).reduce(
      (acc, [key, message]: [string, I18nLocaleMessages]) => {
        acc[key as I18nLocale] = {
          message,
        }
        return acc
      },
      {} as Record<I18nLocale, { message: I18nLocaleMessages }>,
    ),
  },
})
