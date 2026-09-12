// 시간대별 타임라인 인디케이터 + 공연 리스트
export default function TimelineList({ performances = [], onSelect }) {
  return (
    <ul>
      {performances.map((p) => (
        <li key={p.id} onClick={() => onSelect(p.id)}>
          {p.time} · {p.name} ({p.category})
        </li>
      ))}
    </ul>
  )
}
