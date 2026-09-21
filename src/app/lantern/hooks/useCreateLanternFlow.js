import { useState } from 'react'
import { getCurrentFestivalDate } from '../utils/getCurrentFestivalDate'

// 등불 "달기" 작성 플로우 전용 훅 (LanternFlowPage, MyPage 공용).
// 등불 생성 자체(모달 상태, 3개 제한, 등불 객체 생성)

export function useCreateLanternFlow({ lanternCount, onCreated, onFirstLantern }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const openCreateModal = () => {
    if (lanternCount >= 3) {
      setIsLimitModalOpen(true)
    } else {
      setIsCreateModalOpen(true)
    }
  }

  const handleCreateLantern = (newLantern) => {
    const isFirstLantern = lanternCount === 0
    const now = new Date()
    const created = {
      id: Date.now(),
      boothName: newLantern.boothName,
      // nickname은 빈 값 그대로 저장 — '익명의 코끼리'는 표시 전용 fallback (LanternCard 등에서 처리)
      nickname: newLantern.nickname,
      message: newLantern.content,
      content: newLantern.content,
      createdAt: now.toISOString(),
      festivalDate: getCurrentFestivalDate(), // 'YYYY-MM-DD' — 나의 등불 DAY 필터 기준
    }

    onCreated(created)
    setIsCreateModalOpen(false)

    if (isFirstLantern) {
      onFirstLantern?.(created)
    } else {
      setIsSuccessModalOpen(true)
    }
  }

  return {
    isCreateModalOpen,
    closeCreateModal: () => setIsCreateModalOpen(false),
    openCreateModal,
    isLimitModalOpen,
    closeLimitModal: () => setIsLimitModalOpen(false),
    isSuccessModalOpen,
    closeSuccessModal: () => setIsSuccessModalOpen(false),
    handleCreateLantern,
  }
}
