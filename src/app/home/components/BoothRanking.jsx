import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import EmptyState from '../../../components/common/EmptyState'

// 부스별 등불 수 내림차순 랭킹. 0개 부스는 전부 동점 처리 (기능명세서 참고햇습니다!)

// TODO(API): 등불 랭킹 API 응답으로 교체
const RANKED_BOOTHS = [
  { id: 1, name: '멋쟁이사자처럼', lanternCount: 500 },
  { id: 2, name: '멋쟁이사자처럼', lanternCount: 500 },
  { id: 3, name: '멋쟁이사자처럼', lanternCount: 500 },
]

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  padding: 0 12px 8px;
`

const Row = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 0;
  border: 0;
  border-bottom: 1px solid #e4e4e4;
  background: transparent;
  text-align: left;

  &:last-child {
    border-bottom: 0;
  }
`

const NameGroup = styled.span`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`

const Rank = styled.span`
  flex: 0 0 auto;
  color: #dc7054;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
`

const Name = styled.span`
  min-width: 0;
  overflow: hidden;
  color: #000;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const CountGroup = styled.span`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 6px;
`

const Count = styled.span`
  color: #9f9c99;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`

const LanternDot = styled.span`
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  aspect-ratio: 1 / 1;
  border-radius: 99px;
  background: #dc7054;
  box-shadow: 0 0 4px 0 rgba(220, 112, 84, 0.6);
`

const ArrowBox = styled.span`
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  display: flex;
`

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.13387 2.62947C5.04805 2.71414 5 2.82788 5 2.94634C5 3.0648 5.04805 3.17854 5.13387 3.26321L9.91635 8L5.1354 12.7368C5.05005 12.8214 5.00228 12.9348 5.00228 13.0529C5.00228 13.171 5.05005 13.2844 5.1354 13.3691C5.17688 13.4105 5.22657 13.4434 5.28151 13.4659C5.33646 13.4884 5.39552 13.5 5.4552 13.5C5.51488 13.5 5.57395 13.4884 5.6289 13.4659C5.68384 13.4434 5.73353 13.4105 5.77501 13.3691L10.8612 8.3302C10.9502 8.24176 11 8.12331 11 8C11 7.87669 10.9502 7.75824 10.8612 7.6698L5.77347 2.63095C5.73199 2.58953 5.6823 2.55659 5.62736 2.53409C5.57242 2.51159 5.51335 2.5 5.45367 2.5C5.39399 2.5 5.33492 2.51159 5.27998 2.53409C5.22504 2.55659 5.17535 2.58953 5.13387 2.63095V2.62947Z"
        fill="#9F9C99"
      />
    </svg>
  )
}

export default function BoothRanking() {
  const navigate = useNavigate()

  if (RANKED_BOOTHS.length === 0) {
    return <EmptyState>아직 등불이 달린 부스가 없습니다.</EmptyState>
  }

  return (
    <Wrapper aria-label="부스 등불 랭킹">
      {RANKED_BOOTHS.map((booth, index) => (
        <Row
          key={booth.id}
          type="button"
          aria-label={`${index + 1}위 ${booth.name}, 등불 ${booth.lanternCount}개`}
          onClick={() => navigate('/map')}
        >
          <NameGroup>
            <Rank aria-hidden="true">{String(index + 1).padStart(2, '0')}</Rank>
            <Name>{booth.name}</Name>
          </NameGroup>
          <CountGroup>
            <LanternDot aria-hidden="true" />
            <Count aria-hidden="true">{booth.lanternCount}</Count>
            <ArrowBox>
              <ArrowRightIcon />
            </ArrowBox>
          </CountGroup>
        </Row>
      ))}
    </Wrapper>
  )
}
