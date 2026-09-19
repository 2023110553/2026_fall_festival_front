import axios from 'axios'
import { useAuthStore } from '../store/useAuthStore'
import { authMockEnabled, authMockAdapter, mockExpiryPath } from './mocks/authMock'

// 모든 도메인 api/*.js 파일이 공통으로 쓰는 axios 인스턴스.
// VITE_API_BASE_URL은 .env.example 참고 (개발/배포 환경별로 .env에서 오버라이드)
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

// 로그인 토큰이 있으면 자동으로 헤더에 실어보내기
apiClient.interceptors.request.use((config) => {
  if (authMockEnabled && (config.url === '/api/accounts/login/' || config.url === mockExpiryPath)) {
    config.adapter = authMockAdapter
  }
  const token = useAuthStore.getState().accessToken
  const canSendToken = !token?.startsWith('mock-auth-') || (authMockEnabled && config.url === mockExpiryPath)
  if (token && canSendToken && !config.skipUserAuth && !config.url?.startsWith('/api/admin/')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 공통 에러 처리 — 도메인별 api 함수에서 또 try/catch 하지 않아도 되게
// 여기서는 로깅만 하고, 실제 사용자 피드백(토스트 등)은 호출부(컴포넌트)에서 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const auth = useAuthStore.getState()
    const config = error.config
    if (error.response?.status === 401 && !config?.skipUserAuth &&
        !config?.url?.startsWith('/api/admin/') && auth.accessToken &&
        config?.headers?.Authorization === `Bearer ${auth.accessToken}`) {
      auth.logout()
      window.dispatchEvent(new Event('auth:expired'))
    }
    if (import.meta.env.DEV) {
      console.error('[API Error]', error?.response?.status, error?.config?.url, error?.response?.data)
    }
    return Promise.reject(error)
  }
)
