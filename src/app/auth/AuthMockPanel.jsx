import { useState } from 'react'
import { apiClient } from '../../api/client'
import { mockExpiryPath } from '../../api/mocks/authMock'
import { useAuthStore } from '../../store/useAuthStore'
import * as S from './AuthMockPanel.styles'

export default function AuthMockPanel() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [pending, setPending] = useState(false)
  const expire = async () => {
    setPending(true)
    try {
      await apiClient.get(mockExpiryPath)
    } catch {
      // 실제 공통 응답 인터셉터가 로그아웃과 재로그인 안내를 처리한다.
    } finally {
      setPending(false)
    }
  }
  return <S.Panel aria-label="개발용 로그인 테스트">
    <span>임시 로그인 모드 · {isLoggedIn ? '로그인됨' : '로그아웃됨'}</span>
    <button type="button" disabled={!isLoggedIn || pending} onClick={expire}>토큰 만료 (401) 테스트</button>
  </S.Panel>
}
