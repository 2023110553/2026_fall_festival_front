// 분실물 목록 — 취득 날짜 필터(9/29, 9/30, 10/1) + 키워드 검색
export default function LostFoundList({ items = [], onSelect }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id} onClick={() => onSelect(item.id)}>
          {item.date} {item.title}
        </li>
      ))}
    </ul>
  )
}
