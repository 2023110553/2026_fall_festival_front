import { useEffect, useState } from 'react'

import * as S from './AdminLanternPage.styles'
import LanternDetailModal from './LanternDetailModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import { deleteAdminLantern, getAdminLanterns } from '../../../../api/admin'
import sirenIcon from '../../../../assets/admin/siren.svg'
import closeIcon from '../../../../assets/admin/close.svg'

// 한 번에 불러오는 개수 (명세상 size 최대 100)
const PAGE_SIZE = 20

// 등불 관리 — 신고순/최신순 정렬, 총 개수, 목록(닉네임/문구/부스자리/신고횟수), 삭제(확인 모달 2단계)
export default function AdminLanternPage() {
  const [sort, setSort] = useState('REPORT_DESC')
  const [selectedLantern, setSelectedLantern] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

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

  // 목록에서 빼고 총 개수도 같이 줄인다 (서버도 삭제 즉시 카운트를 -1 차감)
  const removeLantern = (lanternId) => {
    setLanterns((prev) => prev.filter((l) => l.lantern_id !== lanternId))
    setTotalCount((prev) => Math.max(prev - 1, 0))
  }

  const closeDeleteModal = () => {
    if (isDeleting) return
    setDeleteTarget(null)
    setDeleteError('')
  }

  // 2단계: 확인 모달의 "삭제하기" → DELETE /api/lanterns/{lantern_id}/ (블라인드 처리)
  const handleDeleteConfirm = async () => {
    const lanternId = deleteTarget.lantern_id
    setIsDeleting(true)
    setDeleteError('')
    try {
      await deleteAdminLantern(lanternId)
      removeLantern(lanternId)
      setDeleteTarget(null)
    } catch (err) {
      // 404는 이미 삭제된 등불 — 목록에 남아 있을 이유가 없으니 똑같이 빼준다
      if (err.response?.status === 404) {
        removeLantern(lanternId)
        setDeleteTarget(null)
      } else {
        setDeleteError('등불을 삭제하지 못했습니다. 다시 시도해 주세요.')
      }
    } finally {
      setIsDeleting(false)
    }
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
              {/* 카드의 X는 상세 모달을 건너뛰고 바로 확인 모달을 연다 */}
              <S.DeleteButton
                type="button"
                aria-label="등불 삭제"
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteTarget(l)
                }}
              >
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
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        errorMessage={deleteError}
      />
    </S.Page>
  )
}
