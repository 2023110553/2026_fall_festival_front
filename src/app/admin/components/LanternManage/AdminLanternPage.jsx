import { useState } from 'react'

import * as S from './AdminLanternPage.styles'
import sirenIcon from '../../../../assets/admin/siren.svg'
import closeIcon from '../../../../assets/admin/close.svg'

// TODO: API 연동 후 제거 — 카드 UI 확인용 임시 데이터
const MOCK_LANTERNS = [
  {
    id: 1,
    nickname: '닉네임',
    reportReason: '욕설 및 비방',
    message: '여기서 파는 삼겹살 너무 맛있어여 친절하심',
    boothName: '부스 자리',
    reportCount: 45,
  },
]

// 등불 관리 — 신고순/최신순 정렬, 총 개수, 목록(닉네임/문구/부스자리/신고횟수), 삭제(확인 모달 2단계)
export default function AdminLanternPage() {
  const [sort, setSort] = useState('report')

  // TODO: getAdminLanterns(sort) 연동 (api/admin.js)
  const lanterns = MOCK_LANTERNS

  return (
    <S.Page>
      <S.Header>
      <S.SortSelect value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="report">신고순</option>
        <option value="recent">최신순</option>
      </S.SortSelect>
      <S.TotalCount>{lanterns.length}개</S.TotalCount>
      </S.Header>
      <S.LanternList>
        {lanterns.map((l) => (
          <S.LanternCard key={l.id}>
            <S.CardContent>
              <S.TitleRow>
                <S.Nickname>{l.nickname}</S.Nickname>
                {l.reportReason && <S.ReportBadge>{l.reportReason}</S.ReportBadge>}
              </S.TitleRow>
              <S.Message>{l.message}</S.Message>
              <S.BoothName>{l.boothName}</S.BoothName>
            </S.CardContent>
            <S.CardSide>
              <S.ReportCount>
                {l.reportCount}
                <S.SirenIcon src={sirenIcon} alt="신고" />
              </S.ReportCount>
              <S.DeleteButton type="button" aria-label="등불 삭제">
                <img src={closeIcon} alt="" />
              </S.DeleteButton>
            </S.CardSide>
          </S.LanternCard>
        ))}
      </S.LanternList>
    </S.Page>
  )
}
