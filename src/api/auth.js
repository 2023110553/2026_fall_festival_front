import { apiClient } from './client'

export async function kakaoLogin(code) {
  const response = await apiClient.post('/api/accounts/login/', { code }, { skipUserAuth: true })
  const { success, data } = response.data ?? {}
  if (!success || typeof data?.access_token !== 'string' || !data.access_token || !data.user?.id) {
    throw new Error('로그인 응답을 확인할 수 없습니다. 다시 로그인해주세요.')
  }
  return { accessToken: data.access_token, user: data.user }
}
