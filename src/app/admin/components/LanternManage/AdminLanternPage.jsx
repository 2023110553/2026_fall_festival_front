import { useEffect, useState } from 'react'

import * as S from './AdminLanternPage.styles'
import LanternDetailModal from './LanternDetailModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import { getAdminLanterns } from '../../../../api/admin'
import sirenIcon from '../../../../assets/admin/siren.svg'
import closeIcon from '../../../../assets/admin/close.svg'

// 한 번에 불러오는 개수 (명세상 size 최대 100)
const PAGE_SIZE = 20

// 등불 관리 — 신고순/최신순 정렬, 총 개수, 목록(닉네임/문구/부스자리/신고횟수), 삭제(확인 모달 2단계)
export default function AdminLanternPage() {
  const [sort, setSort] = useState('REPORT_DESC')
  const [selectedLantern, setSelectedLantern] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // GET /api/lanterns/ — 페이징이라 page를 올리면서 items를 이어붙인다
  const [lanterns, setLanterns] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    setIsLoading(true)

    getAdminLanterns({ sort, page, size: PAGE_SIZE })
      .then((res) => {
        if (ignore) return
        const data = res.data?.data ?? {}
        const nextItems = data.items ?? []
        // page 0은 첫 조회/정렬 변경, 그 외에는 "더보기"라 뒤에 이어붙인다
        setLanterns((prev) => (page === 0 ? nextItems : [...prev, ...nextItems]))
        setTotalCount(data.total_count ?? 0)
        setHasNext(data.has_next ?? false)
        setError('')
      })
      .catch((err) => {
        if (ignore) return
        setError(
          err.response?.status === 401
            ? '관리자 인증이 필요합니다.'
            : '등불 목록을 불러오지 못했습니다.',
        )
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [sort, page])

  // 정렬이 바뀌면 첫 페이지부터 다시 불러온다
  const handleSortChange = (e) => {
    setSort(e.target.value)
    setPage(0)
    setLanterns([])
  }

  // 1단계: 상세 모달의 "삭제하기" → 상세 모달을 닫고 확인 모달을 연다
  const handleDeleteRequest = (lantern) => {
    setSelectedLantern(null)
    setDeleteTarget(lantern)
  }

  // 2단계: 확인 모달의 "삭제하기" → 실제 삭제
  const handleDeleteConfirm = () => {
    // TODO: deleteAdminLantern(deleteTarget.lantern_id) 연동 후 목록 갱신
    console.log('delete lantern', deleteTarget.lantern_id)
    setDeleteTarget(null)
  }

  return (
    <S.Page>
      <S.Header>
      <S.SortSelect value={sort} onChange={handleSortChange}>
        <option value="REPORT_DESC">신고순</option>
        <option value="LATEST">최신순</option>
      </S.SortSelect>
      <S.TotalCount>{totalCount}개</S.TotalCount>
      </S.Header>
      <S.LanternList>
        {lanterns.map((l) => (
          <S.LanternCard key={l.lantern_id} onClick={() => setSelectedLantern(l)}>
            <S.CardContent>
              <S.TitleRow>
                <S.Nickname>{l.nickname}</S.Nickname>
                {/* 최다 신고 사유 — 신고 0건이면 null이라 칩을 숨긴다 */}
                {l.top_report_reason && <S.ReportBadge>{l.top_report_reason}</S.ReportBadge>}
              </S.TitleRow>
              <S.Message>{l.content}</S.Message>
              <S.BoothName>{l.booth_name}</S.BoothName>
            </S.CardContent>
            <S.CardSide>
              <S.ReportCount>
                {l.report_count}
                <S.SirenIcon src={sirenIcon} alt="신고" />
              </S.ReportCount>
              <S.DeleteButton type="button" aria-label="등불 삭제">
                <img src={closeIcon} alt="" />
              </S.DeleteButton>
            </S.CardSide>
          </S.LanternCard>
        ))}
      </S.LanternList>

      {error && <S.StatusMessage role="alert">{error}</S.StatusMessage>}
      {isLoading && <S.StatusMessage>불러오는 중...</S.StatusMessage>}
      {!isLoading && !error && lanterns.length === 0 && (
        <S.StatusMessage>등록된 등불이 없습니다.</S.StatusMessage>
      )}
      {hasNext && !isLoading && !error && (
        <S.LoadMoreButton type="button" onClick={() => setPage((prev) => prev + 1)}>
          더보기
        </S.LoadMoreButton>
      )}
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
