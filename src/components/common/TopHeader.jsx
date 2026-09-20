import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginModal from '../../app/auth/LoginModal'
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
import * as S from './TopHeader.styles'

const LANGUAGES = [
  { code: 'ko', label: '한국어', flag: flagKo },
  { code: 'en', label: 'English', flag: flagEn },
  { code: 'zh', label: '中文', flag: flagZh },
  { code: 'ja', label: '日本語', flag: flagJa },
]

export default function TopHeader({
  title,
  appearance = 'dark',
  isLoggedIn: isLoggedInOverride,
}) {
  const navigate = useNavigate()
  const { isLoggedIn: authIsLoggedIn, logout } = useAuth()
  const { requestLanternList, requestCoupon } = useLanterns()
  const isLoggedIn = isLoggedInOverride ?? authIsLoggedIn
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
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
  const handleLogout = () => {
    logout()
    closeProfileMenu()
    navigate('/')
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
      <S.Header ref={headerRef}>
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
              aria-label="언어 선택, 현재 한국어"
              aria-haspopup="menu"
              aria-expanded={isLanguageOpen}
              aria-controls={isLanguageOpen ? languageMenuId : undefined}
              onClick={toggleLanguageMenu}
            >
              <S.LanguageLabel>
                <S.Flag src={flagKo} alt="" aria-hidden="true" />
                <span>한국어</span>
              </S.LanguageLabel>
              <S.LanguageChevron src={chevronIcon} alt="" aria-hidden="true" $open={isLanguageOpen} />
            </S.LanguageButton>

            {isLanguageOpen && (
              <S.LanguageMenu id={languageMenuId} role="menu" aria-label="언어 선택">
                {LANGUAGES.map((language, index) => (
                  <S.LanguageOption
                    key={language.code}
                    type="button"
                    role="menuitem"
                    disabled
                    $hasDivider={index < LANGUAGES.length - 1}
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
              aria-label="내 메뉴"
              aria-haspopup="menu"
              aria-expanded={isProfileMenuOpen}
              aria-controls={isProfileMenuOpen ? profileMenuId : undefined}
              onClick={toggleProfileMenu}
            >
              <S.ProfileIcon src={profileIcon} alt="" aria-hidden="true" />
            </S.ProfileButton>
          ) : (
            <S.LoginButton type="button" onClick={() => setIsLoginOpen(true)}>
              로그인
            </S.LoginButton>
          )}
        </S.Actions>

        {isLoggedIn && isProfileMenuOpen && (
          <S.Menu id={profileMenuId} role="menu">
            <S.MenuItem type="button" role="menuitem" onClick={openMyCouponModal}>
              나의 쿠폰
            </S.MenuItem>
            <S.MenuItem type="button" role="menuitem" onClick={openMyLanternListModal}>
              나의 등불
            </S.MenuItem>
            <S.LogoutItem type="button" role="menuitem" onClick={handleLogout}>
              <S.LogoutIcon src={logoutIcon} alt="" aria-hidden="true" />
              로그아웃
            </S.LogoutItem>
          </S.Menu>
        )}
      </S.Header>
      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  )
}
