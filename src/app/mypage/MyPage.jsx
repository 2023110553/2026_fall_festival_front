'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import MyLanternList from './components/lantern/MyLanternList'
import CreateLanternModal from './components/lantern/CreateLanternModal'
import MyCouponList from './components/coupon/MyCouponList'
import ConfirmLogoutModal from './components/lantern/ConfirmLogoutModal'
import LanternLimitModal from './components/lantern/LanternLimitModal'
import LanternSuccessModal from './components/lantern/LanternSuccessModal'

export default function MyPage() {
  const { user, logout } = useAuth()

  // --- 모달 상태 관리 ---
  const [isLanternModalOpen, setIsLanternModalOpen] = useState(false)   // 나의 등불 목록 모달
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)     // 등불 달기 작성 모달
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false)     // 1번째: 쿠폰 긁기 모달
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)   // 2,3번째: 성공 안내 모달
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false)       // 3개 초과 안내 모달
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)     // 로그아웃 확인 모달

  // 등불 목록 데이터 상태 (빈 배열로 시작)
  const [lanterns, setLanterns] = useState([])

  // 1. '+ 등불 달기' 버튼 클릭 시 (3개 제한 여부 판단)
  const handleOpenCreateModal = () => {
    if (lanterns.length >= 3) {
      // 3개 이상이면 제한 안내 팝업 노출
      setIsLimitModalOpen(true)
    } else {
      // 3개 미만이면 등불 달기 작성 폼 모달 노출
      setIsCreateModalOpen(true)
    }
  }

  // 2. '등불 달기' 작성 완료 제출 시 (1번째 vs 2,3번째 조건 분기)
  const handleCreateLantern = (newLantern) => {
    // 작성 직전 개수가 0개이면 1번째 등불로 판단
    const isFirstLantern = lanterns.length === 0

    const created = {
      id: Date.now(),
      nickname: newLantern.nickname || '익명의 코끼리',
      message: newLantern.content,
      content: newLantern.content,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    // 등불 목록에 새로 추가
    setLanterns((prev) => [...prev, created])

    // 모달 분기 노출
    if (isFirstLantern) {
      // [1번째 등불] ➔ 스크래치 쿠폰 모달 오픈
      setIsCouponModalOpen(true)
    } else {
      // [2번째, 3번째 등불] ➔ 성공 완료 안내 모달 오픈
      setIsSuccessModalOpen(true)
    }
  }

// 등불 삭제 처리
  const handleDeleteLantern = (id) => {
    setLanterns((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isDeleted: true } : item
      )
    );
  };

  // 4. 로그아웃 처리
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false)
    logout()
  }

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h2>{user?.nickname ?? '게스트'}님</h2>

      {/* 테스트 및 이동 버튼 영역 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={handleOpenCreateModal}
          style={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#111',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          + 등불 달기
        </button>

        <button
          onClick={() => setIsLanternModalOpen(true)}
          style={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#f59e0b',
            color: '#fff',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          나의 등불 ({lanterns.length}/3)
        </button>

        <button
          onClick={() => setIsCouponModalOpen(true)}
          style={{
            padding: '12px',
            borderRadius: '12px',
            backgroundColor: '#eee',
            color: '#333',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          나의 쿠폰
        </button>
      </div>

      {/* 로그아웃 버튼 */}
      <div>
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          style={{
            border: 'none',
            background: 'none',
            color: '#888',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          로그아웃
        </button>
      </div>

      {/* --- 연결된 모달 목록 --- */}

      {/* 등불 달기 작성 모달 */}
      <CreateLanternModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitSuccess={handleCreateLantern}
        currentCount={lanterns.length}
      />

      {/* 나의 등불 목록 모달 */}
      <MyLanternList
        isOpen={isLanternModalOpen}
        onClose={() => setIsLanternModalOpen(false)}
        lanterns={lanterns}
        onDelete={handleDeleteLantern}
      />

      {/* 1번째 등불 달기 완료 ➔ 쿠폰 모달 */}
      <MyCouponList
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        coupons={[]}
        onSelect={() => {}}
      />

      {/* 2,3번째 등불 달기 완료 ➔ 성공 안내 모달 */}
      <LanternSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      {/* 등불 3개 초과 시 제한 안내 모달 */}
      <LanternLimitModal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
      />

      {/* 로그아웃 확인 모달 */}
      <ConfirmLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  )
}