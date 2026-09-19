'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useCreateLanternFlow } from './hooks/useCreateLanternFlow'
import { useLanterns } from './context/LanternProvider'
import { getTodayLanternCount } from './utils/getCurrentFestivalDate'

// app/lantern/components/ 모달 import
import CreateLanternModal from './components/CreateLanternModal'
import ScratchCouponModal from './components/ScratchCouponModal'
import CouponResultModal from './components/CouponResultModal'
import VerifyCodeModal from './components/VerifyCodeModal'
import MyLanternList from '../mypage/components/lantern/MyLanternList'

import LoginModal from '../auth/LoginModal'
import AlertModal from '../../components/common/AlertModal'

export default function LanternFlowPage() {
  const { isLoggedIn } = useAuth()

  // --- 상태 관리 --- (등불 리스트는 LanternProvider로 전역 공유 — MyPage 등 다른 화면과 같은 목록을 본다)
  const { lanterns, addLantern, deleteLantern, editLantern, registerTriggers } = useLanterns()
  const todayLanternCount = getTodayLanternCount(lanterns) // 3개 제한은 전체 누적이 아니라 오늘(축제일) 기준

  // 쿠폰 플로우: null | 'scratch' | 'result' | 'verify'
  const [couponFlow, setCouponFlow] = useState(null)
  const [coupon, setCoupon] = useState(null)

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
      setCoupon({ id: created.id, status: 'unscratched' })
      setCouponFlow('scratch')
    },
  })

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // BottomNav('+' 버튼)가 호출할 오픈 함수 — 로그인 여부 확인 후 등불 작성 모달(또는 제한 모달) 오픈
  const handleOpenCreateFlow = () => {
    // -------------------------------------------------------------
    // [개발용 로그인 우회]
    // 실제 로그인 연동 시 아래 주석을 해제하고 로그인 모달을 띄워줍니다.
    if (!isLoggedIn) {
      setIsLoginModalOpen(true)
      return
    }
    // -------------------------------------------------------------

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

  // 위 두 함수를 LanternProvider(Context)에 등록 — BottomNav/TopHeader는 형제 컴포넌트라
  // 이 페이지의 로컬 상태를 직접 못 건드리므로, window 커스텀 이벤트 대신 이 등록 방식으로 연결한다.
  useEffect(() => {
    registerTriggers({
      openCreateModal: handleOpenCreateFlow,
      openLanternList: handleOpenListFlow,
    })
  })

  // 스크래치 완료 핸들러
  const handleScratchReveal = () => {
    setCoupon((prev) => ({
      ...prev,
      status: 'win',
      reward: '야간부스 30% 할인',
    }))
    setCouponFlow('result')
  }

  // 3. 현장 코드 검증 핸들러
  const handleVerifyCode = (code) =>
    new Promise((resolve, reject) => {
      if (code === '1234') {
        setCoupon((prev) => ({ ...prev, status: 'used' }))
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
        onClose={() => setIsLoginModalOpen(false)}
      />
      {/* 1. 등불 작성 모달 */}
      <CreateLanternModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmitSuccess={handleCreateLantern}
        currentCount={todayLanternCount}
      />

      {/* 2. 첫 등불 스크래치 복권 모달 */}
      <ScratchCouponModal
        isOpen={couponFlow === 'scratch'}
        onClose={() => setCouponFlow(null)}
        onReveal={handleScratchReveal}
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

      {/* 8. 등불 0개 안내 모달 */}
      <AlertModal
        isOpen={isNoLanternModalOpen}
        onClose={() => setIsNoLanternModalOpen(false)}
        title="등불이 아직 없습니다"
        subTitle="첫 등불을 달고 스크래치 쿠폰을 받아보세요"
      />
    </>
  )
}