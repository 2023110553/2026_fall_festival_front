import styled from 'styled-components'

// 긴급공지/일반공지, 카테고리 필터 등에 쓰는 작은 라벨
const StyledTag = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ theme, $tone }) => ($tone === 'danger' ? theme.color.danger : theme.color.surface)};
  color: ${({ theme, $tone }) => ($tone === 'danger' ? '#fff' : theme.color.textSub)};
`

export default function Tag({ children, tone = 'default' }) {
  return <StyledTag $tone={tone}>{children}</StyledTag>
}
