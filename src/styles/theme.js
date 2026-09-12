// 일반 사이트(홈/지도/등불달기/공연/안내/마이페이지) 라이트 테마
// admin 쪽은 완전히 분리된 adminTheme.js를 따로 쓴다 — 절대 이 파일과 섞지 않기
export const theme = {
  color: {
    bg: '#FFFFFF',
    surface: '#F7F7F8',
    text: '#111214',
    textSub: '#6B6D76',
    border: '#E5E5EA',
    primary: '#FF7A00', // 등불/축제 포인트 컬러 (디자인 확정되면 교체)
    danger: '#E5484D',
    success: '#2FAE60',
  },
  nav: {
    height: '56px',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '20px',
  },
  zIndex: {
    bottomNav: 100,
    modal: 1000,
    bottomSheet: 900,
  },
}
