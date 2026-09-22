import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from '../../../i18n/useTranslation'
import { DEFAULT_PREVIEW_ZONE_ID, ZONE_PREVIEW_IMAGES } from '../assets/zone-preview'

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

// 지도 미리보기 — 등불이 가장 많은 구역의 3D 씬 캡처. 누르면 지도의 해당 구역으로 이동.
const Preview = styled.button`
  position: relative;
  width: 100%;
  height: 192px;
  display: block;
  align-self: stretch;
  padding: 0;
  border: 0;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  background: #1a1a1a;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #dc7054;
    outline-offset: 2px;
  }
`

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  /* 불러오는 동안은 기본 구역 이미지를 살짝 눌러서 "확정 전"임을 표시 */
  opacity: ${({ $dimmed }) => ($dimmed ? 0.55 : 1)};
  transition: opacity 0.2s ease;
`

// 이미지 하단 그라데이션 캡션 — 어떤 구역인지 + 등불 개수
const Caption = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 28px 14px 12px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.72) 100%);
  text-align: left;
`

/* regular11 */
const Eyebrow = styled.span`
  color: rgba(253, 253, 253, 0.85);
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
`

/* semi16 */
const ZoneName = styled.span`
  display: flex;
  align-items: baseline;
  gap: 8px;
  color: #fdfdfd;
  font-size: 16px;
  font-weight: 600;
  line-height: normal;
`

const LanternCount = styled.span`
  color: #ffd27d;
  font-size: 13px;
  font-weight: 500;
`

// props(zoneId/lanternCount/isLoading/isError)는 HomePage가 GET /api/booths/를 구역별로 합산해서 내려준다.
// zoneId가 없으면(전 구역 0개, 로딩 중, 조회 실패) 기본 구역(DEFAULT_PREVIEW_ZONE_ID) 이미지를 쓴다.
export default function LanternPreview({
  zoneId,
  lanternCount,
  isLoading = false,
  isError = false,
  children,
}) {
  const navigate = useNavigate()
  const { language, t } = useTranslation()

  const displayZoneId = zoneId && ZONE_PREVIEW_IMAGES[zoneId] ? zoneId : DEFAULT_PREVIEW_ZONE_ID
  const zoneLabel = t(`map.zone.${displayZoneId}`)
  const hasCount = !isLoading && !isError && Number.isFinite(lanternCount) && lanternCount > 0
  const countLabel = hasCount
    ? t('home.lanternCount', { count: lanternCount.toLocaleString(language === 'ko' ? 'ko-KR' : language) })
    : null

  return (
    <Wrapper>
      <Header>
        <Marker aria-hidden="true" />
        <Title>{t('home.popularNow')}</Title>
      </Header>

      <Card>
        <Preview
          type="button"
          aria-label={t('home.previewAria', { zone: zoneLabel })}
          onClick={() => navigate(`/map?zone=${displayZoneId}`)}
        >
          <PreviewImage
            src={ZONE_PREVIEW_IMAGES[displayZoneId]}
            alt=""
            $dimmed={isLoading}
            loading="lazy"
            decoding="async"
          />
          <Caption aria-hidden="true">
            <Eyebrow>{isLoading ? t('home.previewLoading') : t('home.previewEyebrow')}</Eyebrow>
            <ZoneName>
              {zoneLabel}
              {countLabel && <LanternCount>{countLabel}</LanternCount>}
            </ZoneName>
          </Caption>
        </Preview>
        {children}
      </Card>
    </Wrapper>
  )
}
