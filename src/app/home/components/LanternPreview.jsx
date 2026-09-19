import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

// 섹션 제목 앞 글로우 점 — blur가 10px 박스 밖으로 번지면서 빛나는 느낌을 낸다
const Marker = styled.span`
  width: 10px;
  height: 10px;
  flex: 0 0 10px;
  aspect-ratio: 1 / 1;
  border-radius: 99px;
  opacity: 0.7;
  /* aurora_orange */
  background: #dc7054;
  filter: blur(2.5px);
`

/* semi20 */
const Title = styled.h2`
  margin: 0;
  color: #000;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
`

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-radius: 12px;
  /* aurora_white */
  background: #fdfdfd;
  /* aurora_light */
  box-shadow:
    0 3px 6px 0 rgba(255, 161, 161, 0.25),
    0 -4px 6px 0 rgba(194, 255, 175, 0.25),
    0 0 6px 0 rgba(243, 246, 188, 0.75);
`

// TODO(3D): 지도 미리보기
const Preview = styled.button`
  width: 100%;
  height: 192px;
  display: flex;
  align-self: stretch;
  align-items: center;
  justify-content: center;
  padding: 0 81px;
  border: 0;
  border-radius: 12px 12px 0 0;
  background: #d9d9d9;
  color: #484848;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
`

export default function LanternPreview({ children }) {
  const navigate = useNavigate()

  return (
    <Wrapper>
      <Header>
        <Marker aria-hidden="true" />
        <Title>현재 인기</Title>
      </Header>

      <Card>
        <Preview type="button" aria-label="지도에서 등불 보기" onClick={() => navigate('/map')}>
          지도 미리보기
        </Preview>
        {children}
      </Card>
    </Wrapper>
  )
}
