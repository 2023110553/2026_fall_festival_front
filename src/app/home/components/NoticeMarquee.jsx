import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

// 공지사항 — 긴급 공지 1순위, 일반 공지는 최신순으로 반복 롤링 (기능명세서 Notice 항목 참조했습니다)

// TODO(API): isUrgent 우선 정렬
const NOTICES = [
  { id: 1, isUrgent: true, title: '공지사항 1 더미' },
  { id: 2, isUrgent: false, title: '공지사항 2 더미' },
  { id: 3, isUrgent: false, title: '공지사항 3 더미' },
]

const scroll = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`

const Wrapper = styled.button`
  /* 시안 폭 343px = 375(Page) - 32(Content 좌우 패딩). 좁은 기기에서도 맞도록 100%로 둔다 */
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 12px 2px 10px;
  overflow: hidden;
  border: 0;
  border-radius: 999px;
  /* aurora_white */
  background: #fdfdfd;
  /* aurora_light_small */
  box-shadow:
    0 3px 6px 0 rgba(255, 161, 161, 0.1),
    0 -4px 6px 0 rgba(194, 255, 175, 0.1),
    0 0 6px 0 rgba(243, 246, 188, 0.55);
`

const IconBox = styled.span`
  width: 13px;
  height: 13px;
  flex: 0 0 13px;
  display: flex;
`

function NoticeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M12 0C11.9406 0 11.8797 0.0109375 11.8188 0.0359375L2.8125 3.65469H0.25C0.1125 3.65469 0 3.77031 0 3.91406V8.58594C0 8.72969 0.1125 8.84531 0.25 8.84531H1.8375C1.77969 9.02656 1.75 9.21875 1.75 9.41406C1.75 10.4438 2.59063 11.2812 3.625 11.2812C4.49062 11.2812 5.22031 10.6937 5.43594 9.9L11.8203 12.4656C11.8813 12.4891 11.9422 12.5016 12.0016 12.5016C12.2656 12.5016 12.5016 12.2797 12.5016 11.9828V0.51875C12.5 0.221875 12.2656 0 12 0ZM3.625 10.1609C3.21094 10.1609 2.875 9.82656 2.875 9.41406C2.875 9.23906 2.93594 9.07187 3.04688 8.93906L4.37344 9.47188C4.34219 9.85625 4.01875 10.1609 3.625 10.1609Z"
        fill="#DC7054"
      />
    </svg>
  )
}

const Label = styled.span`
  flex: 0 0 auto;
  color: #111214;
  font-size: 12px;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
`

const Track = styled.span`
  min-width: 0;
  flex: 1;
  display: flex;
  overflow: hidden;
`

const Rolling = styled.span`
  display: flex;
  flex-shrink: 0;
  gap: 40px;
  padding-right: 40px;
  white-space: nowrap;
  animation: ${scroll} 18s linear infinite;
`

const Item = styled.span`
  color: #9f9c99;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`

export default function NoticeMarquee() {
  const navigate = useNavigate()
  const ordered = [...NOTICES].sort((a, b) => Number(b.isUrgent) - Number(a.isUrgent))

  return (
    <Wrapper type="button" aria-label="공지사항 보기" onClick={() => navigate('/info')}>
      <IconBox>
        <NoticeIcon />
      </IconBox>
      <Label>공지사항</Label>
      <Track>

        {[0, 1].map((loop) => (
          <Rolling key={loop} aria-hidden={loop === 1 ? 'true' : undefined}>
            {ordered.map((notice) => (
              <Item key={notice.id}>{notice.title}</Item>
            ))}
          </Rolling>
        ))}
      </Track>
    </Wrapper>
  )
}
