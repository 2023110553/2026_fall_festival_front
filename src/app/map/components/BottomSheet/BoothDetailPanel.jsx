import EditLanternModal from '../../../lantern/components/EditLanternModal'
import ConfirmDeleteModal from '../../../mypage/components/lantern/ConfirmDeleteModal'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useAuthStore } from '../../../../store/useAuthStore'
import { getBoothLanterns, updateLantern, deleteLantern } from '../../../../api/lantern'
import { useMapContext } from '../../context/MapProvider'
import EmptyState from '../../../../components/common/EmptyState'
import LanternCard from '../../../lantern/components/LanternCard'

const List = styled.ul`
  list-style: none;
  margin: 16px 0;
  padding: 0;
  display: grid;
  gap: 12px;
  > li { min-width: 0; }
`
const Action = styled.button`
  min-height: 44px;
  padding: 8px 16px;
  margin: 8px 0;
  cursor: pointer;
`

// 부스·날짜·로그인 상태가 바뀌면 목록과 필터를 초기화한다.
export default function LanternViewTab({ boothId }) {
  const { selectedDate } = useMapContext()
  const { isLoggedIn, accessToken } = useAuthStore()
  const date = selectedDate ?? '2026-09-29'
  const key = JSON.stringify([boothId, date, isLoggedIn, accessToken])
  return <BoothLanternList key={key} boothId={boothId} date={date} isLoggedIn={isLoggedIn} />
}

function BoothLanternList({ boothId, date, isLoggedIn }) {
  const [onlyMine, setOnlyMine] = useState(false)
  return (
    <section aria-label="부스 등불 목록">
      <p>등불을 달아 부스를 밝혀주세요! 욕설, 비방과 같은 내용을 게시할 시 처벌을 받을 수 있습니다.</p>
      <label>
        <input type="checkbox" checked={onlyMine} disabled={!isLoggedIn}
          onChange={(event) => setOnlyMine(event.target.checked)} />
        내가 쓴 등불만 보기
      </label>
      <LanternResults key={String(onlyMine)} boothId={boothId} date={date} mine={onlyMine} />
    </section>
  )
}

function LanternResults({ boothId, date, mine }) {
  const { refreshBooths } = useMapContext()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [pending, setPending] = useState(false)
  const [mutationError, setMutationError] = useState('')
  const busy = useRef(false)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

  const errorMessageOf = (err) => {
    const known = {
      NOT_OWNER: '본인이 작성한 등불만 수정·삭제할 수 있어요.',
      LANTERN_NOT_FOUND: '존재하지 않는 등불입니다.',
      ALREADY_DELETED: '이미 삭제된 등불입니다.',
    }
    return known[err.response?.data?.code] ?? err.response?.data?.message ?? '처리하지 못했어요. 다시 시도해주세요.'
  }

  const refetchList = () => {
    refreshBooths()
    if (!mounted.current) return
    setItems([])
    setPage(0)
    setStatus('loading')
    setAttempt((value) => value + 1)
  }

  // EditLanternModal(공용 컴포넌트, develop 최신 버전)은 pending/error prop이 없고,
  // onSubmit이 reject되면 스스로 에러 문구를 보여주며 열려있고, resolve되면 스스로
  // onClose를 호출한다 — 그 계약에 맞춰 에러를 err.response.data.message 모양으로 다시 던진다.
  const handleEditSubmit = async (id, changes) => {
    try {
      const { data } = await updateLantern(id, changes)
      if (!data?.success) throw new Error('요청을 완료하지 못했어요.')
    } catch (err) {
      throw { response: { data: { message: errorMessageOf(err) } } }
    }
    refetchList()
  }

  const handleDelete = async (id) => {
    if (busy.current) return
    busy.current = true
    setPending(true)
    setMutationError('')
    try {
      const { data } = await deleteLantern(id)
      if (!data?.success) throw new Error('요청을 완료하지 못했어요.')
      refetchList()
      if (!mounted.current) return
      setDeleting(null)
    } catch (err) {
      if (!mounted.current) return
      setMutationError(errorMessageOf(err))
    } finally {
      busy.current = false
      if (mounted.current) setPending(false)
    }
  }

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
    return () => controller.abort()
  }, [boothId, date, mine, page, attempt])

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