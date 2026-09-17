import { useLocation, useNavigate } from 'react-router-dom'
import * as S from './BottomNav.styles'

import homeIcon from '../../assets/bottom-nav/home.svg'
import mapIcon from '../../assets/bottom-nav/map.svg'
import performanceIcon from '../../assets/bottom-nav/performance.svg'
import infoIcon from '../../assets/bottom-nav/info.svg'
import plusIcon from '../../assets/bottom-nav/plus.svg'

const LEFT_ITEMS = [
  { path: '/', label: '홈', icon: homeIcon },
  { path: '/map', label: '지도', icon: mapIcon },
]

const RIGHT_ITEMS = [
  { path: '/performance', label: '공연', icon: performanceIcon },
  { path: '/info', label: '안내', icon: infoIcon },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isActive = (path) =>
    path === '/' ? pathname === path : pathname === path || pathname.startsWith(`${path}/`)

  const renderItem = (item) => (
    <S.NavItem
      key={item.path}
      type="button"
      aria-label={item.label}
      aria-current={isActive(item.path) ? 'page' : undefined}
      onClick={() => navigate(item.path)}
    >
      <S.Icon src={item.icon} alt="" aria-hidden="true" />
      <S.Label>{item.label}</S.Label>
    </S.NavItem>
  )

  return (
    <S.Wrapper aria-label="주요 메뉴">
      <S.Bar>
        <S.ItemGroup>{LEFT_ITEMS.map(renderItem)}</S.ItemGroup>
        <S.ItemGroup>{RIGHT_ITEMS.map(renderItem)}</S.ItemGroup>
      </S.Bar>

      <S.LanternItem
        type="button"
        aria-label="등불 달기"
        onClick={() => {
          window.dispatchEvent(new CustomEvent('openLanternModal'));
        }}
      >
        <S.LanternButton>
          <S.PlusIcon src={plusIcon} alt="" aria-hidden="true" />
        </S.LanternButton>
        <S.Label>등불 달기</S.Label>
      </S.LanternItem>
    </S.Wrapper>
  )
}
