// 공지 상세 — 태그, 제목, 사진(선택), 본문
export default function NoticeDetail({ notice }) {
  if (!notice) return null
  return (
    <div>
      <h2>{notice.title}</h2>
      {notice.imageUrl && <img src={notice.imageUrl} alt={notice.title} />}
      <p>{notice.content}</p>
    </div>
  )
}
