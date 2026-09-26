import * as S from './Modal.styles'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

// 동시에 열려있는 모달 개수를 센다 — 모달 여러 개가 겹쳐서 동시에 닫힐 때
// 각자 "열기 전 값"을 저장/복원하면 순서에 따라 scroll lock이 풀리지 않는 문제가 있어서
// (안쪽 모달이 저장한 "이전 값"이 이미 바깥 모달이 hidden으로 바꿔둔 값일 수 있음),
// 전역 카운터로 마지막 하나가 닫힐 때만 풀어주는 방식으로 처리한다.
let openModalCount = 0

// 등불 성공/실패, 삭제 확인, 쿠폰 안내 등 — 와이어프레임에 반복적으로 등장하는
// "가운데 뜨는 모달"의 공용 껍데기. 내용(children)만 각 도메인에서 채워 넣는다.
export default function Modal({ open, isOpen, onClose, children, style = {}, portal = false }) {
  const isModalOpen = open ?? isOpen ?? false

  // 모달이 열려있을 때 배경 페이지 스크롤 방지
  useEffect(() => {
    if (!isModalOpen) return undefined

    const closeWithEscape = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    openModalCount += 1
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', closeWithEscape)

    return () => {
      openModalCount = Math.max(0, openModalCount - 1)
      if (openModalCount === 0) document.body.style.overflow = ''
      document.removeEventListener('keydown', closeWithEscape)
    }
  }, [isModalOpen, onClose])

  if (!isModalOpen) return null

  const modal = (
    <S.Overlay onClick={onClose}>
      <S.Panel role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()} style={style}>
        {children}
      </S.Panel>
    </S.Overlay>
  )

  return portal ? createPortal(modal, document.body) : modal
}
