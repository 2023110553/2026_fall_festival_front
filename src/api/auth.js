import { apiClient } from './client'
import { useAuthStore, syncAuthFromStorage } from '../store/useAuthStore'

export async function kakaoLogin(code) {
  if (typeof code !== 'string' || !code.trim()) {
    throw new Error('인증 코드가 없습니다. 다시 로그인해주세요.')
  }
  const response = await apiClient.post('/api/accounts/login/', { code }, { skipUserAuth: true })
  const { success, data } = response.data ?? {}
  if (success !== true || typeof data?.access_token !== 'string' || !data.access_token.trim() || !data.user?.id) {
    throw new Error('로그인 응답을 확인할 수 없습니다. 다시 로그인해주세요.')
  }
  if (typeof data.refresh_token !== 'string' || !data.refresh_token.trim()) {
    throw new Error('로그인 토큰을 확인할 수 없습니다. 다시 로그인해주세요.')
  }
  if (typeof data.is_new_user !== 'boolean') {
    throw new Error('로그인 응답을 확인할 수 없습니다. 다시 로그인해주세요.')
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    isNewUser: data.is_new_user,
    user: data.user,
  }
}

export async function logoutAccount() {
  const initialAuth = useAuthStore.getState()
  if (!initialAuth.isLoggedIn) return false
  const sessionId = initialAuth.sessionId

  const logout = async () => {
    // 재발급과 같은 잠금을 사용해 회전된 최신 refresh token을 무효화한다.
    let refreshToken = initialAuth.refreshToken

    try {
      await syncAuthFromStorage()
      const auth = useAuthStore.getState()
      if (auth.isLoggedIn && auth.sessionId !== sessionId) return false
      if (auth.sessionId === sessionId) refreshToken = auth.refreshToken
    } catch (error) {
      if (import.meta.env.DEV) console.warn('[Logout storage sync failed]', error)
    }

    // 개발용 가짜 계정은 서버 토큰이 없으므로 로컬 상태만 지운다.
    if (refreshToken) {
      try {
        const response = await apiClient.post(
          '/api/accounts/logout/',
          { refresh_token: refreshToken },
          { skipUserAuth: true },
        )
        if (response.data?.success !== true && import.meta.env.DEV) {
          console.warn('[Logout API returned an unsuccessful response]')
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('[Logout API failed]', error?.response?.status ?? error?.code ?? 'UNKNOWN')
        }
      }
    }

    const currentAuth = useAuthStore.getState()
    if (currentAuth.isLoggedIn && currentAuth.sessionId !== sessionId) return false

    currentAuth.logout()
    window.dispatchEvent(new Event('auth:logout'))
    return true
  }

  return globalThis.navigator?.locks
    ? navigator.locks.request(`festival-refresh:${useAuthStore.persist.getOptions().name}`, logout)
    : logout()
}
