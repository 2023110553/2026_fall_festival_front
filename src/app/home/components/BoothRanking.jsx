import { useCallback, useEffect, useRef, useState } from 'react'
import Modal from '../../../components/common/Modal'
import BoothDetailPanel from '../../map/components/BottomSheet/BoothDetailPanel'
import { getCurrentFestivalDate } from '../../lantern/utils/getCurrentFestivalDate'
import styled from 'styled-components'
import { useTranslation } from '../../../i18n/useTranslation'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  padding: 0 12px 8px;
`

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 0;
  border: 0;
  border-bottom: 1px solid #e4e4e4;
  background: transparent;
  text-align: left;
  font: inherit;

  &[type='button'] {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid #dc7054;
    outline-offset: 2px;
  }

  &:last-child {
    border-bottom: 0;
  }
`

const NameGroup = styled.span`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`

const Rank = styled.span`
  flex: 0 0 auto;
  color: #dc7054;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
`

const Name = styled.span`
  min-width: 0;
  overflow: hidden;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const CountGroup = styled.span`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
`

const Count = styled.span`
  color: #9f9c99;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`

const LanternDot = styled.span`
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  aspect-ratio: 1 / 1;
  border-radius: 99px;
  opacity: 0.7;
  background: var(--aurora_orange, #DC7054);
  filter: blur(2px);
`

const ArrowBox = styled.span`
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  border: 0;
  padding: 0;
  background: transparent;
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  display: flex;
`

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.13387 2.62947C5.04805 2.71414 5 2.82788 5 2.94634C5 3.0648 5.04805 3.17854 5.13387 3.26321L9.91635 8L5.1354 12.7368C5.05005 12.8214 5.00228 12.9348 5.00228 13.0529C5.00228 13.171 5.05005 13.2844 5.1354 13.3691C5.17688 13.4105 5.22657 13.4434 5.28151 13.4659C5.33646 13.4884 5.39552 13.5 5.4552 13.5C5.51488 13.5 5.57395 13.4884 5.6289 13.4659C5.68384 13.4434 5.73353 13.4105 5.77501 13.3691L10.8612 8.3302C10.9502 8.24176 11 8.12331 11 8C11 7.87669 10.9502 7.75824 10.8612 7.6698L5.77347 2.63095C5.73199 2.58953 5.6823 2.55659 5.62736 2.53409C5.57242 2.51159 5.51335 2.5 5.45367 2.5C5.39399 2.5 5.33492 2.51159 5.27998 2.53409C5.22504 2.55659 5.17535 2.58953 5.13387 2.63095V2.62947Z"
        fill="#9F9C99"
      />
    </svg>
  )
}

export default function BoothRanking({ ranking = [], isLoading = false, isError = false }) {
  const { language, t } = useTranslation()
  const [selectedBoothId, setSelectedBoothId] = useState(null)
  const [sheetTab, setSheetTab] = useState('info')
  const triggerRef = useRef(null)
  const sheetRef = useRef(null)
  const closeSheet = useCallback(() => {
    setSelectedBoothId(null)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    if (selectedBoothId == null) return
    const panel = sheetRef.current
    panel?.querySelector('button')?.focus()
    const trapFocus = (event) => {
      if (event.key !== 'Tab') return
      const controls = [...panel.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]')]
      const first = controls[0]
      const last = controls.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    panel?.addEventListener('keydown', trapFocus)
    return () => panel?.removeEventListener('keydown', trapFocus)
  }, [selectedBoothId])

  const hasRanking = !isLoading && !isError && Array.isArray(ranking) && ranking.length > 0
  const emptyLabel = isLoading
    ? t('home.rankingLoading')
    : isError
      ? t('home.rankingError')
      : t('home.rankingEmpty')

  return (
    <Wrapper aria-label={t('home.rankingLabel')}>
      {!hasRanking ? Array.from({ length: 3 }, (_, index) => (
        <Row key={`empty-${index}`}>
          <NameGroup>
            <Rank aria-hidden="true">{String(index + 1).padStart(2, '0')}</Rank>
            <Name>{emptyLabel}</Name>
          </NameGroup>
          <CountGroup>
            <LanternDot aria-hidden="true" />
            <Count>-</Count>
            <ArrowBox $disabled aria-hidden="true">
              <ArrowRightIcon />
            </ArrowBox>
          </CountGroup>
        </Row>
      )) : ranking.map((booth) => (
        <Row
          as="button"
          type="button"
          key={booth.booth_id}
          aria-label={t('home.rankingDetail', { rank: booth.rank, name: booth.name, count: booth.lantern_count })}
          aria-haspopup="dialog"
          onClick={(event) => {
            triggerRef.current = event.currentTarget
            setSheetTab('info')
            setSelectedBoothId(booth.booth_id)
          }}
        >
          <NameGroup>
            <Rank aria-hidden="true">{String(booth.rank).padStart(2, '0')}</Rank>
            <Name>{booth.name}</Name>
          </NameGroup>
          <CountGroup>
            <LanternDot aria-hidden="true" />
            <Count aria-hidden="true">{t('home.lanternCount', { count: booth.lantern_count.toLocaleString(language === 'ko' ? 'ko-KR' : language) })}</Count>
            <ArrowBox aria-hidden="true">
              <ArrowRightIcon />
            </ArrowBox>
          </CountGroup>
        </Row>
      ))}
      {selectedBoothId != null && (
        <Modal
          open
          onClose={closeSheet}
          style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 375, maxHeight: 'calc(100dvh - 40px)',
            overflowY: 'auto', overscrollBehavior: 'contain', boxSizing: 'border-box',
            borderRadius: '28px 28px 0 0', textAlign: 'left',
            padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
          }}
        >
          <div ref={sheetRef}>
            <BoothDetailPanel
              boothId={selectedBoothId}
              onBack={closeSheet}
              sheetTab={sheetTab}
              setSheetTab={setSheetTab}
              selectedDate={getCurrentFestivalDate()}
            />
          </div>
        </Modal>
      )}
    </Wrapper>
  )
}
