// 등불 개수 기준 부스 밝기(밤) / 채도·장식(낮) 단계 — final-plan-team-share.md 2-3 참고
// 실제 구간·단계 수는 3D/디자인 쪽과 조율하면서 조정 가능 (여기 값만 바꾸면 낮/밤 양쪽에 동일하게 반영됨)
export const LANTERN_TIERS = [
  { threshold: 0, tier: 0 },
  { threshold: 1, tier: 1 },
  { threshold: 5, tier: 2 },
  { threshold: 10, tier: 3 },
  { threshold: 50, tier: 4 },
]

export function getLanternTier(count) {
  return [...LANTERN_TIERS].reverse().find((t) => count >= t.threshold)?.tier ?? 0
}
