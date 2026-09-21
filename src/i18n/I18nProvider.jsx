import { useCallback, useEffect, useMemo, useState } from 'react'
import { I18nContext } from './I18nContext'
import { SUPPORTED_LANGUAGES, translations } from './translations'

const STORAGE_KEY = 'festival-language'
const DOCUMENT_LANGS = { ko: 'ko', en: 'en', ja: 'ja', zh: 'zh-CN' }

function getInitialLanguage() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (SUPPORTED_LANGUAGES.includes(saved)) return saved
  } catch {
    // 저장소를 사용할 수 없으면 기본 언어를 사용한다.
  }
  return 'ko'
}

function interpolate(message, values = {}) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
    message,
  )
}

export default function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = DOCUMENT_LANGS[language]
    try {
      window.localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // 저장소 차단 환경에서도 현재 세션의 언어 변경은 유지한다.
    }
  }, [language])

  const changeLanguage = useCallback((nextLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(nextLanguage)) setLanguage(nextLanguage)
  }, [])

  const t = useCallback(
    (key, values) => interpolate(translations[language]?.[key] ?? translations.ko[key] ?? key, values),
    [language],
  )

  const value = useMemo(() => ({ language, changeLanguage, t }), [changeLanguage, language, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}