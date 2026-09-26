import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../../../i18n/useTranslation'
import * as S from './LanternGuide.styles'

export default function LanternGuide() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const guideRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!guideRef.current?.contains(event.target)) setIsOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [isOpen])

  return (
    <S.Wrapper ref={guideRef}>
      <S.Toggle
        type="button"
        $isOpen={isOpen}
        aria-label={t('map.lanternGuide')}
        aria-expanded={isOpen}
        aria-controls="map-lantern-guide"
        onClick={() => setIsOpen((open) => !open)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" viewBox="0 0 11 16" fill="none" aria-hidden="true">
          <path d="M7.865 14.4V12.8H3.15071V14.4C3.15071 15.28 3.85786 16 4.72214 16H6.29357C7.15786 16 7.865 15.28 7.865 14.4ZM2.51429 10.464C2.61643 10.608 2.74214 10.888 2.85214 11.2H8.16357C8.28143 10.888 8.39929 10.608 8.50143 10.464C8.77643 10.064 9.06714 9.72 9.35 9.376C10.1593 8.408 11 7.408 11 5.6C11 2.512 8.53286 0 5.5 0C2.46714 0 0 2.512 0 5.6C0 7.424 0.840715 8.424 1.65 9.384C1.93286 9.72 2.22357 10.064 2.50643 10.464H2.51429ZM5.50786 2.4V4C4.64357 4 3.93643 4.72 3.93643 5.6H2.365C2.365 3.832 3.77143 2.4 5.50786 2.4Z" fill={isOpen ? '#9F9C99' : '#DC7054'} />
        </svg>
      </S.Toggle>

      {isOpen && (
        <S.Description id="map-lantern-guide" role="status">
          {t('map.lanternGuideDescription')}
        </S.Description>
      )}
    </S.Wrapper>
  )
}
