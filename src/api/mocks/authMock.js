import { AxiosError } from 'axios'

export const authMockEnabled = import.meta.env.DEV && import.meta.env.VITE_USE_AUTH_MOCK === 'true'
export const mockExpiryPath = '/__dev__/auth/expired'

// 로그인과 명시적인 만료 테스트만 가로챈다. 다른 도메인 API는 모킹하지 않는다.
export async function authMockAdapter(config) {
  await new Promise((resolve) => setTimeout(resolve, 350))
  const body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
  let status = 200
  let data
  if (config.url === mockExpiryPath) {
    status = 401
    data = { success: false, code: '401', message: '토큰이 만료되었습니다.' }
  } else if (body?.code === 'mock-success') {
    const now = new Date().toISOString()
    data = { success: true, code: 'LOGIN_SUCCESS', message: '카카오톡 1초 로그인 성공', data: {
      access_token: 'mock-auth-token-for-local-testing',
      user: { id: 99999, kakao_id: 99999, nickname: '테스트 코끼리', profile_image: null, createdAt: now, updatedAt: now },
    } }
  } else {
    status = body?.code === 'mock-server-error' ? 502 : 401
    data = { success: false, code: String(status), message: status === 502 ? '카카오 서버 연결 실패' : '카카오 인증에 실패했습니다.' }
  }
  const response = { data, status, statusText: String(status), headers: {}, config }
  if (status >= 400) throw new AxiosError(data.message, status >= 500 ? 'ERR_BAD_RESPONSE' : 'ERR_BAD_REQUEST', config, null, response)
  return response
}
