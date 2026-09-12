import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { router } from './router'
import { theme } from './styles/theme'
import { GlobalStyle } from './styles/GlobalStyle'

// 기본(라이트) 테마 — 일반 사이트 전체에 적용된다.
// /admin 하위는 AdminThemeProvider(router/index.jsx에서 레이아웃 라우트로 연결)가
// 이 테마를 다크(adminTheme)로 중첩 덮어쓴다.
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}
