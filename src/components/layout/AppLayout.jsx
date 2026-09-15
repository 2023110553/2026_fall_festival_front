import { Outlet } from 'react-router-dom'

import ScrollToTop from '../common/ScrollToTop'
import BottomNav from './BottomNav'
import * as S from './AppLayout.styles'

export default function AppLayout() {
  return (
    <S.Page>
      <ScrollToTop />

      <Outlet />

      <BottomNav />
    </S.Page>
  )
}