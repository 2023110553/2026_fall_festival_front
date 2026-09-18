'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import AlertModal from '../../components/common/AlertModal'

// 1. mypage 전용 컴포넌트 및 스타일
import ConfirmLogoutModal from './components/auth/ConfirmLogoutModal'
import * as S from './MyPage.styles'

// 2. app/lantern 공통 모달들, 등불 작성 플로우 훅, 전역 등불 리스트
import CreateLanternModal from '../lantern/components/CreateLanternModal'
import ScratchCouponModal from '../lantern/components/ScratchCouponModal'
import CouponResultModal from '../lantern/components/CouponResultModal'
import VerifyCodeModal from '../lantern/components/VerifyCodeModal'
import { useCreateLanternFlow } from '../lantern/hooks/useCreateLanternFlow'
import { useLanterns } from '../lantern/context/LanternProvider'

export default function MyPage() {
  const { user, logout } = useAuth()

  // 등불 리스트는 LanternProvider로 전역 공유 (나의 등불 목록 모달은 AppLayout에 항상 떠 있는 LanternFlowPage가 렌더링)
  const { lanterns, addLantern, requestLanternList } = useLanterns()

  // --- 모달 상태 관리 ---
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false) // 로그아웃 확인 모달
  const [isNoLanternModalOpen, setIsNoLanternModalOpen] = useState(false) // '나의 쿠폰' 클릭 시 등불 0개 안내 모달

  // 쿠폰 플로우 — null | 'scratch' | 'result' | 'verify'
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
    lanternCount: lanterns.length,
    onCreated: addLantern,
    onFirstLantern: (created) => {
      // [1번째 등불] ➔ 새 쿠폰 발급 + 스크래치 모달 오픈
      // TODO: 실제로는 서버가 등록 순서로 이미 확정한 당첨 결과를 응답에 포함해서 내려줌
      const isWin = Math.random() < 0.5
      setCoupon({
        id: created.id,
        status: 'unscratched',
        reward: isWin ? '야간부스 30%할인' : undefined,
        isWin,
      })
      setCouponFlow('scratch')
    },
  })

  // 스크래치 완료 시 화면 전환 — 당첨 결과는 쿠폰 발급 시점에 이미 확정되어 있으므로 여기선 상태만 전환
  const handleScratchReveal = () => {
    setCoupon((prev) => ({
      ...prev,
      status: prev.isWin ? 'win' : 'lose',
    }))
    setCouponFlow('result')
  }

  // 쿠폰 사용 코드 검증
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

  // TEMP: 당첨/꽝 스크래치 결과를 강제로 확인하기 위한 테스트용 — 확인 끝나면 제거
  const handleTestScratch = (isWin) => {
    setCoupon({
      id: Date.now(),
      status: 'unscratched',
      reward: isWin ? '야간부스 30%할인' : undefined,
      isWin,
    })
    setCouponFlow('scratch')
  }

  // '나의 쿠폰' 버튼 클릭 시
  const handleOpenCouponFlow = () => {
    if (lanterns.length === 0) {
      setIsNoLanternModalOpen(true)
      return
    }
    if (!coupon) return
    setCouponFlow(coupon.status === 'unscratched' ? 'scratch' : 'result')
  }

  // 로그아웃 처리
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false)
    logout()
  }

  return (
    <S.Container>
      <S.Title>{user?.nickname ?? '게스트'}님</S.Title>

      {/* 테스트 및 이동 버튼 영역 */}
      <S.ButtonGroup>
        <S.PrimaryButton onClick={openCreateModal}>
          + 등불 달기
        </S.PrimaryButton>

        <S.SecondaryButton onClick={requestLanternList}>
          나의 등불 ({lanterns.length}/3)
        </S.SecondaryButton>

        <S.DefaultButton onClick={handleOpenCouponFlow}>
          나의 쿠폰
        </S.DefaultButton>
      </S.ButtonGroup>

      {/* TEMP: 당첨/꽝 스크래치 테스터 — 확인 끝나면 제거 */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          type="button"
          onClick={() => handleTestScratch(true)}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px dashed #f59e0b', background: '#fff', color: '#f59e0b', cursor: 'pointer' }}
        >
          [테스트] 당첨 긁기
        </button>
        <button
          type="button"
          onClick={() => handleTestScratch(false)}
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px dashed #999', background: '#fff', color: '#999', cursor: 'pointer' }}
        >
          [테스트] 꽝 긁기
        </button>
      </div>

      {/* 로그아웃 버튼 */}
      <S.LogoutWrapper>
        <S.LogoutButton onClick={() => setIsLogoutModalOpen(true)}>
          로그아웃
        </S.LogoutButton>
      </S.LogoutWrapper>

      {/* --- 연결된 모달 목록 --- */}
      <CreateLanternModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmitSuccess={handleCreateLantern}
        currentCount={lanterns.length}
      />

      <ScratchCouponModal
        isOpen={couponFlow === 'scratch'}
        onClose={() => setCouponFlow(null)}
        onReveal={handleScratchReveal}
        coupon={coupon}
      />

      <CouponResultModal
        isOpen={couponFlow === 'result'}
        onClose={() => setCouponFlow(null)}
        coupon={coupon}
        onUseClick={() => setCouponFlow('verify')}
      />

      <VerifyCodeModal
        isOpen={couponFlow === 'verify'}
        onClose={() => setCouponFlow('result')}
        onSubmit={handleVerifyCode}
      />

      <AlertModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        title="등불 달기 성공!"
        subTitle="성공적으로 등불이 달렸습니다."
      />

      <AlertModal
        isOpen={isLimitModalOpen}
        onClose={closeLimitModal}
        title="등불 3개를 모두 달았어요"
        subTitle="등불은 하루에 3개씩만 달 수 있어요"
      />

      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      <AlertModal
        isOpen={isNoLanternModalOpen}
        onClose={() => setIsNoLanternModalOpen(false)}
        title="등불이 아직 없습니다"
        subTitle="첫 등불을 달고 스크래치 쿠폰을 받아보세요"
      />
    </S.Container>
  )
}
