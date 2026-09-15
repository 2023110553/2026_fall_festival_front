import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'
import LanternFlowPage from '../../app/lantern/LanternFlowPage'
import * as S from './AppLayout.styles'

export default function AppLayout() {
  return (
    <S.Page>
      <Outlet />
      <BottomNav />
      <LanternFlowPage />
    </S.Page>
  )
}