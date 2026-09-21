'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useCreateLanternFlow } from './hooks/useCreateLanternFlow'
import { useLanterns } from './context/LanternProvider'
import { getTodayLanternCount, getTodayUsedBoothIds, getCurrentFestivalDate } from './utils/getCurrentFestivalDate'
import { revealCoupon, markCouponUsed } from './utils/couponRules'

// app/lantern/components/ 모달 import
import CreateLanternModal from './components/CreateLanternModal'
import ScratchCouponModal from './components/ScratchCouponModal'
import CouponResultModal from './components/CouponResultModal'
import EmptyCouponModal from './components/EmptyCouponModal'
import VerifyCodeModal from './components/VerifyCodeModal'
import MyLanternList from '../mypage/components/lantern/MyLanternList'

import LoginModal from '../auth/LoginModal'
import AlertModal from '../../components/common/AlertModal'

export default function LanternFlowPage() {
  const { isLoggedIn } = useAuth()

  // --- 상태 관리 --- (등불 리스트는 LanternProvider로 전역 공유 — MyPage 등 다른 화면과 같은 목록을 본다)
  const { lanterns, addLantern, deleteLantern, editLantern, registerTriggers, activeBooth, coupon, setCoupon } = useLanterns()
  const todayLanternCount = getTodayLanternCount(lanterns) // 3개 제한은 전체 누적이 아니라 오늘(축제일) 기준
  const usedBoothIds = getTodayUsedBoothIds(lanterns) // 오늘 이미 등불을 단 부스 — 드롭다운 재선택 방지

  // 쿠폰 플로우: null | 'scratch' | 'result' | 'verify'
  const [couponFlow, setCouponFlow] = useState(null)
  const [isNewCoupon, setIsNewCoupon] = useState(false)
  const [isNoCouponModalOpen, setIsNoCouponModalOpen] = useState(false)

  const {
    isCreateModalOpen,
    closeCreateModal,
    openCreateModal,
    isLimitModalOpen,
    closeLimitModal,
    isSuccessModalOpen,
    closeSuccessModal,
    handleCreateLantern,
  } = useCreateLanternFlow({
    lanternCount: todayLanternCount,
    onCreated: addLantern,
    onFirstLantern: (created) => {
      // 1번째 등불: 스크래치 복권 생성 및 모달 오픈
      // 서버 연동 전 목업 결과를 미리 정해 긁는 중과 결과 모달의 내용을 일치시킨다.
      const isWin = Math.random() < 0.5
      setCoupon({
        id: created.id,
        status: 'unscratched',
        isWin,
        reward: isWin ? '야간부스 30% 할인' : undefined,
        usageDescription: isWin ? '사과대 광홍 부스에서 사용 가능' : undefined,
      })
      setIsNewCoupon(true)
      setCouponFlow('scratch')
    },
  })

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  // null | 'past' | 'future' — 지도에서 오늘이 아닌 날짜의 부스를 보다가 등불 달기를 누른 경우
  const [wrongDateVariant, setWrongDateVariant] = useState(null)

  // 카카오 로그인은 페이지를 완전히 떠났다 돌아오는 리다이렉트 방식이라 리액트 state로는
  // "등불 달기 하려던 중이었다"는 걸 못 들고 다닌다 — URL 쿼리에 표시해뒀다가 로그인 완료 후 확인한다.
  const OPEN_LANTERN_PARAM = 'openLantern'

  const clearOpenLanternParam = () => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has(OPEN_LANTERN_PARAM)) return
    params.delete(OPEN_LANTERN_PARAM)
    const query = params.toString()
    window.history.replaceState(null, '', window.location.pathname + (query ? `?${query}` : '') + window.location.hash)
  }

  // 로그인 완료 후 돌아왔을 때, 등불 달기 하려다 로그인하러 간 거였으면 바로 작성 모달을 띄운다
  useEffect(() => {
    if (!isLoggedIn) return
    if (!new URLSearchParams(window.location.search).has(OPEN_LANTERN_PARAM)) return
    clearOpenLanternParam()
    openCreateModal()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  // BottomNav('+' 버튼)가 호출할 오픈 함수 — 로그인 여부 확인 후 등불 작성 모달(또는 제한 모달) 오픈
  const handleOpenCreateFlow = () => {
    if (!isLoggedIn) {
      const params = new URLSearchParams(window.location.search)
      params.set(OPEN_LANTERN_PARAM, '1')
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}${window.location.hash}`)
      setIsLoginModalOpen(true)
      return
    }

    // 당일 부스에만 등불을 달 수 있음 — 전날/다음날 부스면 문구를 다르게 안내
    if (activeBooth?.festivalDate && activeBooth.festivalDate !== getCurrentFestivalDate()) {
      setWrongDateVariant(activeBooth.festivalDate < getCurrentFestivalDate() ? 'past' : 'future')
      return
    }

    openCreateModal()
  }

  // 프로필 메뉴(TopHeader) / 마이페이지 버튼이 호출할 오픈 함수 — '나의 등불' 목록(또는 0개 안내) 오픈
  const [isLanternListOpen, setIsLanternListOpen] = useState(false)
  const [isNoLanternModalOpen, setIsNoLanternModalOpen] = useState(false)
  const handleOpenListFlow = () => {
    if (lanterns.length === 0) {
      setIsNoLanternModalOpen(true)
    } else {
      setIsLanternListOpen(true)
    }
  }

  const handleOpenCouponFlow = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    if (!coupon) {
      setIsNoCouponModalOpen(true)
      return
    }
    setIsNewCoupon(false)
    setCouponFlow(coupon.status === 'unscratched' ? 'scratch' : 'result')
  }

  // 메뉴 동작을 LanternProvider(Context)에 등록 — BottomNav/TopHeader는 형제 컴포넌트라
  // 이 페이지의 로컬 상태를 직접 못 건드리므로, window 커스텀 이벤트 대신 이 등록 방식으로 연결한다.
  useEffect(() => {
    registerTriggers({
      openCreateModal: handleOpenCreateFlow,
      openLanternList: handleOpenListFlow,
      openCoupon: handleOpenCouponFlow,
    })
  })

  // 스크래치 완료 핸들러
  const handleScratchReveal = () => {
    if (coupon?.status !== 'unscratched') return
    setCoupon(revealCoupon(coupon))
    setCouponFlow('result')
  }

  // 3. 현장 코드 검증 핸들러
  const handleVerifyCode = (code) =>
    new Promise((resolve, reject) => {
      if (coupon?.status !== 'win') {
        reject(new Error('사용할 수 없는 쿠폰이에요.'))
      } else if (code.trim() === '1234') {
        setCoupon(markCouponUsed(coupon))
        setCouponFlow('result')
        resolve()
      } else {
        reject()
      }
    })

  return (
    <>
      {/* --- 모달 랜더링 영역 --- */}
      <LoginModal
        open={isLoginModalOpen}
        onClose={() => {
          clearOpenLanternParam()
          setIsLoginModalOpen(false)
        }}
      />
      {/* 1. 등불 작성 모달 */}
      <CreateLanternModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmitSuccess={handleCreateLantern}
        currentCount={todayLanternCount}
        usedBoothIds={usedBoothIds}
        presetBoothId={activeBooth?.boothId ?? null}
      />

      {/* 2. 첫 등불 스크래치 복권 모달 */}
      <ScratchCouponModal
        isOpen={couponFlow === 'scratch'}
        onClose={() => setCouponFlow(null)}
        onReveal={handleScratchReveal}
        coupon={coupon}
        isNewCoupon={isNewCoupon}
      />

      {/* 3. 쿠폰 결과/당첨 모달 */}
      <CouponResultModal
        isOpen={couponFlow === 'result'}
        onClose={() => setCouponFlow(null)}
        coupon={coupon}
        onUseClick={() => setCouponFlow('verify')}
      />

      {/* 4. 현장 사용 코드 입력 모달 */}
      <VerifyCodeModal
        isOpen={couponFlow === 'verify'}
        onClose={() => setCouponFlow('result')}
        onSubmit={handleVerifyCode}
      />

      {/* 5. 2,3번째 등불 작성 성공 안내 모달 */}
      <AlertModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        title="등불 달기 성공!"
        subTitle="성공적으로 등불이 달렸습니다."
      />

      {/* 6. 3개 초과 작성 제한 안내 모달 */}
      <AlertModal
        isOpen={isLimitModalOpen}
        onClose={closeLimitModal}
        title="등불 3개를 모두 달았어요"
        subTitle="등불은 하루에 3개씩만 달 수 있어요"
      />

      {/* 7. 나의 등불 목록 모달 — 프로필 메뉴/마이페이지 등 어디서든 전역 이벤트로 오픈 */}
      <MyLanternList
        isOpen={isLanternListOpen}
        onClose={() => setIsLanternListOpen(false)}
        lanterns={lanterns}
        onDelete={deleteLantern}
        onEdit={editLantern}
      />

      {/* 쿠폰 미발급 안내 모달 */}
      <EmptyCouponModal
        isOpen={isNoCouponModalOpen}
        onClose={() => setIsNoCouponModalOpen(false)}
      />

      {/* 8. 등불 0개 안내 모달 */}
      <AlertModal
        isOpen={isNoLanternModalOpen}
        onClose={() => setIsNoLanternModalOpen(false)}
        title="등불이 아직 없습니다"
        subTitle="첫 등불을 달고 스크래치 쿠폰을 받아보세요"
      />

      {/* 9. 오늘이 아닌 날짜의 부스에서 등불 달기를 시도한 경우 안내 */}
      <AlertModal
        isOpen={wrongDateVariant !== null}
        onClose={() => setWrongDateVariant(null)}
        title={wrongDateVariant === 'past' ? '지난 날에는 등불을 달 수 없어요.' : '내일 등불은 아직 달 수 없어요.'}
        subTitle="상단의 날짜 선택을 변경해주세요."
      />
    </>
  )
}
