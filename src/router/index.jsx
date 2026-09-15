import { createBrowserRouter } from 'react-router-dom'

import AppLayout from '../components/layout/AppLayout'
import AdminAppLayout from '../components/layout/AdminAppLayout'
import AdminRoute from './AdminRoute'

import HomePage from '../app/home/HomePage'
import MapPage from '../app/map/MapPage'
import LanternFlowPage from '../app/lantern/LanternFlowPage'
import PerformancePage from '../app/performance/PerformancePage'
import InfoPage from '../app/info/InfoPage'
import MyPage from '../app/mypage/MyPage'
import ComponentPreviewPage from '../app/dev/ComponentPreviewPage'
import PerformanceDetailPage from '../app/performance/PerformanceDetailPage'

import AdminThemeProvider from '../app/admin/AdminThemeProvider'
import AdminLoginPage from '../app/admin/AdminLoginPage'
import AdminLanternPage from '../app/admin/components/LanternManage/AdminLanternPage'
import AdminNoticePage from '../app/admin/components/NoticeManage/AdminNoticePage'
import AdminLostFoundPage from '../app/admin/components/LostFoundManage/AdminLostFoundPage'

// 라우트 정의는 이 파일 한 곳에서만 관리한다.
// 일반 사이트(AppLayout, 하단 내비 포함)와 관리자(AdminAppLayout, /admin/*)는
// 레이아웃부터 완전히 분리되어 있다 — 2026-09-12 재원 확정: 같은 앱, 라우트 레벨 통합.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'lantern', element: <LanternFlowPage /> },
      { path: 'performance', element: <PerformancePage /> },
      { path: 'performance/:id', element: <PerformanceDetailPage /> },
      { path: 'info', element: <InfoPage /> },
      { path: 'mypage', element: <MyPage /> },
    ],
  },
  {
    // /admin 이하 전체(로그인 화면 포함)는 다크 테마 서브트리로 감싼다
    element: <AdminThemeProvider />,
    children: [
      { path: '/admin/login', element: <AdminLoginPage /> },
      {
        path: '/admin',
        element: <AdminRoute />,
        children: [
          {
            element: <AdminAppLayout />,
            children: [
              { path: 'lanterns', element: <AdminLanternPage /> },
              { path: 'notices', element: <AdminNoticePage /> },
              { path: 'lost-found', element: <AdminLostFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
  ...(import.meta.env.DEV
    ? [{ path: '/ui-preview', element: <ComponentPreviewPage /> }]
    : []),
])
