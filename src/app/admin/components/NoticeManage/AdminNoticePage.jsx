// 공지 관리 — 목록(태그/제목/미리보기), 신규 등록(유형 선택 모달→작성), 상세/수정/삭제
export default function AdminNoticePage() {
  // TODO: getAdminNotices() 연동 (api/admin.js)
  const notices = []

  return (
    <div>
      <button>공지 등록하기</button>
      <ul>
        {notices.map((n) => (
          <li key={n.id}>{n.title}</li>
        ))}
      </ul>
    </div>
  )
}
