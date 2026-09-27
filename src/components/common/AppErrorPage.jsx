import { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'
import { useTranslation } from '../../i18n/useTranslation'
import * as S from './AppErrorPage.styles'

// 라우터 최상위 에러 화면 — 2026-09-27 추가(이슈 #299).
//
// 이게 없으면 어디서 예외가 나든 React Router의 개발자용 기본 화면이 사용자에게 그대로 보인다
// ("Unexpected Application Error!" + 스택 트레이스 + "Hey developer 👋").
// 지도 씬 실패는 MapSceneBoundary가 먼저 잡아서 여기까지 오지 않는다 — 여기는 그 밖의 모든 예외를
// 받는 마지막 그물이다.
//
// 버튼이 둘 다 하드 내비게이션(reload / assign)인 이유: 여기까지 왔다는 건 React 트리가 이미 한 번
// 무너졌다는 뜻이라, 같은 트리 안에서 navigate로 상태를 되돌리려 하면 또 같은 예외를 만날 수 있다.
// 페이지를 통째로 다시 띄우는 게 가장 확실하다.
//
// App.jsx가 I18nProvider · ThemeProvider 안에서 RouterProvider를 그리므로 여기서도 t()와 theme을 쓸 수 있다.
export default function AppErrorPage() {
  const error = useRouteError()
  const { t } = useTranslation()

  useEffect(() => {
    // 에러 수집 도구가 없어서 콘솔이 유일한 단서다.
    console.error('[App] 처리되지 않은 예외', error)
  }, [error])

  return (
    <S.Page role="alert">
      <S.Title>{t('error.title')}</S.Title>
      <S.Description>{t('error.description')}</S.Description>
      <S.Actions>
        <S.PrimaryButton type="button" onClick={() => window.location.reload()}>
          {t('error.reload')}
        </S.PrimaryButton>
        <S.GhostButton type="button" onClick={() => window.location.assign('/')}>
          {t('error.goHome')}
        </S.GhostButton>
      </S.Actions>
    </S.Page>
  )
}
