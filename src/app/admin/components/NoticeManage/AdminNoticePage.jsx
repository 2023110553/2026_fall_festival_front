import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import * as S from './AdminNoticePage.styles'
import { getAdminNotices } from '../../../../api/admin'
import { getNoticeTypeLabel, isUrgentNotice } from './mockNotices'
import NoticeTypeSelectModal from './NoticeTypeSelectModal'

// 한 번에 불러오는 개수 (명세상 size 최대 100)
const PAGE_SIZE = 20

export default function AdminNoticePage() {
  const navigate = useNavigate()
  const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false)

  // GET /api/notices/ — 페이징이라 page를 올리면서 items를 이어붙인다
  const [notices, setNotices] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    setIsLoading(true)

    getAdminNotices({ page, size: PAGE_SIZE })
      .then((res) => {
        if (ignore) return
        const data = res.data?.data ?? {}
        const nextItems = data.items ?? []
        setNotices((prev) => (page === 0 ? nextItems : [...prev, ...nextItems]))
        setTotalCount(data.total_count ?? 0)
        setHasNext(data.has_next ?? false)
        setError('')
      })
      .catch((err) => {
        if (ignore) return
        setError(
          err.response?.status === 401
            ? '관리자 인증이 필요합니다.'
            : '공지 목록을 불러오지 못했습니다.',
        )
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [page])

  return (
    <S.Page>
      <S.TotalCount>{totalCount}개</S.TotalCount>
      <S.NoticeList>
        {notices.map((n) => (
          <S.NoticeCard key={n.notice_id} onClick={() => navigate(`/admin/notices/${n.notice_id}`)}>
            <S.TitleRow>
              <S.TypeTag $urgent={isUrgentNotice(n.type)}>{getNoticeTypeLabel(n.type)}</S.TypeTag>
              <S.Title>{n.title}</S.Title>
            </S.TitleRow>
            <S.Preview>{n.content_preview}</S.Preview>
          </S.NoticeCard>
        ))}
      </S.NoticeList>

      {error && <S.StatusMessage role="alert">{error}</S.StatusMessage>}
      {isLoading && <S.StatusMessage>불러오는 중...</S.StatusMessage>}
      {!isLoading && !error && notices.length === 0 && (
        <S.StatusMessage>등록된 공지가 없습니다.</S.StatusMessage>
      )}
      {hasNext && !isLoading && !error && (
        <S.LoadMoreButton type="button" onClick={() => setPage((prev) => prev + 1)}>
          더보기
        </S.LoadMoreButton>
      )}
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
