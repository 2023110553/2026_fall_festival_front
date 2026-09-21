import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'

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

export default function NoticeMarquee({ notices = [], isLoading = false, isError = false }) {
  const navigate = useNavigate()
  const ordered = [...notices].sort((a, b) =>
    Number(b.type === 'URGENT') - Number(a.type === 'URGENT') ||
    b.created_at.localeCompare(a.created_at)
  )
  const message = isLoading
    ? '공지사항을 불러오는 중입니다.'
    : isError
      ? '공지사항을 불러오지 못했습니다.'
      : ordered.length === 0
        ? '등록된 공지사항이 없습니다.'
        : null

  return (
    <Wrapper type="button" aria-label="공지사항 보기" onClick={() => navigate('/info?tab=notice')}>
      <IconBox>
        <NoticeIcon />
      </IconBox>
      <Label>공지사항</Label>
      <Track>

        {message ? <Item role="status">{message}</Item> : [0, 1].map((loop) => (
          <Rolling key={loop} aria-hidden={loop === 1 ? 'true' : undefined}>
            {ordered.map((notice) => (
              <Item key={notice.notice_id}>{notice.title}</Item>
            ))}
          </Rolling>
        ))}
      </Track>
    </Wrapper>
  )
}
