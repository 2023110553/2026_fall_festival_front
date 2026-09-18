import styled from 'styled-components'

import Modal from '../../../../components/common/Modal'
import { LOST_FOUND_DATES } from './mockLostFound'

const panelStyle = {
  position: 'relative',
  width: 'min(310px, 88vw)',
  background: '#FFF',
  borderRadius: '18px',
  padding: '44px 20px 20px',
}

const CloseIconButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
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

const DateButton = styled.button`
  display: block;
  width: 100%;
  height: 60px;
  border: none;
  border-radius: 8px;
  background: #4A4A4A;
  color: #FFF;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'pretendard', sans-serif;

  & + & {
    margin-top: 12px;
  }
`

export default function LostFoundDateSelectModal({ isOpen, onClose, onSelect }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={panelStyle}>
      <CloseIconButton type="button" aria-label="닫기" onClick={onClose}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M1 1L9 9M9 1L1 9" stroke="#000" strokeLinecap="round" />
        </svg>
      </CloseIconButton>
      <Title>분실물 취득 날짜를 선택하세요.</Title>
      {LOST_FOUND_DATES.map((date) => (
        <DateButton key={date} type="button" onClick={() => onSelect(date)}>
          {date}
        </DateButton>
      ))}
    </Modal>
  )
}
