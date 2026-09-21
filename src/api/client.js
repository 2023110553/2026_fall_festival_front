import axios from 'axios'
import { useAuthStore, syncAuthFromStorage } from '../store/useAuthStore'
import { expireSession, refreshSession, refreshPath } from './refresh'

// 모든 도메인 api/*.js 파일이 공통으로 쓰는 axios 인스턴스.
// VITE_API_BASE_URL은 .env.example 참고 (개발/배포 환경별로 .env에서 오버라이드)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// 로그인 토큰이 있으면 자동으로 헤더에 실어보내기
apiClient.interceptors.request.use(async (config) => {
  await syncAuthFromStorage()
  const auth = useAuthStore.getState()
  if (config._authRetry && (!auth.accessToken || auth.sessionId !== config._authSessionId)) {
    return Promise.reject(new axios.CanceledError('로그인 상태가 변경되었습니다.'))
  }
  const token = auth.accessToken
  if (token && !config.skipUserAuth && !config.url?.startsWith('/api/admin/')) {
    config.headers.Authorization = `Bearer ${token}`
    config._authSessionId = auth.sessionId
  }
  return config
})

// access token(24시간)의 만료는 서버의 401 응답으로 판단한다.
// 먼저 refresh를 시도하고, 재발급이 401일 때만 재로그인 안내를 띄운다.
// 갱신된 access token으로 재시도한 요청도 401이면 반복하지 않고 인증을 종료한다.
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) await syncAuthFromStorage()
    const auth = useAuthStore.getState()
    const config = error.config
    if (error.response?.status === 401 && config && !config.skipUserAuth &&
        config.url !== refreshPath && config.url !== '/api/accounts/login/' &&
        !config.url?.startsWith('/api/admin/') && auth.accessToken &&
        config._authSessionId === auth.sessionId && config.headers?.Authorization) {
      if (config._authRetry) {
        if (config.headers.Authorization === `Bearer ${auth.accessToken}`) expireSession(auth.sessionId)
        throw error
      }
      config._authRetry = true
      // 늦게 도착한 이전 토큰의 401은 이미 갱신된 토큰으로 재시도한다.
      if (config.headers.Authorization === `Bearer ${auth.accessToken}`) await refreshSession(auth)
      return apiClient(config)
    }
    if (import.meta.env.DEV) {
      console.error('[API Error]', error?.response?.status, error?.config?.url)
    }
    return Promise.reject(error)
  }
)
