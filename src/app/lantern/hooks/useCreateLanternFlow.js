import { useState } from 'react'

// 등불 "달기" 작성 플로우 전용 훅 (LanternFlowPage, MyPage 공용).
// 등불 생성 자체(모달 상태, 3개 제한, 실제 등록 API 호출 + 에러 코드 분기)

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

  // onCreated(= LanternProvider의 addLantern)가 실제 등록 API를 호출한다.
  // 실패 시 CreateLanternModal이 인라인 에러로 보여줄 수 있게 { field, message }를 던진다.
  const handleCreateLantern = async (formData) => {
    const isFirstLantern = lanternCount === 0

    try {
      const created = await onCreated({
        boothId: formData.boothId,
        nickname: formData.nickname,
        message: formData.message,
      })

      setIsCreateModalOpen(false)

      if (isFirstLantern) {
        onFirstLantern?.(created)
      } else {
        setIsSuccessModalOpen(true)
      }
    } catch (err) {
      const code = err?.response?.data?.code
      const serverMessage = err?.response?.data?.message

      // 로컬 카운트와 서버 상태가 어긋난 경우(새로고침 없이 다른 탭에서 등록 등) — 제한 안내로 대체
      if (code === 'DAILY_LIMIT_EXCEEDED') {
        setIsCreateModalOpen(false)
        setIsLimitModalOpen(true)
        return
      }

      if (code === 'BOOTH_NOT_FOUND' || code === 'DUPLICATE_BOOTH_LANTERN') {
        throw { field: 'booth', code, message: serverMessage }
      }

      // FORBIDDEN_WORD_DETECTED, INVALID_REQUEST_PARAM 등은 한마디 입력 필드 에러로 표시
      throw { field: 'message', code, message: serverMessage }
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
