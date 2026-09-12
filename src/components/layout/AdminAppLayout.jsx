import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const Header = styled.header`
  display: flex;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const Tab = styled.button`
  border: none;
  background: none;
  color: ${({ theme, $active }) => ($active ? theme.color.primary : theme.color.textSub)};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
`

const TABS = [
  { path: '/admin/lanterns', label: '등불 관리' },
  { path: '/admin/notices', label: '공지 관리' },
  { path: '/admin/lost-found', label: '분실물 관리' },
]

// 관리자 전용 레이아웃 — adminTheme(다크)가 App.jsx에서 /admin/* 라우트에만 적용된다
export default function AdminAppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div>
      <Header>
        {TABS.map((tab) => (
          <Tab key={tab.path} $active={pathname.startsWith(tab.path)} onClick={() => navigate(tab.path)}>
            {tab.label}
          </Tab>
        ))}
      </Header>
      <Outlet />
    </div>
  )
}
