import styled from 'styled-components'

export const modalStyle = {
  width: '225px',
  padding: '20px 0 14px 0',
  borderRadius: '12px',
  background: '#FFF',
  boxShadow: '0 0 9.074px 0 rgba(0, 0, 0, 0.10)'
}

export const Content = styled.div`
  text-align: center;
  padding: 2px 0;
`

export const Title = styled.h2`
  font-family: Pretendard;
  margin: 0;
  color: #000;
  font-size: 16px;
  font-weight: 600;
`

export const Description = styled.p`
  margin: 7px 0 0 0;
  font-family: Pretendard;
  color: #000;
  font-size: 12px;
  font-weight: 400;

`

export const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 7px;
  margin-top: 12px;
`

export const CloseButton = styled.button`
  width: 88px;
  padding: 9px;
  border: none;
  border-radius: 7.5px;
  background-color: #EEE;
  font-family: Pretendard;
  color: #5F5F5F;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`

export const DeleteButton = styled.button`
  width: 88px;
  padding: 9px;
  border: none;
  border-radius: 7.5px;
  background-color: #FFB2B2;
  font-family: Pretendard;
  color: #AD0000;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`
