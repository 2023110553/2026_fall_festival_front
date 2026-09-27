import { useTranslation } from '../../../../i18n/useTranslation'
import * as S from './MapSceneBoundary.styles'

// 지도 3D 씬이 실패했을 때 지도 자리에 대신 그리는 화면 — 2026-09-27 추가(이슈 #299).
// 경계(MapSceneBoundary)는 클래스라 훅을 쓸 수 없어서, i18n이 필요한 화면은 이렇게 따로 뒀다.
// (한 파일에 두면 react-refresh/only-export-components 경고도 난다)
export default function MapSceneFallback({ onRetry }) {
  const { t } = useTranslation()

  return (
    <S.Fallback role="alert">
      <S.Title>{t('map.scene.errorTitle')}</S.Title>
      <S.Description>{t('map.scene.errorDescription')}</S.Description>
      <S.RetryButton type="button" onClick={onRetry}>
        {t('map.scene.retry')}
      </S.RetryButton>
    </S.Fallback>
  )
}
