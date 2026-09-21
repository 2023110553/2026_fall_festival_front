import { Outlet } from 'react-router-dom'

import ScrollToTop from '../common/ScrollToTop'
import BottomNav from './BottomNav'
import LanternFlowPage from '../../app/lantern/LanternFlowPage'
import AuthHandler from '../../app/auth/AuthHandler'
import { LanternProvider } from '../../app/lantern/context/LanternProvider'
import DevAuthPanel from '../../app/dev/DevAuthPanel'
import * as S from './AppLayout.styles'

export default function AppLayout() {
  return (
    <S.Page>
      <AuthHandler>
        <LanternProvider>
          <ScrollToTop />

          <Outlet />

          <BottomNav />
          <LanternFlowPage />
          {import.meta.env.DEV && <DevAuthPanel />}
        </LanternProvider>
      </AuthHandler>
    </S.Page>
  )
}
