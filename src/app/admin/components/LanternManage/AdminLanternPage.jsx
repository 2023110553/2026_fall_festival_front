import { useState } from 'react'

import * as S from './AdminLanternPage.styles'
import LanternDetailModal from './LanternDetailModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
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
  const [selectedLantern, setSelectedLantern] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // TODO: getAdminLanterns(sort) 연동 (api/admin.js)
  const lanterns = MOCK_LANTERNS

  // 1단계: 상세 모달의 "삭제하기" → 상세 모달을 닫고 확인 모달을 연다
  const handleDeleteRequest = (lantern) => {
    setSelectedLantern(null)
    setDeleteTarget(lantern)
  }

  // 2단계: 확인 모달의 "삭제하기" → 실제 삭제
  const handleDeleteConfirm = () => {
    // TODO: deleteAdminLantern(deleteTarget.id) 연동 후 목록 갱신
    console.log('delete lantern', deleteTarget.id)
    setDeleteTarget(null)
  }

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
          <S.LanternCard key={l.id} onClick={() => setSelectedLantern(l)}>
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
      <LanternDetailModal
        lantern={selectedLantern}
        onClose={() => setSelectedLantern(null)}
        onDelete={handleDeleteRequest}
      />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </S.Page>
  )
}
