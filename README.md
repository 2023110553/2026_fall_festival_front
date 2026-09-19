# 2026_fall_festival_front

2026년 동국대학교 가을 대동제(풀스온) 사이트 프론트엔드 레포지토리입니다.

## 시작하기

```bash
npm install
cp .env.example .env   # VITE_API_BASE_URL 등 채우기
npm run dev
```

## 백엔드 없이 로그인 테스트

1. 로컬 `.env`에 `VITE_USE_AUTH_MOCK=true`를 설정하고 개발 서버를 재시작합니다.
2. 로그인 버튼을 누르고 모달의 테스트 항목(성공 / 인증 실패 / 서버 오류 / 취소)을 선택한 뒤 카카오 로그인 버튼을 누릅니다.
3. 성공 시 `테스트 코끼리` 계정으로 로그인됩니다. 새로고침 후 유지와 기존 메뉴의 로그아웃을 확인합니다.
   인증 실패 / 서버 오류 / 취소 시에는 홈으로 돌아와 로그인 모달의 기본 안내 문구 대신 오류 메시지가 표시됩니다.
4. 화면 하단의 `토큰 만료 (401) 테스트`를 누르면 실제 API 인터셉터를 거쳐 로그아웃되고 재로그인 모달이 열립니다.
5. 실제 연동 테스트는 `VITE_USE_AUTH_MOCK=false`로 바꾸고 개발 서버를 재시작합니다.

임시 모드는 카카오 페이지 대신 로컬 콜백으로 이동하고 로그인 API 응답만 모킹합니다. 다른 API, 실제 카카오 인증 및 CORS는 테스트하지 않습니다. 테스트 로그인 정보는 별도 저장되며 가짜 토큰은 실제 서버에 전송하지 않습니다. 배포 빌드에서는 이 모드가 켜지지 않습니다.

## 기술 스택

- React 19 + Vite
- styled-components (`ComponentName.styles.js` + `import * as S from './ComponentName.styles'` 컨벤션)
- react-router-dom (라우트는 `src/router/index.jsx` 한 곳에서 관리)
- Zustand (도메인을 넘나드는 진짜 전역 상태만 — 로그인/관리자 인증)
- Axios (`src/api/client.js` 공통 인스턴스, `VITE_API_BASE_URL` 사용)
- react-three-fiber + drei (지도 3D 씬, `src/app/map/scene/`)

## 폴더 구조

`src/app/{domain}/` 기준 도메인 폴더링입니다. 각 도메인 폴더 안에 그 화면 전용 `components/`를 둡니다.

```text
src/
├── app/                # 라우트 단위 도메인 (home, map, lantern, performance, info, mypage, auth, admin)
├── components/         # 도메인을 넘나드는 진짜 공통 컴포넌트 (common/, layout/)
├── router/              # 라우트 정의 + AdminRoute 가드
├── store/                # Zustand — 전역 상태만 (인증)
├── api/                  # axios 클라이언트 + 도메인별 api 함수
├── hooks/                # 여러 도메인 공용 훅
├── styles/               # GlobalStyle, theme(라이트), adminTheme(다크)
└── constants/            # 구역/카테고리/등불 단계 threshold 등
```

전체 설계 배경과 각 폴더의 역할은 팀 노션/Claude 프로젝트 문서(`frontend-repo-folder-structure.md`)에 정리되어 있습니다.

## Git 워크플로

- Fork 기반: `origin` = 개인 fork, `upstream` = 팀 레포(`LikeLion-at-DGU/2026_fall_festival_front`)
- 브랜치: `{type}/fe/{issue-number}-{description}`
- 커밋: `태그: 제목` (한국어 conventional commit)
- 이슈 1개당 브랜치 1개, 개발 중엔 Draft PR(`Related to #N`), 완료 PR에는 `Closes #N`

## 관리자 페이지

`/admin/*` 라우트로 통합되어 있습니다. 일반 사이트와 레이아웃(`AdminAppLayout`)·테마(`adminTheme`, 다크)·인증(`useAdminAuthStore`, 관리자 키)이 완전히 분리되어 있으니, 관리자 화면 작업 시 일반 사이트 컴포넌트를 가져다 쓰지 말고 `src/app/admin/` 안에서 해결해주세요.
