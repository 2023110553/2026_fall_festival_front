// 분실물 관리 — 목록(날짜/제목/해시태그), 신규 등록(날짜 선택 모달→작성), 상세/수정/삭제
export default function AdminLostFoundPage() {
  // TODO: getAdminLostFound() 연동 (api/admin.js)
  const items = []

  return (
    <div>
      <button>분실물 추가하기</button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  )
}
