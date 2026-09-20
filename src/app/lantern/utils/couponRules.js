export const SCRATCH_THRESHOLD = 0.7

export function revealCoupon(coupon) {
  if (!coupon || coupon.status !== 'unscratched') return coupon
  return { ...coupon, status: coupon.isWin ? 'win' : 'lose' }
}

export function markCouponUsed(coupon) {
  if (!coupon || coupon.status !== 'win') throw new Error('사용할 수 없는 쿠폰이에요.')
  return { ...coupon, status: 'used' }
}
