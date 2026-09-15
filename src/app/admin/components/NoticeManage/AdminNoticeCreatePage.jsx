import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import * as S from './NoticeEditor.styles'
import NoticeEditor from './NoticeEditor'
import { NOTICE_TYPE_LABEL } from './mockNotices'

export default function AdminNoticeCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [type, setType] = useState(searchParams.get('type') === 'URGENT' ? 'URGENT' : 'NORMAL')

  const listPath = '/admin/notices'

  const handleCreate = ({ title, content, imageFile }) => {
    console.log('create notice', { type, title, content, imageFile })
    navigate(listPath)
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
