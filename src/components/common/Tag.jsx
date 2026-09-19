import styled from 'styled-components'

// 긴급공지/일반공지, 카테고리 필터 등에 쓰는 작은 라벨
const StyledTag = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-height: ${({ $size }) => ($size === 'detail' ? '26px' : '18px')};
  padding: ${({ $size }) => ($size === 'detail' ? '6px 8px' : '4px 6px')};
  border-radius: 4px;
  background: ${({ $tone }) => ($tone === 'danger' ? '#dc7054' : '#737373')};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  color: #fdfdfd;
  font-size: ${({ $size }) => ($size === 'detail' ? '12px' : '10px')};
  font-weight: 500;
  line-height: 1;
`

export default function Tag({ children, tone = 'default', size = 'list' }) {
  return <StyledTag $tone={tone} $size={size}>{children}</StyledTag>
}
