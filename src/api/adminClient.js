import axios from 'axios'
import { useAdminAuthStore } from '../store/useAdminAuthStore'

// 관리자 API 전용 인스턴스.
// 백엔드는 Host(admin.*)로 관리자 라우팅을 구분하므로 baseURL이 반드시 관리자 도메인이어야 한다.
export const adminClient = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_API_BASE_URL,
  timeout: 10000,
})

adminClient.interceptors.request.use((config) => {
  const token = useAdminAuthStore.getState().adminToken
  // 로그인 검증처럼 호출부가 직접 헤더를 넣은 요청은 덮어쓰지 않는다
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 관리자 토큰은 refresh가 없으므로 401이면 바로 로그아웃 → AdminRoute 가드가 로그인 페이지로 보낸다
adminClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) useAdminAuthStore.getState().logoutAdmin()
    if (import.meta.env.DEV) {
  console.error('[Admin API Error]', error?.response?.status, error?.config?.url, error)
}

    return Promise.reject(error)
  }
)

