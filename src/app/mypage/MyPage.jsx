'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import AlertModal from '../../components/common/AlertModal'

// 1. mypage 전용 컴포넌트 및 스타일
import MyLanternList from './components/lantern/MyLanternList'
import ConfirmLogoutModal from './components/auth/ConfirmLogoutModal'
import * as S from './MyPage.styles'

// 2. app/lantern 공통 모달들
import CreateLanternModal from '../lantern/components/CreateLanternModal'
import ScratchCouponModal from '../lantern/components/ScratchCouponModal'
import CouponResultModal from '../lantern/components/CouponResultModal'
import VerifyCodeModal from '../lantern/components/VerifyCodeModal'

export default function MyPage() {
  const { user, logout } = useAuth()

  // --- 모달 상태 관리 ---
  const [isLanternModalOpen, setIsLanternModalOpen] = useState(false) // 나의 등불 목록 모달
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false) // 등불 달기 작성 모달
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false) // 성공 안내 모달
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false) // 3개 초과 안내 모달
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false) // 로그아웃 확인 모달
  const [isNoLanternModalOpen, setIsNoLanternModalOpen] = useState(false) // 등불 0개 안내 모달

  // 쿠폰 플로우 — null | 'scratch' | 'result' | 'verify'
  const [couponFlow, setCouponFlow] = useState(null)
  const [coupon, setCoupon] = useState(null)

  // 등불 목록 데이터 상태
  const [lanterns, setLanterns] = useState([])

  // 1. '+ 등불 달기' 버튼 클릭 시
  const handleOpenCreateModal = () => {
    if (lanterns.length >= 3) {
      setIsLimitModalOpen(true)
    } else {
      setIsCreateModalOpen(true)
    }
  }

  // 2. '나의 등불' 버튼 클릭 시
  const handleOpenLanternList = () => {
    if (lanterns.length === 0) {
      setIsNoLanternModalOpen(true)
    } else {
      setIsLanternModalOpen(true)
    }
  }

  // 3. '등불 달기' 작성 완료 제출 시
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

    if (isFirstLantern) {
      setCoupon({ id: created.id, status: 'unscratched' })
      setCouponFlow('scratch')
    } else {
      setIsSuccessModalOpen(true)
    }
  }

  // 스크래치 완료 시
  const handleScratchReveal = () => {
    setCoupon((prev) => {
      const isWin = Math.random() < 0.5
      return {
        ...prev,
        status: isWin ? 'win' : 'lose',
        reward: isWin ? '야간부스 30%할인' : undefined,
      }
    })
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

  // '나의 쿠폰' 버튼 클릭 시
  const handleOpenCouponFlow = () => {
    if (lanterns.length === 0) {
      setIsNoLanternModalOpen(true)
      return
    }
    if (!coupon) return
    setCouponFlow(coupon.status === 'unscratched' ? 'scratch' : 'result')
  }

  // 등불 삭제 처리
  const handleDeleteLantern = (id) => {
    setLanterns((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isDeleted: true } : item
      )
    )
  }

  useEffect(() => {
    const savedLanterns = localStorage.getItem('my_lanterns')
    if (savedLanterns) {
      setLanterns(JSON.parse(savedLanterns))
    }
  }, [])

  // 등불 수정 처리
  const handleEditLantern = (id, newContent) => {
    setLanterns((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, message: newContent, content: newContent } : item
      )
    )
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
        <S.PrimaryButton onClick={handleOpenCreateModal}>
          + 등불 달기
        </S.PrimaryButton>

        <S.SecondaryButton onClick={handleOpenLanternList}>
          나의 등불 ({lanterns.length}/3)
        </S.SecondaryButton>

        <S.DefaultButton onClick={handleOpenCouponFlow}>
          나의 쿠폰
        </S.DefaultButton>
      </S.ButtonGroup>

      {/* 로그아웃 버튼 */}
      <S.LogoutWrapper>
        <S.LogoutButton onClick={() => setIsLogoutModalOpen(true)}>
          로그아웃
        </S.LogoutButton>
      </S.LogoutWrapper>

      {/* --- 연결된 모달 목록 --- */}
      <CreateLanternModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleCreateLantern}
        currentCount={lanterns.length}
      />

      <MyLanternList
        isOpen={isLanternModalOpen}
        onClose={() => setIsLanternModalOpen(false)}
        lanterns={lanterns}
        onDelete={handleDeleteLantern}
        onEdit={handleEditLantern}
      />

      <ScratchCouponModal
        isOpen={couponFlow === 'scratch'}
        onClose={() => setCouponFlow(null)}
        onReveal={handleScratchReveal}
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
        onClose={() => setIsSuccessModalOpen(false)}
        title="등불 달기 성공!"
        subTitle="성공적으로 등불이 달렸습니다."
      />

      <AlertModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
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