import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

// 상단 광고 배너 (기능명세서 바탕으로) 일정 시간(5초)마다 자동 롤링, 클릭 시 안내>협업 페이지로 이동

// TODO(API): 배너 목록 API가 정해지면 연결할거고 일단 지금은 더미 데이터로 구현해둿습니다
// image에 실제 배너 이미지가 들어오면 Wrapper 배경으로 깔린다 (title은 스크린리더용)
const BANNERS = [
  { id: 1, title: '부스 방문하고 선물 받기', image: null },
  { id: 2, title: '협업 부스 이벤트 참여하기', image: null },
  { id: 3, title: '등불 달고 쿠폰 받기', image: null },
  { id: 4, title: '이번 주 공연 라인업 확인', image: null },
]

const ROLLING_INTERVAL = 5000

// 배너 안에 놓이는 건 인디케이터 하나뿐이라, 시안 padding이 곧 인디케이터 위치가 된다.
// 350 + 14(인디케이터) + 11 = 375 / 61 + 12 + 7 = 80
const Wrapper = styled.button`
  width: calc(100% + 32px);
  height: 80px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-self: stretch;
  margin: 0 -16px;
  padding: 61px 11px 7px 350px;
  border: 0;
  border-radius: 0;
  background-color: #a6a6a6;
  background-image: ${({ $image }) => ($image ? `url(${$image})` : 'none')};
  background-size: cover;
  background-position: center;
`

const Indicator = styled.span`
  color: #fff;
  font-size: 9px;
  line-height: 1;
  white-space: nowrap;
`

export default function AdBanner() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % BANNERS.length)
    }, ROLLING_INTERVAL)

    return () => clearInterval(timer)
  }, [])

  const banner = BANNERS[index]

  return (
    <Wrapper
      type="button"
      $image={banner.image}
      aria-label={banner.title}
      onClick={() => navigate('/info')}
    >
      <Indicator aria-hidden="true">
        {index + 1}/{BANNERS.length}
      </Indicator>
    </Wrapper>
  )
}
