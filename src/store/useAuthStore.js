import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 카카오 로그인 상태 — 앱 전체(홈/지도/등불달기/마이페이지)가 공유해야 하는 "진짜 전역" 상태만 여기 둔다.
// 지도 섹션 내부 상태(구역/주야/날짜/검색어 등)는 여기 넣지 않고 app/map/context에 로컬로 둔다.
export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      sessionId: null,
      user: null, // { id, nickname, ... }
      isLoggedIn: false,
      isNewUser: null, // 이번 로그인 응답의 신규 가입 여부
      login: ({ accessToken, refreshToken = null, isNewUser = null, user }) => set({ accessToken, refreshToken, isNewUser, user, sessionId: crypto.randomUUID(), isLoggedIn: true }),
      // 회전된 두 토큰은 한 번의 상태 변경으로 함께 저장한다.
      updateTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      logout: () => set({ accessToken: null, refreshToken: null, sessionId: null, user: null, isLoggedIn: false, isNewUser: null }),
    }),
    { name: 'fall-festival-auth' }
  )
)

export async function syncAuthFromStorage() {
  try {
    const saved = window.localStorage.getItem(useAuthStore.persist.getOptions().name)
    if (saved === null) {
      if (useAuthStore.getState().accessToken) useAuthStore.getState().logout()
      return
    }
    // persist는 JSON 파싱 실패를 내부에서 삼키므로 이전 메모리 토큰 사용을 막는다.
    JSON.parse(saved)
    await useAuthStore.persist.rehydrate()
  } catch {
    try {
      useAuthStore.getState().logout()
    } catch {
      // 저장소 쓰기도 차단됐더라도 logout의 메모리 상태 초기화는 적용된다.
    }
    throw new Error('로그인 정보를 저장할 수 없습니다. 브라우저 설정을 확인해주세요.')
  }
}

// localStorage 변경은 다른 탭의 메모리 상태에 자동 반영되지 않는다.
export function subscribeToAuthStorage(onLogout) {
  const sync = async () => {
    const wasLoggedIn = useAuthStore.getState().isLoggedIn
    try {
      await syncAuthFromStorage()
    } catch {
      // storage/pageshow 이벤트에서 처리되지 않은 Promise 오류를 만들지 않는다.
    }
    if (wasLoggedIn && !useAuthStore.getState().isLoggedIn) onLogout?.()
  }
  const onStorage = (event) => {
    if (event.storageArea === window.localStorage &&
        (event.key === null || event.key === useAuthStore.persist.getOptions().name)) void sync()
  }
  const onPageShow = (event) => { if (event.persisted) void sync() }
  window.addEventListener('storage', onStorage)
  window.addEventListener('pageshow', onPageShow)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('pageshow', onPageShow)
  }
}
