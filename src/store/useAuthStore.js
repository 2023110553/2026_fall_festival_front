import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 카카오 로그인 상태 — 앱 전체(홈/지도/등불달기/마이페이지)가 공유해야 하는 "진짜 전역" 상태만 여기 둔다.
// 지도 섹션 내부 상태(구역/주야/날짜/검색어 등)는 여기 넣지 않고 app/map/context에 로컬로 둔다.
export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      user: null, // { id, nickname, ... }
      isLoggedIn: false,
      login: ({ accessToken, user }) => set({ accessToken, user, isLoggedIn: true }),
      logout: () => set({ accessToken: null, user: null, isLoggedIn: false }),
    }),
    { name: 'fall-festival-auth' }
  )
)
