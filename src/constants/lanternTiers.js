// 등불 개수 기준 부스 밝기(밤) / 채도·장식(낮) 단계 — final-plan-team-share.md 2-3 참고
// 실제 구간·단계 수는 3D/디자인 쪽과 조율하면서 조정 가능 (여기 값만 바꾸면 낮/밤 양쪽에 동일하게 반영됨)
//
// 2026-09-18: 팀 합의로 구간을 0/1/5/10/50(5단계) → 0/1/10/30/50/100(6단계, 0~5)로 조정.
// "정하는 로직"(여기 getLanternTier)과 "그리는 로직"(BoothMarker의 brightnessLevel prop)이 분리돼 있어서
// 구간을 바꿔도 BoothMarker 쪽은 단계 수(MAX_LANTERN_TIER)만 맞춰주면 된다 — 단계별 실제 밝기/반경 값은
// BoothMarker.jsx의 BRIGHTNESS_TIERS 표에 있고, 그 표의 길이는 항상 MAX_LANTERN_TIER + 1 이어야 함.
export const LANTERN_TIERS = [
  { threshold: 0, tier: 0 }, // 등불 0개 — 평상시
  { threshold: 1, tier: 1 }, // 1개 이상
  { threshold: 10, tier: 2 }, // 10개 이상
  { threshold: 30, tier: 3 }, // 30개 이상
  { threshold: 50, tier: 4 }, // 50개 이상
  { threshold: 100, tier: 5 }, // 100개 이상 — 최대 단계
]

// 가장 높은 단계 번호(현재 5). BoothMarker의 clamp 상한, 미리보기 버튼의 순환 범위 등에서
// 숫자를 하드코딩하지 말고 이 값을 쓰면 구간을 늘리거나 줄여도 한 곳만 고치면 된다.
export const MAX_LANTERN_TIER = LANTERN_TIERS[LANTERN_TIERS.length - 1].tier

// 등불 개수 → 단계 번호(0~MAX_LANTERN_TIER). 2026-09-19부터 BoothMarker가 부스마다 lanternCount로
// 이 함수를 호출해 밝기 단계를 정한다(BoothMarker.jsx 19번 항목). 음수/NaN처럼 어떤 구간에도
// 안 걸리는 값은 0단계.
export function getLanternTier(count) {
  return [...LANTERN_TIERS].reverse().find((t) => count >= t.threshold)?.tier ?? 0
}
