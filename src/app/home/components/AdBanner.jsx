import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

// 상단 광고 배너 (기능명세서 바탕으로) 일정 시간(5초)마다 자동 롤링, 클릭 시 안내>협업 페이지로 이동

// TODO(API): 배너 목록 API가 정해지면 연결할거고 일단 지금은 더미 데이터로 구현해둿습니다
const BANNERS = [
  { id: 1, logo: '단과대\n로고', title: '부스 방문하고 선물 받기', description: '음료수 받고 싶으면 배너 클릭' },
  { id: 2, logo: '단과대\n로고', title: '협업 부스 이벤트 참여하기', description: '음료수 받고 싶으면 배너 클릭' },
  { id: 3, logo: '단과대\n로고', title: '등불 달고 쿠폰 받기', description: '음료수 받고 싶으면 배너 클릭' },
  { id: 4, logo: '단과대\n로고', title: '이번 주 공연 라인업 확인', description: '음료수 받고 싶으면 배너 클릭' },
]

const ROLLING_INTERVAL = 5000

const Wrapper = styled.button`
  position: relative;
  width: calc(100% + 32px);
  height: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 -16px;
  padding: 0 16px;
  border: 0;
  border-radius: 0;
  background: #a6a6a6;
  text-align: left;
`

const LogoBox = styled.span`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 21px 15px 16px;
  border-radius: 20px;
  background: #fff;
  color: #111214;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.3;
  text-align: center;
  white-space: pre-line;
`

const TextBox = styled.span`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Title = styled.strong`
  overflow: hidden;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Description = styled.span`
  overflow: hidden;
  color: #fff;
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Indicator = styled.span`
  position: absolute;
  right: 10px;
  bottom: 8px;
  color: #fff;
  font-size: 9px;
  line-height: 1;
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
    <Wrapper type="button" aria-label={banner.title} onClick={() => navigate('/info')}>
      <LogoBox aria-hidden="true">{banner.logo}</LogoBox>
      <TextBox>
        <Title>{banner.title}</Title>
        <Description>{banner.description}</Description>
      </TextBox>
      <Indicator aria-hidden="true">
        {index + 1}/{BANNERS.length}
      </Indicator>
    </Wrapper>
  )
}
