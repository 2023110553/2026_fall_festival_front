import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore, subscribeToAuthStorage } from '../../store/useAuthStore'
import LoginModal from './LoginModal'
import { completeKakaoLogin, clearKakaoCallback, loginErrorMessage } from './kakaoOAuth'
import { useTranslation } from '../../i18n/useTranslation'

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
    {isCallback ? <p role="status">{t('auth.kakaoPending')}</p> : children}
    <LoginModal open={Boolean(message)} message={message} onClose={() => setMessage('')} />
  </>
}
