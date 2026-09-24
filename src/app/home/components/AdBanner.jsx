import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import Modal from '../../../components/common/Modal'
import BoothDetailPanel from '../../map/components/BottomSheet/BoothDetailPanel'
import { getCurrentFestivalDate } from '../../lantern/utils/getCurrentFestivalDate'

import donggam from '../assets/donggam.png'
import ecoco from '../assets/ecoco.png'
import scien from '../assets/scien.png'
import sogaeting from '../assets/sogaeting.svg'
import ba from '../assets/ba.png'
import ace from '../assets/ace.png'
import leaders from '../assets/108.png'
import stu from '../assets/stuco.png'

// 상단 광고 배너 (기능명세서 바탕으로) 일정 시간(5초)마다 자동 롤링, 클릭 시 안내>협업 페이지로 이동

// TODO(API): 배너 목록 API가 정해지면 연결할거고 일단 지금은 더미 데이터로 구현해둿습니다
// image에 실제 배너 이미지가 들어오면 Wrapper 배경으로 깔린다 (title은 스크린리더용)
const BANNERS = [
  {
    id: 1,
    title: '동감',
    image: donggam,
    href: null,
    boothId: null,
    to: '/info/collab/donggam',
  },
  {
    id: 2,
    title: '에코코',
    image: ecoco,
    href: null,
    boothId: null,
    to: '/info/collab/ecoco',
  },
  {
    id: 3,
    title: '자연科 함께',
    image: scien,
    href: null,
    boothId: null,
    to: '/info/collab/with-nature',
  },
  {
    id: 4,
    title: '소개팅',
    image: sogaeting,
    href: 'https://threadoffate.site/?ref=dgufest',
    boothId: null,
    to: null,
  },
  {
    id: 5,
    title: '경영학과 야간부스',
    image: ba,
    href: null,
    boothId: 1,
    to: null,
  },
  {
    id: 6,
    title: '첨단융합대학 야간부스',
    image: ace,
    href: null,
    boothId: 18,
    to: null,
  },
  {
    id: 7,
    title: '108 리더스',
    image: leaders,
    href: null,
    boothId: null,
    to: '/info/collab/108-leaders',
  },
  {
    id: 8,
    title: '축제기획단',
    image: stu,
    href: null,
    boothId: null,
    to: '/info/collab/festival-planning-team',
  },
]

const ROLLING_INTERVAL = 5000

let lastIndex = 0

// 홈 부스 랭킹 모달과 동일한 바텀시트라서 이거 pr 이후에 공통으로 분리할 예정
const SHEET_STYLE = {
  position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
  width: '100%', maxWidth: 375, maxHeight: 'calc(100dvh - 40px)',
  overflowY: 'auto', overscrollBehavior: 'contain', boxSizing: 'border-box',
  borderRadius: '28px 28px 0 0', textAlign: 'left',
  padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
}

const Track = styled.div`
  position: relative;
  width: calc(100% + 32px);
  margin: 0 -16px;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  scroll-behavior: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`

// 배너 안에 놓이는 건 인디케이터 하나뿐이라, 시안 padding이 곧 인디케이터 위치가 된다.
// 350 + 14(인디케이터) + 11 = 375 / 61 + 12 + 7 = 80
const Slide = styled.button`
  flex: 0 0 100%;
  height: 80px;
  scroll-snap-align: start;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 61px 11px 7px 350px;
  border: 0;
  border-radius: 0;
  background-color: #a6a6a6;
  background-image: ${({ $image }) => ($image ? `url(${$image})` : 'none')};
  background-size: cover;
  background-position: center;
`

const Indicator = styled.span`
  position: absolute;
  right: 11px;
  bottom: 7px;
  color: #fff;
  font-size: 9px;
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;
`

export default function AdBanner() {
  const navigate = useNavigate()
  const location = useLocation()
  const [index, setIndex] = useState(lastIndex % BANNERS.length)
  const [openBoothId, setOpenBoothId] = useState(null)
  const [sheetTab, setSheetTab] = useState('info')
  const triggerRef = useRef(null)
  const trackRef = useRef(null)
  const isUserScrolling = useRef(false)

  const closeSheet = useCallback(() => {
    setOpenBoothId(null)
    triggerRef.current?.focus()
  }, [])

  // 현재 index로 스크롤 위치를 맞춘다 (자동 롤링 / 첫 진입 복원)
  const isFirstRender = useRef(true)

  useEffect(() => {
    lastIndex = index
    const track = trackRef.current
    if (!track || isUserScrolling.current) return

    track.scrollTo({
      left: track.clientWidth * index,
      behavior: isFirstRender.current ? 'auto' : 'smooth',
    })
    isFirstRender.current = false
  }, [index])

  // 사용자가 직접 넘긴 경우 index를 스크롤 위치에 맞춘다
  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    isUserScrolling.current = true
    const next = Math.round(track.scrollLeft / track.clientWidth)
    setIndex((current) => (next === current ? current : next))
    window.clearTimeout(trackRef.current._t)
    trackRef.current._t = window.setTimeout(() => {
      isUserScrolling.current = false
    }, 200)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      if (isUserScrolling.current) return
      setIndex((current) => (current + 1) % BANNERS.length)
    }, ROLLING_INTERVAL)

    return () => clearInterval(timer)
  }, [])

  if (BANNERS.length === 0) {
    return null
  }

  const handleClick = (banner) => (event) => {
    if (banner.href) {
      window.open(banner.href, '_blank', 'noopener,noreferrer')
      return
    }
    if (banner.boothId) {
      triggerRef.current = event.currentTarget
      setSheetTab('info')
      setOpenBoothId(banner.boothId)
      return
    }
    if (banner.to) {
      navigate(banner.to, {
        state: { from: `${location.pathname}${location.search}` },
      })
    }
  }

  return (
    <>
      <Track ref={trackRef} onScroll={handleScroll}>
        {BANNERS.map((banner) => (
          <Slide
            key={banner.id}
            type="button"
            $image={banner.image}
            aria-label={banner.title}
            aria-haspopup={banner.boothId ? 'dialog' : undefined}
            onClick={handleClick(banner)}
          />
        ))}
        <Indicator aria-hidden="true">
          {index + 1}/{BANNERS.length}
        </Indicator>
      </Track>

      {openBoothId != null && (
        <Modal open onClose={closeSheet} style={SHEET_STYLE}>
          <BoothDetailPanel
            boothId={openBoothId}
            onBack={closeSheet}
            sheetTab={sheetTab}
            setSheetTab={setSheetTab}
            selectedDate={getCurrentFestivalDate()}
          />
        </Modal>
      )}
    </>
  )
}