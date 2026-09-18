import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as S from './TopHeader.styles'
import LoginModal from '../../app/auth/LoginModal'
import { useAuth } from '../../hooks/useAuth'
import { useLanterns } from '../../app/lantern/context/LanternProvider'

import titleMarker from '../../assets/top-header/title-marker.svg'
import profileIcon from '../../assets/top-header/profile.svg'
import logoutIcon from '../../assets/top-header/logout.svg'

export default function TopHeader({
  title,
  appearance = 'dark',
  isLoggedIn: isLoggedInOverride,
}) {
  const navigate = useNavigate()
  const { isLoggedIn: authIsLoggedIn, logout } = useAuth()
  const { requestLanternList } = useLanterns()
  const isLoggedIn = isLoggedInOverride ?? authIsLoggedIn
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const headerRef = useRef(null)
  const menuId = useId()

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const closeWhenOutside = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    const closeWithEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeWhenOutside)
    document.addEventListener('keydown', closeWithEscape)

    return () => {
      document.removeEventListener('pointerdown', closeWhenOutside)
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)
  const openMyPage = (section) => {
    navigate(`/mypage?section=${section}`)
    closeMenu()
  }
  // 나의 등불은 페이지 이동 없이 어디서든 전역 모달로 오픈 (AppLayout에 항상 떠 있는 LanternFlowPage가 처리)
  const openMyLanternListModal = () => {
    requestLanternList()
    closeMenu()
  }
  const handleLogout = () => {
    logout()
    closeMenu()
    navigate('/')
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
          <S.LanguageButton type="button" disabled aria-label="언어 선택, 현재 한국어">
            <span aria-hidden="true">🇰🇷</span>
            <span>한국어</span>
            <S.LanguageChevron aria-hidden="true">⌄</S.LanguageChevron>
          </S.LanguageButton>

          {isLoggedIn ? (
            <S.ProfileButton
              type="button"
              aria-label="내 메뉴"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              aria-controls={isMenuOpen ? menuId : undefined}
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <S.ProfileIcon src={profileIcon} alt="" aria-hidden="true" />
            </S.ProfileButton>
          ) : (
            <S.LoginButton
              type="button"
              onClick={() => setIsLoginOpen(true)}
            >
              로그인
            </S.LoginButton>
          )}
        </S.Actions>

        {isLoggedIn && isMenuOpen && (
          <S.Menu id={menuId} role="menu">
            <S.MenuItem type="button" role="menuitem" onClick={() => openMyPage('coupons')}>
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
