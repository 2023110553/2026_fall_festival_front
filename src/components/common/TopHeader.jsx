import { useEffect, useId, useRef, useState } from 'react'
import LoginModal from '../../app/auth/LoginModal'
import ConfirmLogoutModal from '../../app/auth/ConfirmLogoutModal'
import { logoutAccount } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'
import { useLanterns } from '../../app/lantern/context/LanternProvider'

import titleMarker from '../../assets/top-header/title-marker.svg'
import profileIcon from '../../assets/top-header/profile.svg'
import logoutIcon from '../../assets/top-header/logout.svg'
import chevronIcon from '../../assets/top-header/language-chevron.svg'
import flagKo from '../../assets/top-header/flag-ko.png'
import flagEn from '../../assets/top-header/flag-en.png'
import flagZh from '../../assets/top-header/flag-zh.png'
import flagJa from '../../assets/top-header/flag-ja.png'
import { useTranslation } from '../../i18n/useTranslation'
import * as S from './TopHeader.styles'

const LANGUAGES = [
  { code: 'ko', label: '한국어', flag: flagKo },
  { code: 'en', label: 'English', flag: flagEn },
  { code: 'ja', label: '日本語', flag: flagJa },
  { code: 'zh', label: '中文', flag: flagZh },
]

export default function TopHeader({
  title,
  appearance = 'dark',
  zIndex = 100,
  isLoggedIn: isLoggedInOverride,
}) {
  const { isLoggedIn: authIsLoggedIn } = useAuth()
  const { language, changeLanguage, t } = useTranslation()
  const selectedLanguage = LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0]
  const { requestLanternList, requestCoupon } = useLanterns()
  const isLoggedIn = isLoggedInOverride ?? authIsLoggedIn
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [logoutPending, setLogoutPending] = useState(false)
  const headerRef = useRef(null)
  const languageMenuId = useId()
  const profileMenuId = useId()

  useEffect(() => {
    if (!isLanguageOpen && !isProfileMenuOpen) return undefined

    const closeWhenOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setIsLanguageOpen(false)
        setIsProfileMenuOpen(false)
      }
    }

    const closeWithEscape = (event) => {
      if (event.key === 'Escape') {
        setIsLanguageOpen(false)
        setIsProfileMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeWhenOutside)
    document.addEventListener('keydown', closeWithEscape)

    return () => {
      document.removeEventListener('pointerdown', closeWhenOutside)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [isLanguageOpen, isProfileMenuOpen])

  const closeProfileMenu = () => setIsProfileMenuOpen(false)
  const openMyCouponModal = () => {
    requestCoupon()
    closeProfileMenu()
  }

  // 나의 등불은 페이지 이동 없이 어디서든 전역 모달로 오픈 (AppLayout에 항상 떠 있는 LanternFlowPage가 처리)
  const openMyLanternListModal = () => {
    requestLanternList()
    closeProfileMenu()
  }
  const openLogoutModal = () => {
    closeProfileMenu()
    setIsLogoutOpen(true)
  }

  const handleLogout = async () => {
    if (logoutPending) return
    setLogoutPending(true)
    try {
      await logoutAccount()
      setIsLogoutOpen(false)
    } finally {
      setLogoutPending(false)
    }
  }

  const toggleLanguageMenu = () => {
    setIsLanguageOpen((current) => !current)
    setIsProfileMenuOpen(false)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((current) => !current)
    setIsLanguageOpen(false)
  }

  return (
    <>
      <S.Header ref={headerRef} $zIndex={zIndex}>
        <S.TitleGroup>
          <S.MarkerBox>
            <S.Marker src={titleMarker} alt="" aria-hidden="true" />
          </S.MarkerBox>
          <S.Title $appearance={appearance}>{title}</S.Title>
        </S.TitleGroup>

        <S.Actions>
          <S.LanguageControl>
            <S.LanguageButton
              type="button"
              aria-label={`${t('header.selectLanguage')}, ${t('header.currentLanguage', { language: selectedLanguage.label })}`}
              aria-haspopup="menu"
              aria-expanded={isLanguageOpen}
              aria-controls={isLanguageOpen ? languageMenuId : undefined}
              onClick={toggleLanguageMenu}
            >
              <S.LanguageLabel>
                <S.Flag src={selectedLanguage.flag} alt="" aria-hidden="true" />
                <span>{selectedLanguage.label}</span>
              </S.LanguageLabel>
              <S.LanguageChevron src={chevronIcon} alt="" aria-hidden="true" $open={isLanguageOpen} />
            </S.LanguageButton>

            {isLanguageOpen && (
              <S.LanguageMenu id={languageMenuId} role="menu" aria-label={t('header.selectLanguage')}>
                {LANGUAGES.map((language, index) => (
                  <S.LanguageOption
                    key={language.code}
                    type="button"
                    role="menuitemradio"
                    $active={language.code === selectedLanguage.code}
                    $hasDivider={index < LANGUAGES.length - 1}
                    aria-checked={language.code === selectedLanguage.code}
                    onClick={() => {
                      changeLanguage(language.code)
                      setIsLanguageOpen(false)
                    }}
                  >
                    <S.Flag src={language.flag} alt="" aria-hidden="true" />
                    <span>{language.label}</span>
                  </S.LanguageOption>
                ))}
              </S.LanguageMenu>
            )}
          </S.LanguageControl>

          {isLoggedIn ? (
            <S.ProfileButton
              type="button"
              aria-label={t('header.myMenu')}
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
              aria-controls={isProfileMenuOpen ? profileMenuId : undefined}
              onClick={toggleProfileMenu}
            >
              <S.ProfileIcon src={profileIcon} alt="" aria-hidden="true" />
            </S.ProfileButton>
          ) : (
            <S.LoginButton type="button" onClick={() => setIsLoginOpen(true)}>
              {t('header.login')}
            </S.LoginButton>
          )}
        </S.Actions>

        {isLoggedIn && isProfileMenuOpen && (
          <S.Menu id={profileMenuId} role="menu">
            <S.MenuItem type="button" role="menuitem" onClick={openMyCouponModal}>
              {t('header.myCoupon')}
            </S.MenuItem>
            <S.MenuItem type="button" role="menuitem" onClick={openMyLanternListModal}>
              {t('header.myLantern')}
            </S.MenuItem>
            <S.LogoutItem type="button" role="menuitem" onClick={openLogoutModal}>
              <S.LogoutIcon src={logoutIcon} alt="" aria-hidden="true" />
              {t('header.logout')}
            </S.LogoutItem>
          </S.Menu>
        )}
      </S.Header>
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <ConfirmLogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
        pending={logoutPending}
      />
    </>
  )
}
