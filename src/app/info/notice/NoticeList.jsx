import Tag from '../../../components/common/Tag'

// 공지 목록 — 긴급/일반 태그, 긴급 공지는 제목 앞에 날짜 필수 표시
export default function NoticeList({ notices = [], onSelect }) {
  return (
    <ul>
      {notices.map((n) => (
        <li key={n.id} onClick={() => onSelect(n.id)}>
          <Tag tone={n.isUrgent ? 'danger' : 'default'}>{n.isUrgent ? '긴급 공지' : '일반 공지'}</Tag>
          {n.isUrgent ? `[${n.date}] ` : ''}
          {n.title}
        </li>
      ))}
    </ul>
  )
}
