import { kakaoLogin } from '../../api/auth'
import { authMockEnabled } from '../../api/mocks/authMock'

const STORAGE_KEY = 'fall-festival-kakao-request'
let callbackPromise

export function startKakaoLogin(scenario = 'success') {
  const clientId = import.meta.env.VITE_KAKAO_REST_API_KEY
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI
  if (!authMockEnabled && (!clientId || !redirectUri)) throw new Error('로그인 설정을 확인해주세요.')
  const state = crypto.randomUUID()
  const returnTo = window.location.pathname + window.location.search + window.location.hash
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ state, returnTo }))
  if (authMockEnabled) {
    const params = new URLSearchParams({ state })
    if (scenario === 'cancel') params.set('error', 'access_denied')
    else params.set('code', `mock-${scenario}`)
    window.location.assign(`/?${params}`)
    return
  }
  const url = new URL('https://kauth.kakao.com/oauth/authorize')
  url.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', state }).toString()
  window.location.assign(url.href)
}

// 동일 페이지의 StrictMode 재실행에서도 인가 코드는 한 번만 교환한다.
export function completeKakaoLogin(search) {
  if (callbackPromise) return callbackPromise
  callbackPromise = (async () => {
    const params = new URLSearchParams(search)
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
    sessionStorage.removeItem(STORAGE_KEY)
    if (!saved?.state || saved.state !== params.get('state')) {
      throw new Error('로그인 요청을 확인할 수 없습니다. 다시 로그인해주세요.')
    }
    if (params.has('error')) {
      throw new Error(params.get('error') === 'access_denied'
        ? '카카오 로그인이 취소되었어요.'
        : '카카오 로그인을 완료하지 못했어요.')
    }
    const code = params.get('code')
    if (!code?.trim()) throw new Error('인증 코드가 없습니다. 다시 로그인해주세요.')
    const auth = await kakaoLogin(code)
    const target = new URL(saved.returnTo || '/', window.location.origin)
    const returnTo = target.origin === window.location.origin
      ? target.pathname + target.search + target.hash : '/'
    return { auth, returnTo }
  })()
  return callbackPromise
}

export function loginErrorMessage(error) {
  if (error.response?.status >= 500 || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
    return '서버 오류입니다. 잠시 후 시도해주세요.'
  }
  return error.response?.data?.message || error.message || '로그인에 실패했습니다. 다시 로그인해주세요.'
}
