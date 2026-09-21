import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    /* 프리텐다드 전역 폰트 설정 */
    --font-pretendard: 'Pretendard Variable', 'Pretendard', -apple-system,
      BlinkMacSystemFont, system-ui, 'Apple SD Gothic Neo', 'Noto Sans KR',
      sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    background: var(
      --background2,
      linear-gradient(180deg, #ffcdc1 0%, #fff9f8 36.54%, #f7f7f7 65.38%)
    );
    background-attachment: fixed;
    background-repeat: no-repeat;
    color: ${({ theme }) => theme.color.text};
    font-family: var(--font-pretendard);
    -webkit-tap-highlight-color: transparent;
  }

  button, input, textarea, select {
    font-family: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    margin: 0;
    padding: 0;
    list-style: none;
  }
`
