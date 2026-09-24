import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from '../../../i18n/useTranslation'

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  padding: 0 12px 8px;
`

const Row = styled.div`
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
  font: inherit;

  /* 링크로 렌더되는 줄(순위가 있는 줄)만 누를 수 있는 모양 — 자리 표시용 빈 줄은 그냥 div다 */
  &:any-link {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid #dc7054;
    outline-offset: 2px;
  }

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
  opacity: 0.7;
  background: var(--aurora_orange, #DC7054);
  filter: blur(2px);
`

const ArrowBox = styled.span`
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  border: 0;
  padding: 0;
  background: transparent;
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

// 랭킹 한 줄이 가리키는 지도 주소. 구역(zoneId)을 알면 같이 실어 보낸다 —
// 구역 없이 보내도 MapProvider가 부스 목록을 받은 뒤 알아서 맞추지만, 그동안 기본 구역이 한 번
// 그려졌다가 바뀌는 깜빡임이 생긴다. 구역을 모르는 부스만 booth 하나로 보낸다.
function buildBoothMapPath(boothId, zoneId) {
  const params = new URLSearchParams()
  if (zoneId) params.set('zone', zoneId)
  params.set('booth', String(boothId))
  return `/map?${params}`
}

// 홈 "현재 인기" 카드 아래 부스 등불 랭킹(GET /api/booths/ranking/ 상위 3개).
//
// 2026-09-23: 부스를 누르면 홈에서 모달로 상세를 띄우던 것을 지도 이동으로 바꿨다(재원 결정).
// 부스는 지도 위의 장소라서, 상세만 보여주는 것보다 지도에서 그 부스로 데려다주는 편이 자연스럽다.
// 넘어간 지도에서는 MapProvider가 ?booth=를 읽어 상세 바텀시트를 바로 연다.
// (같은 홈의 AdBanner는 계속 모달로 상세를 띄운다 — 배너는 지도 위 위치보다 내용이 중요해서 그대로 뒀다.)
//
// <button> 대신 react-router <Link>(=<a href>)를 쓴 이유: 실제로 다른 페이지로 가는 동작이라
// 새 탭으로 열기·링크 주소 복사 같은 브라우저 기본 동작이 그대로 동작하는 게 맞다.
//
// props:
//   - ranking: 랭킹 배열(rank / booth_id / name / lantern_count)
//   - zoneIdByBoothId: 부스 id → 구역 id. HomePage가 부스 목록에서 만들어 내려준다(없으면 구역 없이 이동)
//   - isLoading / isError: 자리 표시용 빈 줄 3개를 보여줄지 결정
export default function BoothRanking({ ranking = [], zoneIdByBoothId, isLoading = false, isError = false }) {
  const { language, t } = useTranslation()

  const hasRanking = !isLoading && !isError && Array.isArray(ranking) && ranking.length > 0
  const emptyLabel = isLoading
    ? t('home.rankingLoading')
    : isError
      ? t('home.rankingError')
      : t('home.rankingEmpty')

  return (
    <Wrapper aria-label={t('home.rankingLabel')}>
      {!hasRanking ? Array.from({ length: 3 }, (_, index) => (
        <Row key={`empty-${index}`}>
          <NameGroup>
            <Rank aria-hidden="true">{String(index + 1).padStart(2, '0')}</Rank>
            <Name>{emptyLabel}</Name>
          </NameGroup>
          <CountGroup>
            <LanternDot aria-hidden="true" />
            <Count>-</Count>
            <ArrowBox $disabled aria-hidden="true">
              <ArrowRightIcon />
            </ArrowBox>
          </CountGroup>
        </Row>
      )) : ranking.map((booth) => (
        <Row
          as={Link}
          key={booth.booth_id}
          to={buildBoothMapPath(booth.booth_id, zoneIdByBoothId?.[booth.booth_id])}
          aria-label={t('home.rankingDetail', { rank: booth.rank, name: booth.name, count: booth.lantern_count })}
        >
          <NameGroup>
            <Rank aria-hidden="true">{String(booth.rank).padStart(2, '0')}</Rank>
            <Name>{booth.name}</Name>
          </NameGroup>
          <CountGroup>
            <LanternDot aria-hidden="true" />
            <Count aria-hidden="true">{t('home.lanternCount', { count: booth.lantern_count.toLocaleString(language === 'ko' ? 'ko-KR' : language) })}</Count>
            <ArrowBox aria-hidden="true">
              <ArrowRightIcon />
            </ArrowBox>
          </CountGroup>
        </Row>
      ))}
    </Wrapper>
  )
}
