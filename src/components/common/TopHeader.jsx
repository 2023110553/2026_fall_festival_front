import { useEffect, useId, useRef, useState } from 'react'
import * as S from './TopHeader.styles'

import titleMarker from '../../assets/top-header/title-marker.svg'
import profileIcon from '../../assets/top-header/profile.svg'
import logoutIcon from '../../assets/top-header/logout.svg'

export default function TopHeader({ title, isLoggedIn = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  return (
    <S.Header ref={headerRef}>
      <S.TitleGroup>
        <S.MarkerBox>
          <S.Marker src={titleMarker} alt="" aria-hidden="true" />
        </S.MarkerBox>
        <S.Title>{title}</S.Title>
      </S.TitleGroup>

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
        <S.LoginButton type="button">로그인</S.LoginButton>
      )}

      {isLoggedIn && isMenuOpen && (
        <S.Menu id={menuId} role="menu">
          <S.MenuItem type="button" role="menuitem" onClick={closeMenu}>
            나의 쿠폰
          </S.MenuItem>
          <S.MenuItem type="button" role="menuitem" onClick={closeMenu}>
            나의 등불
          </S.MenuItem>
          <S.LogoutItem type="button" role="menuitem" onClick={closeMenu}>
            <S.LogoutIcon src={logoutIcon} alt="" aria-hidden="true" />
            로그아웃
          </S.LogoutItem>
        </S.Menu>
      )}
    </S.Header>
  )
}
