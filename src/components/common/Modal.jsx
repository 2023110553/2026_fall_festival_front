import * as S from './Modal.styles'

// 등불 성공/실패, 삭제 확인, 쿠폰 안내 등 — 와이어프레임에 반복적으로 등장하는
// "가운데 뜨는 모달"의 공용 껍데기. 내용(children)만 각 도메인에서 채워 넣는다.
export default function Modal({ open, onClose, children }) {
  if (!open) return null
  return (
    <S.Overlay onClick={onClose}>
      <S.Panel onClick={(e) => e.stopPropagation()}>{children}</S.Panel>
    </S.Overlay>
  )
}
