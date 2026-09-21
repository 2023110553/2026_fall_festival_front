import axios from 'axios'
import { useAuthStore, syncAuthFromStorage } from '../store/useAuthStore'

export const refreshPath = '/api/accounts/token/refresh/'
// 응답 인터셉터가 없는 클라이언트로 재발급 요청의 무한 재시도를 방지한다.
export const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

let pendingRefresh

export function expireSession(sessionId) {
  const auth = useAuthStore.getState()
  if (auth.sessionId !== sessionId || !auth.accessToken) return
  auth.logout()
  window.dispatchEvent(new Event('auth:expired'))
}

export function refreshSession(snapshot) {
  if (pendingRefresh?.sessionId === snapshot.sessionId) return pendingRefresh.promise

  const refresh = async () => {
    // 같은 origin의 다른 탭이 이미 갱신했거나 로그아웃했는지 확인한다.
    await syncAuthFromStorage()
    let current = useAuthStore.getState()
    if (!current.accessToken || current.sessionId !== snapshot.sessionId) throw new Error('로그인 상태가 변경되었습니다.')
    if (current.accessToken !== snapshot.accessToken) return
    if (!current.refreshToken) {
      expireSession(snapshot.sessionId)
      throw new Error('재로그인이 필요합니다.')
    }
    const refreshToken = current.refreshToken
    let response
    try {
      response = await refreshClient.post(refreshPath, { refresh_token: refreshToken })
    } catch (error) {
      // 네트워크/서버 장애는 로그아웃 사유가 아니다.
      await syncAuthFromStorage()
      current = useAuthStore.getState()
      if (error.response?.status === 401 && current.refreshToken === refreshToken) expireSession(snapshot.sessionId)
      throw error
    }
    const { success, data } = response.data ?? {}
    if (!success || typeof data?.access_token !== 'string' || !data.access_token.trim() ||
        typeof data?.refresh_token !== 'string' || !data.refresh_token.trim()) {
      throw new Error('토큰 재발급 응답이 올바르지 않습니다.')
    }
    await syncAuthFromStorage()
    current = useAuthStore.getState()
    if (current.sessionId !== snapshot.sessionId || !current.accessToken || current.refreshToken !== refreshToken) {
      throw new Error('로그인 상태가 변경되었습니다.')
    }
    // 서버가 access 24시간 / refresh 7일의 새 토큰을 발급한다.
    // refresh 유효기간은 매 재발급 시 갱신되므로 최초 로그인 시점으로 만료를 계산하지 않는다.
    current.updateTokens({ accessToken: data.access_token, refreshToken: data.refresh_token })
  }

  // 회전형 refresh token을 여러 탭에서 동시에 사용하지 않는다.
  const promise = (globalThis.navigator?.locks
    ? navigator.locks.request(`festival-refresh:${useAuthStore.persist.getOptions().name}`, refresh)
    : refresh()).finally(() => {
    if (pendingRefresh?.promise === promise) pendingRefresh = undefined
  })
  pendingRefresh = { sessionId: snapshot.sessionId, promise }
  return promise
}
