import EmptyState from '../../../../components/common/EmptyState'

// 획득한 쿠폰 내역 — 미사용(스크래치 필요)/당첨/꽝 상태별로 클릭 시 각각 다른 모달로 연결
export default function MyCouponList({ coupons = [], onSelect }) {
  if (coupons.length === 0) return <EmptyState>사용 가능한 쿠폰이 없습니다.</EmptyState>
  return (
    <ul>
      {coupons.map((c) => (
        <li key={c.id} onClick={() => onSelect(c.id)}>
          {c.status}
        </li>
      ))}
    </ul>
  )
}
