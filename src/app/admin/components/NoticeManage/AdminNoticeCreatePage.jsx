import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import * as S from './NoticeEditor.styles'
import NoticeEditor from './NoticeEditor'
import { createAdminNotice } from '../../../../api/admin'
import { NOTICE_TYPE_LABEL } from './noticeTypes'

// 서버 400은 errors에 필드별 메시지가 오므로 있으면 그걸, 없으면 message를 보여준다
const toErrorMessage = (error) => {
  const data = error.response?.data
  const fieldMessages = Object.values(data?.errors ?? {}).filter(Boolean)
  if (fieldMessages.length) return fieldMessages.join(' ')
  return data?.message ?? '공지 등록에 실패했습니다.'
}

export default function AdminNoticeCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [type, setType] = useState(searchParams.get('type') === 'URGENT' ? 'URGENT' : 'NORMAL')

  const listPath = '/admin/notices'

  // 실패 시 에디터가 토스트로 띄울 메시지를 돌려준다 (성공하면 목록으로)
  const handleCreate = async ({ title, content, imageFile }) => {
    try {
      // 화면에선 URGENT 키를 쓰지만 서버 유형 값은 EMERGENCY
      await createAdminNotice({
        type: type === 'URGENT' ? 'EMERGENCY' : 'NORMAL',
        title: title.trim(),
        content: content.trim(),
        imageFile,
      })
      navigate(listPath)
    } catch (err) {
      return toErrorMessage(err)
    }
  }

  const typeSlot = (
    <S.TypeSelectWrap>
      <S.TypeSelect
        aria-label="공지 유형"
        value={type}
        $urgent={type === 'URGENT'}
        onChange={(e) => setType(e.target.value)}
      >
        {Object.entries(NOTICE_TYPE_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </S.TypeSelect>
      <svg width="7" height="5" viewBox="0 0 7 5" fill="none" aria-hidden="true">
        <path d="M1 1L3.5 3.5L6 1" stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </S.TypeSelectWrap>
  )

  return (
    <NoticeEditor
      typeSlot={typeSlot}
      submitLabel="게시물 등록하기"
      toastMessage="제목 및 본문은 필수 입력값입니다. 미입력 시 등록되지 않습니다."
      continueLabel="계속 작성하기"
      onSubmit={handleCreate}
      onLeave={() => navigate(listPath)}
    />
  )
}
