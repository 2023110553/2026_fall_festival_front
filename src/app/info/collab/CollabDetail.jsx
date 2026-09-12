// 협업 단체 상세 — 대표 사진, Introduction, SNS 링크
export default function CollabDetail({ collab }) {
  if (!collab) return null
  return (
    <div>
      <h2>{collab.name}</h2>
      <p>{collab.introduction}</p>
      <a href={collab.snsUrl}>{collab.snsHandle}</a>
    </div>
  )
}
