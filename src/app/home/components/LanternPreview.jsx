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

// 사진 위에 덮는 그라데이션 — 2026-09-23 디자인(개발화면_와프).
// 피그마 정지점: 0% #666666(불투명도 0%) → 100% #1D1D1D(불투명도 90%).
// 색이 바뀌는 그라데이션이 아니라 "투명 → 어두움"으로 덮는 그라데이션이라, 정지점 불투명도를
// rgba의 a값으로 옮기면 블렌드 모드 없이 그대로 재현된다.
//
// 방향은 피그마 그라데이션 핸들 위치를 카드(343×192) 좌표로 환산해서 옮겼다.
//   투명(0%) 핸들 (270, 110)  →  어두움(100%) 핸들 (171, 39)   = 오른쪽 아래에서 왼쪽 위로
// CSS의 linear-gradient는 정지점 위치를 "박스를 가로지르는 그라데이션 선" 기준으로 재기 때문에,
// 저 두 좌표를 그 선 위로 투영하면 305.4deg / 27.5% / 58.6%가 나온다.
// 결과적으로 글씨가 놓이는 왼쪽 위는 불투명도 90%로 꽉 눌려 대비가 확보되고,
// 오른쪽 아래로 갈수록 사진이 그대로 드러난다(모서리에서 완전 투명).
const Scrim = styled.span`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    305.4deg,
    rgba(102, 102, 102, 0) 27.5%,
    rgba(29, 29, 29, 0.9) 58.6%
  );
  pointer-events: none;
`

// 사진 위 문구 — 디자인 좌표(왼쪽 26px, 제목 위 96px, 본문 위 148px) 기준.
// 제목과 본문 사이 간격 10px = 본문 top(148) - 제목 bottom(96+42).
const Copy = styled.span`
  position: absolute;
  left: 26px;
  /* 오른쪽도 26px 띄워서, 문구가 길어지는 언어에서도 카드 밖으로 나가지 않게 한다 */
  right: 26px;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: left;
`

/* semi18 — 줄바꿈은 번역문(\n)이 담당하므로 pre-line */
const Headline = styled.span`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  /* 디자인 행간은 100%지만, Pretendard 기본 줄 상자 기준으로 두 줄 높이가 42px가 되게 맞춤 */
  line-height: 1.17;
  white-space: pre-line;
`

// 문장에서 강조 단어(등불)만 포인트 컬러
const Accent = styled.span`
  /* aurora_orange */
  color: #dc7054;
`

/* medium8 */
const Body = styled.span`
  color: #fff;
  font-size: 8px;
  font-weight: 500;
  line-height: 1.25;
  white-space: pre-line;
`

// 번역문 안에서 강조 단어를 찾아 앞/뒤로 자른다.
// 언어마다 강조 단어 위치가 달라도 되고, 문장에 없으면 전체가 기본 색으로 나온다.
function splitAccent(sentence, accent) {
  const index = accent ? sentence.indexOf(accent) : -1
  if (index < 0) return { before: sentence, accent: '', after: '' }
  return { before: sentence.slice(0, index), accent, after: sentence.slice(index + accent.length) }
}

// props(zoneId/isLoading)는 HomePage가 GET /api/booths/를 구역별로 합산해서 내려준다.
// zoneId가 없으면(전 구역 0개, 로딩 중, 조회 실패) 기본 구역(DEFAULT_PREVIEW_ZONE_ID) 이미지를 쓴다.
// 2026-09-23: 사진 위 문구를 디자인(개발화면_와프)대로 고정 문구로 교체하면서 구역명·등불 개수 표시는 뺐다.
// 어느 구역 사진인지는 이미지와 버튼 aria-label(=이동할 구역)이 계속 알려준다.
export default function LanternPreview({ zoneId, isLoading = false, children }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const displayZoneId = zoneId && ZONE_PREVIEW_IMAGES[zoneId] ? zoneId : DEFAULT_PREVIEW_ZONE_ID
  const zoneLabel = t(`map.zone.${displayZoneId}`)
  const headline = splitAccent(t('home.previewHeadline'), t('home.previewHeadlineAccent'))

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
          <Scrim aria-hidden="true" />
          {/* 버튼 이름은 aria-label(=이동할 구역)이 담당하므로, 장식 문구는 보조기기에서 숨긴다 */}
          <Copy aria-hidden="true">
            <Headline>
              {headline.before}
              {headline.accent && <Accent>{headline.accent}</Accent>}
              {headline.after}
            </Headline>
            <Body>{t('home.previewBody')}</Body>
          </Copy>
        </Preview>
        {children}
      </Card>
    </Wrapper>
  )
}
