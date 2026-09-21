import EditLanternModal from '../../../lantern/components/EditLanternModal'
import ConfirmDeleteModal from '../../../mypage/components/lantern/ConfirmDeleteModal'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useAuthStore } from '../../../../store/useAuthStore'
import { getBoothLanterns, updateLantern, deleteLantern } from '../../../../api/lantern'
import { useMapContext } from '../../context/MapProvider'
import EmptyState from '../../../../components/common/EmptyState'
import LanternCard from '../../../lantern/components/LanternCard'

// 실제 부스 설명은 장소 상세 페이지와 공통 콘텐츠를 재사용하도록 연결한다.
export default function BoothDetailPanel({ boothId, onBack }) {
  const { sheetTab, setSheetTab, selectedDate, boothRevision } = useMapContext()
  const { setActiveBooth } = useLanterns()
  const { isLoggedIn } = useAuth()
  const [detail, setDetail] = useState(null)
  const currentDetail = detail?.boothId === boothId && detail?.isLoggedIn === isLoggedIn
    ? detail : null
  const booth = currentDetail?.booth ?? null
  const isLoading = currentDetail == null

  useEffect(() => {
    const controller = new AbortController()
    getBoothLanterns(boothId, { date, mine, page, size: 20, signal: controller.signal })
      .then(({ data: response }) => {
        if (controller.signal.aborted) return
        const data = response?.data
        if (!response?.success || !Array.isArray(data?.items)
          || data.page !== page || typeof data.has_next !== 'boolean') {
          throw new Error('Invalid lantern list response')
        }
        const nextItems = data.items.map((item) => ({
          id: item.lantern_id,
          nickname: item.nickname,
          message: item.message,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          isMine: item.is_mine,
          status: item.status,
        }))
        setItems((previous) => [...new Map([...previous, ...nextItems].map((item) => [item.id, item])).values()])
        setHasNext(data.has_next)
        setStatus('success')
      })
      .catch((failure) => {
        if (controller.signal.aborted) return
        const code = failure.response?.status
        setError(code === 400 ? '조회 조건을 확인해주세요. 날짜는 YYYY-MM-DD 형식이어야 해요.'
          : code === 401 ? '로그인이 필요해요. 로그인 상태를 확인해주세요.'
          : '등불 목록을 불러오지 못했어요. 다시 시도해주세요.')
        setStatus('error')
      })
    return () => { ignore = true }
  }, [boothId, isLoggedIn, boothRevision])
  const simple =
    booth &&
    (booth.place_type === 'FACILITY' ||
      ['TOILET', 'ALCOHOL'].includes(booth.category))
  const money = (value) =>
    value ? `${value.toLocaleString('ko-KR')}원` : '무료'

  const activeBoothId = booth && !simple ? booth.booth_id : null
  const festivalDate = selectedDate ?? '2026-09-29'

  useEffect(() => {
    setActiveBooth(activeBoothId == null ? null : {
      boothId: activeBoothId,
      festivalDate,
    })

    // 목록으로 돌아가거나 지도 페이지를 떠날 때 이전 부스 선택을 남기지 않는다.
    return () => setActiveBooth(null)
  }, [activeBoothId, festivalDate, setActiveBooth])

  return (
    <div aria-busy={status === 'loading'}>
      {editing && (
        <EditLanternModal isOpen lantern={editing} onClose={() => setEditing(null)} onSubmit={handleEditSubmit} />
      )}
      {deleting && (
        <ConfirmDeleteModal
          isOpen
          pending={pending}
          error={mutationError}
          onClose={() => { if (!busy.current) setDeleting(null) }}
          onConfirm={() => handleDelete(deleting.id)}
        />
      )}

      <List>
        {items.map((item) => (
          <li key={item.id}>
            {['deleted_by_user', 'deleted_by_admin'].includes(item.status) ? (
              <p>{item.status === 'deleted_by_admin' ? '관리자에 의해 삭제된 등불입니다.' : '삭제한 등불입니다.'}</p>
            ) : (
              <LanternCard
                lantern={item}
                isMine={item.isMine}
                onEdit={item.isMine && item.status === 'active' ? () => { setMutationError(''); setEditing(item) } : undefined}
                onDelete={item.isMine && item.status === 'active' ? () => { setMutationError(''); setDeleting(item) } : undefined}
              />
            )}
          </li>
        ))}
      </List>
      {status === 'loading' && <p role="status">등불 목록을 불러오는 중이에요...</p>}
      {status === 'error' && <div role="alert">
        <p>{error}</p>
        <Action type="button" onClick={() => { setStatus('loading'); setAttempt((value) => value + 1) }}>다시 시도</Action>
      </div>}
      {status === 'success' && items.length === 0 && <EmptyState>{mine ? '이 날짜에 작성한 등불이 없습니다.' : '등불이 아직 없습니다.'}</EmptyState>}
      {status === 'success' && hasNext && <Action type="button" onClick={() => { setStatus('loading'); setPage((value) => value + 1) }}>더 보기</Action>}
    </div>
  )
}