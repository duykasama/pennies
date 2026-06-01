import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from '#/lib/locales/en'
import vi from '#/lib/locales/vi'
import type { Translations } from '#/lib/locales/en'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: Translations }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'vi'],
    detection: {
      order: ['cookie'],
      caches: ['cookie'],
      lookupCookie: 'locale',
    },
    interpolation: { escapeValue: false },
  })

export default i18n
