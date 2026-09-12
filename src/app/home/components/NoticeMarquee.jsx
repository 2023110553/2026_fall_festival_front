import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 10px 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.color.text};
  white-space: nowrap;
  overflow: hidden;
`

// 공지사항 마퀴 — 긴급 공지 1순위, 일반 공지는 최신순으로 반복 롤링 (기능명세서 Notice 항목)
export default function NoticeMarquee() {
  return <Wrapper>공지사항 마퀴 placeholder</Wrapper>
}
