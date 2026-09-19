import { Outlet } from 'react-router-dom'

import ScrollToTop from '../common/ScrollToTop'
import BottomNav from './BottomNav'
import LanternFlowPage from '../../app/lantern/LanternFlowPage'
import AuthHandler from '../../app/auth/AuthHandler'
import * as S from './AppLayout.styles'

export default function AppLayout() {
  return (
    <S.Page>
      <AuthHandler>
        <ScrollToTop />

        <Outlet />

        <BottomNav />
        <LanternFlowPage />
      </AuthHandler>
    </S.Page>
  )
}
