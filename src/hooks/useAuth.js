import { useAuthStore } from '../store/useAuthStore'

// 지도 섹션(등불 보기 탭 등)에서 합의한 인터페이스 — 로그인 담당 팀이 실제 로직을 채우기 전까지는
// useAuthStore 상태를 그대로 노출하는 얇은 훅. 다른 도메인은 이 훅만 보고 연동하면 된다.
export function useAuth() {
  const { isLoggedIn, user, login, logout } = useAuthStore()
  return { isLoggedIn, user, login, logout }
}
