import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 48px 16px;
  text-align: center;
  color: ${({ theme }) => theme.color.textSub};
  font-size: 14px;
`

// "등불이 아직 없습니다.", "공지사항이 없습니다" 같은 빈 상태 문구를 매번 새로 만들지 않도록
export default function EmptyState({ children }) {
  return <Wrapper>{children}</Wrapper>
}
