import { useState } from 'react'

// 등불 "달기" 작성 플로우 전용 훅 (LanternFlowPage, MyPage 공용).
// 등불 생성 자체(모달 상태, 3개 제한, 등불 객체 생성)만 책임지고,
// 1번째 등불이라 쿠폰 발급이 필요한 시점에는 쿠폰 로직을 구현하지 않고 onFirstLantern 콜백만 호출한다.
// 쿠폰 상태/로직은 각 페이지가 그대로 소유한다 (담당 아님).
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
    const created = {
      id: Date.now(),
      nickname: newLantern.nickname || '익명의 코끼리',
      message: newLantern.content,
      content: newLantern.content,
      createdAt: new Date().toISOString(),
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
