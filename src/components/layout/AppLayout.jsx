import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import * as S from './AppLayout.styles'

// 홈/지도/등불달기/공연/안내 5개 화면이 공유하는 하단 내비게이션 레이아웃.
// 관리자는 이 레이아웃을 쓰지 않고 AdminAppLayout을 따로 쓴다 (디자인·인증이 완전히 다르므로).
const NAV_ITEMS = [
  { path: '/', label: '홈' },
  { path: '/map', label: '지도' },
  { path: '/lantern', label: '등불 달기' },
  { path: '/performance', label: '공연' },
  { path: '/info', label: '안내' },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <S.Page>
      <Outlet />
      <S.Nav>
        {NAV_ITEMS.map((item) => (
          <S.NavItem
            key={item.path}
            $active={pathname === item.path}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </S.NavItem>
        ))}
      </S.Nav>
    </S.Page>
  )
}
