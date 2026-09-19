import { Outlet } from 'react-router-dom'

import ScrollToTop from '../common/ScrollToTop'
import BottomNav from './BottomNav'
import LanternFlowPage from '../../app/lantern/LanternFlowPage'
import { LanternProvider } from '../../app/lantern/context/LanternProvider'
import * as S from './AppLayout.styles'

export default function AppLayout() {
  return (
    <LanternProvider>
      <S.Page>
        <ScrollToTop />

        <Outlet />

        <BottomNav />
        <LanternFlowPage />
      </S.Page>
    </LanternProvider>
  )
}