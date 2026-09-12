import { apiClient } from './client'

// 등불 관련 api — "달기" 플로우 + 부스별 등불 목록(등불 보기 탭)
export const getBoothLanterns = (boothId) => apiClient.get(`/api/booths/${boothId}/lanterns`)

export const postLantern = ({ boothId, nickname, message }) =>
  apiClient.post(`/api/booths/${boothId}/lanterns`, { nickname, message })

export const deleteLantern = (lanternId) => apiClient.delete(`/api/lanterns/${lanternId}`)

export const reportLantern = (lanternId) => apiClient.post(`/api/lanterns/${lanternId}/report`)

// 등불 달기 성공 시 발급되는 쿠폰 스크래치/사용
export const getMyCoupon = () => apiClient.get('/api/coupons/me')
export const useCoupon = (couponId, code) => apiClient.post(`/api/coupons/${couponId}/use`, { code })
