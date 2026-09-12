import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../api/admin'
import { useAdminAuthStore } from '../../store/useAdminAuthStore'

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
      const res = await adminLogin(adminKey)
      loginAsAdmin(res.data.token)
      navigate('/admin/lanterns')
    } catch {
      setError('관리자 키가 맞지 않습니다.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>2026 가을 대동제 관리자 페이지</h1>
      <input
        type="password"
        value={adminKey}
        onChange={(e) => setAdminKey(e.target.value)}
        placeholder="관리자 키를 입력하세요..."
      />
      {error && <p>{error}</p>}
      <button type="submit">로그인</button>
    </form>
  )
}
