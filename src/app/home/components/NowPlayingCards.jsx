import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import EmptyState from '../../../components/common/EmptyState'
import titleMarker from '../../../assets/top-header/title-marker.svg'

// TODO(API): thumbnail, progress 등 연결 나중에
const NOW_PLAYING = []

const SAMPLE_NOW_PLAYING = [
  { id: 1, name: '멋쟁이사자처럼', time: '07:00', progress: 0.38, thumbnail: null },
  { id: 2, name: '아티스트 이름', time: '07:40', progress: 0.2, thumbnail: null },
  { id: 3, name: '아티스트 이름', time: '08:20', progress: 0, thumbnail: null },
]

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

const MoreLink = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: #9f9c99;
  font-size: 12px;
  font-weight: 400;
`
const Scroller = styled.ul`
  display: flex;
  gap: 10px;
  margin: 0 -16px;
  padding: 0 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 16px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Card = styled.li`
  width: 254px;
  flex: 0 0 254px;
  overflow: hidden;
  border-radius: 12px;
  background: #484848;
  scroll-snap-align: start;
`

const CardButton = styled.button`
  width: 100%;
  display: block;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
`

const Thumbnail = styled.span`
  width: 254px;
  height: 191px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $src }) => ($src ? `url(${$src}) center / cover no-repeat` : '#a6a6a6')};
  color: #484848;
  font-size: 12px;
`

const CardInfo = styled.span`
  width: 254px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 14px;
  padding: 13px 10px 10px;
  background: #484848;
`

const InfoRow = styled.span`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const CardName = styled.span`
  min-width: 0;
  overflow: hidden;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const CardTime = styled.span`
  flex: 0 0 auto;
  color: #fff;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
`
// TODO 진행바 수정 필요 이것도 api 추후 연결
const ProgressTrack = styled.span`
  display: block;
  width: 234px;
  height: 3px;
  border-radius: 99px;
  background: #fff;
`

const ProgressFill = styled.span`
  display: block;
  height: 100%;
  width: ${({ $value }) => `${Math.min(Math.max($value, 0), 1) * 100}%`};
  border-radius: 99px;
  background: #a6a6a6;
`

export default function NowPlayingCards() {
  const navigate = useNavigate()

  return (
    <Wrapper>
      <Header>
        <TitleGroup>
          <MarkerBox>
            <Marker src={titleMarker} alt="" aria-hidden="true" />
          </MarkerBox>
          <Title>지금 공연 중</Title>
        </TitleGroup>
        <MoreLink type="button" onClick={() => navigate('/performance')}>
          전체 일정 보기
        </MoreLink>
      </Header>

      {NOW_PLAYING.length === 0 ? (
        <EmptyState>진행 중인 공연이 없어요.</EmptyState>
      ) : (
        <Scroller>
          {NOW_PLAYING.map((performance) => (
            <Card key={performance.id}>
              <CardButton
                type="button"
                aria-label={`${performance.name} ${performance.time}`}
                onClick={() => navigate('/performance')}
              >
                <Thumbnail $src={performance.thumbnail}>
                  {performance.thumbnail ? '' : '공연 사진'}
                </Thumbnail>
                <CardInfo>
                  <InfoRow>
                    <CardName>{performance.name}</CardName>
                    <CardTime>{performance.time}</CardTime>
                  </InfoRow>
                  <ProgressTrack>
                    <ProgressFill $value={performance.progress} />
                  </ProgressTrack>
                </CardInfo>
              </CardButton>
            </Card>
          ))}
        </Scroller>
      )}
    </Wrapper>
  )
}
