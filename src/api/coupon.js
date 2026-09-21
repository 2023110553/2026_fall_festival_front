import { apiClient } from './client'

const COUPON_REWARD = '가온누리 3000원 쿠폰'
const COUPON_USAGE_DESCRIPTION = '수령장소: 멋쟁이사자처럼 동방 (학생회관 2층)'

export function normalizeCoupon(rawCoupon) {
  if (!rawCoupon) return null

  const status = rawCoupon.status?.toLowerCase()
  return {
    id: rawCoupon.coupon_id,
    date: rawCoupon.issued_date,
    status,
    scratchedAt: rawCoupon.scratched_at,
    usedAt: rawCoupon.used_at,
    isWin: status === 'win' || status === 'used',
    reward: status === 'win' || status === 'used' ? COUPON_REWARD : undefined,
    usageDescription: status === 'win' || status === 'used' ? COUPON_USAGE_DESCRIPTION : undefined,
  }
}

export async function issueCoupon() {
  const { data } = await apiClient.post('/api/coupons/issue/')
  return normalizeCoupon(data)
}

export async function getMyCoupons(status) {
  const { data } = await apiClient.get('/api/coupons/', {
    params: { status: status?.toUpperCase() || undefined },
  })
  return (data?.data?.items ?? []).map(normalizeCoupon)
}

export async function scratchCoupon(couponId) {
  const { data } = await apiClient.post(`/api/coupons/${couponId}/scratch/`)
  return normalizeCoupon(data)
}

export async function useCoupon(couponId, verifyCode) {
  const { data } = await apiClient.post(`/api/coupons/${couponId}/use/`, {
    verify_code: verifyCode,
  })
  return data?.data
}
