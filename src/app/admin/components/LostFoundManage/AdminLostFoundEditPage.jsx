import { useNavigate, useParams } from 'react-router-dom'

import LostFoundEditor from './LostFoundEditor'
import { MOCK_LOST_FOUND } from './mockLostFound'

export default function AdminLostFoundEditPage() {
  const { itemId } = useParams()
  const navigate = useNavigate()

  const item = MOCK_LOST_FOUND.find((i) => String(i.id) === itemId)
  const detailPath = `/admin/lost-found/${itemId}`

  if (!item) return null

  const handleSave = (payload) => {
    console.log('update lost-found', item.id, payload)
    navigate(detailPath)
  }

  return (
    <LostFoundEditor
      initialDate={item.date}
      initialTitle={item.title}
      initialImageUrl={item.imageUrl}
      initialKeywords={item.keywords}
      submitLabel="게시물 저장하기"
      continueLabel="계속 수정하기"
      leaveDescription="저장하지 않은 게시물은 수정사항이 반영되지 않습니다."
      onSubmit={handleSave}
      onLeave={() => navigate(detailPath)}
    />
  )
}
