import styled from 'styled-components'

import Modal from '../../../../components/common/Modal'

const panelStyle = {
  position: 'relative',
  width: 'min(310px, 88vw)',
  background: '#FFF',
  borderRadius: '18px',
  padding: '36px 20px 20px',
}

const CloseIconButton = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`

const Title = styled.h2`
  margin: 0 0 16px;
  color: #000;
  font-size: 18px;
  font-weight: 600;
`

const TypeButton = styled.button`
  display: block;
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 8px;
  background: ${({ $urgent }) => ($urgent ? '#FFB2B2' : '#737373')};
  color: ${({ $urgent }) => ($urgent ? '#AD0000' : '#FFF')};
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-pretendard);
  & + & {
    margin-top: 12px;
  }
`

export default function NoticeTypeSelectModal({ isOpen, onClose, onSelect }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={panelStyle}>
      <CloseIconButton type="button" aria-label="닫기" onClick={onClose}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 1L9 9M9 1L1 9" stroke="#000" strokeLinecap="round" />
        </svg>
      </CloseIconButton>
      <Title>공지의 유형을 선택해주세요.</Title>
      <TypeButton type="button" onClick={() => onSelect('NORMAL')}>
        일반 공지
      </TypeButton>
      <TypeButton type="button" $urgent onClick={() => onSelect('URGENT')}>
        긴급 공지
      </TypeButton>
    </Modal>
  )
}
