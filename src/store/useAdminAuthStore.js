import { create } from 'zustand'

// 관리자 키 인증 상태 — 일반 사용자 인증(useAuthStore)과 완전히 분리
// AdminRoute가 이 값을 보고 /admin/* 접근을 막는다
export const useAdminAuthStore = create((set) => ({
  adminToken: null,
  isAdminAuthed: false,
  loginAsAdmin: (adminToken) => set({ adminToken, isAdminAuthed: true }),
  logoutAdmin: () => set({ adminToken: null, isAdminAuthed: false }),
}))
