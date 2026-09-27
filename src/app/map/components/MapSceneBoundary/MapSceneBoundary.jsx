import { Component, Fragment } from 'react'
import { useGLTF } from '@react-three/drei'
import MapSceneFallback from './MapSceneFallback'

// 지도 3D 씬(MapCanvas) 전용 에러 경계 — 2026-09-27 추가(이슈 #299).
//
// 왜 필요한가:
//   구역 씬은 useGLTF로 지형 glb를 읽는다(Zone1Scene 등). useGLTF는 Suspense용이라 실패하면 throw하는데,
//   Suspense는 "로딩 중"만 받아주고 에러는 받지 못한다. 앱에 에러 경계가 하나도 없으면 그 예외가 라우터까지
//   올라가서 React Router의 개발자용 기본 화면("Unexpected Application Error!")이 앱 전체를 덮는다.
//   실제로 모바일에서 3MB짜리 zone1.glb를 받다 회선이 끊겨 그렇게 됐다(사파리의 "Load failed" = fetch가
//   네트워크 단계에서 끊긴 것. 404나 파일 손상이면 다른 문구가 난다).
//
// 왜 MapCanvas만 감싸나:
//   경계를 MapArea나 MapShell에 걸면 구역 선택(PlaceSelector)과 바텀시트(부스 목록·검색·상세)까지 같이
//   사라진다. MapCanvas만 감싸면 3D가 죽어도 나머지 지도 기능은 그대로 쓸 수 있다 — "지도는 안 보이지만
//   부스는 찾을 수 있는" 상태가 "앱이 죽은" 상태보다 훨씬 낫다.
//
// 왜 클래스 컴포넌트인가:
//   React에는 아직 훅 기반 에러 경계가 없다(getDerivedStateFromError / componentDidCatch는 클래스 전용).
//   프로젝트의 "함수형 컴포넌트" 원칙에서 이 파일만 예외다. react-error-boundary 같은 라이브러리를 새로
//   넣을 만큼 큰 기능이 아니라서 30줄짜리 클래스로 끝냈다.
//
// props:
//   - zoneId: 지금 그리는 구역 id. 재시도할 때 비울 캐시 키를 만들고, 구역이 바뀌면 에러를 자동으로 푼다
//   - children: <MapCanvas />

export default class MapSceneBoundary extends Component {
  state = { error: null, attempt: 0 }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // 에러 수집 도구가 없어서 콘솔이 유일한 단서다. 어느 구역에서 났는지까지 남긴다.
    console.error(`[MapScene] ${this.props.zoneId} 씬 로드 실패`, error, info.componentStack)
  }

  componentDidUpdate(prevProps) {
    // 구역을 바꾸면 에러를 자동으로 푼다.
    // 실패하는 건 구역 하나의 모델이고, 실패 화면 위에 PlaceSelector가 그대로 보여서 사용자가 다른 구역을
    // 고를 수 있다. 자동으로 풀지 않으면 골라도 화면이 그대로라 "버튼이 안 먹는다"가 된다.
    if (prevProps.zoneId !== this.props.zoneId && this.state.error) {
      this.setState({ error: null })
    }
  }

  handleRetry = () => {
    // drei는 실패한 요청도 캐시에 남긴다(suspend-react). 지우지 않으면 다시 마운트해도 캐시에 있는
    // 거절된 Promise를 그대로 다시 던져서, 네트워크가 돌아왔는데도 버튼이 먹통처럼 보인다.
    const { zoneId } = this.props
    if (zoneId) useGLTF.clear(`/models/${zoneId}.glb`)

    // 캐시만 비우면 이미 마운트된 트리는 그대로다 — key를 바꿔 Canvas를 통째로 다시 마운트한다.
    this.setState((prev) => ({ error: null, attempt: prev.attempt + 1 }))
  }

  render() {
    if (this.state.error) {
      return <MapSceneFallback onRetry={this.handleRetry} />
    }
    return <Fragment key={this.state.attempt}>{this.props.children}</Fragment>
  }
}
