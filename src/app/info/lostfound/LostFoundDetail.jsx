// 분실물 상세 — 날짜/제목/이미지/해시태그 + "분실물 찾으러 가기"(인스타 DM 연결)
export default function LostFoundDetail({ item }) {
  if (!item) return null
  return (
    <div>
      <h2>{item.title}</h2>
      <p>{item.hashtags?.join(' ')}</p>
      <a href={item.instagramUrl}>분실물 찾으러 가기</a>
    </div>
  )
}
