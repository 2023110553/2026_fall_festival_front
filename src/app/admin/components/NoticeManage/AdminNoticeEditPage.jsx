import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import * as S from './NoticeEditor.styles'
import NoticeEditor from './NoticeEditor'
import { getAdminNoticeDetail } from '../../../../api/admin'
import { getNoticeTypeLabel, isUrgentNotice } from './mockNotices'

export default function AdminNoticeEditPage() {
  const { noticeId } = useParams()
  const navigate = useNavigate()
  const detailPath = `/admin/notices/${noticeId}`

  // 초기값 바인딩용 상세 조회 — NoticeEditor는 initial* 값을 첫 렌더에서만 읽으므로 로드 후에 그린다
  const [notice, setNotice] = useState(null)

  useEffect(() => {
    let ignore = false

    getAdminNoticeDetail(noticeId)
      .then((res) => {
        if (!ignore) setNotice(res.data?.data ?? null)
      })
      .catch(() => {
        // 404(삭제됨)·인증 실패 등은 상세 화면에서 안내하도록 되돌려 보낸다
        if (!ignore) navigate(detailPath, { replace: true })
      })

    return () => {
      ignore = true
    }
  }, [noticeId, navigate, detailPath])

  if (!notice) return null

  const handleSave = ({ title, content, imageFile }) => {
    console.log('update notice', notice.notice_id, { title, content, imageFile })
    navigate(detailPath)
  }

  return (
    <NoticeEditor
      typeSlot={<S.TypeTag $urgent={isUrgentNotice(notice.type)}>{getNoticeTypeLabel(notice.type)}</S.TypeTag>}
      initialTitle={notice.title}
      initialContent={notice.content}
      initialImageUrl={notice.image_url}
      submitLabel="게시물 저장하기"
      toastMessage="제목 및 본문은 필수 입력입니다. 미입력 시 저장되지 않습니다."
      continueLabel="계속 수정하기"
      onSubmit={handleSave}
      onLeave={() => navigate(detailPath)}
    />
  )
}
