import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as S from './AdminNoticePage.styles'
import { MOCK_NOTICES, NOTICE_TYPE_LABEL } from './mockNotices'
import NoticeTypeSelectModal from './NoticeTypeSelectModal'

export default function AdminNoticePage() {
  const navigate = useNavigate()
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false)

  const notices = MOCK_NOTICES

  return (
    <S.Page>
      <S.TotalCount>{notices.length}개</S.TotalCount>
      <S.NoticeList>
        {notices.map((n) => (
          <S.NoticeCard key={n.id} onClick={() => navigate(`/admin/notices/${n.id}`)}>
            <S.TitleRow>
              <S.TypeTag $urgent={n.type === 'URGENT'}>{NOTICE_TYPE_LABEL[n.type]}</S.TypeTag>
              <S.Title>{n.title}</S.Title>
            </S.TitleRow>
            <S.Preview>{n.content}</S.Preview>
          </S.NoticeCard>
        ))}
      </S.NoticeList>
      <S.BottomBar>
        <S.PrimaryButton type="button" onClick={() => setIsTypeSelectOpen(true)}>
          공지 등록하기
        </S.PrimaryButton>
      </S.BottomBar>

      <NoticeTypeSelectModal
        isOpen={isTypeSelectOpen}
        onClose={() => setIsTypeSelectOpen(false)}
        onSelect={(type) => navigate(`/admin/notices/new?type=${type}`)}
      />
    </S.Page>
  )
}
