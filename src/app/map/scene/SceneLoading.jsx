import { Html } from '@react-three/drei'
import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './SceneLoading.styles'

// 구역 지형 glb를 받는 동안 보여주는 표시 — 2026-09-27 추가(이슈 #299).
//
// 왜 필요한가: 예전에는 <Suspense fallback={null}>이라 모델을 받는 몇 초 동안 지도 자리가 완전히 비어
// 있었다. 그러면 사용자가 "로딩 중"과 "실패"를 구분할 수 없다 — 실패 화면(MapSceneBoundary)만 만들고
// 로딩 표시가 없으면 반쪽이다. 모바일 회선에서 zone1.glb가 3MB라 체감이 특히 크다.
//
// 왜 drei <Html>인가: Suspense fallback은 Canvas 안(three 트리)이라 일반 DOM을 바로 넣을 수 없다.
// <Html>이 캔버스 위에 DOM을 얹어 준다 — BoothMarker의 이름표(PinLabel)가 쓰는 것과 같은 방식이라
// styled-components 테마와 i18n 컨텍스트도 그대로 넘어온다.
// fullscreen을 쓰는 이유: 위치를 좌표로 주면 구역마다 카메라 타깃이 달라 라벨이 화면 한가운데에 안 온다.
export default function SceneLoading() {
  const { t } = useTranslation()

  return (
    <Html fullscreen>
      <S.Overlay>
        <S.Label>{t('map.scene.loading')}</S.Label>
      </S.Overlay>
    </Html>
  )
}
