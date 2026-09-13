import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import titleMarker from '../../../assets/top-header/title-marker.svg'

// TODO(API): 전체 등불 수 추후에 등불 집계 API로 교체 필요함
const TOTAL_LANTERN_COUNT = 100

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const MarkerBox = styled.span`
  position: relative;
  width: 10px;
  height: 10px;
  flex: 0 0 10px;
`

const Marker = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
`

const Title = styled.h2`
  margin: 0;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
`

const Total = styled.span`
  color: #9f9c99;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`

const Card = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 14px 0 rgba(243, 246, 188, 0.75);
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
        <TitleGroup>
          <MarkerBox>
            <Marker src={titleMarker} alt="" aria-hidden="true" />
          </MarkerBox>
          <Title>등불 밝히기</Title>
        </TitleGroup>
        <Total>전체 등불 {TOTAL_LANTERN_COUNT}개</Total>
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
