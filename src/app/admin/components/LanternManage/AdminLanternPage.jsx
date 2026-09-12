import { useState } from 'react'

// 등불 관리 — 신고순/최신순 정렬, 총 개수, 목록(닉네임/문구/부스자리/신고횟수), 삭제(확인 모달 2단계)
export default function AdminLanternPage() {
  const [sort, setSort] = useState('report')

  // TODO: getAdminLanterns(sort) 연동 (api/admin.js)
  const lanterns = []

  return (
    <div>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="report">신고순</option>
        <option value="recent">최신순</option>
      </select>
      <p>{lanterns.length}개</p>
      <ul>
        {lanterns.map((l) => (
          <li key={l.id}>{l.message}</li>
        ))}
      </ul>
    </div>
  )
}
