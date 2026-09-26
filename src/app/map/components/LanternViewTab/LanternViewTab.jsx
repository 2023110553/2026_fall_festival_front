import ReportModal from '../../../lantern/components/ReportModal'
import AlertModal from '../../../../components/common/AlertModal'
import EditLanternModal from '../../../lantern/components/EditLanternModal'
import ConfirmDeleteModal from '../../../mypage/components/lantern/ConfirmDeleteModal'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useAuthStore } from '../../../../store/useAuthStore'
import { getBoothLanterns, updateLantern, deleteLantern, reportLantern } from '../../../../api/lantern'
import { useOptionalMapContext } from '../../context/MapProvider'
import { useLanterns } from '../../../lantern/context/LanternProvider'
import { getCurrentFestivalDate } from '../../../lantern/utils/getCurrentFestivalDate'
import EmptyState from '../../../../components/common/EmptyState'
import LanternCard from '../../../lantern/components/LanternCard'
import LoginModal from '../../../auth/LoginModal'
import { useTranslation } from '../../../../i18n/useTranslation'

const List = styled.ul`
  list-style: none;
  margin: 6px 0 16px;
  padding: 0;
  display: grid;
  gap: 12px;
  > li { min-width: 0; }
`
const Notice = styled.div`
  font-family: Pretendard;
`
const Prompt = styled.p`
  margin: 0;
  color: #5C5C5C;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`
const Warning = styled.p`
  margin: 4px 0 0;
  color: #808080;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`
const Divider = styled.hr`
  width: 100%;
  height: 0.959px;
  margin: 12px 0 0;
  border: 0;
  background: #FFF;
`
const MineFilter = styled.button`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  width: fit-content;
  margin-top: 16px;
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  font-family: Pretendard;
  color: var(--text_black, #272727);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid #DC7054;
    outline-offset: 2px;
    border-radius: 4px;
  }
`
const CheckboxIconSlot = styled.span`
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  display: grid;
  place-items: center;
`
const CheckboxIcon = styled.svg`
  display: block;
  flex-shrink: 0;
`
const Action = styled.button`
  min-height: 44px;
  padding: 8px 16px;
  margin: 8px 0;
  cursor: pointer;
`

// 부스·날짜·로그인 상태가 바뀌면 목록과 필터를 초기화한다.
// selectedDate는 BoothDetailPanel이 props로 넘겨준다. MapProvider 안이면 컨텍스트 값을, 둘 다 없으면 오늘 축제일을 쓴다.
export default function LanternViewTab({ boothId, selectedDate }) {
  const map = useOptionalMapContext()
  const { isLoggedIn, accessToken } = useAuthStore()
  const date = selectedDate ?? map?.selectedDate ?? getCurrentFestivalDate()
  const key = JSON.stringify([boothId, date, isLoggedIn, accessToken])
  return <BoothLanternList key={key} boothId={boothId} date={date} isLoggedIn={isLoggedIn} />
}

function BoothLanternList({ boothId, date, isLoggedIn }) {
  const { t } = useTranslation()
  const [onlyMine, setOnlyMine] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const toggleOnlyMine = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    setOnlyMine((checked) => !checked)
  }

  return (
    <section aria-label={t('map.boothLanternList')}>
      <LoginModal portal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <Notice>
        <Prompt>{t('map.lanternPrompt')}</Prompt>
        <Warning>{t('map.lanternWarning')}</Warning>
      </Notice>
      <Divider />
      <MineFilter
        type="button"
        role="checkbox"
        aria-checked={onlyMine}
        onClick={toggleOnlyMine}
      >
        {t('map.onlyMine')}
        <CheckboxIconSlot>
          <CheckboxIcon xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="var(--text_black, #272727)" strokeWidth="1" aria-hidden="true">
            <path d="M12.75 0.5H4C2.067 0.5 0.5 2.067 0.5 4V12.75C0.5 14.683 2.067 16.25 4 16.25H12.75C14.683 16.25 16.25 14.683 16.25 12.75V4C16.25 2.067 14.683 0.5 12.75 0.5Z" strokeLinecap="round" strokeLinejoin="round" />
            {onlyMine && (
              <svg x="5.25" y="6.125" width="7" height="5" viewBox="0 0 7 5" fill="none">
                <path d="M0.5 2.5L2.46875 4L5.75 0.5" stroke="var(--text_black, #272727)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </CheckboxIcon>
        </CheckboxIconSlot>
      </MineFilter>
      <LanternResults key={String(onlyMine)} boothId={boothId} date={date} mine={onlyMine} isLoggedIn={isLoggedIn} />
    </section>
  )
}

function LanternResults({ boothId, date, mine, isLoggedIn }) {
  const { t } = useTranslation()
  // 홈 랭킹 모달처럼 MapProvider 밖에서 열리면 부스 목록 갱신은 건너뛴다.
  const refreshBooths = useOptionalMapContext()?.refreshBooths
  const { refreshLanterns } = useLanterns()
  const [reporting, setReporting] = useState(null)
  const [reportNotice, setReportNotice] = useState(null)
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

  const mutate = async (kind, id, changes) => {
    if (busy.current) return
    busy.current = true
    setPending(true)
    setMutationError('')
    try {
      const { data } = await (kind === 'edit' ? updateLantern(id, changes) : deleteLantern(id))
      if (!data?.success) throw new Error(t('map.requestFailed'))
      refreshBooths?.()
      // 나의 등불(개수·사용한 부스)도 같이 갱신
      refreshLanterns()
      if (!mounted.current) return
      setEditing(null)
      setDeleting(null)
      setItems([])
      setPage(0)
      setStatus('loading')
      setAttempt((value) => value + 1)
    } catch (error) {
      if (!mounted.current) return
      const messages = {
        NOT_OWNER: t('map.notOwner'),
        LANTERN_NOT_FOUND: t('map.lanternNotFound'),
        ALREADY_DELETED: t('map.alreadyDeleted'),
      }
      const message = messages[error.response?.data?.code]
        ?? error.response?.data?.message ?? t('map.processError')
      setMutationError(message)
      // EditLanternModal은 onSubmit이 resolve되면 스스로 닫히므로, 실패는 던져서 모달 안에 메시지를 띄운다.
      if (kind === 'edit') throw { response: { data: { message } } }
    } finally {
      busy.current = false
      if (mounted.current) setPending(false)
    }
  }

  const submitReport = async (reason) => {
    try {
      const { data } = await reportLantern(reporting.id, reason)
      if (!data?.success || data.code !== 'LANTERN_REPORT_SUCCESS') throw new Error('Invalid report response')
      if (mounted.current) setReportNotice('success')
    } catch (error) {
      if (!mounted.current) return
      if (error.response?.status === 409 && error.response?.data?.code === 'ALREADY_REPORTED') {
        setReportNotice('duplicate')
        return
      }
      throw error
    }
  }

  const [items, setItems] = useState([])
  const [page, setPage] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')

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
        setError(code === 400 ? t('map.invalidDate')
          : code === 401 ? t('map.loginRequired')
          : t('map.lanternListError'))
        setStatus('error')
      })
    return () => controller.abort()
  }, [boothId, date, mine, page, attempt, t])

  return (
    <div aria-busy={status === 'loading'}>
      {reporting && <ReportModal key={reporting.id} isOpen
        onClose={() => setReporting(null)} onSubmit={submitReport} />}
      <AlertModal isOpen={reportNotice != null} onClose={() => setReportNotice(null)}
        title={reportNotice === 'duplicate' ? t('map.reportDuplicateTitle') : t('map.reportSuccessTitle')}
        subTitle={reportNotice === 'duplicate' ? t('map.reportDuplicateDescription') : t('map.reportSuccessDescription')} />

      {editing && <EditLanternModal isOpen lantern={editing}
        onClose={() => { if (!busy.current) setEditing(null) }}
        onSubmit={(id, changes) => mutate('edit', id, changes)} />}
      {deleting && <ConfirmDeleteModal isOpen pending={pending} error={mutationError}
        onClose={() => { if (!busy.current) setDeleting(null) }}
        onConfirm={() => mutate('delete', deleting.id)} />}

      <List>
        {items.map((item) => (
          <li key={item.id}>
            {['deleted_by_user', 'deleted_by_admin'].includes(item.status) ? (
              <p>{item.status === 'deleted_by_admin' ? t('map.deletedByAdmin') : t('map.deletedByUser')}</p>
            ) : <LanternCard lantern={item} isMine={item.isMine === true}
              onReport={isLoggedIn && item.isMine === false ? () => setReporting(item) : undefined}
              onEdit={isLoggedIn && item.isMine === true && item.status === 'active' ? () => { setMutationError(''); setEditing(item) } : undefined}
              onDelete={isLoggedIn && item.isMine === true && item.status === 'active' ? () => { setMutationError(''); setDeleting(item) } : undefined}
            />}
          </li>
        ))}
      </List>
      {status === 'loading' && <p role="status">{t('map.loadingLanterns')}</p>}
      {status === 'error' && <div role="alert">
        <p>{error}</p>
        <Action type="button" onClick={() => { setStatus('loading'); setAttempt((value) => value + 1) }}>{t('map.retry')}</Action>
      </div>}
      {status === 'success' && items.length === 0 && <EmptyState>{mine ? t('map.noMineLanterns') : t('map.noLanterns')}</EmptyState>}
      {status === 'success' && hasNext && <Action type="button" onClick={() => { setStatus('loading'); setPage((value) => value + 1) }}>{t('map.more')}</Action>}
    </div>
  )
}
