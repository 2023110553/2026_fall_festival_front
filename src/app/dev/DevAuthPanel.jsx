import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import { useLanterns } from '../lantern/context/LanternProvider'
import * as S from './DevAuthPanel.styles'

const returningAccount = { id: 'dev-test-a', nickname: '기존 테스트 계정' }
const lastNewAccountKey = 'festival-dev-last-new-account-id'

export default function DevAuthPanel() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const { lanterns, coupon } = useLanterns()

  const loginAs = (account, isNewUser) => {
    useAuthStore.getState().login({ accessToken: null, refreshToken: null, user: account, isNewUser })
    navigate('/')
  }

  const loginAsNewAccount = () => {
    // 두 번째 버튼은 누를 때마다 새 ID를 발급하고 직전 새 계정의 테스트 데이터만 정리한다.
    const previousId = localStorage.getItem(lastNewAccountKey)
    if (previousId?.startsWith('dev-test-new-')) {
      localStorage.removeItem(`festival-lanterns:${previousId}`)
    }
    const id = `dev-test-new-${crypto.randomUUID()}`
    localStorage.setItem(lastNewAccountKey, id)
    loginAs({ id, nickname: '새 테스트 계정' }, true)
  }

  return (
    <S.Panel>
      <S.Toggle type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        개발용 로그인 테스트 {open ? '접기' : '열기'}
      </S.Toggle>
      {open && <S.Content>
        <p>현재: {user?.nickname ?? '로그아웃'} · 등불 {lanterns.length}개 · 쿠폰 {coupon ? coupon.status : '없음'}</p>
        <p>화면 동작만 확인합니다. 서버에는 저장되지 않습니다.</p>
        <S.Actions>
          <button type="button" onClick={() => loginAs(returningAccount, false)}>① 기존 계정 로그인 · 기록 유지</button>
          <button type="button" onClick={loginAsNewAccount}>② 새 계정 로그인 · 빈 상태</button>
        </S.Actions>
      </S.Content>}
    </S.Panel>
  )
}
