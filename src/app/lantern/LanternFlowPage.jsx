'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

// app/lantern/components/ 모달 import
import CreateLanternModal from './components/CreateLanternModal'
import ScratchCouponModal from './components/ScratchCouponModal'
import CouponResultModal from './components/CouponResultModal'
import VerifyCodeModal from './components/VerifyCodeModal'

import LoginModal from '../auth/LoginModal'
import AlertModal from '../../components/common/AlertModal'

export default function LanternFlowPage() {
  const { isLoggedIn } = useAuth()

  // --- 상태 관리 ---
  const [lanterns, setLanterns] = useState([]) // 작성된 등불 리스트
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  // 쿠폰 플로우: null | 'scratch' | 'result' | 'verify'
  const [couponFlow, setCouponFlow] = useState(null)
  const [coupon, setCoupon] = useState(null)

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  // BottomNav 등 전역 이벤트(openLanternModal) 수신 및 모달 오픈 처리
  useEffect(() => {
    const handleOpen = () => {
      // -------------------------------------------------------------
      // [개발용 로그인 우회]
      // 실제 로그인 연동 시 아래 주석을 해제하고 로그인 모달을 띄워줍니다.
      if (!isLoggedIn) {
        setIsLoginModalOpen(true)
        return
      }
      // -------------------------------------------------------------

      // 등불 작성 개수 제한 분기 (3개 이상 시 제한 모달)
      if (lanterns.length >= 3) {
        setIsLimitModalOpen(true)
      } else {
        setIsCreateModalOpen(true)
      }
    }

    window.addEventListener('openLanternModal', handleOpen)
    return () => window.removeEventListener('openLanternModal', handleOpen)
  }, [lanterns.length, isLoggedIn])

  // 1. 등불 작성 완료 핸들러 (1번째 vs 2,3번째 분기)
  const handleCreateLantern = (newLantern) => {
    const isFirstLantern = lanterns.length === 0
    const created = {
      id: Date.now(),
      nickname: newLantern.nickname || '익명의 코끼리',
      message: newLantern.content,
      content: newLantern.content,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setLanterns((prev) => [...prev, created])
    setIsCreateModalOpen(false) // 작성 모달 닫기

    if (isFirstLantern) {
      // 1번째 등불: 스크래치 복권 생성 및 모달 오픈
      setCoupon({ id: created.id, status: 'unscratched' })
      setCouponFlow('scratch')
    } else {
      // 2, 3번째 등불: 성공 안내 모달 오픈
      setIsSuccessModalOpen(true)
    }
  }

  // 2. 스크래치 완료 핸들러
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
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleCreateLantern}
        currentCount={lanterns.length}
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
        onClose={() => setIsSuccessModalOpen(false)}
        title="등불 달기 성공!"
        subTitle="성공적으로 등불이 달렸습니다."
      />

      {/* 6. 3개 초과 작성 제한 안내 모달 */}
      <AlertModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        title="등불 3개를 모두 달았어요"
        subTitle="등불은 하루에 3개씩만 달 수 있어요"
      />
    </>
  )
}