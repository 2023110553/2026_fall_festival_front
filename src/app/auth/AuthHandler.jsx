import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore, subscribeToAuthStorage } from '../../store/useAuthStore'
import LoginModal from './LoginModal'
import { completeKakaoLogin, clearKakaoCallback, loginErrorMessage } from './kakaoOAuth'
import { useTranslation } from '../../i18n/useTranslation'
import styled from 'styled-components'

export default function AuthHandler({ children }) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const params = new URLSearchParams(location.search)
  const isCallback = location.pathname === '/' && (params.has('code') || params.has('error'))

  useEffect(() => subscribeToAuthStorage(() => {
    setMessage('')
    navigate('/', { replace: true })
  }), [navigate])

  useEffect(() => {
    const onExpired = () => {
      setMessage(t('auth.expired'))
      navigate('/', { replace: true })
    }
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [navigate, t])

  useEffect(() => {
    const onLogout = () => {
      setMessage('')
      navigate('/', { replace: true })
    }
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [navigate])

  useEffect(() => {
    if (!isCallback) return undefined
    let active = true
    completeKakaoLogin(location.search).then(({ auth, returnTo }) => {
      if (!active) return
      clearKakaoCallback(location.search)
      useAuthStore.getState().login(auth)
      navigate(returnTo, { replace: true })
    }).catch((error) => {
      if (!active) return
      clearKakaoCallback(location.search)
      setMessage(loginErrorMessage(error))
      navigate('/', { replace: true })
    })
    return () => { active = false }
  }, [isCallback, location.search, navigate])

  return <>
    {isCallback ? <PendingMessage role="status">{t('auth.kakaoPending')}</PendingMessage> : children}
    <LoginModal open={Boolean(message)} message={message} onClose={() => setMessage('')} />
  </>
}

const PendingMessage = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 375px;
  margin: 84px auto 0;
  padding: 48px 16px;
  text-align: center;
  color: var(--aurora_gray, #9F9C99);
  font-family: Pretendard;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;
