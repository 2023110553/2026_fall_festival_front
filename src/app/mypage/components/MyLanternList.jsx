import EmptyState from '../../../components/common/EmptyState'

// 당일 작성한 등불 내역(최대 3개) — 개별 삭제 가능, 삭제해도 일일 작성 한도는 복구되지 않음
export default function MyLanternList({ lanterns = [], onDelete }) {
  if (lanterns.length === 0) return <EmptyState>등불이 아직 없습니다.</EmptyState>
  return (
    <ul>
      {lanterns.map((l) => (
        <li key={l.id}>
          {l.message} <button onClick={() => onDelete(l.id)}>삭제</button>
        </li>
      ))}
    </ul>
  )
}
