// 등불 등록 완료 후 노출되는 스크래치 쿠폰 — 손가락으로 문질러 당첨/꽝 결과 확인
// 실제 스크래치 인터랙션(canvas 지우기 등)은 디자인 확정 후 구현
export default function ScratchCoupon({ onRevealed }) {
  return (
    <div onClick={onRevealed}>
      <p>손으로 문질러서 당첨 결과를 확인해보세요</p>
    </div>
  )
}
