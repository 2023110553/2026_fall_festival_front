import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../api/admin'
import { useAdminAuthStore } from '../../store/useAdminAuthStore'
import * as S from './AdminLoginPage.styles'

import keyIcon from '../../assets/admin/key.svg'

// 관리자 키 입력 로그인 — 일반 사용자 로그인(카카오)과 완전히 별개.
// 성공 시 useAdminAuthStore에 토큰을 저장하고 AdminRoute 가드를 통과시킨다.
export default function AdminLoginPage() {
  const [adminKey, setAdminKey] = useState('')
  const [error, setError] = useState('')
  const loginAsAdmin = useAdminAuthStore((state) => state.loginAsAdmin)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // 앞뒤 공백이 섞이면 백엔드의 정확 일치 비교에서 401이 나므로 잘라서 보낸다
      loginAsAdmin(await adminLogin(adminKey.trim()))
      navigate('/admin/lanterns')
    } catch {
      setError('관리자 키가 맞지 않습니다.')
    }
  }

  return (
    <S.Page>
      <S.Form onSubmit={handleSubmit}>
        <S.Logo>로고</S.Logo>
        <S.Title>2026 가을 대동제 관리자 페이지</S.Title>
        <S.InputWrapper>
          <S.KeyIcon src={keyIcon} alt="" />

          <S.Input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="관리자 키를 입력하세요..."
          />
        </S.InputWrapper>
        <S.SubmitButton type="submit" disabled={!adminKey.trim()}>
          로그인
        </S.SubmitButton>
      </S.Form>
    </S.Page>
  )
}
