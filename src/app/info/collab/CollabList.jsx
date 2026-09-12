// 협업 단체 목록 — 총학생회/동아리연합회/ESG서포터즈 동빛 3개 고정 + 펼쳐보기(가나다순)
export default function CollabList({ collabs = [], onSelect }) {
  return (
    <ul>
      {collabs.map((c) => (
        <li key={c.id} onClick={() => onSelect(c.id)}>
          {c.name}
        </li>
      ))}
    </ul>
  )
}
