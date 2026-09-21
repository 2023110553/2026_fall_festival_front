import styled from 'styled-components'

export const panelStyle = {
  width: 'min(310px, 88vw)',
  background: '#FFF',
  borderRadius: '18px',
  padding: '28px 20px 16px',
}

export const Title = styled.h2`
  margin: 0;
  color: #000;
  font-size: 22px;
  font-weight: 600;
  font-family: var(--font-pretendard);
`

export const Description = styled.p`
  margin: 8px 0 0;
  color: #000;
  font-size: 11px;
  font-family: var(--font-pretendard);
`

// 삭제 요청이 실패했을 때 모달을 닫지 않고 그 자리에 이유를 보여준다
export const ErrorMessage = styled.p`
  margin: 10px 0 0;
  color: #AD0000;
  font-size: 11px;
  font-family: var(--font-pretendard);
`
