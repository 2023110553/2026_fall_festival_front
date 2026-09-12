import { useState, useCallback } from 'react'

// 여러 도메인에서 반복되는 "모달 열림/닫힘" 상태를 매번 useState로 새로 만들지 않도록 하는 공용 훅
export function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  return { isOpen, open, close, toggle }
}
