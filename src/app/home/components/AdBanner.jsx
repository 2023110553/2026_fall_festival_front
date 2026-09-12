import styled from 'styled-components'

const Wrapper = styled.div`
  height: 96px;
  margin: 12px 16px 0;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.textSub};
  font-size: 13px;
`

// 상단 광고 배너 — 일정 시간(예: 5초)마다 자동 롤링, 클릭 시 안내>협업 페이지로 이동 (기능명세서 Header 항목)
// 실제 롤링/데이터 연동은 배너 목록 API가 정해지면 채워 넣기
export default function AdBanner() {
  return <Wrapper>AdBanner placeholder</Wrapper>
}
