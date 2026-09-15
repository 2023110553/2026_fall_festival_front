import { useNavigate } from 'react-router-dom'

import * as S from './AdminNoticePage.styles'
import { MOCK_NOTICES, NOTICE_TYPE_LABEL } from './mockNotices'

// 공지 관리 — 목록(태그/제목/미리보기), 신규 등록(유형 선택 모달→작성), 상세/수정/삭제
export default function AdminNoticePage() {
  const navigate = useNavigate()

  // TODO: getAdminNotices() 연동 (api/admin.js)
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
        {/* TODO: 공지 등록 플로우(유형 선택 모달→작성) */}
        <S.PrimaryButton type="button">공지 등록하기</S.PrimaryButton>
      </S.BottomBar>
    </S.Page>
  )
}
