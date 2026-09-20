import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import LoginModal from './LoginModal'
import { completeKakaoLogin, loginErrorMessage } from './kakaoOAuth'
import { authMockEnabled } from '../../api/mocks/authMock'
import AuthMockPanel from './AuthMockPanel'

export default function AuthHandler({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const params = new URLSearchParams(location.search)
  const isCallback = location.pathname === '/' && (params.has('code') || params.has('error'))

  useEffect(() => {
    const onExpired = () => {
      setMessage('로그인이 만료되어 재로그인이 필요해요.')
      navigate('/', { replace: true })
    }
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [navigate])

  useEffect(() => {
    if (!isCallback) return undefined
    let active = true
    completeKakaoLogin(location.search).then(({ auth, returnTo }) => {
      if (!active) return
      useAuthStore.getState().login(auth)
      navigate(returnTo, { replace: true })
    }).catch((error) => {
      if (!active) return
      setMessage(loginErrorMessage(error))
      navigate('/', { replace: true })
    })
    return () => { active = false }
  }, [isCallback, location.search, navigate])

  return <>
    {isCallback ? <p role="status">카카오 로그인 중입니다…</p> : children}
    <LoginModal open={Boolean(message)} message={message} onClose={() => setMessage('')} />
    {authMockEnabled && !isCallback && <AuthMockPanel />}
  </>
}
