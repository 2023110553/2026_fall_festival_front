import styled from 'styled-components'

const Wrapper = styled.section`
  margin: 16px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface};
`

// "등불 밝히기 — 전체 등불 n개" + 지도 미리보기(천막 밝아진 모습 위주) — 탭하면 지도&등불보기 페이지로 이동
export default function LanternPreview() {
  return <Wrapper>LanternPreview placeholder (전체 등불 수 + 지도 미리보기)</Wrapper>
}
