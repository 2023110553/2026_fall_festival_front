// 현재 진행 중인 공연 하이라이트 카드 (썸네일/팀명/소속/시간)
export default function NowPlayingCard({ performance }) {
  if (!performance) return <p>내일 만나요</p>
  return <div>{performance.name} · {performance.time}</div>
}
