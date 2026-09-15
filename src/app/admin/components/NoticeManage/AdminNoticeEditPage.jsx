import { useNavigate, useParams } from 'react-router-dom'

import * as S from './NoticeEditor.styles'
import NoticeEditor from './NoticeEditor'
import { MOCK_NOTICES, NOTICE_TYPE_LABEL } from './mockNotices'

export default function AdminNoticeEditPage() {
  const { noticeId } = useParams()
  const navigate = useNavigate()

  const notice = MOCK_NOTICES.find((n) => String(n.id) === noticeId)
  const detailPath = `/admin/notices/${noticeId}`

  if (!notice) return null

  const handleSave = ({ title, content, imageFile }) => {
    console.log('update notice', notice.id, { title, content, imageFile })
    navigate(detailPath)
  }

  return (
    <NoticeEditor
      typeSlot={<S.TypeTag $urgent={notice.type === 'URGENT'}>{NOTICE_TYPE_LABEL[notice.type]}</S.TypeTag>}
      initialTitle={notice.title}
      initialContent={notice.content}
      initialImageUrl={notice.imageUrl}
      submitLabel="게시물 저장하기"
      toastMessage="제목 및 본문은 필수 입력입니다. 미입력 시 저장되지 않습니다."
      continueLabel="계속 수정하기"
      onSubmit={handleSave}
      onLeave={() => navigate(detailPath)}
    />
  )
}
