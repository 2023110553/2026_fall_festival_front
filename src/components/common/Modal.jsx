import * as S from './Modal.styles'
import { useEffect } from 'react'

// 등불 성공/실패, 삭제 확인, 쿠폰 안내 등 — 와이어프레임에 반복적으로 등장하는
// "가운데 뜨는 모달"의 공용 껍데기. 내용(children)만 각 도메인에서 채워 넣는다.
export default function Modal({ open, isOpen, onClose, children, style = {} }) {
  const isModalOpen = open ?? isOpen ?? false

  // 모달이 열려있을 때 배경 페이지 스크롤 방지
  useEffect(() => {
    if (!isModalOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const closeWithEscape = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeWithEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [isModalOpen, onClose])

  if (!isModalOpen) return null

  return (
    <S.Overlay onClick={onClose}>
      <S.Panel role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={style}>
        {children}
      </S.Panel>
    </S.Overlay>
  )
}
