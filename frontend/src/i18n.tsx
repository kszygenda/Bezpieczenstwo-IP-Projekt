import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import en from './locales/en'
import pl from './locales/pl'

export type Language = 'pl' | 'en'

type TranslationMap = {
  [key: string]: string | TranslationMap
}

type I18nContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const TRANSLATIONS: Record<Language, TranslationMap> = {
  pl,
  en,
}

const I18nContext = createContext<I18nContextValue | null>(null)

function readNestedValue(map: TranslationMap, path: string): string | null {
  const chunks = path.split('.')
  let current: string | TranslationMap | undefined = map

  for (const chunk of chunks) {
    if (!current || typeof current === 'string') {
      return null
    }

    current = current[chunk]
  }

  return typeof current === 'string' ? current : null
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const fromStorage = localStorage.getItem('bwip-language')
    if (fromStorage === 'pl' || fromStorage === 'en') {
      return fromStorage
    }
    return 'pl'
  })

  useEffect(() => {
    localStorage.setItem('bwip-language', language)
  }, [language])

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key: string) => {
        const translated = readNestedValue(TRANSLATIONS[language], key)
        if (translated) {
          return translated
        }
        return key
      },
    }),
    [language],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }

  return context
}
