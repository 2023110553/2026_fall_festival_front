import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import * as S from './NoticeEditor.styles'
import NoticeEditor from './NoticeEditor'
import { getAdminNoticeDetail, updateAdminNotice } from '../../../../api/admin'
import { getNoticeTypeLabel, isUrgentNotice } from './noticeTypes'

// 서버 400은 errors에 필드별 메시지가 오므로 있으면 그걸, 없으면 message를 보여준다
const toErrorMessage = (error) => {
  const data = error.response?.data
  const fieldMessages = Object.values(data?.errors ?? {}).filter(Boolean)
  if (fieldMessages.length) return fieldMessages.join(' ')
  return data?.message ?? '공지 수정에 실패했습니다.'
}

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

  // 실패 시 에디터가 토스트로 띄울 메시지를 돌려준다 (성공하면 상세로)
  const handleSave = async ({ title, content, imageFile }) => {
    try {
      // 이 화면에선 유형을 바꾸지 않지만 type은 필수라 기존 값을 그대로 보낸다
      // imageFile은 새 사진을 골랐을 때만 있음 → 없으면 image 미전송으로 기존 사진 유지
      await updateAdminNotice(notice.notice_id, {
        type: isUrgentNotice(notice.type) ? 'EMERGENCY' : 'NORMAL',
        title: title.trim(),
        content: content.trim(),
        imageFile,
      })
      navigate(detailPath)
    } catch (err) {
      return toErrorMessage(err)
    }
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
